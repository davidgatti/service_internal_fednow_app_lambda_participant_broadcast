let crypto = require('crypto');

//
//  Generate unique message ID for SQS payload
//
module.exports = async (container) => {

    //
    //  Try to run the code
    //
    try {

        //
        //  Generate UUID v4 for message tracking (remove hyphens to shorten)
        //
        let message_id = crypto.randomUUID().replace(/-/g, '').substring(0, 24);

        //
        //  Store in container.req for next module
        //
        container.req.message_id = message_id;

    } catch (error) {

        //
        //  Capture error context for debugging
        //
        container.error = {
            module: 'message_id_generate',
            context: {},
            originalError: error.message
        };

        //
        //  Re-throw with enriched error message
        //
        throw new Error(`Failed to generate message ID: ${error.message}`);

    }

};
