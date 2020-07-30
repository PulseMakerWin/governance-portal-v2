/** @jsx jsx */
import Link from 'next/link';
import { useState } from 'react';
import { Text, Flex, Box, Button, jsx } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import invariant from 'tiny-invariant';

import { isActivePoll, isRankedChoicePoll, getNumberWithOrdinal } from '../../lib/utils';
import { getNetwork } from '../../lib/maker';
import Stack from '../layouts/Stack';
import CountdownTimer from '../CountdownTimer';
import VotingStatus from './VotingStatus';
import Poll from '../../types/poll';
import PollOptionBadge from '../PollOptionBadge';
import useBreakpoints from '../../lib/useBreakpoints';
import useAccountsStore from '../../stores/accounts';
import useBallotStore from '../../stores/ballot';
import RankedChoiceSelect from './RankedChoiceSelect';
import SingleSelect from './SingleSelect';

type Props = { poll: Poll; startMobileVoting: () => void };
export default function PollOverviewCard({ poll, startMobileVoting, ...props }: Props): JSX.Element {
  const network = getNetwork();
  const account = useAccountsStore(state => state.currentAccount);
  const bpi = useBreakpoints();
  const canVote = !!account && isActivePoll(poll);
  const showQuickVote = canVote && bpi > 0;

  return (
    <Flex sx={{ flexDirection: 'row', justifyContent: 'space-between', variant: 'cards.primary' }} {...props}>
      <Stack gap={2}>
        {bpi === 0 && (
          <Flex sx={{ justifyContent: 'space-between', flexDirection: 'row', flexWrap: 'nowrap' }}>
            <CountdownTimer endText="Poll ended" endDate={poll.endDate} />
            <VotingStatus poll={poll} />
          </Flex>
        )}
        <Box>
          <Link
            href={{ pathname: '/polling/[poll-hash]', query: { network } }}
            as={{ pathname: `/polling/${poll.slug}`, query: { network } }}
          >
            <Text sx={{ fontSize: [3, 4], whiteSpace: 'nowrap', overflowX: 'auto' }}>{poll.title}</Text>
          </Link>
        </Box>
        <Text
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: [2, 3],
            opacity: 0.8
          }}
        >
          {poll.summary}
        </Text>
        {bpi > 0 && <CountdownTimer endText="Poll ended" endDate={poll.endDate} />}
        <Flex sx={{ alignItems: 'center' }}>
          {canVote && bpi === 0 && (
            <Button variant="primary" mr={2} onClick={startMobileVoting}>
              Vote
            </Button>
          )}
          <Link
            key={poll.slug}
            href={{ pathname: '/polling/[poll-hash]', query: { network } }}
            as={{ pathname: `/polling/${poll.slug}`, query: { network } }}
          >
            <Button variant="outline">View Details</Button>
          </Link>
          {isActivePoll(poll) ? '' : <PollOptionBadge poll={poll} sx={{ color: 'mutedAlt' }} />}
          <VotingStatus sx={{ display: ['none', 'block'] }} poll={poll} />
        </Flex>
      </Stack>
      {showQuickVote && <QuickVote poll={poll} />}
    </Flex>
  );
}

const QuickVote = ({ poll }: { poll: Poll }) => {
  const [addToBallot, addedChoice] = useBallotStore(state => [state.addToBallot, state.ballot[poll.pollId]]);
  const [choice, setChoice] = useState<number | number[] | null>(null);
  const [editing, setEditing] = useState(false);
  const isChoiceValid = Array.isArray(choice) ? choice.length > 0 : choice !== null;

  const submit = () => {
    invariant(isChoiceValid);
    addToBallot(poll.pollId, choice as number | number[]);
    setEditing(false);
  };

  // TODO show icon next to Your Vote for ranked choice
  const gap = 2;
  return (
    <Stack gap={gap} ml={5} sx={{ maxWidth: 7 }}>
      <Text variant="caps" color="mutedAlt">
        Your Vote
      </Text>
      {!!addedChoice && !editing ? (
        <ChoiceSummary poll={poll} choice={addedChoice} edit={() => setEditing(true)} />
      ) : (
        <div>
          {isRankedChoicePoll(poll) ? (
            <RankedChoiceSelect {...{ poll, setChoice }} />
          ) : (
            <SingleSelect {...{ poll, setChoice }} />
          )}
          <Button
            variant="primaryOutline"
            sx={{ width: 7 }}
            onClick={submit}
            mt={gap}
            disabled={!isChoiceValid}
          >
            Add vote to ballot
          </Button>
        </div>
      )}
    </Stack>
  );
};

const ChoiceSummary = ({ choice: { option }, poll, edit, ...props }) => {
  if (typeof option === 'number') {
    return (
      <Box {...props}>
        <Box bg="background" sx={{ p: 3, mb: 2 }}>
          <Text>{option === ABSTAIN ? 'Abstain' : poll.options[option]}</Text>
        </Box>
        <Button
          onClick={edit}
          variant="smallOutline"
          sx={{ display: 'inline-flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <Icon name="edit" size={3} mr={1} />
          Edit choice
        </Button>
      </Box>
    );
  }
  return (
    <Box {...props}>
      {option.map((id, index) => (
        <Flex sx={{ backgroundColor: 'background', py: 2, px: 3, mb: 2 }} key={index}>
          <Flex sx={{ flexDirection: 'column' }}>
            <Text sx={{ textTransform: 'uppercase', fontSize: 1, fontWeight: 'bold' }}>
              {getNumberWithOrdinal(index + 1)} choice
            </Text>
            <Text>{poll.options[id]}</Text>
          </Flex>
        </Flex>
      ))}
      <Button
        onClick={edit}
        variant="smallOutline"
        sx={{ display: 'inline-flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <Icon name="edit" size={3} mr={1} />
        Edit choice
      </Button>
    </Box>
  );
};
