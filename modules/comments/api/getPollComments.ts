/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import connectToDatabase from 'modules/db/helpers/connectToDatabase';
import { SupportedNetworks } from 'modules/web3/constants/networks';
import { getAddressInfo } from 'modules/address/api/getAddressInfo';
import invariant from 'tiny-invariant';
import { PollComment, PollCommentFromDB, PollCommentsAPIResponseItem } from '../types/comments';
import uniqBy from 'lodash/uniqBy';
import { markdownToHtml } from 'lib/markdown';
import { getCommentTransactionStatus } from './getCommentTransaction';
import { getGaslessProvider, getProvider } from 'modules/web3/helpers/chain';

export async function getPollComments(
  pollId: number,
  network: SupportedNetworks
): Promise<PollCommentsAPIResponseItem[]> {

  const { db, client } = await connectToDatabase;
  invariant(await client.isConnected(), 'mongo client failed to connect');

  const collection = db.collection('comments');

  // decending sort
  const commentsFromDB: PollCommentFromDB[] = await collection
    .find({ pollId, network, commentType: 'poll' })
    .sort({ date: -1 })
    .toArray();

  const comments = await Promise.all(
    commentsFromDB.map(async comment => {
      const commentBody = await markdownToHtml(comment.comment, true);
      return {
        ...comment,
        comment: commentBody
      };
    })
  );

  const uniqueComments = uniqBy(comments, 'voterAddress');

  const promises = uniqueComments.map(async (comment: PollComment) => {
    try {
      const provider = comment.gaslessNetwork ? getGaslessProvider(network) : getProvider(network);

      // Verify provider connection
      const networkInfo = await provider.getNetwork().catch(e => {
        console.error('Failed to get network from provider:', e);
        return null;
      });

      const { completed, isValid } = await getCommentTransactionStatus(network, provider, comment);
      const addressInfo = await getAddressInfo(comment.voterAddress, network);

      return {
        comment,
        isValid,
        completed,
        address: addressInfo
      };
    } catch (error) {
      console.error('Error processing comment:', {
        error,
        address: comment.voterAddress,
        network
      });

      // Return invalid comment instead of throwing
      return {
        comment,
        isValid: false,
        completed: false,
        address: await getAddressInfo(comment.voterAddress, network)
      };
    }
  });

  const response = await Promise.all(promises);

  return response.filter(i => i.isValid) as PollCommentsAPIResponseItem[];
}
