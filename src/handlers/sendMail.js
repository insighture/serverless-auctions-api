import createError from 'http-errors';
import { closeAuction } from '../../lib/closeAuction';
import { getEndedAuctions } from '../../lib/getEndedAuctions';
import AWS from 'aws-sdk';

const sqs = new AWS.SQS();
const ses = new AWS.SES({ region: 'us-east-1' });

async function sendMail(event, context) {

    const record = event.Records[0];
    console.log('record processing', record);

    const email = JSON.parse(record.body);
    const { subject, body, recipient } = email;

    const param = {
        Source: "asankaboteju@gmail.com",
        Destination: {
            ToAddress:"asankaboteju@gmail.com"
        },
        Message: {
            Body: {
                Text: {
                    Data: "Hello"
                }
            },
            Subject: {
                Data: "Hello"
            }
        },
    };

    try {
        const result = await ses.sendEmail().promise();
        console.log(result);
        return result;
    }
    catch(error) {
        console.error(error);
    }

    try {
        const notifySeller = sqs.sendMessage({
            QueueUrl: process.env.MAIL_QUEUE_URL,
            MessageBody: JSON.stringify({
                subject: '',
                recipent: '',
                body: ''
            }),
        }).promise();

        const notifyBidder = sqs.sendMessage({
            QueueUrl: process.env.MAIL_QUEUE_URL,
            MessageBody: JSON.stringify({
                subject: '',
                recipent: '',
                body: ''
            }),
        }).promise();

        return Promise.all([
            notifySeller,
            notifyBidder
        ]);
    } catch(error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }
}

export const handler = sendMail;