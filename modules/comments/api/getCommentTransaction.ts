/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import { ethers } from 'ethers';
import logger from 'lib/logger';
import { FIVE_MINUTES_IN_MS } from 'modules/app/constants/time';
import { cacheGet, cacheSet } from 'modules/cache/cache';
import { SupportedNetworks } from 'modules/web3/constants/networks';
import { CommentFromDB, Comment } from '../types/comments';

export async function getCommentTransactionStatus(
  network: SupportedNetworks,
  provider: ethers.providers.JsonRpcProvider,
  comment: CommentFromDB | Comment
): Promise<{ completed: boolean; isValid: boolean }> {
  const txHash = comment.txHash;
  const cacheKey = `transaction-comment-${txHash}`;

  console.log('Verifying transaction:', {
    network,
    txHash,
    providerNetwork: await provider.getNetwork().catch(e => 'Failed to get network'),
    commentAddress: comment.voterAddress
  });

  const cachedResponse = await cacheGet(cacheKey, network);
  if (cachedResponse) {
    return JSON.parse(cachedResponse);
  }

  try {
    if (!txHash) {
      return { completed: false, isValid: false };
    }

    const transaction = await provider.getTransaction(txHash).catch(e => {
      logger.error('Error fetching transaction:', e);
      return null;
    });

    console.log('Transaction details:', {
      found: !!transaction,
      confirmations: transaction?.confirmations,
      from: transaction?.from,
      to: transaction?.to
    });

    const isValid = !!transaction && transaction.from.toLowerCase() === comment.voterAddress.toLowerCase();

    const completed = transaction && transaction.confirmations > 10;
    const response = { completed: !!completed, isValid };

    await cacheSet(cacheKey, JSON.stringify(response), network, FIVE_MINUTES_IN_MS);

    return response;
  } catch (e) {
    logger.error(`Error fetching comment transcation: ${txHash}`);
    return {
      completed: false,
      isValid: false
    };
  }
}
