/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import {
  getArbitrumGoerliTestnetSdk,
  getArbitrumOneSdk,
  getArbitrumSepoliaSdk
} from '@dethcrypto/eth-sdk-client';
import { config } from 'lib/config';
import { ArbitrumSdkGenerators } from 'modules/web3/types/contracts';

export const relayerCredentials = {
  mainnet: { apiKey: config.DEFENDER_API_KEY_MAINNET, apiSecret: config.DEFENDER_API_SECRET_MAINNET },
  goerli: { apiKey: config.DEFENDER_API_KEY_TESTNET, apiSecret: config.DEFENDER_API_SECRET_TESTNET },
  sepolia: { apiKey: config.DEFENDER_API_KEY_TESTNET, apiSecret: config.DEFENDER_API_SECRET_TESTNET }
};

export const arbitrumSdkGenerators: ArbitrumSdkGenerators = {
  mainnet: getArbitrumOneSdk,
  goerli: getArbitrumGoerliTestnetSdk,
  sepolia: getArbitrumSepoliaSdk
};
