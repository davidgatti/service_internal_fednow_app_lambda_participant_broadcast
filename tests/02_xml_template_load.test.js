//
//  XML template load module tests
//
describe('02_xml_template_load', () => {

    //
    //  Module reference
    //
    let xml_template_load;

    //
    //  Mock fs.promises
    //
    let mock_read_file;

    //
    //  Set up mocks before each test
    //
    beforeEach(() => {

        //
        //  Reset modules for clean state
        //
        jest.resetModules();

        //
        //  Create mock function
        //
        mock_read_file = jest.fn();

        //
        //  Register mock
        //
        jest.mock('fs', () => ({
            promises: {
                readFile: mock_read_file
            }
        }));

        //
        //  Require fresh module
        //
        xml_template_load = require('../src/modules/02_xml_template_load');

    });

    //
    //  Should load XML template and store in container
    //
    test('loads XML template and stores in container', async () => {

        //
        //  Mock file content
        //
        let mock_xml = '<xml>{{EVENT_CODE}}</xml>';

        //
        //  Configure mock to return template
        //
        mock_read_file.mockResolvedValue(mock_xml);

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
        await xml_template_load(container);

        //
        //  Verify template stored in container
        //
        expect(container.req.xml_template).toBe(mock_xml);

        //
        //  Verify readFile called with correct path
        //
        expect(mock_read_file).toHaveBeenCalledWith(
            expect.stringContaining('fednow_participant_broadcast.xml'),
            'utf8'
        );

    });

    //
    //  Should throw when template file is missing
    //
    test('throws when template file cannot be read', async () => {

        //
        //  Configure mock to reject
        //
        mock_read_file.mockRejectedValue(new Error('ENOENT: no such file'));

        //
        //  Create container
        //
        let container = {
            req: {},
            res: {}
        };

        //
        //  Should throw with enriched error
        //
        await expect(xml_template_load(container)).rejects.toThrow(
            'Failed to load XML template'
        );

        //
        //  Verify error context stored
        //
        expect(container.error).toBeDefined();

        //
        //  Verify module name in error context
        //
        expect(container.error.module).toBe('xml_template_load');

    });

});
