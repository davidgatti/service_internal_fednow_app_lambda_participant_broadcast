let fednowMessageBuilder = require('../../helpers/fednowMessageBuilder');

//
//  Replace XML template placeholders with broadcast event data
//
module.exports = async (container) => {

    //
    //  Extract data from container
    //
    let {
        xml_template,
        event_code,
        sender_rtn
    } = container.req;

    //
    //  Try to run the code
    //
    try {

        //
        //  Generate ISO 8601 timestamp in UTC
        //
        let event_time = new Date().toISOString()
            .replace(/\.\d{3}Z$/, 'Z');

        //
        //  Generate a unique BizMsgIdr for the message header
        //
        let biz_msg_id = `${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${sender_rtn}PBSc1Step1MsgId`;

        //
        //  Define placeholder replacements
        //
        let replacements = {
            EVENT_CODE: event_code,
            SENDER_RTN: sender_rtn,
            EVENT_TIME: event_time,
            BIZ_MSG_ID: biz_msg_id
        };

        //
        //  Replace all placeholders in XML template
        //
        let xml_content = fednowMessageBuilder.replace_placeholders(
            xml_template,
            replacements
        );

        //
        //  Store populated XML in container
        //
        container.req.xml_content = xml_content;

        //
        //  Save XML to file in local mode for review
        //
        if (process.env.ENVIRONMENT === 'local') {

            //
            //  Write computed XML for local debugging
            //
            let fs = require('fs').promises;
            let path = require('path');

            //
            //  Output path for local review
            //
            let output_path = path.join(
                __dirname,
                '../../computed_participant_broadcast.xml'
            );

            //
            //  Write the populated XML
            //
            await fs.writeFile(output_path, xml_content, 'utf8');

            //
            //  Log the output location
            //
            container.logger.info('Local mode: XML saved for review', {
                output_path
            });

        }

    } catch (error) {

        //
        //  Capture error context for debugging
        //
        container.error = {
            module: 'xml_placeholders_replace',
            context: {
                event_code,
                sender_rtn
            },
            originalError: error.message
        };

        //
        //  Re-throw with enriched error message
        //
        throw new Error(`Failed to replace XML placeholders: ${error.message}`);

    }

};
