/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import { BigNumberJS } from 'lib/bigNumberJs';
import Skeleton from 'modules/app/components/SkeletonThemed';
import { Stats } from 'modules/home/components/Stats';
import { DelegatesAPIStats } from 'modules/delegates/types';
import { PollsResponse } from 'modules/polling/types/pollsResponse';

type Props = {
  pollStats: PollsResponse['stats'];
  stats?: DelegatesAPIStats;
  mkrOnHat?: string;
  mkrInChief?: string;
};

export function GovernanceStats({ pollStats, stats, mkrOnHat, mkrInChief }: Props): JSX.Element {
  const infoUnits = [
    {
      title: 'pMKR on Hat',
      value: mkrOnHat ? `${mkrOnHat} pMKR` : <Skeleton />
    },
    {
      title: 'Active Polls',
      value: pollStats ? pollStats.active.toString() : <Skeleton />
    },
    {
      title: 'Aligned Delegates',
      value: stats ? stats.aligned.toString() : <Skeleton />
    },
    {
      title: 'Shadow Delegates',
      value: stats ? stats.shadow.toString() : <Skeleton />
    },
    {
      title: 'pMKR Delegated',
      value: stats ? `${new BigNumberJS(stats.totalMKRDelegated).toFormat(0)} pMKR` : <Skeleton />
    },
    {
      title: 'pMKR in Chief',
      value: mkrInChief ? `${mkrInChief} pMKR` : <Skeleton />
    }
  ];

  return (
    <Stats
      title="Governance Stats"
      infoUnits={infoUnits}
      viewMoreUrl="" //Neeed to get additional stats or remove
    />
  );
}
