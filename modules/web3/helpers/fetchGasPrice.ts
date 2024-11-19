/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import { fetchJson } from 'lib/fetchJson';
import { formatUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';
import { GASNOW_ENDPOINT } from '../constants/networks';
import logger from 'lib/logger';

export const fetchGasPrice = async (
  speed: 'standard' | 'fast' | 'rapid' | 'slow' = 'fast'
): Promise<string | number> => {
  try {
    const response = await fetch(GASNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_gasPrice',
        params: [],
        id: 1
      })
    });

    const json = await response.json();

    if (!json.result) {
      throw new Error('Invalid gas price response');
    }

    // Convert hex to decimal (beats)
    const beatsValue = parseInt(json.result, 16);

    // Estimated gas used for a vote transaction
    const estimatedGasUsed = 20000; // Adjust this based on your actual transaction

    // Calculate total transaction cost in beats
    const totalCostBeats = beatsValue * estimatedGasUsed;

    // Convert total cost to PLS (1 PLS = 10^18 beats)
    const baseCostPLS = totalCostBeats / 1e18;

    // Calculate different speeds
    const gasPrices = {
      rapid: Number((baseCostPLS * 2).toFixed(2)), // 2x for rapid
      fast: Number((baseCostPLS * 1.5).toFixed(2)), // 1.5x for fast
      standard: Number(baseCostPLS.toFixed(2)), // base price for standard
      slow: Number((baseCostPLS * 0.8).toFixed(2)) // 0.8x for slow
    };

    return gasPrices[speed];
  } catch (e) {
    logger.error('fetchGasPrice: Error fetching gas price', e.message);
    throw e;
  }
};
