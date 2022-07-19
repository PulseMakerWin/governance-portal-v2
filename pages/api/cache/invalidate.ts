import { NextApiRequest, NextApiResponse } from 'next';
import { DEFAULT_NETWORK, SupportedNetworks } from 'modules/web3/constants/networks';
import withApiHandler from 'modules/app/api/withApiHandler';
import logger from 'lib/logger';
import { cacheDel } from 'modules/cache/cache';
import {
  delegatesGithubCacheKey,
  allDelegatesCacheKey,
  executiveSupportersCacheKey
} from 'modules/cache/constants/cache-keys';

// Deletes cache for a tally
export default withApiHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const network = (req.query.network as SupportedNetworks) || DEFAULT_NETWORK.network;

    // Allowed cache keys to be deleted, they can be partial since we just check that the key is on the requested path.
    const allowedCacheKeys = [
      'parsed-tally-',
      executiveSupportersCacheKey,
      'polls-',
      delegatesGithubCacheKey,
      allDelegatesCacheKey
    ];

    try {
      const { cacheKey } = req.body;

      const isAllowed = allowedCacheKeys.reduce((prev, next) => {
        return prev || cacheKey.indexOf(next) !== -1;
      }, false);

      if (!isAllowed || !cacheKey) {
        return res.status(401).json({
          error: 'Unauthorized'
        });
      }

      logger.debug(`invalidate-cache request: ${cacheKey}`);

      cacheDel(cacheKey, network);

      return res.status(200).json({
        invalidated: true,
        cacheKey
      });
    } catch (e) {
      logger.error(`invalidate-cache: ${e.message}`);
      return res.status(200).json({
        invalidated: false
      });
    }
  },
  {
    allowPost: true
  }
);
