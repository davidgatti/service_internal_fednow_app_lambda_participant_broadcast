let message_prepare = require('../src/modules/06_message_prepare');

//
//  Message preparation module tests
//
describe('06_message_prepare', () => {

    //
    //  Should assemble SQS payload with correct structure
    //
    test('assembles SQS payload with id, channel, and base64_xml', async () => {

        //
        //  Create container with required fields
        //
        let container = {
            req: {
                base64_xml: 'PHhtbD5GUDI8L3htbD4=',
                message_id: 'abc123def456789012345678'
            },
            res: {}
        };

        //
        //  Execute module
        //
        await message_prepare(container);

        //
        //  Verify payload structure
        //
        expect(container.req.sqs_payload).toEqual({
            id: 'abc123def456789012345678',
            channel: 'adm',
            base64_xml: 'PHhtbD5GUDI8L3htbD4='
        });

    });

    //
    //  Should always use 'adm' channel for broadcast messages
    //
    test('uses adm channel for participant broadcasts', async () => {

        //
        //  Create container
        //
        let container = {
            req: {
                base64_xml: 'dGVzdA==',
                message_id: '000000000000000000000000'
            },
            res: {}
        };

        //
        //  Execute module
        //
        await message_prepare(container);

        //
        //  Verify channel is adm
        //
        expect(container.req.sqs_payload.channel).toBe('adm');

    });

});
