import { NextApiRequest, NextApiResponse } from 'next';
import withApiHandler from 'modules/app/api/withApiHandler';
import logger from 'lib/logger';
import { isSupportedNetwork } from 'modules/web3/helpers/networks';
import { getMessageFromCode, ERROR_CODES } from 'eth-rpc-errors';
import { getRelayerBalance } from 'modules/polling/helpers/getRelayerBalance';
import { DEFAULT_NETWORK } from 'modules/web3/constants/networks';
import invariant from 'tiny-invariant';

export default withApiHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const network = (req.query.network as string) || DEFAULT_NETWORK.network;
      invariant(isSupportedNetwork(network), `unsupported network ${network}`);

      const balance = await getRelayerBalance(network);

      return res.status(200).json(balance);
    } catch (err) {
      const errorMessage =
        'code' in err &&
        [...Object.values(ERROR_CODES.provider), ...Object.values(ERROR_CODES.rpc)].includes(err['code'])
          ? getMessageFromCode(err['code'])
          : err.message;
      logger.error(errorMessage);
      return res.status(400).json({
        error: errorMessage
      });
    }
  },
  { allowPost: true }
);
