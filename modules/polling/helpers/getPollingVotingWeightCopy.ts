/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

export const getPollingVotingWeightCopy = (isVotingDelegate: boolean): string =>
  isVotingDelegate
    ? 'Your polling voting weight is made up of the pMKR delegated to your delegate contract. This amount is applied to all polls you vote on.'
    : 'Your polling voting weight is made up of the pMKR in your wallet, vote proxy, and voting contract. This amount is applied to all polls you vote on.';
