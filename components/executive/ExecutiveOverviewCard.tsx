/** @jsx jsx */
import Link from 'next/link';
import { useBreakpointIndex } from '@theme-ui/match-media';
import { Text, Flex, Box, Button, Badge, Divider, Card, jsx } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import useSWR from 'swr';
import Skeleton from 'react-loading-skeleton';
import Bignumber from 'bignumber.js';

import Proposal from '../../types/proposal';
import getMaker, { getNetwork } from '../../lib/maker';
import { formatDateWithTime } from '../../lib/utils';
import Stack from '../layouts/Stack';
import useAccountsStore from '../../stores/accounts';
import VoteModal from './VoteModal';
import { useState } from 'react';
import SpellData from '../../types/spellData';

type Props = {
  proposal: Proposal;
  spellData?: SpellData;
};

export default function ExecutiveOverviewCard({ proposal, spellData, ...props }: Props): JSX.Element {
  const account = useAccountsStore(state => state.currentAccount);
  const [voting, setVoting] = useState(false);

  const { data: votedProposals } = useSWR<string[]>(
    ['/executive/voted-proposals', account?.address],
    (_, address) =>
      getMaker().then(maker =>
        maker
          .service('chief')
          .getVotedSlate(address)
          .then(slate => maker.service('chief').getSlateAddresses(slate))
      )
  );

  const network = getNetwork();
  const bpi = useBreakpointIndex();
  const hasVotedFor =
    votedProposals &&
    !!votedProposals.find(
      proposalAddress => proposalAddress.toLowerCase() === proposal.address.toLowerCase()
    );
  const canVote = !!account;

  if ('about' in proposal) {
    return (
      <Card sx={{ p: [0, 0] }} {...props}>
        <Flex px={[3, 4]} py={[3, spellData?.hasBeenCast ? 3 : 4]} sx={{ justifyContent: 'space-between' }}>
          <Stack gap={2}>
            <Flex sx={{ justifyContent: 'space-between', flexDirection: 'row', flexWrap: 'nowrap' }}>
              <Text variant="caps" sx={{ color: 'mutedAlt' }}>
                posted {formatDateWithTime(proposal.date)}
              </Text>
            </Flex>
            <Box>
              <Link
                href={{ pathname: '/executive/[proposal-id]', query: { network } }}
                as={{ pathname: `/executive/${proposal.key}`, query: { network } }}
              >
                <Text variant="microHeading" sx={{ fontSize: [3, 5], cursor: 'pointer' }}>
                  {proposal.title}
                </Text>
              </Link>
            </Box>
            <Text
              sx={{
                fontSize: [2, 3],
                color: 'onSecondary'
              }}
            >
              {proposal.proposalBlurb}
            </Text>
            <Flex sx={{ alignItems: 'center' }}>
              <Flex>
                {hasVotedFor && (
                  <Badge
                    variant="primary"
                    sx={{
                      color: 'primary',
                      borderColor: 'primary',
                      textTransform: 'uppercase',
                      display: 'inline-flex',
                      alignItems: 'center',
                      mr: 2
                    }}
                  >
                    <Flex sx={{ display: 'inline-flex', pr: 2 }}>
                      <Icon name="verified" size={3} />
                    </Flex>
                    Your Vote
                  </Badge>
                )}
                {spellData?.mkrSupport === undefined ? (
                  <Box sx={{ width: 6 }}>
                    <Skeleton />
                  </Box>
                ) : (
                  <Badge
                    variant="primary"
                    sx={{
                      borderColor: 'text',
                      textTransform: 'uppercase'
                    }}
                  >
                    {new Bignumber(spellData.mkrSupport).toFormat(2)} MKR Supporting
                  </Badge>
                )}
              </Flex>
            </Flex>
            {canVote && bpi === 0 && (
              <Box sx={{ pt: 2 }}>
                <Button variant="primaryOutline" sx={{ width: '100%' }} onClick={() => setVoting(true)}>
                  {hasVotedFor ? 'Withdraw Vote' : 'Vote'}
                </Button>
              </Box>
            )}
          </Stack>
          {canVote && bpi > 0 && (
            <Flex sx={{ mx: 4, alignItems: 'center', justifyContent: 'center', width: 7 }}>
              <Button variant="primaryOutline" sx={{ width: '100%' }} onClick={() => setVoting(true)}>
                {hasVotedFor ? 'Withdraw Vote' : 'Vote'}
              </Button>
            </Flex>
          )}
        </Flex>
        {voting && <VoteModal proposal={proposal} close={() => setVoting(false)} />}

        {spellData?.hasBeenCast && (
          <>
            <Divider my={0} />
            <Flex p={[4, 3]} sx={{ justifyContent: 'center' }}>
              <Text sx={{ fontSize: [2, 3], color: 'onSecondary' }}>
                Passed on {formatDateWithTime(spellData.datePassed)}.{' '}
                {typeof spellData.dateExecuted === 'string' ? (
                  <>Executed on {formatDateWithTime(spellData.dateExecuted)}.</>
                ) : (
                  <>Available for execution on {formatDateWithTime(spellData.eta)}.</>
                )}
              </Text>
            </Flex>
          </>
        )}
      </Card>
    );
  }

  return (
    <Card sx={{ p: [0, 0] }} {...props}>
      <Box sx={{ p: 3 }}>
        <Text>spell address {proposal.address}</Text>
      </Box>
    </Card>
  );
}
