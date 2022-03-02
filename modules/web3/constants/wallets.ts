import { injectedConnector, walletConnectConnector, walletLinkConnector } from '../connectors';
import { WalletInfo } from '../types/wallets';
import { SupportedConnectors } from './networks';

export const SUPPORTED_WALLETS: { [connector in SupportedConnectors]: WalletInfo } = {
  [SupportedConnectors.METAMASK]: {
    connector: injectedConnector,
    name: 'MetaMask'
  },
  [SupportedConnectors.WALLET_CONNECT]: {
    connector: walletConnectConnector,
    name: 'WalletConnect'
  },
  [SupportedConnectors.COINBASE_WALLET]: {
    connector: walletLinkConnector,
    name: 'Coinbase Wallet'
  }
};
