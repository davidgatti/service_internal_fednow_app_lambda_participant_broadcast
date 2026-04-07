let xml_placeholders_replace = require('../src/modules/03_xml_placeholders_replace');

//
//  XML placeholder replacement module tests
//
describe('03_xml_placeholders_replace', () => {

    //
    //  Store original environment
    //
    let original_environment;

    //
    //  Set up environment before each test
    //
    beforeEach(() => {

        //
        //  Save original value
        //
        original_environment = process.env.ENVIRONMENT;

        //
        //  Set to non-local to skip file write
        //
        process.env.ENVIRONMENT = 'production';

    });

    //
    //  Restore environment after each test
    //
    afterEach(() => {

        //
        //  Restore original value
        //
        //
        //  Remove current value
        //
        delete process.env.ENVIRONMENT;

        //
        //  Restore original if it existed
        //
        if (original_environment !== undefined) {

            //
            //  Restore value
            //
            process.env.ENVIRONMENT = original_environment;

        }

    });

    //
    //  Should replace EVENT_CODE placeholder with FPON
    //
    test('replaces all placeholders for signon broadcast', async () => {

        //
        //  Create container with template and event data
        //
        let container = {
            req: {
                xml_template: '<EvtCd>{{EVENT_CODE}}</EvtCd><EvtParam>{{PARTICIPANT_RTN}}</EvtParam><EvtTm>{{EVENT_TIME}}</EvtTm><BizMsgIdr>{{BIZ_MSG_ID}}</BizMsgIdr><MmbId>{{SENDER_RTN}}</MmbId>',
                event_code: 'FPON',
                sender_rtn: '721160232',
                participant_rtn: '011054317'
            },
            res: {},
            logger: { info: jest.fn() }
        };

        //
        //  Execute module
        //
        await xml_placeholders_replace(container);

        //
        //  Verify event code replaced
        //
        expect(container.req.xml_content).toContain('<EvtCd>FPON</EvtCd>');

        //
        //  Verify participant RTN replaced in EvtParam
        //
        expect(container.req.xml_content).toContain('<EvtParam>011054317</EvtParam>');

        //
        //  Verify sender RTN replaced in MmbId
        //
        expect(container.req.xml_content).toContain('<MmbId>721160232</MmbId>');

        //
        //  Verify no unreplaced placeholders remain
        //
        expect(container.req.xml_content).not.toContain('{{');

    });

    //
    //  Should replace EVENT_CODE placeholder with FPOF
    //
    test('replaces event code with FPOF for signoff broadcast', async () => {

        //
        //  Create container with signoff event code
        //
        let container = {
            req: {
                xml_template: '<EvtCd>{{EVENT_CODE}}</EvtCd><EvtParam>{{PARTICIPANT_RTN}}</EvtParam><EvtTm>{{EVENT_TIME}}</EvtTm><BizMsgIdr>{{BIZ_MSG_ID}}</BizMsgIdr>',
                event_code: 'FPOF',
                sender_rtn: '999999999',
                participant_rtn: '011054317'
            },
            res: {},
            logger: { info: jest.fn() }
        };

        //
        //  Execute module
        //
        await xml_placeholders_replace(container);

        //
        //  Verify FPOF event code in output
        //
        expect(container.req.xml_content).toContain('<EvtCd>FPOF</EvtCd>');

    });

    //
    //  Should generate timestamp in ISO 8601 format
    //
    test('generates event time in ISO 8601 format', async () => {

        //
        //  Create container
        //
        let container = {
            req: {
                xml_template: '<EvtTm>{{EVENT_TIME}}</EvtTm><EvtCd>{{EVENT_CODE}}</EvtCd><EvtParam>{{PARTICIPANT_RTN}}</EvtParam><BizMsgIdr>{{BIZ_MSG_ID}}</BizMsgIdr>',
                event_code: 'FPON',
                sender_rtn: '721160232',
                participant_rtn: '011054317'
            },
            res: {},
            logger: { info: jest.fn() }
        };

        //
        //  Execute module
        //
        await xml_placeholders_replace(container);

        //
        //  Verify timestamp format (YYYY-MM-DDTHH:MM:SSZ)
        //
        expect(container.req.xml_content).toMatch(
            /<EvtTm>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z<\/EvtTm>/
        );

        //
        //  Regression: must NOT contain timezone offset (+HH:MM or -HH:MM)
        //  An offset causes FedNow to interpret the time as local, shifting
        //  it hours into the future and triggering T580 rejections.
        //
        expect(container.req.xml_content).not.toMatch(/<EvtTm>[^<]+[+-]\d{2}:\d{2}<\/EvtTm>/);

    });

    //
    //  Should generate BizMsgIdr containing the sender RTN
    //
    test('generates BizMsgIdr containing sender RTN', async () => {

        //
        //  Create container
        //
        let container = {
            req: {
                xml_template: '<BizMsgIdr>{{BIZ_MSG_ID}}</BizMsgIdr><EvtCd>{{EVENT_CODE}}</EvtCd><EvtParam>{{PARTICIPANT_RTN}}</EvtParam><EvtTm>{{EVENT_TIME}}</EvtTm>',
                event_code: 'FPON',
                sender_rtn: '721160232',
                participant_rtn: '011054317'
            },
            res: {},
            logger: { info: jest.fn() }
        };

        //
        //  Execute module
        //
        await xml_placeholders_replace(container);

        //
        //  Verify BizMsgIdr contains the RTN
        //
        expect(container.req.xml_content).toMatch(
            /<BizMsgIdr>\d{8}721160232PBSc1Step1MsgId<\/BizMsgIdr>/
        );

    });

});
