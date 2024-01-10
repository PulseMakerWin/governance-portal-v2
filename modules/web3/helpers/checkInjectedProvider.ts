import * as env from 'detect-browser';
import { WindowPostMessageStream } from '@metamask/post-message-stream';
import { initializeProvider } from '@metamask/providers';

export function checkInjectedProvider() {
  const injectedAvailable = !!window.ethereum;

  if (!injectedAvailable) {
    const browser = env.detect();
    if (browser && browser.name === 'firefox') {
      // Due to https://github.com/MetaMask/metamask-extension/issues/3133
      // setup background connection
      const metamaskStream = new WindowPostMessageStream({
        name: 'metamask-inpage',
        target: 'metamask-contentscript'
      });

      // this will initialize the provider and set it as window.ethereum
      initializeProvider({
        connectionStream: metamaskStream,
        shouldShimWeb3: true
      });
    }
  }
}
