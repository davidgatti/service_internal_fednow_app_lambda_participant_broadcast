let message_id_generate = require('../src/modules/04_message_id_generate');

//
//  Message ID generation module tests
//
describe('04_message_id_generate', () => {

    //
    //  Should generate a 24-character message ID
    //
    test('generates a 24-character message ID', async () => {

        //
        //  Create container
        //
        let container = {
            req: {},
            res: {}
        };

        //
        //  Execute module
        //
        await message_id_generate(container);

        //
        //  Verify message ID exists
        //
        expect(container.req.message_id).toBeDefined();

        //
        //  Verify message ID is 24 characters
        //
        expect(container.req.message_id).toHaveLength(24);

    });

    //
    //  Should generate hex-only characters
    //
    test('generates message ID with hex characters only', async () => {

        //
        //  Create container
        //
        let container = {
            req: {},
            res: {}
        };

        //
        //  Execute module
        //
        await message_id_generate(container);

        //
        //  Verify hex format
        //
        expect(container.req.message_id).toMatch(/^[a-f0-9]{24}$/);

    });

    //
    //  Should generate unique IDs on successive calls
    //
    test('generates unique IDs across calls', async () => {

        //
        //  Create two containers
        //
        let container_1 = { req: {}, res: {} };

        //
        //  Second container
        //
        let container_2 = { req: {}, res: {} };

        //
        //  Execute module twice
        //
        await message_id_generate(container_1);

        //
        //  Second execution
        //
        await message_id_generate(container_2);

        //
        //  Verify IDs are different
        //
        expect(container_1.req.message_id).not.toBe(
            container_2.req.message_id
        );

    });

});
