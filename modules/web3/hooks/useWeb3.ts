/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import { useWeb3React, Web3ContextType } from '@web3-react/core';
import logger from 'lib/logger';
import { SupportedNetworks } from '../constants/networks';
import { chainIdToNetworkName } from '../helpers/chain';

export function useWeb3(): Web3ContextType & { network: SupportedNetworks } {
  const context = useWeb3React();

  let network;
  try {
    if (context.chainId === undefined) {
      logger.warn('Chain ID is undefined, using default network');
      network = SupportedNetworks.MAINNET;
    } else {
      network = chainIdToNetworkName(context.chainId);
    }
  } catch (err) {
    logger.error('Error determining network:', err);
    logger.warn('Connected to unsupported network');
  }

  return {
    ...context,
    network
  };
}
