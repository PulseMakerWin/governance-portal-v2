import { SupportedNetworks } from 'modules/web3/constants/networks';
import { formatIsoDateConversion } from 'lib/datetime';
import { MKRWeightTimeRanges } from '../delegates.constants';
import { MKRWeightHisory } from '../types/mkrWeight';
import { format } from 'date-fns';
import BigNumber from 'bignumber.js';
import { MKRLockedDelegateAPIResponse } from '../types';
import { differenceInCalendarYears, subDays } from 'date-fns';
import { gqlRequest } from 'modules/gql/gqlRequest';
import { networkNameToChainId } from 'modules/web3/helpers/chain';
import { mkrLockedDelegateArray } from 'modules/gql/queries/mkrLockedDelegateArray';

export async function fetchDelegatesMKRWeightHistory(
  address: string,
  from: number,
  range: MKRWeightTimeRanges,
  network: SupportedNetworks
): Promise<MKRWeightHisory[]> {
  const data = await gqlRequest({
    chainId: networkNameToChainId(network),
    query: mkrLockedDelegateArray,
    variables: {
      argAddress: [address.toLowerCase()],
      argUnixTimeStart: 0,
      argUnixTimeEnd: Math.floor(Date.now() / 1000)
    }
  });

  const addressData: MKRLockedDelegateAPIResponse[] = data.mkrLockedDelegateArray.nodes;

  // We need to fill all the data for the interval
  // If we get last month, we need to add all the missing days
  const start = formatIsoDateConversion(addressData[0].blockTimestamp);

  const years = differenceInCalendarYears(Date.now(), new Date(addressData[0].blockTimestamp));

  const end =
    years * 365 +
    parseInt(
      format(new Date(), 'D', {
        useAdditionalDayOfYearTokens: true
      })
    );

  const output: MKRWeightHisory[] = [];

  for (let i = start; i <= end; i++) {
    const existingItem = addressData.filter(item => {
      const years = differenceInCalendarYears(
        new Date(item.blockTimestamp),
        new Date(addressData[0].blockTimestamp)
      );
      const dayOfYear = formatIsoDateConversion(item.blockTimestamp);
      const dayNumber = dayOfYear + years * 365;
      if (dayNumber === i) {
        return item;
      }
    });

    if (existingItem && existingItem.length > 0) {
      // If we have multiple items for the same day, use the final one because the lockTotal will be accurate.
      const mostRecent = existingItem[existingItem.length - 1];
      output.push({
        date: subDays(new Date(), end - i),
        MKR: new BigNumber(mostRecent.lockTotal).toNumber()
      });
    } else {
      output.push({
        date: subDays(new Date(), end - i),
        MKR: output[output.length - 1].MKR
      });
    }
  }

  // Filter by date
  return output.filter(i => {
    return i.date.getTime() > new Date(from).getTime();
  });
}
