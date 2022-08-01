import {
  PollInputFormat,
  PollResultDisplay,
  PollVictoryConditions,
  POLL_VOTE_TYPE
} from '../polling.constants';
import { PollVoteType } from '../types';
import { NestedVictoryCondition, PollParameters } from '../types/poll';
import {
  hasVictoryConditionAND,
  hasVictoryConditionApproval,
  hasVictoryConditionInstantRunOff,
  hasVictoryConditionMajority,
  hasVictoryConditionPlurality
} from './utils';

export const ERRORS_VALIDATE_POLL_PARAMETERS = {
  missingInputFormat: 'Missing input_format on poll parameters',
  invalidInputFormat: 'Invalid input_format. Supported values are rank-free, choose-free and single-choice',
  missingVictoryConditions: 'Missing victory_conditions',
  victoryConditionsNotArray: 'victory_conditions should be an array',
  victoryConditionsNotValid:
    'victory_conditions must include a valid condition. Valid conditions are "plurality" or "instant_runoff"',
  victoryConditionsInstantRunOffAndPluralityCanNotBeCombined:
    'victory_conditions combination not valid. instant-runoff and plurality can not be combined together.',
  victoryConditionsInstantRunOffAndMajoritynNotBeCombined:
    'victory_conditions combination not valid. instant-runoff and majority can not be combined together.',
  victoryConditionANDRequiresConditions: 'victory_condition AND requires inserting nested conditions',
  instantRunoffRequiresRankFree: 'victory_condition instant-runoff requires input_format rank-free',
  pluralityRequiresSingleChoice: 'victory_condition plurality requires input_format single-choice',
  approvalRequiresChooseFree: 'victory_condition approval requires input_format choose-free',
  // TODO: Include more result_displays when allowed
  requiredResultDisplay:
    'result_display is required. Available values are "instant-runoff-breakdown" or "single-vote-breakdown"',
  singleChoiceRequiresSingleVoteBreakdownDisplay:
    'input_format single-choice requires single-vote-breakdown result_display',
  rankFreeRequiresInstantRunoffBreakdownDisplay:
    'input_format rank-free requires instant-runoff-breakdown result_display',
  approvalRequiresApprovalBreakdownDisplay:
    'victory_condition approval requires approval-breakdown result_display'
};

/*
 Validates the correc structure of the poll parameters and valid combinations

  Examples of valid poll parameters: 

  Ranked choice
  {
    input_format: 'rank-free',
    victory_conditions: [
      {
        type: 'instant-runoff'
      }
    ],
    result_display: 'instant-runoff-breakdown'
  }

  Plurality

  {
    input_format: 'single-choice',
    victory_conditions: [
      {
        type: 'plurality'
      }
    ],
    result_display: 'single-vote-breakdown'
  }

  Majority 

  // Majority, between the options 0-3, if not completed correctly, use comparison, and check if any option 0-2 >= 10000 to determine victor
  {
    input_format: 'single-choice' | 'rank-free',
    victory_conditions: [
      {
        type: 'majority',
        options: [0,1,2,3]
      },
      {
        type: 'comparison',
        options: [0,1,2],
        comparator: '>=10000'
      }
    ],
    result_display: 'single-vote-breakdown' | or others
  }
*/

export function validatePollParameters(params: Record<string, unknown>): [PollParameters | null, string[]] {
  const errors: string[] = [];
  let inputFormatType = '';
  let inputFormatOptions = [];
  let inputFormatAbstain = [0];

  if (!params.input_format) {
    errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.missingInputFormat);
  } else {
    // Extract the input format type
    if (typeof params.input_format === 'string') {
      // if is an string, asume is the type, and use the default options
      inputFormatType = params.input_format;
    } else {
      inputFormatType = (params.input_format as any).type;
      inputFormatOptions = (params.input_format as any).options || inputFormatOptions;
      inputFormatAbstain = (params.input_format as any).abstain || inputFormatAbstain;
    }

    if (
      inputFormatType !== PollInputFormat.rankFree &&
      inputFormatType !== PollInputFormat.singleChoice &&
      inputFormatType !== PollInputFormat.chooseFree
    ) {
      errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.invalidInputFormat);
    }
  }

  if (!params.victory_conditions) {
    errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.missingVictoryConditions);
  } else if (!Array.isArray(params.victory_conditions)) {
    errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.victoryConditionsNotArray);
  } else {
    const hasInstantRunOff = hasVictoryConditionInstantRunOff(params.victory_conditions);
    const hasPlurality = hasVictoryConditionPlurality(params.victory_conditions);
    const hasApproval = hasVictoryConditionApproval(params.victory_conditions);
    const hasMajority = hasVictoryConditionMajority(params.victory_conditions);
    const hasAND = hasVictoryConditionAND(params.victory_conditions);

    // Can not combine instant runoff and plurality
    if (hasInstantRunOff && hasPlurality) {
      errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.victoryConditionsInstantRunOffAndPluralityCanNotBeCombined);
    }

    // Can not combine instant runoff and majority
    if (hasInstantRunOff && hasMajority) {
      errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.victoryConditionsInstantRunOffAndMajoritynNotBeCombined);
    }

    // Rank free requires instant runoff condition
    if (inputFormatType !== PollInputFormat.rankFree && hasInstantRunOff) {
      errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.instantRunoffRequiresRankFree);
    }

    // plurality requires requires single_choice
    if (inputFormatType !== PollInputFormat.singleChoice && hasPlurality) {
      errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.pluralityRequiresSingleChoice);
    }

    // Approval requires input_format choose_free
    if (inputFormatType !== PollInputFormat.chooseFree && hasApproval) {
      errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.approvalRequiresChooseFree);
    }

    // Validate that the AND victory condition has conditions inside
    if (hasAND) {
      const andCondition = params.victory_conditions.find(i => i.type === PollVictoryConditions.and);

      if (!andCondition.conditions || andCondition.conditions?.length === 0) {
        errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.victoryConditionANDRequiresConditions);
      }
    }

    // If it has default victory condition, the default has to have a value
    // TODO

    // If it has a majority condition, check that the majority has a value
  }

  // Validate result display
  if (!params.result_display) {
    errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.requiredResultDisplay);
  } else {
    // input_format single-choice requires single-vote-breakdown result_display
    if (
      inputFormatType === PollInputFormat.singleChoice &&
      params.result_display !== PollResultDisplay.singleVoteBreakdown
    ) {
      errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.singleChoiceRequiresSingleVoteBreakdownDisplay);
    }

    // input_format rank-free requires instant-runoff-breakdown result_display
    if (
      inputFormatType === PollInputFormat.rankFree &&
      params.result_display !== PollResultDisplay.instantRunoffBreakdown
    ) {
      errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.rankFreeRequiresInstantRunoffBreakdownDisplay);
    }

    // Approval requires approval-breakdown result_display
    if (
      hasVictoryConditionApproval(params.victory_conditions as any) &&
      params.result_display !== PollResultDisplay.approvalBreakdown
    ) {
      errors.push(ERRORS_VALIDATE_POLL_PARAMETERS.approvalRequiresApprovalBreakdownDisplay);
    }
  }

  // There are errors, return a empty object and the list of errors
  if (errors.length > 0) {
    return [null, errors];
  } else {
    // Correct object
    return [
      {
        inputFormat: {
          type: inputFormatType,
          abstain: inputFormatAbstain,
          options: inputFormatOptions
        },
        resultDisplay: params.result_display,
        victoryConditions: params.victory_conditions
      } as PollParameters,
      []
    ];
  }
}

// Validate single victory condition structure
// For example: Comparison has a threshold defined
function validateVictoryCondition(vc: NestedVictoryCondition | NestedVictoryCondition[]) {
  // TODO: Implement
}

// Victory conditions can be grouped in an AND logic group
// There are certain restrictions to an AND group:
// instant-runoff can not be combined with majority
function validateVictoryConditionGroup(vc: NestedVictoryCondition[]) {
  // TODO: implement
}

// Formats old vote types to new poll parameters
export function oldVoteTypeToNewParameters(voteType: PollVoteType): PollParameters {
  if (voteType === POLL_VOTE_TYPE.PLURALITY_VOTE || voteType === POLL_VOTE_TYPE.UNKNOWN) {
    return {
      inputFormat: {
        type: PollInputFormat.singleChoice,
        abstain: [0],
        options: []
      },
      resultDisplay: PollResultDisplay.singleVoteBreakdown,
      victoryConditions: [
        {
          type: PollVictoryConditions.plurality
        }
      ]
    };
  } else {
    return {
      inputFormat: {
        type: PollInputFormat.rankFree,
        abstain: [0],
        options: []
      },
      resultDisplay: PollResultDisplay.instantRunoffBreakdown,
      victoryConditions: [
        {
          type: PollVictoryConditions.instantRunoff
        }
      ]
    };
  }
}
