//
//  Replace placeholders in XML template with actual values
//
//  Placeholders:
//  {{EVENT_CODE}} - FedNow event code (FPON or FPOF)
//  {{SENDER_RTN}} - 9-digit participant routing transit number
//  {{EVENT_TIME}} - ISO 8601 datetime with timezone offset
//  {{BIZ_MSG_ID}} - Unique business message identifier
//
function replace_placeholders(xml_template, replacements) {

    //
    //  Start with original template
    //
    let xml_output = xml_template;

    //
    //  Replace each placeholder with its corresponding value
    //
    for (let [placeholder, value] of Object.entries(replacements)) {

        //
        //  Create regex to match {{PLACEHOLDER}} pattern (case-sensitive)
        //
        let pattern = new RegExp(`{{${placeholder}}}`, 'g');

        //
        //  Replace all occurrences
        //
        xml_output = xml_output.replace(pattern, value);

    }

    //
    //  Verify no unreplaced placeholders remain
    //
    let unreplaced_placeholders = xml_output.match(/{{[A-Z_]+}}/g);

    //
    //  TODO: Add comment
    //
    if (unreplaced_placeholders) {

        //
        //  TODO: Add comment
        //
        let joined = unreplaced_placeholders.join(', ');

        //
        //  TODO: Add comment
        //
        throw new Error(
            `Unreplaced placeholders found in XML: ${joined}`
        );

    }

    //
    //  TODO: Add comment
    //
    return xml_output;

}

//
//  Export function
//
module.exports = {
    replace_placeholders
};
