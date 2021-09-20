import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {

  let updatedAuction;
  const { id } = event.pathParameters;
  const { amount } = event.body;
  
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'SET highestBid.amount = :amount, highestBid.bidder = :bidder',
    ExpressionAttributeValues: {
      ':amount': amount,
      ':bidder': 'asankaboteju@gmail.com'
    },
    ReturnValues: 'ALL_NEW',
  };

  try
  {
    const result = await dynamodb.update(params).promise();
    updatedAuction = result.Attributes;
  }
  catch(error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction)
  };
}

export const handler = commonMiddleware(placeBid);