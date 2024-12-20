/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import { useState } from 'react';
import useTransactionStore, {
  transactionsSelectors,
  transactionsApi
} from 'modules/web3/stores/transactions';
import { shallow } from 'zustand/shallow';
import { BigNumber } from 'ethers';
import { BaseTransactionResponse } from 'modules/web3/types/transaction';
import { useContracts } from 'modules/web3/hooks/useContracts';
import { useAccount } from 'modules/app/hooks/useAccount';
import { sendTransaction } from 'modules/web3/helpers/sendTransaction';
import { useWeb3 } from 'modules/web3/hooks/useWeb3';

type LockResponse = BaseTransactionResponse & {
  lock: (mkrToDeposit: BigNumber, callbacks?: Record<string, () => void>) => void;
};

export const useLock = (): LockResponse => {
  const [txId, setTxId] = useState<string | null>(null);

  const { account, voteProxyContract } = useAccount();
  const { provider } = useWeb3();
  const { chief } = useContracts();

  const [track, tx] = useTransactionStore(
    state => [state.track, txId ? transactionsSelectors.getTransaction(state, txId) : null],
    shallow
  );

  const lock = (mkrToDeposit: BigNumber, callbacks?: Record<string, () => void>) => {
    if (!account || !provider) {
      return;
    }

    const lockTxCreator = async () => {
      const populatedTransaction = voteProxyContract
        ? await voteProxyContract.populateTransaction.lock(mkrToDeposit)
        : await chief.populateTransaction.lock(mkrToDeposit);

      return sendTransaction(populatedTransaction, provider, account);
    };

    const transactionId = track(lockTxCreator, account, 'Depositing pMKR', {
      pending: () => {
        if (typeof callbacks?.pending === 'function') callbacks.pending();
      },
      mined: txId => {
        transactionsApi.getState().setMessage(txId, 'pMKR deposited');
        if (typeof callbacks?.mined === 'function') callbacks.mined();
      },
      error: txId => {
        transactionsApi.getState().setMessage(txId, 'pMKR deposit failed');
        if (typeof callbacks?.error === 'function') callbacks.error();
      }
    });
    setTxId(transactionId);
  };

  return { txId, setTxId, lock, tx };
};
