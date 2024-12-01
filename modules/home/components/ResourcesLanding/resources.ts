/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

export enum ResourceCategory {
  ALL_RESOURCES = 'All Resources',
  GOVERNANCE = 'Governance',
  PRODUCTS_AND_TOOLS = 'Products & Tools',
  DEVELOPERS = 'Developers'
}

enum ResourceBackground {
  GOVERNANCE = 'linear-gradient(260.14deg, #DEE8C4 0%, #AAE4D7 97.43%)',
  PRODUCTS_AND_TOOLS = 'linear-gradient(260.14deg, #E2CCFF 0%, #9A4BFF 97.43%)',
  DEVELOPERS = 'linear-gradient(260.14deg, #F4B7FE 0%, #E64BFF 97.43%)'
}

export enum ResourceColor {
  GOVERNANCE = '#1ACCA7',
  PRODUCTS_AND_TOOLS = '#9A4BFF',
  DEVELOPERS = '#E64BFF'
}

type LandingResource = {
  title: string;
  url: string;
  category: ResourceCategory;
  bg: string;
  color: string;
  logo: string;
  summary: string;
};

export const resources: LandingResource[] = [
  {
    title: 'Maker Operation Manual',
    url: 'https://manual.makerdao.com',
    category: ResourceCategory.GOVERNANCE,
    bg: ResourceBackground.GOVERNANCE,
    color: ResourceColor.GOVERNANCE,
    logo: '/assets/resource_icon_2.svg',
    summary:
      'Documentation on the Maker protocol & MakerDAO processes, written for pMKR holders that actively participate in governance.'
  },
  {
    title: 'Technical Docs',
    url: 'https://docs.makerdao.com/',
    category: ResourceCategory.DEVELOPERS,
    bg: ResourceBackground.DEVELOPERS,
    color: ResourceColor.DEVELOPERS,
    logo: '/assets/resource_icon_7.svg',
    summary:
      'Technical documentation about the MakerDAO protocol, covering all its mechanisms, smart contracts and more.'
  },
  {
    title: 'MakerDAO GitHub',
    url: 'https://github.com/PulseMakerWin/',
    category: ResourceCategory.DEVELOPERS,
    bg: ResourceBackground.DEVELOPERS,
    color: ResourceColor.DEVELOPERS,
    logo: '/assets/resource_icon_8.svg',
    summary:
      'GitHub organization with many repositories relevant to PulseMaker and goverance, including the community repo and the codebase for this site.'
  },
  {
    title: 'API Docs',
    url: 'https://pulsemaker.com/api-docs',
    category: ResourceCategory.DEVELOPERS,
    bg: ResourceBackground.DEVELOPERS,
    color: ResourceColor.DEVELOPERS,
    logo: '/assets/resource_icon_9.svg',
    summary:
      'Automatically generated API documentation for the Governance Portal API, used to query PusleMaker governance data.'
  }
];
