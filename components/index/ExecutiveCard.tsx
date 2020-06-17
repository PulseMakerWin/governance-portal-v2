/** @jsx jsx */
import Link from 'next/link';
import useSWR from 'swr';
import { Button, Text, Flex, Badge, Box, jsx } from 'theme-ui';
import Skeleton from 'react-loading-skeleton';

import getMaker, { getNetwork } from '../../lib/maker';
import CurrencyObject from '../../types/currency';
import Proposal from '../../types/proposal';

type Props = {
  proposal: Proposal;
  isHat: boolean;
};

export default function ExecutiveCard({ proposal, isHat, ...props }: Props) {
  const network = getNetwork();

  const { data: mkrSupport } = useSWR<CurrencyObject>(
    [`/executive/mkr-support`, proposal.source],
    (_, spellAddress) => getMaker().then(maker => maker.service('chief').getApprovalCount(spellAddress))
  );

  return (
    <div
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        variant: 'cards.primary',
        mx: [4, 0]
      }}
      {...props}
    >
      <Flex
        sx={{
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Link
          href={{
            pathname: '/executive/[proposal-id]',
            query: { network }
          }}
          as={{
            pathname: `/executive/${proposal.key}`,
            query: { network }
          }}
        >
          <Text
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: [3, 4]
            }}
          >
            {proposal.title}
          </Text>
        </Link>
        <Text
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: [3, 4],
            opacity: 0.8
          }}
        >
          {proposal.proposal_blurb}
        </Text>
        <Flex sx={{ alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Link
            href={{
              pathname: '/executive/[proposal-id]',
              query: { network }
            }}
            as={{
              pathname: `/executive/${proposal.key}`,
              query: { network }
            }}
          >
            <Button>Vote on proposal</Button>
          </Link>
          {mkrSupport ? (
            <>
              <Badge
                variant="primary"
                sx={{
                  borderColor: 'text',
                  textTransform: 'uppercase',
                  alignSelf: 'center'
                }}
              >
                {mkrSupport.toBigNumber().toFormat(2)} MKR Supporting
              </Badge>
              {isHat ? (
                <Badge
                  variant="primary"
                  sx={{
                    borderColor: '#098C7D',
                    color: '#098C7D',
                    textTransform: 'uppercase',
                    alignSelf: 'center'
                  }}
                >
                  Governing proposal
                </Badge>
              ) : null}
            </>
          ) : (
            <Box m="auto" ml="3" sx={{ width: '200px' }}>
              <Skeleton />
            </Box>
          )}
        </Flex>
      </Flex>
    </div>
  );
}
