let input_validate = require('../src/modules/01_input_validate');

//
//  Input validation module tests
//
describe('01_input_validate', () => {

    //
    //  Store original environment
    //
    let original_sqs_queue_url;

    //
    //  Store original SENDER_RTN
    //
    let original_sender_rtn;

    //
    //  Set up environment before each test
    //
    beforeEach(() => {

        //
        //  Save original values
        //
        original_sqs_queue_url = process.env.SQS_QUEUE_URL;

        //
        //  Save original SENDER_RTN
        //
        original_sender_rtn = process.env.SENDER_RTN;

        //
        //  Set test values
        //
        process.env.SQS_QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/123/test';

        //
        //  Set test RTN
        //
        process.env.SENDER_RTN = '721160232';

    });

    //
    //  Restore environment after each test
    //
    afterEach(() => {

        //
        //  Restore original SQS_QUEUE_URL
        //
        //
        //  Remove current value
        //
        delete process.env.SQS_QUEUE_URL;

        //
        //  Restore original if it existed
        //
        if (original_sqs_queue_url !== undefined) {

            //
            //  Restore value
            //
            process.env.SQS_QUEUE_URL = original_sqs_queue_url;

        }

        //
        //  Restore original SENDER_RTN
        //
        //
        //  Remove current value
        //
        delete process.env.SENDER_RTN;

        //
        //  Restore original if it existed
        //
        if (original_sender_rtn !== undefined) {

            //
            //  Restore value
            //
            process.env.SENDER_RTN = original_sender_rtn;

        }

    });

    //
    //  Should pass with valid signon action
    //
    test('passes with signon action and sets FPON event code', async () => {

        //
        //  Create container with signon action
        //
        let container = {
            req: { action: 'signon' },
            res: {}
        };

        //
        //  Should not throw
        //
        await expect(input_validate(container)).resolves.not.toThrow();

        //
        //  Verify event code mapped correctly
        //
        expect(container.req.event_code).toBe('FPON');

        //
        //  Verify RTN stored in container
        //
        expect(container.req.sender_rtn).toBe('721160232');

    });

    //
    //  Should pass with valid signoff action
    //
    test('passes with signoff action and sets FPOF event code', async () => {

        //
        //  Create container with signoff action
        //
        let container = {
            req: { action: 'signoff' },
            res: {}
        };

        //
        //  Should not throw
        //
        await expect(input_validate(container)).resolves.not.toThrow();

        //
        //  Verify event code mapped correctly
        //
        expect(container.req.event_code).toBe('FPOF');

    });

    //
    //  Should throw when action is missing
    //
    test('throws when action is missing', async () => {

        //
        //  Create container without action
        //
        let container = {
            req: {},
            res: {}
        };

        //
        //  Should throw with clear error
        //
        await expect(input_validate(container)).rejects.toThrow(
            'Missing required field: action'
        );

    });

    //
    //  Should throw when action is invalid
    //
    test('throws when action is invalid string', async () => {

        //
        //  Create container with unknown action
        //
        let container = {
            req: { action: 'restart' },
            res: {}
        };

        //
        //  Should throw with clear error
        //
        await expect(input_validate(container)).rejects.toThrow(
            'Invalid action: must be "signon" or "signoff"'
        );

    });

    //
    //  Should throw when SQS_QUEUE_URL is missing
    //
    test('throws when SQS_QUEUE_URL is not set', async () => {

        //
        //  Remove env var
        //
        delete process.env.SQS_QUEUE_URL;

        //
        //  Create container with valid action
        //
        let container = {
            req: { action: 'signon' },
            res: {}
        };

        //
        //  Should throw with clear error
        //
        await expect(input_validate(container)).rejects.toThrow(
            'Missing required environment variable: SQS_QUEUE_URL'
        );

    });

    //
    //  Should throw when SENDER_RTN is missing
    //
    test('throws when SENDER_RTN is not set', async () => {

        //
        //  Remove env var
        //
        delete process.env.SENDER_RTN;

        //
        //  Create container with valid action
        //
        let container = {
            req: { action: 'signon' },
            res: {}
        };

        //
        //  Should throw with clear error
        //
        await expect(input_validate(container)).rejects.toThrow(
            'Missing required environment variable: SENDER_RTN'
        );

    });

});
