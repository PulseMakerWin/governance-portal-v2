/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import { SupportedNetworks } from 'modules/web3/constants/networks';
import invariant from 'tiny-invariant';
import uniqBy from 'lodash/uniqBy';
import { getAddressInfo } from 'modules/address/api/getAddressInfo';
import {
  ExecutiveComment,
  ExecutiveCommentFromDB,
  ExecutiveCommentsAPIResponseItem
} from '../types/comments';
import connectToDatabase from 'modules/db/helpers/connectToDatabase';
import { markdownToHtml } from 'lib/markdown';
import { networkNameToChainId } from 'modules/web3/helpers/chain';
import { getRPCFromChainID } from 'modules/web3/helpers/getRPC';
import { ethers } from 'ethers';
import { getCommentTransactionStatus } from './getCommentTransaction';

export async function getExecutiveComments(
  spellAddress: string,
  network: SupportedNetworks
): Promise<ExecutiveCommentsAPIResponseItem[]> {
  const { db, client } = await connectToDatabase;

  invariant(await client.isConnected(), 'mongo client failed to connect');

  const collection = db.collection('comments');
  // decending sort
  console.log('Fetching comments from DB with query:', { spellAddress, network, commentType: 'executive' });

  const commentsFromDB: ExecutiveCommentFromDB[] = await collection
    .find({
      spellAddress: new RegExp(`^${spellAddress}$`, 'i'), // Case-insensitive regex
      network,
      commentType: 'executive'
    })
    .sort({ date: -1 })
    .toArray();

  console.log(`Number of comments fetched: ${commentsFromDB.length}`);
  console.log('Comments fetched from DB:', commentsFromDB);

  const comments: ExecutiveComment[] = await Promise.all(
    commentsFromDB.map(async comment => {
      const { _id, voterAddress, ...rest } = comment;
      const commentBody = await markdownToHtml(comment.comment, true);
      return {
        ...rest,
        comment: commentBody,
        voterAddress: voterAddress.toLowerCase()
      };
    })
  );

  const uniqueComments = uniqBy(comments, 'voterAddress');
  console.log(`Number of unique comments: ${uniqueComments.length}`);

  const rpcUrl = getRPCFromChainID(networkNameToChainId(network));
  const provider = await new ethers.providers.JsonRpcProvider(rpcUrl);

  const promises = uniqueComments.map(async (comment: ExecutiveComment) => {
    // verify tx ownership
    console.log(`Processing comment with voterAddress: ${comment.voterAddress}`);
    const { completed, isValid } = await getCommentTransactionStatus(network, provider, comment);
    console.log(`Transaction status for voterAddress ${comment.voterAddress}:`, { completed, isValid });

    return {
      comment,
      address: await getAddressInfo(comment.voterAddress, network),
      isValid,
      completed
    };
  });

  const response = await Promise.all(promises);
  console.log('Final response before filtering:', response);

  const validComments = response.filter(i => i.isValid);
  console.log(`Number of valid comments: ${validComments.length}`);
  console.log('Valid comments:', validComments);

  return response.filter(i => i.isValid) as ExecutiveCommentsAPIResponseItem[];
}
