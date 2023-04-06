/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import { gqlRequest } from 'modules/gql/gqlRequest';
import { totalMkrDelegatedToGroup } from 'modules/gql/queries/totalMkrDelegatedToGroup';
import { SupportedNetworks } from 'modules/web3/constants/networks';
import { networkNameToChainId } from 'modules/web3/helpers/chain';
import { CvcStats, CvcWithCountAndDelegates } from '../types/cvc';
import logger from 'lib/logger';

export async function fetchCvcsTotalDelegated(
  cvcs: CvcWithCountAndDelegates[],
  network: SupportedNetworks
): Promise<CvcStats[]> {
  const cvcsData = await Promise.all(
    cvcs.map(async cvc => {
      try {
        const res = await gqlRequest({
          chainId: networkNameToChainId(network),
          query: totalMkrDelegatedToGroup,
          variables: {
            delegates: cvc.delegates
          }
        });

        const totalMkr: number = +res.totalMkrDelegatedToGroup;
        return {
          cvc_name: cvc.cvc_name,
          count: cvc.count,
          totalMkr
        };
      } catch (e) {
        logger.error('fetchCvcTotalDelegated: Error fetching MKR delegated to CVC', e.message);
        return {
          cvc_name: cvc.cvc_name,
          count: cvc.count,
          totalMkr: 0
        };
      }
    })
  );

  return cvcsData;
}
