//
//  Validate that the event contains a valid action field
//
//  Accepted actions:
//    "signon"  → maps to FedNow event code FPON
//    "signoff" → maps to FedNow event code FPOF
//
module.exports = async (container) => {

    //
    //  Extract action from the event payload
    //
    let { action } = container.req;

    //
    //  Validate action is present
    //
    if (!action) {

        //
        //  Action is required to determine broadcast type
        //
        throw new Error(
            'Missing required field: action (must be "signon" or "signoff")'
        );

    }

    //
    //  Map action to FedNow event code
    //
    let event_code_map = {
        signon: 'FPON',
        signoff: 'FPOF'
    };

    //
    //  Validate action is one of the allowed values
    //
    let event_code = event_code_map[action];

    //
    //  Reject unknown actions
    //
    if (!event_code) {

        //
        //  Only signon and signoff are valid broadcast actions
        //
        throw new Error(
            'Invalid action: must be "signon" or "signoff"'
        );

    }

    //
    //  Store event code in container for XML placeholder replacement
    //
    container.req.event_code = event_code;

    //
    //  Validate participant_rtn is present
    //
    if (!container.req.participant_rtn) {

        //
        //  Participant RTN identifies the participant the broadcast is about
        //
        throw new Error(
            'Missing required field: participant_rtn'
        );

    }

    //
    //  Validate SQS_QUEUE_URL environment variable
    //
    if (!process.env.SQS_QUEUE_URL) {

        //
        //  Cannot send broadcast without queue URL
        //
        throw new Error(
            'Missing required environment variable: SQS_QUEUE_URL'
        );

    }

    //
    //  Validate SENDER_RTN environment variable
    //
    if (!process.env.SENDER_RTN) {

        //
        //  Cannot build broadcast message without participant RTN
        //
        throw new Error(
            'Missing required environment variable: SENDER_RTN'
        );

    }

    //
    //  Store RTN in container for XML placeholder replacement
    //
    container.req.sender_rtn = process.env.SENDER_RTN;

};
