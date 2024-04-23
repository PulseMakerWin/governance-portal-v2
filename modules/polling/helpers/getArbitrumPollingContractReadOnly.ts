/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import { Contract } from 'ethers';
import { SupportedNetworks } from 'modules/web3/constants/networks';
import { getGaslessProvider } from 'modules/web3/helpers/chain';
import { arbitrumSdkGenerators } from './relayerCredentials';

export const getArbitrumPollingContractReadOnly = (network: SupportedNetworks): Contract => {
  const sdkNetwork = network === SupportedNetworks.TENDERLY ? SupportedNetworks.MAINNET : network;
  const gaslessProvider = getGaslessProvider(network);
  const { polling } = arbitrumSdkGenerators[sdkNetwork](gaslessProvider);
  return polling;
};
