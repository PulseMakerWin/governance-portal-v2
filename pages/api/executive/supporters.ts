/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import { NextApiRequest, NextApiResponse } from 'next';
import { DEFAULT_NETWORK, SupportedNetworks } from 'modules/web3/constants/networks';
import withApiHandler from 'modules/app/api/withApiHandler';
import { isSupportedNetwork } from 'modules/web3/helpers/networks';
import { getContracts } from 'modules/web3/helpers/getContracts';
import { networkNameToChainId } from 'modules/web3/helpers/chain';
import { fetchExecutiveVoteTally } from 'modules/executive/api/fetchExecutiveVoteTally';
import { cacheGet, cacheSet } from 'modules/cache/cache';
import { executiveSupportersCacheKey } from 'modules/cache/constants/cache-keys';
import { FIVE_MINUTES_IN_MS } from 'modules/app/constants/time';
import { ApiError } from 'modules/app/api/ApiError';

export default withApiHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  const network = (req.query.network as SupportedNetworks) || DEFAULT_NETWORK.network;

  // validate network
  if (!isSupportedNetwork(network)) {
    throw new ApiError('Invalid network', 400, 'Invalid network');
  }

  const cached = await cacheGet(executiveSupportersCacheKey, network);

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

  if (cached) {
    res.status(200).json(JSON.parse(cached));
    return;
  }

  const chief = getContracts(networkNameToChainId(network), undefined, undefined, true).chief;
  const allSupporters = await fetchExecutiveVoteTally(chief);

  // handle percent and check address
  Object.keys(allSupporters).forEach(spell => {
    allSupporters[spell].forEach(supporter => {
      if (supporter.percent === 'NaN') supporter.percent = '0';
    });
  });

  cacheSet(executiveSupportersCacheKey, JSON.stringify(allSupporters), network, FIVE_MINUTES_IN_MS);
  res.status(200).json(allSupporters);
});
