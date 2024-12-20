/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import { Dispatch, SetStateAction, useState } from 'react';
import useTransactionStore, {
  transactionsSelectors,
  transactionsApi
} from 'modules/web3/stores/transactions';
import { shallow } from 'zustand/shallow';
import { Transaction } from 'modules/web3/types/transaction';
import { useContracts } from 'modules/web3/hooks/useContracts';
import { useAccount } from 'modules/app/hooks/useAccount';
import { useWeb3 } from 'modules/web3/hooks/useWeb3';
import { sendTransaction } from 'modules/web3/helpers/sendTransaction';

type ShutdownResponse = {
  txId: string | null;
  setTxId: Dispatch<SetStateAction<string | null>>;
  shutdown: (callbacks?: Record<string, (id?: string) => void>) => void;
  tx: Transaction | null;
};

export const useEsmShutdown = (): ShutdownResponse => {
  const [txId, setTxId] = useState<string | null>(null);

  const { account } = useAccount();
  const { provider } = useWeb3();
  const { esm } = useContracts();

  const [track, tx] = useTransactionStore(
    state => [state.track, txId ? transactionsSelectors.getTransaction(state, txId) : null],
    shallow
  );

  const shutdown = callbacks => {
    if (!account || !provider) {
      return;
    }

    const shutdownTxCreator = async () => {
      const populatedTransaction = await esm.populateTransaction.fire();
      return sendTransaction(populatedTransaction, provider, account);
    };

    const txId = track(shutdownTxCreator, account, 'Shutting Down pDAI Credit System', {
      initialized: () => {
        if (typeof callbacks?.initialized === 'function') callbacks.initialized();
      },
      pending: () => {
        if (typeof callbacks?.pending === 'function') callbacks.pending();
      },
      mined: txId => {
        transactionsApi.getState().setMessage(txId, 'pDAI Credit System has been Shutdown');
        if (typeof callbacks?.mined === 'function') callbacks.mined();
      },
      error: () => {
        if (typeof callbacks?.error === 'function') callbacks.error();
      }
    });
    setTxId(txId);
  };

  return { txId, setTxId, shutdown, tx };
};
