/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import { GoerliSdk, MainnetSdk, ArbitrumGoerliTestnetSdk, ArbitrumOneSdk } from '@dethcrypto/eth-sdk-client';
import { providers, Signer } from 'ethers';

export type ContractName =
  | 'chief'
  | 'chiefOld'
  | 'dai'
  | 'end'
  | 'esm'
  | 'mkr'
  | 'iou'
  | 'iouOld'
  | 'pause'
  | 'pauseProxy'
  | 'polling'
  | 'pollingOld'
  | 'pot'
  | 'vat'
  | 'voteDelegateFactory'
  | 'voteProxyFactory'
  | 'vow';

export type EthSdk = MainnetSdk | GoerliSdk;

export type SignerOrProvider = Signer | providers.Provider;

export type SdkGenerators = {
  mainnet: (signerOrProvider: SignerOrProvider) => MainnetSdk;
  goerli: (signerOrProvider: SignerOrProvider) => GoerliSdk;
  tenderly: (signerOrProvider: SignerOrProvider) => MainnetSdk;
};

export type ArbitrumSdkGenerators = {
  mainnet: (signerOrProvider: SignerOrProvider) => ArbitrumOneSdk;
  goerli: (signerOrProvider: SignerOrProvider) => ArbitrumGoerliTestnetSdk;
  sepolia: (signerOrProvider: SignerOrProvider) => ArbitrumSepoliaSdk;
};
