import { BigNumber } from '@ethersproject/bignumber';
import { hexStripZeros } from '@ethersproject/bytes';
import { Web3Provider } from '@ethersproject/providers';
import { SupportedChainId } from '../constants/chainID';

interface SwitchNetworkArguments {
  library: Web3Provider;
  chainId: SupportedChainId;
}

// provider.request returns Promise<any>, but wallet_switchEthereumChain must return null or throw
// see https://github.com/rekmarks/EIPs/blob/3326-create/EIPS/eip-3326.md for more info on wallet_switchEthereumChain
export async function switchToNetwork({ library, chainId }: SwitchNetworkArguments): Promise<null | void> {
  if (!library?.provider?.request) {
    return;
  }
  const formattedChainId = hexStripZeros(BigNumber.from(chainId).toHexString());
  try {
    await library.provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: formattedChainId }]
    });
  } catch (error) {
    console.log(error);
    // metamask comes with goerli configuration so this is unecessary
    // but will leave it for future chains we may add
    // 4902 is the error code for attempting to switch to an unrecognized chainId
    // if (error.code === 4902) {
    //   const info = CHAIN_INFO[chainId];
    //   await library.provider.request({
    //     method: 'wallet_addEthereumChain',
    //     params: [
    //       {
    //         chainId: formattedChainId,
    //         chainName: info.label,
    //         rpcUrls: [info.addNetworkInfo.rpcUrl],
    //         nativeCurrency: info.addNetworkInfo.nativeCurrency,
    //         blockExplorerUrls: [info.explorer]
    //       }
    //     ]
    //   });
    //   // metamask (only known implementer) automatically switches after a network is added
    //   // the second call is done here because that behavior is not a part of the spec and cannot be relied upon in the future
    //   // metamask's behavior when switching to the current network is just to return null (a no-op)
    //   try {
    //     await library.provider.request({
    //       method: 'wallet_switchEthereumChain',
    //       params: [{ chainId: formattedChainId }]
    //     });
    //   } catch (error) {
    //     console.debug('Added network but could not switch chains', error);
    //   }
    // } else {
    //   throw error;
    // }
  }
}
