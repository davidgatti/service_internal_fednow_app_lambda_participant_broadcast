let { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

//
//  Send prepared message payload to SQS queue
//
module.exports = async (container) => {

    //
    //  Extract payload from container
    //
    let { sqs_payload } = container.req;

    //
    //  Read queue URL from environment
    //
    let queue_url = process.env.SQS_QUEUE_URL;

    //
    //  Resolve region with fallback to us-east-1
    //
    let region = process.env.AWS_REGION;

    //
    //  Default to us-east-1 when region is not set
    //
    if (!region) {

        //
        //  Set default region
        //
        region = 'us-east-1';

    }

    //
    //  Create SQS client
    //
    let sqs_client = new SQSClient({
        region: region
    });

    //
    //  Try to run the code
    //
    try {

        //
        //  Send message to SQS queue
        //
        let send_command = new SendMessageCommand({
            QueueUrl: queue_url,
            MessageBody: JSON.stringify(sqs_payload)
        });

        //
        //  Save the result to access the SQS ID.
        //
        let result = await sqs_client.send(send_command);

        //
        //  Log successful send operation
        //
        container.logger.info('Message sent to SQS successfully', {
            our_message_id: sqs_payload.id,
            sqs_message_id: result.MessageId,
            queue_url: queue_url
        });

    } catch (error) {

        //
        //  Capture error context for debugging
        //
        container.error = {
            module: 'sqs_send',
            context: {
                queue_url,
                payload_id: sqs_payload?.id
            },
            originalError: error.message
        };

        //
        //  Re-throw with enriched error message
        //
        throw new Error(`Failed to send SQS message: ${error.message}`);

    }

};
