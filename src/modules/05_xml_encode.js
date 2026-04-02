//
//  Encode XML content to base64
//
module.exports = async (container) => {

    //
    //  Extract XML content from previous module
    //
    let { xml_content } = container.req;

    //
    //  Try to run the code
    //
    try {

        //
        //  Convert XML string to base64 encoding
        //
        let base64_xml = Buffer.from(xml_content).toString('base64');

        //
        //  Store in container.req for next module
        //
        container.req.base64_xml = base64_xml;

    } catch (error) {

        //
        //  Capture error context for debugging
        //
        container.error = {
            module: 'xml_encode',
            context: { xml_content_exists: !!xml_content },
            originalError: error.message
        };

        //
        //  Re-throw with enriched error message
        //
        throw new Error(`Failed to encode XML to base64: ${error.message}`);

    }

};
