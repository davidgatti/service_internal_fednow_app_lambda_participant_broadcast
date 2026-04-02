let index = require('./src/index');
let { createLogger } = require('./helpers/logger');

//
//  TODO: Add comment
//
let logger = createLogger();

//
//  Define an async handler function for AWS Lambda to invoke.
//
exports.handler = async (event) => {

    //
    //  TODO: Add comment
    //
    let event_type = event.httpMethod;

    //
    //  Default to invocation when httpMethod is not set
    //
    if (!event_type) {

        //
        //  Set default event type
        //
        event_type = 'invocation';

    }

    //
    //  Create child logger with transaction ID bound to all logs
    //
    let child_logger = logger.child({
        event_type: event_type
    });

    //
    //  When working locally, log the event for easy debugging.
    //
    child_logger.info('Lambda invoked with event', { event });

    //
    //  Create a container for the event.
    //
    let container = {

        //
        //  The request object that always has all the data
        //  that was used to invoke the Lambda.
        //
        req: {
            ...event
        },

        //
        //  The default response for the Lambda.
        //
        res: {
            success: true,
            message: 'Execution successful',
            data: []
        },

        //
        //  Child logger for transaction tracking across all modules
        //
        logger: child_logger
    };

    //
    //  Try to run the pipeline.
    //
    try {

        //
        //  Start the pipeline.
        //
        await index(container);

        //
        //  Return success response.
        //
        return container.res;

    } catch (error) {

        //
        //  Surface the error in the logs.
        //
        logger.error(error.message, { err: error });

        //
        //  Build error response
        //
        let error_context = container.error;

        //
        //  Default to empty object when no error context
        //
        if (!error_context) {

            //
            //  Set default error context
            //
            error_context = {};

        }

        //
        //  Return error response.
        //
        return {
            success: false,
            message: error.message,
            error: error_context
        };

    }

};
