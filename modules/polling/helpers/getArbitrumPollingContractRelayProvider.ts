import { Contract } from 'ethers';
import { getArbitrumGoerliTestnetSdk, getArbitrumOneSdk } from '@dethcrypto/eth-sdk-client';
import { config } from 'lib/config';
import { ArbitrumSdkGenerators } from 'modules/web3/types/contracts';
import { SupportedNetworks } from 'modules/web3/constants/networks';
import { DefenderRelayProvider, DefenderRelaySigner } from 'defender-relay-client/lib/ethers';

export const relayerCredentials = {
  mainnet: { apiKey: config.DEFENDER_API_KEY_MAINNET, apiSecret: config.DEFENDER_API_SECRET_MAINNET },
  goerli: { apiKey: config.DEFENDER_API_KEY_TESTNET, apiSecret: config.DEFENDER_API_SECRET_TESTNET }
};

export const arbitrumSdkGenerators: ArbitrumSdkGenerators = {
  mainnet: getArbitrumOneSdk,
  goerli: getArbitrumGoerliTestnetSdk
};

//Note that we'll get an error if we try to run this defender relay code on the frontend
//So we should only import this function on the backend
export const getArbitrumPollingContractRelayProvider = (network: SupportedNetworks): Contract => {
  const sdkNetwork = network === SupportedNetworks.GOERLIFORK ? SupportedNetworks.GOERLI : network;
  const provider = new DefenderRelayProvider(relayerCredentials[sdkNetwork]);
  const signer = new DefenderRelaySigner(relayerCredentials[sdkNetwork], provider, {
    speed: 'fast'
  });
  const { polling } = arbitrumSdkGenerators[sdkNetwork](signer);

  return polling;
};
