import { useEffect, useState } from 'react';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { isDefaultNetwork, getNetwork } from '../../lib/maker';
import { getPolls, getPoll } from '../../lib/api';
import { formatPollTally } from '../../lib/utils';
import PrimaryLayout from '../../components/PrimaryLayout';

function Poll({ poll, loading }) {
  const network = getNetwork();
  const hasPollEnded = new Date(poll.endDate).getTime() < new Date().getTime();
  const { data: _tally } = useSWR(
    hasPollEnded
      ? `/api/polling/tally/cache-no-revalidate/${poll.pollId}?network=${network}`
      : `/api/polling/tally/${poll.pollId}?network=${network}`
  );

  const tally = formatPollTally(_tally);

  if (!loading && !poll?.multiHash) {
    return (
      <ErrorPage statusCode={404} title="Polling vote could not be found" />
    );
  }

  return (
    <PrimaryLayout>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <div dangerouslySetInnerHTML={{ __html: poll.content }} />
        </>
      )}
    </PrimaryLayout>
  );
}

export default ({ poll }) => {
  const [_poll, _setPoll] = useState();
  const [loading, setLoading] = useState(false);
  const { query, isFallback } = useRouter();

  // fetch poll contents at run-time if on any network other than the default
  useEffect(() => {
    if (!isDefaultNetwork()) {
      setLoading(true);
      getPoll(query['poll-hash'], { useCache: true }).then(poll => {
        _setPoll(poll);
        setLoading(false);
      });
    }
  }, []);

  return (
    <Poll
      loading={loading || isFallback}
      poll={isDefaultNetwork() ? poll : _poll}
    />
  );
};

export async function getStaticProps({ params }) {
  // fetch poll contents at build-time if on the default network
  const poll = await getPoll(params['poll-hash'], { useCache: true });

  return {
    props: {
      poll
    }
  };
}

export async function getStaticPaths() {
  const polls = await getPolls();
  const paths = polls.map(p => `/polling/${p.multiHash}`);

  return {
    paths,
    fallback: true
  };
}
