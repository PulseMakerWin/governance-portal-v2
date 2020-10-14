/** @jsx jsx */
import Link from 'next/link';
import { Button, Text, Flex, jsx } from 'theme-ui';

import Stack from '../layouts/Stack';
import { getNetwork } from '../../lib/maker';
import CountdownTimer from '../CountdownTimer';
import PollOptionBadge from '../PollOptionBadge';
import Poll from '../../types/poll';

type Props = {
  poll: Poll;
};

const PollPreviewCard = ({ poll, ...props }: Props): JSX.Element => {
  const network = getNetwork();

  return (
    <div {...props}>
      <Stack gap={2} sx={{ variant: 'cards.primary' }}>
        <Flex sx={{ justifyContent: 'space-between' }}>
          <Text
            variant="caps"
            sx={{
              fontSize: [2, 1],
              color: 'textSecondary'
            }}
          >
            Posted{' '}
            {new Date(poll.startDate).toLocaleString('default', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
          <CountdownTimer endText="Poll ended" endDate={poll.endDate} />
        </Flex>
        <Flex>
          <Link
            href={{
              pathname: '/polling/[poll-hash]',
              query: { network }
            }}
            as={{
              pathname: `/polling/${poll.slug}`,
              query: { network }
            }}
          >
            <Text variant="microHeading" sx={{ fontSize: [3, 4], cursor: 'pointer' }}>
              {poll.title}
            </Text>
          </Link>
        </Flex>

        <Text
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: 3,
            opacity: 0.8,
            mb: [1, 2]
          }}
        >
          {poll.summary}
        </Text>
        <Flex sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <PollOptionBadge poll={poll} sx={{ mb: 2, display: ['block', 'none'] }} />
          <Link
            key={poll.slug}
            href={{
              pathname: '/polling/[poll-hash]',
              query: { network }
            }}
            as={{
              pathname: `/polling/${poll.slug}`,
              query: { network }
            }}
          >
            <Button variant="primaryOutline" sx={{ borderRadius: 'small', px: 4, width: ['100%', 'auto'] }}>
              View proposal
            </Button>
          </Link>
          <PollOptionBadge poll={poll} sx={{ ml: 3, display: ['none', 'block'] }} />
        </Flex>
      </Stack>
    </div>
  );
};

export default PollPreviewCard;
