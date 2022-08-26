import { ParsedSpockVote } from 'modules/polling/types/tallyVotes';
import { extractWinnerInstantRunoff } from '../instantRunoff';
import BigNumber from 'lib/bigNumberJs';

const fromBuffer = (buf, opts?) => {
  if (!opts) {
    opts = {};
  }

  const endian = { 1: 'big', '-1': 'little' }[opts.endian] || opts.endian || 'big';

  const size = opts.size === 'auto' ? Math.ceil(buf.length) : opts.size || 1;

  if (buf.length % size !== 0) {
    throw new RangeError(`Buffer length (${buf.length}) must be a multiple of size (${size})`);
  }

  const hex = [];
  for (let i = 0; i < buf.length; i += size) {
    const chunk = [];
    for (let j = 0; j < size; j++) {
      chunk.push(buf[i + (endian === 'big' ? j : size - j - 1)]);
    }

    hex.push(chunk.map(c => (c < 16 ? '0' : '') + c.toString(16)).join(''));
  }

  return new BigNumber(hex.join(''), 16).toString();
};

describe('Instant runoff calculation', () => {
  it('gives expected results for a tally with majority', () => {
    const votes: ParsedSpockVote[] = [
      {
        mkrSupport: '60.025',
        optionIdRaw: fromBuffer([1, 3].reverse()),
        ballot: [1, 3]
      },
      {
        mkrSupport: '200.598801867883985831',
        optionIdRaw: fromBuffer([3, 1].reverse()),
        ballot: [3, 1]
      },
      {
        mkrSupport: '64.068823529411764706',
        optionIdRaw: fromBuffer([2, 3].reverse()),
        ballot: [2, 3]
      }
    ];

    const winner = extractWinnerInstantRunoff(votes);

    const expectedResult = {
      rounds: 1,
      winner: 3,
      options: {
        '1': {
          mkrSupport: '60.025',
          transfer: '0',
          winner: false,
          eliminated: false
        },
        '2': {
          mkrSupport: '64.068823529411764706',
          transfer: '0',
          winner: false,
          eliminated: false
        },
        '3': {
          mkrSupport: '200.598801867883985831',
          transfer: '0',
          winner: true,
          eliminated: false
        }
      }
    };

    expect(JSON.parse(JSON.stringify(winner))).toEqual(expectedResult);
  });

  it('gives expected results for a tally with no majority', () => {
    const votes: ParsedSpockVote[] = [
      {
        mkrSupport: '60.025',
        optionIdRaw: fromBuffer([1, 3].reverse()),
        ballot: [1, 3]
      },
      {
        mkrSupport: '102.598801867883985831',
        optionIdRaw: fromBuffer([3, 1].reverse()),
        ballot: [3, 1]
      },
      {
        mkrSupport: '64.068823529411764706',
        optionIdRaw: fromBuffer([2, 3].reverse()),
        ballot: [2, 3]
      }
    ];

    const winner = extractWinnerInstantRunoff(votes);

    const expectedResult = {
      rounds: 2,
      winner: 3,
      options: {
        '1': {
          mkrSupport: '60.025',
          transfer: '-60.025',
          winner: false,
          eliminated: true
        },
        '2': {
          mkrSupport: '64.068823529411764706',
          transfer: '0',
          winner: false,
          eliminated: false
        },
        '3': {
          mkrSupport: '102.598801867883985831',
          transfer: '60.025',
          winner: true,
          eliminated: false
        }
      }
    };

    expect(JSON.parse(JSON.stringify(winner))).toEqual(expectedResult);
  });

  it('gives expected results for a tally with multiple rounds', () => {
    const votes: ParsedSpockVote[] = [
      {
        mkrSupport: '60.025',
        optionIdRaw: fromBuffer([1, 3].reverse()),
        ballot: [1, 3]
      },
      {
        mkrSupport: '102.598801867883985831',
        optionIdRaw: fromBuffer([3, 1].reverse()),
        ballot: [3, 1]
      },
      {
        mkrSupport: '64.068823529411764706',
        optionIdRaw: fromBuffer([2, 3].reverse()),
        ballot: [2, 3]
      },
      {
        mkrSupport: 4,
        optionIdRaw: fromBuffer([4, 1].reverse()),
        ballot: [4, 1]
      }
    ];

    const winner = extractWinnerInstantRunoff(votes);
    const expectedResult = {
      rounds: 3,
      winner: 3,
      options: {
        '1': {
          mkrSupport: '60.025',
          transfer: '-56.025',
          winner: false,
          eliminated: true
        },
        '2': {
          mkrSupport: '64.068823529411764706',
          transfer: '0',
          winner: false,
          eliminated: false
        },
        '3': {
          mkrSupport: '102.598801867883985831',
          transfer: '60.025',
          winner: true,
          eliminated: false
        },
        '4': {
          mkrSupport: '4',
          transfer: '-4',
          winner: false,
          eliminated: true
        }
      }
    };

    expect(JSON.parse(JSON.stringify(winner))).toEqual(expectedResult);
  });

  it('ranked choice tally verify eliminated options cant get votes', () => {
    const votes: ParsedSpockVote[] = [
      {
        mkrSupport: '60.025',
        optionIdRaw: fromBuffer([1, 3].reverse()),
        ballot: [1, 3]
      },
      {
        mkrSupport: '102.598801867883985831',
        optionIdRaw: fromBuffer([3, 1].reverse()),
        ballot: [3, 1]
      },
      {
        mkrSupport: '54.068823529411764706',
        optionIdRaw: fromBuffer([2, 4].reverse()),
        ballot: [2, 4]
      },
      {
        mkrSupport: 4,
        optionIdRaw: fromBuffer([4, 1].reverse()),
        ballot: [4, 1]
      }
    ];

    const winner = extractWinnerInstantRunoff(votes);
    const expectedResult = {
      rounds: 4,
      winner: 3,
      options: {
        '1': {
          mkrSupport: '60.025',
          transfer: '-56.025',
          winner: false,
          eliminated: true
        },
        '2': {
          mkrSupport: '54.068823529411764706',
          transfer: '0',
          winner: false,
          eliminated: true
        },
        '3': {
          mkrSupport: '102.598801867883985831',
          transfer: '60.025',
          winner: true,
          eliminated: false
        },
        '4': {
          mkrSupport: '4',
          transfer: '-4',
          winner: false,
          eliminated: true
        }
      }
    };

    expect(JSON.parse(JSON.stringify(winner))).toEqual(expectedResult);
  });

  it('ranked choice tally stop when 1 remains', () => {
    const votes: ParsedSpockVote[] = [
      {
        mkrSupport: '101',
        optionIdRaw: fromBuffer([1].reverse()),
        ballot: [1]
      },
      {
        mkrSupport: '100',
        optionIdRaw: fromBuffer([2, 1].reverse()),
        ballot: [2, 1]
      },
      {
        mkrSupport: '50',
        optionIdRaw: fromBuffer([3].reverse()),
        ballot: [3]
      },
      {
        mkrSupport: 49,
        optionIdRaw: fromBuffer([4, 3].reverse()),
        ballot: [4, 3]
      }
    ];

    const winner = extractWinnerInstantRunoff(votes);
    const expectedResult = {
      rounds: 4,
      winner: 1,
      options: {
        '1': {
          mkrSupport: '101',
          transfer: '100',
          winner: true,
          eliminated: false
        },
        '2': {
          mkrSupport: '100',
          transfer: '-100',
          winner: false,
          eliminated: true
        },
        '3': {
          mkrSupport: '50',
          transfer: '49',
          winner: false,
          eliminated: true
        },
        '4': {
          mkrSupport: '49',
          transfer: '-49',
          winner: false,
          eliminated: true
        }
      }
    };

    expect(JSON.parse(JSON.stringify(winner))).toEqual(expectedResult);
  });
});
