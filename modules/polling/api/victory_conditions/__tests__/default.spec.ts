/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import { Poll } from 'modules/polling/types';
import { extractWinnerDefault } from '../default';

describe('Default calculation', () => {
  const poll: Poll = {
    options: {
      0: 'test',
      1: 'test',
      2: 'test'
    }
  } as any as Poll;

  it('returns the specified option', () => {
    const winner = extractWinnerDefault(poll, 0);

    expect(winner).toEqual(0);
  });

  it('returns null if we ask for an option that does not exist', () => {
    const winner = extractWinnerDefault(poll, 3);

    expect(winner).toEqual(null);
  });
});
