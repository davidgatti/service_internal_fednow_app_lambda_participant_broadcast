# FedNow Participant Broadcast Implementation Guide

## Overview

This document describes the implementation of the **FedNow participant broadcast** Lambda. The Lambda sends admi.004 messages to announce participant availability status changes (sign-on / sign-off) to the FedNow network.

## Background & Requirements

### FedNow Participant Broadcast Specifications

According to the FedNow Service Technical Specifications (Version 1.12, February 2025):

1. Broadcast Type: admi.004 (SystemEventNotification)
1. Event Codes: FPON (sign-on), FPOF (sign-off)
1. Scope: Participant-level (RTN), not connection-level
1. Trigger: Status changes (initial go-live, after maintenance), not daily
1. Queue: Messages sent to `OUT.ADM` queue via SQS → MQ pipeline

### Event Code Semantics

- **FPON** — Participant is available to receive FedNow transactions
- **FPOF** — Participant is temporarily unavailable (e.g., maintenance window)

### Key Behavior

- FPON is NOT required after key rotation (ROLL broadcasts)
- FPON is sent once when participant first comes online or recovers from maintenance
- FPOF is sent before planned maintenance windows
- FedNow broadcasts received FPON/FPOF to all other participants on the network

## Implementation

This implementation follows the modular pipeline framework used throughout the codebase. All components are function-based modules that pass state through a `container` object.

### Helper Functions

Location: `helpers/`

1. `helpers/fednowMessageBuilder.js` - XML template placeholder replacement
1. `helpers/logger.js` - Pino-based structured logging

### Pipeline Modules

Location: `src/modules/`

Execute in numeric order, pass state via `container` object.

1. `01_input_validate.js` - Validate action field ("signon"/"signoff"), map to FPON/FPOF event code
1. `02_xml_template_load.js` - Load admi.004 XML template from `.templates/fednow_participant_broadcast.xml`
1. `03_xml_placeholders_replace.js` - Replace placeholders (EVENT_CODE, SENDER_RTN, EVENT_TIME, BIZ_MSG_ID)
1. `04_message_id_generate.js` - Generate unique 24-character message ID
1. `05_xml_encode.js` - Encode XML to base64 for transport
1. `06_message_prepare.js` - Prepare SQS payload with `channel: 'adm'`
1. `07_sqs_send.js` - Send message to downstream SQS queue

### XML Template

Location: `.templates/fednow_participant_broadcast.xml`

Placeholders:

- `{{EVENT_CODE}}` — FPON or FPOF
- `{{SENDER_RTN}}` — 9-digit participant routing transit number
- `{{EVENT_TIME}}` — ISO 8601 timestamp with timezone offset
- `{{BIZ_MSG_ID}}` — Unique business message identifier

### Event Payload

```json
{ "action": "signon" }
```

Valid actions: `"signon"` (→ FPON), `"signoff"` (→ FPOF)
