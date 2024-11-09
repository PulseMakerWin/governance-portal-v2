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

  let network: SupportedNetworks = SupportedNetworks.MAINNET;

  try {
    if (context.chainId != null) {
      network = chainIdToNetworkName(context.chainId) || SupportedNetworks.MAINNET;
    }
  } catch (err) {
    logger.warn('Connected to an unsupported network');
  }

  return {
    ...context,
    network
  };
}
