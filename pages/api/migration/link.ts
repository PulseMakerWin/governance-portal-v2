/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import { NextApiRequest, NextApiResponse } from 'next';
import withApiHandler from 'modules/app/api/withApiHandler';
import { config } from 'lib/config';
import { postRequestToDiscord } from 'modules/app/api/postRequestToDiscord';
import { ApiError } from 'modules/app/api/ApiError';

export default withApiHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      console.log('Webhook URL:', config.MIGRATION_WEBHOOK_URL);

      if (!config.MIGRATION_WEBHOOK_URL) {
        throw new ApiError('Migration discord webhook not properly configured', 500);
      }

      console.log('Request body:', req.body);

      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      if (!body.sig || !body.msg) {
        throw new ApiError('Migration discord: Missing parameters', 400, 'Invalid request parameters');
      }

      try {
        const data = await postRequestToDiscord({
          url: config.MIGRATION_WEBHOOK_URL,
          content: JSON.stringify(body),
          notify: true
        });

        console.log('Discord response:', data);

        res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
        res.status(200).json({ data });
      } catch (err) {
        console.error('Discord post error:', err);
        throw new ApiError(`Migration Webhook ${err.message}`, 500);
      }
    } catch (err) {
      console.error('API error:', err);
      throw err;
    }
  },
  { allowPost: true }
);
