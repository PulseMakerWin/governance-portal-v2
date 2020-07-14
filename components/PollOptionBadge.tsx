import { Flex, Box, Badge } from 'theme-ui';
import Skeleton from 'react-loading-skeleton';
import { isActivePoll } from '../lib/utils';
import { getNetwork } from '../lib/maker';
import useSWR from 'swr';
import { parsePollTally, fetchJson } from '../lib/utils';

const PollOptionBadge = ({ poll, color }) => {
  const hasPollEnded=!isActivePoll(poll);
  const network = getNetwork();
  const { data: tally } = useSWR(
    hasPollEnded
      ? `/api/polling/tally/cache-no-revalidate/${poll.pollId}?network=${network}`
      : `/api/polling/tally/${poll.pollId}?network=${network}`,
    async url => parsePollTally(await fetchJson(url), poll)
  );

  return (
    <Flex sx={{ alignItems: 'center' }}>
        {tally ? (
            hasPollEnded ? (
            <Badge
                mx="3"
                px="14px"
                variant="primary"
                sx={{
                borderColor: color ? color : 'primaryAlt',
                color: color ? color : 'primaryAlt',
                textTransform: 'uppercase'
                }}
            >
                Winning Option: {tally.winningOptionName}
            </Badge>
            ) : (
            <Badge
                mx="3"
                px="14px"
                variant="primary"
                sx={{
                borderColor: 'text',
                textTransform: 'uppercase'
                }}
            >
                Leading Option: {tally.winningOptionName}
            </Badge>
            )
        ) : (
            <Box m="auto" ml="3" sx={{ width: '300px' }}>
            <Skeleton />
            </Box>
        )}
    </Flex>
  );
};

export default PollOptionBadge;