import invariant from 'tiny-invariant';
import { NextApiRequest, NextApiResponse } from 'next';
import { isSupportedNetwork } from 'lib/maker';
import { DEFAULT_NETWORK } from 'lib/constants';
import withApiHandler from 'lib/api/withApiHandler';
import { getPolls } from 'modules/polling/api/fetchPolls';


/**
 * @swagger
 * /api/polling/all-polls:
 *   get:
 *     tags:
 *     - "polls"
 *     description: Returns all polls
 *     produces: 
 *     - "application/json"
 *     parameters:
 *     - name: "categories"
 *       in: "query"
 *       description: "Categories to filter polls by"
 *       required: false
 *       type: "array"
 *       items:
 *         type: "string"
 *         enum:
 *         - "Collateral"
 *         - "Greenlight"
 *         - "Governance"
 *         default: ""
 *       collectionFormat: "multi"
 *     responses:
 *       200:
 *         description: List of polls
 */
export default withApiHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  const network = (req.query.network as string) || DEFAULT_NETWORK;
  invariant(isSupportedNetwork(network), `unsupported network ${network}`);

  const filters = {
    startDate: req.query.startDate ? new Date(req.query.startDate as string) : null,
    endDate: req.query.endDate ? new Date(req.query.endDate as string) : null,
    categories: req.query.categories ? ( typeof req.query.categories === 'string' ? [req.query.categories] : req.query.categories): null
  };

  const polls = await getPolls(filters, network);

  res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate');
  res.status(200).json(polls);
});
