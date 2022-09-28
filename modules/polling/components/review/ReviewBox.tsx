import { Box, Button, Card, Divider, Flex, Text, Spinner } from 'theme-ui';
import { Poll } from 'modules/polling/types';
import { useAnalytics } from 'modules/app/client/analytics/useAnalytics';
import { ANALYTICS_PAGES } from 'modules/app/client/analytics/analytics.constants';
import { Icon } from '@makerdao/dai-ui-icons';
import ActivePollsBox from './ActivePollsBox';
import { useContext, useState, useEffect } from 'react';
import { BallotContext } from '../../context/BallotContext';
import LocalIcon from 'modules/app/components/Icon';
import StackLayout from 'modules/app/components/layout/layouts/Stack';
import { ExternalLink } from 'modules/app/components/ExternalLink';
import TxIndicators from 'modules/app/components/TxIndicators';
import { useWeb3 } from 'modules/web3/hooks/useWeb3';
import { InternalLink } from 'modules/app/components/InternalLink';
import { TXMined } from 'modules/web3/types/transaction';
import { MIN_MKR_REQUIRED_FOR_GASLESS_VOTING_DISPLAY } from 'modules/polling/polling.constants';
import logger from 'lib/logger';
import { toast } from 'react-toastify';
import { fetchJson } from 'lib/fetchJson';
import useSWR from 'swr';
import SkeletonThemed from 'modules/app/components/SkeletonThemed';
import { getConnection } from 'modules/web3/connections';
import { ConnectionType } from 'modules/web3/constants/wallets';
import { GASLESS_RATE_LIMIT_IN_MS } from 'modules/polling/polling.constants';
import { formatValue } from 'lib/string';
import { parseEther } from 'ethers/lib/utils';
import EtherscanLink from 'modules/web3/components/EtherscanLink';

export default function ReviewBox({
  account,
  activePolls,
  polls,
  ballotPollIds
}: {
  account: string;
  activePolls: Poll[];
  polls: Poll[];
  ballotPollIds: string[];
}): JSX.Element {
  const { trackButtonClick } = useAnalytics(ANALYTICS_PAGES.POLLING_REVIEW);
  const {
    ballotStep,
    setStep,
    ballotCount,
    commentsCount,
    signComments,
    commentsSignature,
    transaction,
    submissionMethod,
    setSubmissionMethod,
    submitBallot,
    submitBallotGasless,
    submissionError
  } = useContext(BallotContext);
  const { network, connector } = useWeb3();

  const { data: precheckData } = useSWR(
    account && ballotPollIds && network
      ? `/api/polling/precheck?network=${network}&voter=${account}&pollIds=${ballotPollIds.join(',')}`
      : null,
    fetchJson
  );

  const hasMkrRequired = precheckData?.hasMkrRequired;
  const recentlyUsedGaslessVoting = precheckData?.recentlyUsedGaslessVoting;
  const alreadyVoted = precheckData?.alreadyVoted;
  const cacheExpired =
    precheckData?.recentlyUsedGaslessVoting &&
    Date.now() - parseInt(precheckData?.recentlyUsedGaslessVoting) > GASLESS_RATE_LIMIT_IN_MS;
  const relayFunded = parseEther(precheckData?.relayBalance || '0').gt(0);

  const validationPassed =
    precheckData?.hasMkrRequired &&
    (!precheckData?.recentlyUsedGaslessVoting || cacheExpired) &&
    !precheckData?.alreadyVoted &&
    relayFunded;

  // Detect if the current user is using a gnosis safe, and change the UI for comments and signatures
  const isGnosisSafe = getConnection(connector).type === ConnectionType.GNOSIS_SAFE;

  const canUseGasless = !isGnosisSafe && validationPassed;
  const canUseComments = !isGnosisSafe;

  useEffect(() => {
    if (!canUseGasless) {
      setSubmissionMethod('standard');
    }

    if (canUseGasless) {
      setSubmissionMethod('gasless');
    }
  }, [canUseGasless]);

  const [commentsLoading, setCommentsLoading] = useState(false);

  // Done on the first step, we decide which is the appropiate selected method
  const onClickSubmitBallot = () => {
    if (canUseGasless) {
      setSubmissionMethod('gasless');
    } else {
      setSubmissionMethod('standard');
    }

    setStep('method-select');
  };

  const handleCommentsStep = async () => {
    setCommentsLoading(true);
    try {
      setStep('signing-comments');
      await signComments();
    } catch (err) {
      setStep('initial');
      toast.error('Something went wrong signing your comments. Please try again.');
      logger.error(`signComments: ${err}`);
    }
    setCommentsLoading(false);
  };

  const displayError = submissionError || 'Something went wrong with your transaction.';

  return (
    <Box>
      {ballotStep === 'initial' && (
        <ActivePollsBox polls={polls} activePolls={activePolls}>
          {commentsCount > 0 && canUseComments ? (
            <Box p={3}>
              <StackLayout gap={2}>
                <Button
                  variant="primaryOutline"
                  data-testid="sign-comments-button"
                  onClick={handleCommentsStep}
                  disabled={!!commentsSignature || commentsLoading}
                  sx={{ width: '100%', mt: 3 }}
                >
                  <Flex sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    {!!commentsSignature && <Icon name="checkmark" color="primary" sx={{ mr: 3 }} />}
                    <Text>1 - Sign comment{commentsCount > 1 ? 's' : ''}</Text>
                    {commentsLoading && <Spinner sx={{ ml: 2 }} size={'16px'} />}
                  </Flex>
                </Button>
                <Button
                  onClick={onClickSubmitBallot}
                  data-testid="submit-ballot-button"
                  variant="primaryLarge"
                  disabled={!ballotCount || !commentsSignature}
                  sx={{ width: '100%' }}
                >
                  2 - Submit Your Ballot ({ballotCount} vote{ballotCount === 1 ? '' : 's'})
                </Button>
              </StackLayout>
            </Box>
          ) : (
            <Flex p={3} sx={{ flexDirection: 'column', width: '100%', m: '0' }}>
              <Button
                onClick={onClickSubmitBallot}
                data-testid="submit-ballot-button"
                variant="primaryLarge"
                disabled={!ballotCount || ballotStep !== 'initial'}
                sx={{ width: '100%' }}
              >
                Submit Your Ballot ({ballotCount} vote{ballotCount === 1 ? '' : 's'})
              </Button>
            </Flex>
          )}

          <Box>
            <Flex sx={{ alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              <LocalIcon name="sparkles" color="primary" size={3} />{' '}
              <Text sx={{ ml: 2 }}>Poll voting is now gasless!</Text>
            </Flex>
          </Box>
        </ActivePollsBox>
      )}

      {ballotStep === 'method-select' && (
        <Card variant="compact" p={0}>
          {submissionMethod === 'gasless' && (
            <Box>
              <Box p={3}>
                <Text sx={{ fontWeight: 'semiBold' }} as="p">
                  Gasless voting on Arbitrum
                </Text>
                <Text sx={{ mt: 2 }}>
                  Submit your vote by signing your ballot and sending it to the polling contract on Arbitrum
                  via our relayer.
                </Text>

                <Flex sx={{ alignItems: 'center', mt: 3 }}>
                  <Box sx={{ pt: '3px', mr: 1 }}>
                    <Icon name="info" color="textSecondary" size={14} />
                  </Box>
                  <Text sx={{ fontSize: 1, color: 'textSecondary' }}>
                    You won&apos;t need to switch network.
                  </Text>
                </Flex>
                <Button
                  onClick={() => {
                    submitBallotGasless();
                  }}
                  variant="primaryLarge"
                  disabled={
                    !ballotCount || !!(transaction && transaction?.status !== 'error') || !canUseGasless
                  }
                  sx={{ mt: 3, width: '100%' }}
                >
                  Proceed with gasless voting
                </Button>
                <Box>
                  <Flex sx={{ alignItems: 'center', justifyContent: 'center', mt: 3 }}>
                    <LocalIcon name="sparkles" color="primary" size={3} />
                    <Text sx={{ ml: 2 }}>The transaction fee is covered by Maker.</Text>
                  </Flex>
                  <Box>
                    <ExternalLink title="Learn more" href={'https://manual.makerdao.com/'}>
                      <Text as="p" sx={{ fontSize: [1, 3], textAlign: 'center' }}>
                        Learn more
                        <Icon ml={2} name="arrowTopRight" size={2} />
                      </Text>
                    </ExternalLink>
                  </Box>
                </Box>
              </Box>

              <Divider />

              <Box p={3}>
                <Button
                  onClick={() => {
                    setSubmissionMethod('standard');
                  }}
                  variant="primaryOutline"
                  data-testid="switch-to-standar-votting-button"
                  sx={{ width: '100%' }}
                >
                  <Flex sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Switch to legacy voting</Text>
                  </Flex>
                </Button>
              </Box>
            </Box>
          )}
          {submissionMethod === 'standard' && (
            <Box>
              <Box p={3}>
                <Text sx={{ fontWeight: 'semiBold' }} as="p">
                  Legacy voting on Mainnet
                </Text>
                <Text sx={{ mt: 2 }}>
                  Submit your vote by creating a transaction and sending it to the polling contract on
                  Ethereum Mainnet.
                </Text>

                <Flex sx={{ alignItems: 'center', mt: 3 }}>
                  <Box sx={{ pt: '3px', mr: 1 }}>
                    <Icon name="info" color="textSecondary" size={14} />
                  </Box>
                  <Text sx={{ fontSize: 1, color: 'textSecondary' }}>
                    This used to be the default method for voting.
                  </Text>
                </Flex>
                <Button
                  onClick={() => {
                    submitBallot();
                  }}
                  variant="primaryLarge"
                  disabled={!ballotCount || !!(transaction && transaction?.status !== 'error')}
                  sx={{ mt: 3, width: '100%' }}
                >
                  Proceed with legacy voting
                </Button>
                <Box>
                  <Flex sx={{ alignItems: 'center', justifyContent: 'center', mt: 3 }}>
                    <Text>You pay the transaction fee.</Text>
                  </Flex>
                  <Box>
                    <ExternalLink title="View on etherscan" href={'vote.makerdao.com'}>
                      <Text as="p" sx={{ fontSize: [1, 3], textAlign: 'center' }}>
                        Learn more
                        <Icon ml={2} name="arrowTopRight" size={2} />
                      </Text>
                    </ExternalLink>
                  </Box>
                </Box>
              </Box>

              <Divider />

              <Box p={3}>
                <Button
                  onClick={() => {
                    setSubmissionMethod('gasless');
                  }}
                  variant="primaryOutline"
                  disabled={!canUseGasless}
                  data-testid="switch-to-gasless-votting-button"
                  sx={{ width: '100%' }}
                >
                  <Flex sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Switch to gasless voting</Text>
                  </Flex>
                </Button>
                <Flex sx={{ flexDirection: 'column', mt: 3 }}>
                  <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text as="p" variant="caps">
                      Eligibility Criteria
                    </Text>
                    <ExternalLink href="https://manual.makerdao.com/" title="Learn more">
                      <Text as="p" sx={{ fontSize: [1, 3], textAlign: 'center', color: 'accentBlue' }}>
                        Learn more
                        <Icon ml={2} name="arrowTopRight" size={2} />
                      </Text>
                    </ExternalLink>
                  </Flex>
                  <Flex sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Text as="p" variant="secondary" sx={{ fontSize: 1 }}>
                      Address has at least {MIN_MKR_REQUIRED_FOR_GASLESS_VOTING_DISPLAY} MKR of polling weight
                    </Text>
                    <Text>
                      {!precheckData ? (
                        <SkeletonThemed width="30px" height="18px" />
                      ) : hasMkrRequired ? (
                        <Icon name="checkmark" color="bull" size={'13px'} />
                      ) : (
                        <Icon name="close" color="bear" size={'13px'} />
                      )}
                    </Text>
                  </Flex>
                  <Flex sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Text as="p" variant="secondary" sx={{ fontSize: 1 }}>
                      Address has not used the relayer in the last 10 minutes
                    </Text>
                    <Text>
                      {!precheckData ? (
                        <SkeletonThemed width="30px" height="18px" />
                      ) : !recentlyUsedGaslessVoting ? (
                        <Icon name="checkmark" color="bull" size={'13px'} />
                      ) : (
                        <Icon name="close" color="bear" size={'13px'} />
                      )}
                    </Text>
                  </Flex>
                  <Flex sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Text as="p" variant="secondary" sx={{ fontSize: 1 }}>
                      Address has not voted more than once in any included poll
                    </Text>
                    <Text>
                      {!precheckData ? (
                        <SkeletonThemed width="30px" height="18px" />
                      ) : !alreadyVoted ? (
                        <Icon name="checkmark" color="bull" size={'13px'} />
                      ) : (
                        <Icon name="close" color="bear" size={'13px'} />
                      )}
                    </Text>
                  </Flex>

                  <Flex sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Text as="p" variant="secondary" sx={{ fontSize: 1 }}>
                      Is not using a multisig
                    </Text>
                    <Text>
                      {!isGnosisSafe ? (
                        <Icon name="checkmark" color="bull" size={'13px'} />
                      ) : (
                        <Icon name="close" color="bear" size={'13px'} />
                      )}
                    </Text>
                  </Flex>
                </Flex>
                <Flex sx={{ flexDirection: 'column', mt: 3 }}>
                  <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text as="p" variant="caps">
                      RELAYER BALANCE
                    </Text>
                    <ExternalLink href="https://manual.makerdao.com/" title="Learn more">
                      <Text as="p" sx={{ fontSize: [1, 3], textAlign: 'center', color: 'accentBlue' }}>
                        Learn more
                        <Icon ml={2} name="arrowTopRight" size={2} />
                      </Text>
                    </ExternalLink>
                  </Flex>
                  <Flex sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    {precheckData?.relayBalance && (
                      <Text as="p" variant="secondary" sx={{ fontSize: 1 }}>
                        {formatValue(parseEther(precheckData.relayBalance), 'wad', 4)} ETH
                      </Text>
                    )}
                    <Text>
                      {relayFunded ? (
                        <Icon name="checkmark" color="bull" size={'13px'} />
                      ) : (
                        <Icon name="close" color="bear" size={'13px'} />
                      )}
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            </Box>
          )}
        </Card>
      )}

      {ballotStep === 'submitting' && (
        <Card variant="compact" p={3}>
          <Flex sx={{ alignItems: 'center', justifyContent: 'center', mt: 4 }}>
            <TxIndicators.Pending sx={{ width: 6 }} />
          </Flex>
          <Text
            mt={3}
            as="p"
            sx={{ textAlign: 'center', fontSize: 16, color: 'secondaryEmphasis', fontWeight: '500' }}
          >
            Please use your wallet to sign your {submissionMethod === 'gasless' ? 'ballot' : 'transaction'}
          </Text>
          <Flex sx={{ justifyContent: 'center' }}>
            <Button
              mt={3}
              mb={4}
              onClick={() => {
                setStep('method-select');
              }}
              variant="textual"
              sx={{ color: 'secondaryEmphasis', textAlign: 'center', fontSize: 12 }}
            >
              Cancel vote submission
            </Button>
          </Flex>
        </Card>
      )}

      {ballotStep === 'signing-comments' && (
        <Card variant="compact" p={3}>
          <Flex sx={{ alignItems: 'center', justifyContent: 'center', mt: 4 }}>
            <TxIndicators.Pending sx={{ width: 6 }} />
          </Flex>
          <Text
            mt={3}
            as="p"
            sx={{ textAlign: 'center', fontSize: 16, color: 'secondaryEmphasis', fontWeight: '500' }}
          >
            Please use your wallet to sign your {commentsCount > 0 ? 'comments' : 'comment'}
          </Text>
          <Flex sx={{ justifyContent: 'center' }}>
            <Button
              mt={3}
              mb={4}
              onClick={() => {
                setStep('initial');
              }}
              variant="textual"
              sx={{ color: 'secondaryEmphasis', textAlign: 'center', fontSize: 12 }}
            >
              Cancel signing comments
            </Button>
          </Flex>
        </Card>
      )}

      {ballotStep === 'awaiting-relayer' && (
        <Card variant="compact" p={3}>
          <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <TxIndicators.Pending sx={{ width: 6 }} />
          </Flex>
          <Text
            as="p"
            sx={{ textAlign: 'center', fontSize: 16, color: 'secondaryEmphasis', fontWeight: '500', mt: 3 }}
          >
            Sending Ballot to Relayer
          </Text>
        </Card>
      )}

      {ballotStep === 'tx-pending' && (
        <Card variant="compact" p={3}>
          <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <TxIndicators.Pending sx={{ width: 6 }} />
          </Flex>
          <Text
            as="p"
            sx={{ textAlign: 'center', fontSize: 16, color: 'secondaryEmphasis', fontWeight: '500', mt: 3 }}
          >
            Transaction Pending
          </Text>

          <EtherscanLink
            type="transaction"
            hash={(transaction as TXMined).hash}
            network={transaction?.gaslessNetwork ?? network}
            styles={{ justifyContent: 'center', width: '100%' }}
          />
        </Card>
      )}

      {ballotStep === 'tx-error' && (
        <Card variant="compact" p={3}>
          <Flex sx={{ alignItems: 'center', justifyContent: 'center', mt: 4 }}>
            <TxIndicators.Failed sx={{ width: 6 }} />
          </Flex>
          <Text
            mt={3}
            as="p"
            sx={{ textAlign: 'center', fontSize: 16, color: 'secondaryEmphasis', fontWeight: '500' }}
          >
            Transaction Failed.
          </Text>
          <Text mt={3} as="p" sx={{ textAlign: 'center', fontSize: 14, color: 'secondaryEmphasis' }}>
            {displayError} Please try again.
          </Text>
          <Flex sx={{ justifyContent: 'center' }}>
            <InternalLink href={'/polling/review'} title="Back">
              <Button
                pb={3}
                variant="textual"
                sx={{
                  borderColor: 'primary',
                  color: 'secondaryEmphasis',
                  fontSize: 2,
                  width: 'max-content',
                  margin: 'auto'
                }}
                onClick={() => setStep('method-select')}
              >
                Go back
              </Button>
            </InternalLink>
          </Flex>
        </Card>
      )}
    </Box>
  );
}
