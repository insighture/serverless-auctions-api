import AWS from 'aws-sdk';
import { validator } from '@middy/validator';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import getAuctionsSchema from '../../lib/schemas/getAuctionsSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getAuctionById(id) {
  let auction;

  try
  {
    const result = await dynamodb.get({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id }
    }).promise();

    auction = result.Item;
  }
  catch(error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  if (!auction) {
    throw new createError.NotFound(`Àuction with ID ${id} not found!`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auction)
  };
}

async function getAuction(event, context) {

  const { id } = event.pathParameters;
  let auctionResult = await getAuctionById(id);

  if (!auctionResult) {
    throw new createError.NotFound(`Àuction with ID ${id} not found!`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctionResult)
  };
}

export const handler = commonMiddleware(getAuction)
  .use(validator({ inputSchema: getAuctionsSchema, useDefaults: true }))