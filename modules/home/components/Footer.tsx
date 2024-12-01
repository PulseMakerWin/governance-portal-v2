/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import { Box, Flex, Text, useColorMode } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import { ExternalLink } from 'modules/app/components/ExternalLink';
import React, { useState, useEffect } from 'react';
import { translate } from '@makerdao/i18n-helper';
import { useBreakpointIndex } from '@theme-ui/match-media';

const ContactSection = ({ heading, logos, icon }) => {
  return (
    <Flex sx={{ flexDirection: 'column', gap: 2 }}>
      <Text as="h4" sx={{ fontSize: 3, fontWeight: 'semiBold' }}>
        {heading}
      </Text>
      <Flex
        sx={{
          alignItems: 'center',
          '& svg': {
            width: 20,
            height: 20,
            transition: 'opacity 0.2s',
            cursor: 'pointer',
            opacity: 0.8,
            marginRight: 24,
            ':hover': {
              opacity: 1
            }
          }
        }}
      >
        {logos.map(({ title, url, icon, styles }) => (
          <ExternalLink key={title} styles={{ color: 'text', ...styles }} href={url} title={title}>
            <Icon name={icon} />
          </ExternalLink>
        ))}
      </Flex>
      <Icon name={icon} size="auto" sx={{ my: [0, 0, 4], width: '76px' }} />
    </Flex>
  );
};

export default function Footer({ locale = 'en' }: { locale?: string }): React.ReactElement {
  const bpi = useBreakpointIndex();
  const [mode] = useColorMode();
  const [renderedMode, setRenderedMode] = useState('light');

  useEffect(() => {
    setRenderedMode(mode);
  }, [mode]);

  const t = text => translate(text, locale);

  const links = [
    {
      header: t('Participate'),
      list: [
        {
          url: 'https://t.me/PulseChainMKR',
          title: t('Community')
        }
      ]
    },
    {
      header: t('Ecosystem'),
      list: [
        {
          url: 'https://gorealdefi.com/',
          title: t('PulseChain Apps')
        },
        {
          url: 'https://gopulse.com/',
          title: t('GoPulse')
        },
        {
          url: 'https://start.me/p/gGQ09M/plstart-me',
          title: t('Pulsechain Eco')
        }
      ]
    },
    {
      header: t('Build'),
      list: [
        {
          url: 'https://github.com/PulseMakerWin/governance-portal-v2',
          title: t('Developer Documentation')
        }
      ]
    }
  ];

  const logos = {
    sky: [
      { title: 'Telegram', url: 'https://t.me/PulseChainMKR', icon: 'telegram' },
      { title: 'Twitter', url: 'https://x.com/PulseMakerWin', icon: 'twitter' }
    ]
  };

  const mobile = bpi <= 1;
  return (
    <Box sx={{ position: 'relative', mt: 4 }}>
      <Box
        sx={{
          width: '100vw',
          height: '100%',
          left: '50%',

          zIndex: -1,
          position: 'absolute',
          transform: 'translateX(-50%)',
          backgroundImage:
            renderedMode === 'dark'
              ? bpi <= 2
                ? 'url(/assets/bg_dark_medium.jpeg)'
                : 'url(/assets/bg_footer_dark.jpeg)'
              : bpi <= 2
              ? 'url(/assets/bg_medium.jpeg)'
              : 'url(/assets/bg_footer_light.jpeg)',
          backgroundSize: ['1500px', '1500px', '1500px', '100% 600px', '100% 400px'],
          backgroundRepeat: 'no-repeat',
          backgroundPosition: ['-750px 100%', '-750px 100%', '-750px 100%', 'bottom', 'bottom']
        }}
      />
      <Flex
        as="footer"
        sx={{
          justifyContent: 'space-between',
          gap: 4,
          width: '100%',
          flexDirection: mobile ? 'column' : 'row',
          pt: 4,
          pb: 5
        }}
      >
        <ContactSection
          heading="PulseChain Community Channels"
          icon={renderedMode === 'dark' ? 'sky_white' : 'sky'}
          logos={logos.sky}
        />
        <Flex
          sx={{
            justifyContent: 'space-between',
            gap: [4, 2, 5],
            width: ['100%', '100%', 'initial'],
            flexWrap: ['wrap', 'nowrap']
          }}
        >
          {links.map(group => {
            return (
              <Flex key={group.header} sx={{ flexDirection: 'column', gap: 2, minWidth: ['45%', 'initial'] }}>
                <Text as="h4" sx={{ fontSize: 3, fontWeight: 'semiBold' }}>
                  {group.header}
                </Text>
                {group.list.map(({ url, title }) => {
                  return (
                    <ExternalLink
                      key={title}
                      href={url}
                      title={title}
                      styles={{ fontSize: [1, 2], color: 'text' }}
                    >
                      <Text>{title}</Text>
                    </ExternalLink>
                  );
                })}
              </Flex>
            );
          })}
        </Flex>
      </Flex>
    </Box>
  );
}
