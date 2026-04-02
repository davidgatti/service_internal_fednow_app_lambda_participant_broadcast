//
//  Load FedNow participant broadcast (admi.004) XML template
//
let fs = require('fs').promises;
let path = require('path');

//
//  Load FedNow participant broadcast XML template
//
module.exports = async (container) => {

    //
    //  Build absolute path to XML template file
    //
    let xml_template_path = path.join(
        __dirname,
        '..',
        '..',
        '.templates',
        'fednow_participant_broadcast.xml'
    );

    //
    //  Load XML template and store in container
    //
    try {

        //
        //  Read file as UTF-8 string
        //
        let xml_content = await fs.readFile(xml_template_path, 'utf8');

        //
        //  Store template in container
        //
        container.req.xml_template = xml_content;

    } catch (error) {

        //
        //  Capture error context for debugging
        //
        container.error = {
            module: 'xml_template_load',
            context: { xml_template_path },
            originalError: error.message
        };

        //
        //  Re-throw with enriched error message
        //
        throw new Error(`Failed to load XML template: ${error.message}`);

    }

};
