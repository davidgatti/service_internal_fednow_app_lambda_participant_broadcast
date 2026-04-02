//
//  SQS send module tests
//
describe('07_sqs_send', () => {

    //
    //  Module reference
    //
    let sqs_send;

    //
    //  Mock SQS client
    //
    let mock_send;

    //
    //  Set up mocks before each test
    //
    beforeEach(() => {

        //
        //  Reset modules for clean state
        //
        jest.resetModules();

        //
        //  Create mock send function
        //
        mock_send = jest.fn().mockResolvedValue({
            MessageId: 'sqs-msg-id-123'
        });

        //
        //  Register mock
        //
        jest.mock('@aws-sdk/client-sqs', () => ({
            SQSClient: jest.fn().mockImplementation(() => ({
                send: mock_send
            })),
            SendMessageCommand: jest.fn().mockImplementation((params) => params)
        }));

        //
        //  Set environment
        //
        process.env.SQS_QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/123/test';

        //
        //  Require fresh module
        //
        sqs_send = require('../src/modules/07_sqs_send');

    });

    //
    //  Should send message to SQS
    //
    test('sends message to SQS queue successfully', async () => {

        //
        //  Create container with SQS payload
        //
        let container = {
            req: {
                sqs_payload: {
                    id: 'abc123',
                    channel: 'adm',
                    base64_xml: 'dGVzdA=='
                }
            },
            res: {},
            logger: { info: jest.fn() }
        };

        //
        //  Execute module
        //
        await sqs_send(container);

        //
        //  Verify SQS send was called
        //
        expect(mock_send).toHaveBeenCalledTimes(1);

        //
        //  Verify logger was called with success message
        //
        expect(container.logger.info).toHaveBeenCalledWith(
            'Message sent to SQS successfully',
            expect.objectContaining({
                our_message_id: 'abc123',
                sqs_message_id: 'sqs-msg-id-123'
            })
        );

    });

    //
    //  Should throw when SQS send fails
    //
    test('throws when SQS send fails', async () => {

        //
        //  Configure mock to reject
        //
        mock_send.mockRejectedValue(new Error('Access Denied'));

        //
        //  Create container
        //
        let container = {
            req: {
                sqs_payload: {
                    id: 'abc123',
                    channel: 'adm',
                    base64_xml: 'dGVzdA=='
                }
            },
            res: {},
            logger: { info: jest.fn() }
        };

        //
        //  Should throw with enriched error
        //
        await expect(sqs_send(container)).rejects.toThrow(
            'Failed to send SQS message'
        );

        //
        //  Verify error context stored
        //
        expect(container.error).toBeDefined();

        //
        //  Verify module name in error context
        //
        expect(container.error.module).toBe('sqs_send');

    });

});
