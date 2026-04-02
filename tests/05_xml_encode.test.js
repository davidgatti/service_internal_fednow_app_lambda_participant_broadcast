let xml_encode = require('../src/modules/05_xml_encode');

//
//  XML encoding module tests
//
describe('05_xml_encode', () => {

    //
    //  Should encode XML content to base64
    //
    test('encodes XML content to base64', async () => {

        //
        //  Create container with XML content
        //
        let xml_content = '<EvtCd>FPON</EvtCd>';

        //
        //  Create container
        //
        let container = {
            req: { xml_content: xml_content },
            res: {}
        };

        //
        //  Execute module
        //
        await xml_encode(container);

        //
        //  Verify base64 output exists
        //
        expect(container.req.base64_xml).toBeDefined();

        //
        //  Verify it decodes back to original
        //
        let decoded = Buffer.from(container.req.base64_xml, 'base64').toString();

        //
        //  Verify decoded matches original
        //
        expect(decoded).toBe(xml_content);

    });

    //
    //  Should throw when xml_content is missing
    //
    test('throws when xml_content is undefined', async () => {

        //
        //  Create container without xml_content
        //
        let container = {
            req: {},
            res: {}
        };

        //
        //  Should throw with enriched error
        //
        await expect(xml_encode(container)).rejects.toThrow(
            'Failed to encode XML to base64'
        );

    });

});
