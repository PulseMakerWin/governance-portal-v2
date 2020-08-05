import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import useSWR from 'swr';
import { NavLink, Heading, Flex, Badge } from 'theme-ui';
import ErrorPage from 'next/error';

import { getExecutiveProposals } from '../lib/api';
import { getNetwork, isDefaultNetwork } from '../lib/maker';
import PrimaryLayout from '../components/layouts/Primary';
import Proposal from '../types/proposal';
import SpellData from '../types/spellData';

const SpellRow = ({ proposal }: { proposal: Proposal }) => {
  const { data: spellData } = useSWR<SpellData>(
    `/api/executive/analyze-spell/${proposal.address}?network=${getNetwork()}`
  );

  return (
    <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
      <Link
        key={proposal.key}
        href={{
          pathname: '/executive/[proposal-id]',
          query: { network: getNetwork() }
        }}
        as={{
          pathname: `/executive/${proposal.key}`,
          query: { network: getNetwork() }
        }}
      >
        <NavLink>{proposal.key}</NavLink>
      </Link>
      {typeof spellData === 'undefined' ? (
        <div>loading</div>
      ) : (
        <Badge bg="background" variant={spellData.hasBeenCast ? 'primary' : 'notice'}>
          {spellData.hasBeenCast ? 'This spell has been cast' : 'This spell has not yet been cast'}
        </Badge>
      )}
    </Flex>
  );
};

const ExecutiveOverview = ({ proposals }: { proposals: Proposal[] }) => {
  return (
    <PrimaryLayout shortenFooter={true}>
      <Heading as="h1">Executive Proposals</Heading>
      {proposals.map((proposal, index) => (
        <SpellRow key={index} proposal={proposal} />
      ))}
    </PrimaryLayout>
  );
};

export default function ExecutiveOverviewPage({
  proposals: prefetchedProposals
}: {
  proposals: Proposal[];
}): JSX.Element {
  const [_proposals, _setProposals] = useState<Proposal[]>();
  const [error, setError] = useState<string>();

  // fetch proposals at run-time if on any network other than the default
  useEffect(() => {
    if (!isDefaultNetwork()) {
      getExecutiveProposals().then(_setProposals).catch(setError);
    }
  }, []);

  if (error) {
    return <ErrorPage statusCode={404} title="Error fetching proposals" />;
  }

  if (!isDefaultNetwork() && !_proposals)
    return (
      <PrimaryLayout>
        <p>Loading…</p>
      </PrimaryLayout>
    );

  return (
    <ExecutiveOverview proposals={isDefaultNetwork() ? prefetchedProposals : (_proposals as Proposal[])} />
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // fetch proposals at build-time if on the default network
  const proposals = await getExecutiveProposals();

  return {
    unstable_revalidate: 30, // allow revalidation every 30 seconds
    props: {
      proposals
    }
  };
};
