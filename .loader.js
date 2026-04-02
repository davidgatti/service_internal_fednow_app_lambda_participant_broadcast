//
//  This file is used in the package.json file to execute the code that starts
//  in index.js in a way that mimics the AWS Lambda environment 1:1.
//
let { createLogger } = require('./helpers/logger');

//
//  TODO: Add comment
//
let logger = createLogger();

//
//  This way it is easy to test the Lambda locally, and be confident that
//  it will run the same on AWS itself.
//
exports =
    require('./index')
        .handler(select_payload(), require('./.payloads/context.js'))
        .then(function (response) {

            //
            //  TODO: Add comment
            //
            logger.info('Lambda execution completed', { response });

        })
        .catch(function (error) {

            //
            //  TODO: Add comment
            //
            logger.error('Lambda execution failed', { error });

        });

//
//  We allow at run time to use a different payload from the default one, and
//  this function decides which payload to use.
//
function select_payload() {

    //
    //  1.  The default payload to use.
    //
    let event_payload = 'default.json';

    //
    //  2.  Check if the payload was provided
    //
    if (process.argv[1]) {

        //
        //  1.  Over write the default payload with the custom one.
        //
        event_payload = process.argv[1];

    }

    //
    //  -->  Send the event payload.
    //
    return require(`./.payloads/event/${event_payload}`);

}
