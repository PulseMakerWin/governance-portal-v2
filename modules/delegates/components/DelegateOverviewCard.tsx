import React, { useState } from 'react';
import { Card, Box, Flex, Button, Text } from 'theme-ui';
import { formatValue } from 'lib/string';
import { InternalLink } from 'modules/app/components/InternalLink';
import { useMkrDelegated } from 'modules/mkr/hooks/useMkrDelegated';
import { useLockedMkr } from 'modules/mkr/hooks/useLockedMkr';
import { ANALYTICS_PAGES } from 'modules/app/client/analytics/analytics.constants';
import { useAnalytics } from 'modules/app/client/analytics/useAnalytics';
import { Delegate } from '../types';
import { DelegateModal, UndelegateModal } from 'modules/delegates/components';
import {
  participationTooltipLabel,
  communicationTooltipLabel
} from 'modules/delegates/components/DelegateParticipationMetrics';
import Tooltip from 'modules/app/components/Tooltip';
import { CurrentlySupportingExecutive } from 'modules/executive/components/CurrentlySupportingExecutive';
import LastVoted from 'modules/polling/components/LastVoted';
import DelegateAvatarName from './DelegateAvatarName';
import { useAccount } from 'modules/app/hooks/useAccount';
import { CoreUnitModal } from './modals/CoreUnitModal';
import { CoreUnitButton } from './modals/CoreUnitButton';

type PropTypes = {
  delegate: Delegate;
};

export function DelegateOverviewCard({ delegate }: PropTypes): React.ReactElement {
  const { account, voteDelegateContractAddress } = useAccount();

  const [showDelegateModal, setShowDelegateModal] = useState(false);
  const [showUndelegateModal, setShowUndelegateModal] = useState(false);
  const [showCoreUnitModal, setShowCoreUnitModal] = useState(false);

  const handleInfoClick = () => {
    setShowCoreUnitModal(!showCoreUnitModal);
  };

  const { data: totalStaked, mutate: mutateTotalStaked } = useLockedMkr(delegate.voteDelegateAddress);
  const { data: mkrDelegated, mutate: mutateMKRDelegated } = useMkrDelegated(
    account,
    delegate.voteDelegateAddress
  );

  const { trackButtonClick } = useAnalytics(ANALYTICS_PAGES.DELEGATES);

  const isOwner = delegate.voteDelegateAddress.toLowerCase() === voteDelegateContractAddress?.toLowerCase();

  return (
    <Card
      sx={{
        p: [0, 0]
      }}
      data-testid="delegate-card"
    >
      <Box px={[3, 4]} pb={3} pt={3}>
        <Flex sx={{ mb: 3, justifyContent: 'space-between', alignItems: 'center' }}>
          <LastVoted
            expired={delegate.expired}
            date={delegate ? (delegate.lastVoteDate ? delegate.lastVoteDate : null) : undefined}
            left
          />
          {delegate.cuMember && <CoreUnitButton handleInfoClick={handleInfoClick} />}
        </Flex>

        <Flex
          sx={{
            flexDirection: ['column', 'column', 'row', 'column', 'row']
          }}
        >
          <Flex
            sx={{
              maxWidth: ['100%', '100%', '300px', '100%', '300px'],
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              height: '100vh',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ mr: [0, 2] }}>
              <DelegateAvatarName delegate={delegate} />
            </Box>
            <Box>
              <Button
                variant="primaryOutline"
                disabled={!account}
                onClick={() => {
                  trackButtonClick('openUndelegateModal');
                  setShowUndelegateModal(true);
                }}
                sx={{ width: ['100%', '135px'], height: '45px', maxWidth: '135px', mr: '2' }}
                data-testid="button-undelegate"
              >
                Undelegate
              </Button>
              <Button
                variant="primaryLarge"
                data-testid="button-delegate"
                disabled={!account}
                onClick={() => {
                  trackButtonClick('openDelegateModal');
                  setShowDelegateModal(true);
                }}
                sx={{ width: ['100%', '135px'], maxWidth: '135px', height: '45px', ml: '3' }}
              >
                Delegate
              </Button>
            </Box>
          </Flex>

          <Flex
            sx={{
              flex: 1,
              mt: [4, 4, 0, 4, 0],
              flexDirection: ['column']
            }}
          >
            <Flex
              sx={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                width: ['50%', '100%'],
                mr: [1, 0],
                mb: 3,
              }}
            >
              <Box sx={{mr: 3}}>
                <Tooltip label={participationTooltipLabel}>
                  <Text
                    as="p"
                    variant="caps"
                    color="onSecondary"
                    sx={{ fontSize: 1, cursor: 'help' }}
                  >
                    {`${delegate.combinedParticipation ?? 'Untracked'} Participation`}
                  </Text>
                </Tooltip>
              </Box>
              <Box sx={{ }}>
                <Tooltip label={communicationTooltipLabel}>
                  <Text
                    as="p"
                    variant="caps"
                    color="onSecondary"
                    sx={{ fontSize: 1, cursor: 'help' }}
                  >
                    {`${delegate.communication ?? 'Untracked'} Communication`}
                  </Text>
                </Tooltip>
              </Box>
            </Flex>
            <Flex
              sx={{
                flexDirection: ['row'],
                justifyContent: 'space-between',
                width: ['50%', '100%'],
                alignItems: 'center'
              }}
            >
              <Flex sx={{ height: '100%'}}>
                <InternalLink
                  href={`/address/${delegate.voteDelegateAddress}`}
                  title={`View ${isOwner ? 'Your' : 'Profile'} Details`}
                  styles={{ mt: 'auto' }}
                >
                  <Button
                    variant="outline"
                    onClick={() => trackButtonClick('openDelegateProfile')}
                    sx={{ borderColor: 'text', color: 'text' }}
                  >
                    {`View ${isOwner ? 'Your' : 'Profile'} Details`}
                  </Button>
                </InternalLink>
              </Flex>
              <Flex sx={{ justifyContent: 'flex-end'}}>
                <Box>
                  <Text
                    as="p"
                    variant="microHeading"
                    sx={{ fontSize: [3, 5], textAlign: 'right' }}
                    data-testid="mkr-delegated-by-you"
                  >
                    {mkrDelegated ? formatValue(mkrDelegated) : '0.00'}
                  </Text>
                  <Text as="p" variant="secondary" color="onSecondary" sx={{ fontSize: [2, 3] }}>
                    MKR delegated by you
                  </Text>
                </Box>
                <Box sx={{ ml: '4'}}>
                  <Text
                    as="p"
                    variant="microHeading"
                    sx={{ fontSize: [3, 5], textAlign: 'right' }}
                    data-testid="total-mkr-delegated"
                  >
                    {totalStaked && totalStaked.gt(0) ? formatValue(totalStaked) : '0.00'}
                  </Text>
                  <Text as="p" variant="secondary" color="onSecondary" sx={{ fontSize: [2, 3] }}>
                    Total MKR delegated
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Box>
      <CurrentlySupportingExecutive
        proposalsSupported={delegate.proposalsSupported}
        execSupported={delegate.execSupported}
      />

      {showDelegateModal && (
        <DelegateModal
          delegate={delegate}
          isOpen={showDelegateModal}
          onDismiss={() => setShowDelegateModal(false)}
          mutateTotalStaked={mutateTotalStaked}
          mutateMKRDelegated={mutateMKRDelegated}
        />
      )}
      {showUndelegateModal && (
        <UndelegateModal
          delegate={delegate}
          isOpen={showUndelegateModal}
          onDismiss={() => setShowUndelegateModal(false)}
          mutateTotalStaked={mutateTotalStaked}
          mutateMKRDelegated={mutateMKRDelegated}
        />
      )}

      {showCoreUnitModal && (
        <CoreUnitModal isOpen={showCoreUnitModal} onDismiss={() => setShowCoreUnitModal(false)} />
      )}
    </Card>
  );
}
