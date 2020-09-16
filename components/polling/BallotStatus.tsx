import { useRouter } from 'next/router';
import { Text, Button } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import shallow from 'zustand/shallow';

import useTransactionStore, { transactionsSelectors } from '../../stores/transactions';
import TX from '../../types/transaction';
import useBallotStore from '../../stores/ballot';
import { getNetwork } from '../../lib/maker';

const BallotStatus = (props: any): JSX.Element => {
  const [ballot, txId] = useBallotStore(state => [state.ballot, state.txId]);
  const transaction = useTransactionStore(
    state => (txId ? transactionsSelectors.getTransaction(state, txId) : null),
    shallow
  );
  const ballotLength = Object.keys(ballot).length;
  const router = useRouter();
  const network = getNetwork();

  return (
    <Button
      variant={
        ballotLength ? 'primary' :
        transaction == null || transaction?.status == 'pending' || transaction?.status == 'mined' || ballotLength === 0 ?
          'outline' : 'primary'
      }

      sx={{
        borderRadius: 'round',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        border: transaction ? '1px solid #D4D9E1' : ballotLength ? null : '1px solid secondaryMuted',
        display: 'flex',
        height: '36px'
      }}
      
      onClick={() => {
        if (transaction || !ballotLength) return;
        router.push({ pathname: '/polling/review', query: network });
      }}
      {...props}
      disabled={ballotLength > 0 ? false : (transaction === null || transaction?.status === 'pending' || transaction?.status === 'mined')}
    >
      <Icon
        name='ballot'
        size={3}
        sx={{
          color: ballotLength && transaction?.status !== 'pending' ? 'white' : 'textMuted',
          mr: 2
        }}
      />
      <StatusText {...{ transaction }} ballotLength={transaction?.status === 'pending' ? 0 : ballotLength} />
    </Button>
  );
};

const StatusText = ({
  transaction,
  ballotLength
}: {
  transaction: TX | null;
  ballotLength: number;
}): JSX.Element => {
  const DEFAULT_TEXT = `Your Ballot: ${ballotLength} ${ballotLength === 1 ? 'vote' : 'votes'}`;
  const DEFAULT_COLOR = 'white';
  const color =
    transaction == null || transaction?.status === 'pending' || transaction?.status === 'mined' || ballotLength === 0
      ? 'textMuted'
        ? DEFAULT_COLOR
        : 'textMuted'
      : DEFAULT_COLOR

  return (
    <Text
      sx={{
        color,
        fontWeight: ballotLength === 0 ? 'normal' : '600'
      }}
    >
      {DEFAULT_TEXT}
    </Text>
  );
};

export default BallotStatus;
