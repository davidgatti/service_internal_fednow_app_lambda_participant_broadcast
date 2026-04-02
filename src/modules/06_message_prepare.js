//
//  Prepare SQS message payload with ID, channel,
//  and base64-encoded XML
//
module.exports = async (container) => {

    //
    //  Extract base64 XML and message ID from previous modules
    //
    let { base64_xml, message_id } = container.req;

    //
    //  Try to run the code
    //
    try {

        //
        //  Assemble final SQS payload structure
        //
        let sqs_payload = {
            id: message_id,
            channel: 'adm',
            base64_xml: base64_xml
        };

        //
        //  Store in container.req for next module
        //
        container.req.sqs_payload = sqs_payload;

    } catch (error) {

        //
        //  Capture error context for debugging
        //
        container.error = {
            module: 'message_prepare',
            context: {
                base64_xml_exists: !!base64_xml,
                message_id
            },
            originalError: error.message
        };

        //
        //  Re-throw with enriched error message
        //
        throw new Error(`Failed to prepare message payload: ${error.message}`);

    }

};
