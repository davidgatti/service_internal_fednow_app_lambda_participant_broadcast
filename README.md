# FedNow Participant Broadcast Lambda

Sends FedNow **participant broadcast** messages (admi.004) to announce participant availability status changes. Supports sign-on (FPON) and sign-off (FPOF) broadcasts.

Invoked on-demand when the participant needs to announce availability status changes to the FedNow network (e.g., initial go-live, after maintenance windows).

## How It Works

The Lambda runs a sequential module pipeline:

| # | Module | Description |
|---|--------|-------------|
| 01 | `input_validate` | Validate `action` field ("signon" or "signoff"), map to event code |
| 02 | `xml_template_load` | Load the `fednow_participant_broadcast.xml` template |
| 03 | `xml_placeholders_replace` | Replace placeholders (event code, RTN, timestamp) in the XML |
| 04 | `message_id_generate` | Generate a unique 24-character message ID |
| 05 | `xml_encode` | Base64-encode the populated XML |
| 06 | `message_prepare` | Assemble the SQS payload (`{id, channel, base64_xml}`) |
| 07 | `sqs_send` | Send the message to the SQS outbound queue |

## Event Payload

```json
{ "action": "signon" }
```

Valid actions:
- `"signon"` → sends FPON (FedNow Participant On) broadcast
- `"signoff"` → sends FPOF (FedNow Participant Off) broadcast

## AWS Services

- **SQS** — delivers the admi.004 XML message to the outbound queue (routed to FedNow via MQ)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SQS_QUEUE_URL` | URL of the SQS outbound queue |
| `SENDER_RTN` | 9-digit routing transit number of the participant |
| `ENVIRONMENT` | Set to `local` for local development |

## Local Development

```bash
cp .env.template .env
npm install
npm run locally
```

Use `local_test.json` payload to test sign-off: `npm run locally local_test`
