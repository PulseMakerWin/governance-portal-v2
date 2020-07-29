/** @jsx jsx */
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Text, Flex, Box, Button, Close, jsx } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import { ListboxInput, ListboxButton, ListboxPopover, ListboxList, ListboxOption } from '@reach/listbox';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import map from 'lodash/map';
import omitBy from 'lodash/omitBy';
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

const PollOverviewCard = ({ poll, ...props }: { poll: Poll }) => {
  const network = getNetwork();
  const account = useAccountsStore(state => state.currentAccount);
  const bpi = useBreakpoints();
  const canVote = !!account && isActivePoll(poll);
  const showQuickVote = canVote && bpi > 0;
  const [showVoteSheet, setShowVoteSheet] = useState(false);

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
            <Button variant="primary" mr={2} onClick={() => setShowVoteSheet(true)}>
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
      {showVoteSheet && <MobileVoteSheet poll={poll} close={() => setShowVoteSheet(false)} />}
    </Flex>
  );
};

export default PollOverviewCard;

const QuickVote = ({ poll }: { poll: Poll }) => {
  const [addToBallot, addedChoice] = useBallotStore(state => [state.addToBallot, state.ballot[poll.pollId]]);
  const [choice, setChoice] = useState<number | number[] | null>(null);
  const [editing, setEditing] = useState(false);
  const isChoiceValid = Array.isArray(choice) ? choice.length > 0 : choice !== null;

  const submit = () => {
    invariant(isChoiceValid);
    addToBallot(poll.pollId, choice);
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

// TODO should this go into the theme?
const listboxSx = {
  button: { variant: 'buttons.outline', width: '100%' },
  popover: { variant: 'cards.tight', '&:focus-within': { outline: 'none' } },
  list: { 'li[aria-selected="true"]': { backgroundColor: 'primary' } }
};

const ABSTAIN = 0;

const SingleSelect = ({ poll, setChoice, ...props }) => {
  return (
    <ListboxInput onChange={x => setChoice(parseInt(x))} {...props}>
      <ListboxButton sx={listboxSx.button} arrow={<Icon name="chevron_down" size={2} />} />
      <ListboxPopover sx={listboxSx.popover}>
        <ListboxList sx={listboxSx.list}>
          <ListboxOption value="default" sx={{ display: 'none' }}>
            Your choice
          </ListboxOption>
          {map(poll.options, (label, id) => (
            <ListboxOption key={id} value={id}>
              {label}
            </ListboxOption>
          ))}
          <ListboxOption value={String(ABSTAIN)}>Abstain</ListboxOption>
        </ListboxList>
      </ListboxPopover>
    </ListboxInput>
  );
};

type RankedChoiceSelectProps = { poll: Poll; setChoice: (choices: number[]) => void };
const RankedChoiceSelect = ({ poll, setChoice, ...props }: RankedChoiceSelectProps) => {
  const [selectedChoices, setSelectedChoices] = useState<number[]>([]);
  const [optionCount, setOptionCount] = useState<number>(1);
  const numOptionsAvailable = Object.keys(poll.options).length;
  const canAddOption = numOptionsAvailable > optionCount && selectedChoices[optionCount - 1] !== undefined;

  const availableChoices = useMemo(
    () =>
      omitBy(poll.options, (_, pollId) => {
        return selectedChoices.findIndex(choice => choice === parseInt(pollId)) > -1;
      }),
    [optionCount]
  );

  return (
    <Box {...props}>
      <Stack gap={2}>
        {Array.from({ length: optionCount - 1 }).map((_, index) => (
          <Flex sx={{ backgroundColor: 'background', py: 2, px: 3 }} key={index}>
            <Flex sx={{ flexDirection: 'column' }}>
              <Text sx={{ textTransform: 'uppercase', fontSize: 1, fontWeight: 'bold' }}>
                {getNumberWithOrdinal(index + 1)} choice
              </Text>
              <Text>{poll.options[selectedChoices[index]]}</Text>
            </Flex>
            <Close
              ml="auto"
              my="auto"
              sx={{ '> svg': { size: [3] } }}
              onClick={() => {
                const newChoices = [...selectedChoices];
                newChoices.splice(index, 1);
                setSelectedChoices(newChoices);
                setOptionCount(optionCount - 1);
              }}
            />
          </Flex>
        ))}
        <ListboxInput
          key={optionCount}
          onChange={value => {
            const newChoices = [...selectedChoices];
            newChoices[optionCount - 1] = parseInt(value);
            setSelectedChoices(newChoices);
            if (setChoice) setChoice(newChoices);
          }}
        >
          <ListboxButton sx={listboxSx.button} arrow={<Icon name="chevron_down" size={2} />} />
          <ListboxPopover sx={listboxSx.popover}>
            <ListboxList sx={listboxSx.list}>
              <ListboxOption value="default" sx={{ display: 'none' }}>
                {getNumberWithOrdinal(selectedChoices.length + 1)} choice
              </ListboxOption>
              {map(availableChoices, (label, pollId) => (
                <ListboxOption key={pollId} value={pollId}>
                  {label}
                </ListboxOption>
              ))}
            </ListboxList>
          </ListboxPopover>
        </ListboxInput>
      </Stack>
      {canAddOption && (
        <Text
          color="primary"
          onClick={() => setOptionCount(optionCount + 1)}
          sx={{
            pt: 1,
            fontSize: 2,
            cursor: 'pointer',
            textTransform: 'uppercase'
          }}
        >
          <span sx={{ mr: 2 }}>+</span> Add another choice
        </Text>
      )}
    </Box>
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

function MobileVoteSheet({ poll, close }: { poll: Poll; close: () => void }) {
  const addToBallot = useBallotStore(state => state.addToBallot);
  const [choice, setChoice] = useState<number | number[] | null>(null);
  const isChoiceValid = Array.isArray(choice) ? choice.length > 0 : choice !== null;

  const submit = () => {
    invariant(isChoiceValid);
    addToBallot(poll.pollId, choice);
  };

  return (
    <DialogOverlay onDismiss={close}>
      <DialogContent
        sx={{
          width: '100vw',
          position: 'absolute',
          bottom: 0,
          mb: 0,
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px'
        }}
      >
        <Stack gap={2}>
          <Text variant="subheading">{poll.title}</Text>
          <Text sx={{ fontSize: [2, 3], opacity: 0.8 }}>{poll.summary}</Text>
          {isRankedChoicePoll(poll) ? (
            <RankedChoiceSelect {...{ poll, setChoice }} />
          ) : (
            <SingleSelect {...{ poll, setChoice }} />
          )}
          <Button variant="primary" onClick={submit} disabled={!isChoiceValid}>
            Add vote to ballot
          </Button>
        </Stack>
      </DialogContent>
    </DialogOverlay>
  );
}
