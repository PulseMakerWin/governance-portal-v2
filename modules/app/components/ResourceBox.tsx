/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import { Box, Heading, Card, Link as ExternalLink, Flex, Text } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';

type ResourceType = 'general' | 'polling' | 'executive' | 'delegates';

type ResourceLink = {
  linkTitle: string;
  url: string;
};

type Resource = {
  boxTitle: string;
  links: ResourceLink[];
};

const resources: Record<ResourceType, Resource> = {
  general: {
    boxTitle: 'General Maker Resources',
    links: [
      {
        linkTitle: 'Governance Documentation',
        url: 'https://manual.makerdao.com/'
      },
      {
        linkTitle: 'Governance discussion on Discord',
        url: 'https://discord.gg/Sfyfuck2'
      }
    ]
  },
  polling: {
    boxTitle: 'Polling FAQs',
    links: [
      {
        linkTitle: 'How to participate in PulseMaker governance?',
        url: 'https://manual.makerdao.com/governance/voting-in-makerdao'
      },
      {
        linkTitle: 'What are Governance Polls?',
        url: 'https://manual.makerdao.com/governance/voting-in-makerdao/on-chain-governance#governance-polls'
      },
      {
        linkTitle: 'How is voting weight calculated?',
        url: 'https://www.notion.so/jetstreamgg/How-to-Calculate-Polling-Results-32a3f732d7fd481abd685e1f419d2bba'
      },
      {
        linkTitle: 'How to manually vote in a poll with Etherscan?',
        url: 'https://www.notion.so/jetstreamgg/How-to-manually-vote-in-a-Maker-poll-with-Etherscan-d61a8fbac15a4bfc840ecb2d5c19cd80'
      },
      {
        linkTitle: 'How to vote in on-chain governance?',
        url: 'https://manual.makerdao.com/governance/voting-in-makerdao/how-to-vote'
      }
    ]
  },
  executive: {
    boxTitle: 'Executive Proposal FAQs',
    links: [
      {
        linkTitle: 'How to participate in PulseMaker governance?',
        url: 'https://manual.makerdao.com/governance/voting-in-makerdao'
      },
      {
        linkTitle: 'What are Executive Votes?',
        url: 'https://manual.makerdao.com/governance/voting-in-makerdao/on-chain-governance#executive-votes'
      },
      {
        linkTitle: 'How to manually verify Executive Spells?',
        url: 'https://manual.makerdao.com/governance/verification/executive-audit'
      },
      {
        linkTitle: 'How is voting weight calculated?',
        url: 'https://manual.makerdao.com/governance/voting-in-makerdao/on-chain-governance#how-is-the-voting-calculated'
      },
      {
        linkTitle: 'How to vote in on-chain governance?',
        url: 'https://manual.makerdao.com/governance/voting-in-makerdao/how-to-vote'
      }
    ]
  },
  delegates: {
    boxTitle: 'Delegation FAQs',
    links: [
      {
        linkTitle: 'What is pMKR vote delegation?',
        url: 'https://manual.makerdao.com/delegation/overview/what-is-delegation'
      },
      {
        linkTitle: 'What is the Maker Atlas Immutable Alignment Artifact?',
        url: 'https://mips.makerdao.com/mips/details/MIP101'
      },
      {
        linkTitle: 'What is an Aligned Delegate?',
        url: 'https://mips.makerdao.com/mips/details/MIP101#2-6-aligned-delegates-ads-gov6'
      },
      {
        linkTitle: "The pMKR holder's guide to delegation",
        url: 'https://manual.makerdao.com/delegation/for-mkr-holders/mkr-holder-guide'
      }
    ]
  }
};

export default function ResourceBox({
  type,
  className
}: {
  type: ResourceType;
  className?: string;
}): JSX.Element {
  return (
    <Box className={className}>
      <Heading mt={3} mb={2} as="h3" variant="microHeading">
        {resources[type].boxTitle}
      </Heading>
      <Card variant="compact">
        {resources[type].links.map(resource => (
          <Flex key={resource.linkTitle} sx={{ alignItems: 'center', ':not(:last-of-type)': { mb: 3 } }}>
            <ExternalLink href={resource.url} target="_blank">
              <Text sx={{ color: 'accentBlue', ':hover': { color: 'accentBlueEmphasis' } }}>
                {resource.linkTitle}
                <Icon ml={2} name="arrowTopRight" size={2} />
              </Text>
            </ExternalLink>
          </Flex>
        ))}
      </Card>
    </Box>
  );
}
