# FedNow Technical Resources

This folder contains official FedNow Service technical documentation and reference materials. The files provide essential information for implementing and integrating with the FedNow Service real-time payment system.

## Files Overview

### 01 - FN-Pilot-Drop-in-Session-Public_Private_Key_Setup.txt

**Purpose:** Presentation overview on message signing and key management for FedNow pilot participants.

**Key Topics:**

- Benefits of cryptographic message signing (non-repudiation, fraud reduction)
- Key pair specifications and requirements
- Public/private key creation process
- Key management workflow:
  - Creating keys
  - Onboarding first key
  - Key exchange process (adding, revoking, getting FedNow keys)
  - Automated vs. staging key management
- Signing and verifying messages
- Message signing keys are valid up to one year
- Recommendation to maintain multiple active keys with overlapping time periods
- Anti-trust and confidentiality reminders for pilot participants

**When to Use:** Reference this for a high-level overview of the key management process before diving into detailed implementation in the Technical Specifications.

### 02 - FedNow-Service-Technical-Specifications-Version-1-12-February-2025.txt

**Purpose:** Complete technical specifications for implementing FedNow Service integration.

**Key Topics:**

- FedNow Service network architecture and components
- IBM MQ configuration and queue setup (IN/OUT queues)
- Message structure and ISO 20022 message types
- Security protocols and connection requirements
- Key management and exchange:
  - Generating RSA key pairs (2048-bit)
  - Calculating public key fingerprints
  - Key exchange process via FedNow interface and MQ
  - FedNow Service public key rotation
- Message signing and verification implementation
- FedNow REST APIs usage
- Protocol headers and XML schema usage
- Resiliency and connection point affinity
- Application design considerations
- Sample signed messages and code examples
- Error codes and descriptions
- Appendices with MQ client configuration details

**When to Use:** This is the primary technical reference for all implementation work. Use it for architecture planning, MQ setup, message signing implementation, API integration, and understanding the complete FedNow Service technical landscape.

### 03 - FedNow-Service-Message-Signing-Utility_Ver1.0.txt

**Purpose:** Installation and usage guide for the FedNow Service Message Signing Tool (Java-based utilities).

**Key Topics:**

- Java environment setup and prerequisites
- Tool installation and configuration
- Three main utilities:
  - **GetPublicKeyFingerprint:** Calculate public key fingerprints
  - **SignParticipantMessage:** Sign outgoing XML messages to FedNow
  - **VerifyMessageSignature:** Verify incoming messages from FedNow
- Configuration file setup (config.properties)
- Command-line usage examples
- Troubleshooting common cryptographic problems

**When to Use:** Reference this when implementing message signing, verifying signatures, or troubleshooting cryptographic operations in your integration.

### 04 - FedNow-Public-Keys_09212023_Early-Adopter-Hub.txt

**Purpose:** Expired sample public keys from the Customer Testing Environment. Shows the format and structure of FedNow's public keys used for message signing.

**Key Topics:**

- Active public key IDs and their creation/expiration dates
- Public key download process via FedNow interface
- Key rotation notifications (admi.004 broadcast with FNKY code)
- Instructions for uploading and removing keys in participant systems
- Note that FedNow typically uses the oldest active key for signing messages
- Customer Testing Environment maintains 3 active keys

**When to Use:** Reference this when setting up message verification, updating public keys, or troubleshooting signature validation failures.

### 05 - FedNow-Service-Message-Validation-Error-Handling-Guide-Version-1-2.txt

**Purpose:** Comprehensive guide to FedNow Service validation processes and error resolution.

**Key Topics:**

- Message validation flow and error types
- External validation errors:
  - T501: Message size errors
  - T529: Message signing errors
  - T537: Invalid signature errors
  - T505: Schema validation errors
  - T516: Message sender authorization errors
- Rule validation errors for each message type:
  - Business Application Header rules
  - Common message rules
  - Message-specific rules (pacs.004, pacs.008, pacs.009, pacs.002, pacs.028, camt.060, admi.004, admi.007)
- Error descriptions and resolution steps
- Reply not received error handling

**When to Use:** Reference this when troubleshooting message rejections, validation failures, or understanding specific error codes returned by FedNow.

### 06 - Cycle-Day-Rollover-Dec-20-2022.txt

**Purpose:** Explains the FedNow Service cycle day rollover process and end-of-day activities.

**Key Topics:**

- Cycle date rollover timing (approximately 7 PM ET)
- End-of-day accounting cycle process (approximately 8 PM ET)
- Provisional vs. final balance calculations
- Federal Reserve Accounting reconciliation reports (Statement of Account, FIRD, SASF)
- ISO timestamp and date field handling during rollover
- Funds-transfer business day definitions

**When to Use:** Reference this when implementing daily cycle processing, understanding balance timing, or troubleshooting end-of-day reconciliation issues.

## Additional Resources

This folder also contains subdirectories with:

- **FedNow-Service-Sample-XML-Messages-January-2025/**: Sample XML messages for various message types (pacs, camt, admi, pain)
- **FedNow-Service-XML-Schema-Quick-Start-Package-Jun.-1-2023/**: XML schemas for message validation
- **FedNowMessageSigningTools/**: Java-based message signing utilities and sample configurations

## Recommended Reading Order

For new implementations:

1. Start with **FN-Pilot-Drop-in-Session-Public_Private_Key_Setup.txt** for conceptual overview
2. Read **FedNow-Service-Technical-Specifications-Version-1-12-February-2025.txt** for complete technical details
3. Use **FedNow-Service-Message-Signing-Utility_Ver1.0.txt** to implement signing/verification
4. Reference **FedNow-Public-Keys_09212023_Early-Adopter-Hub.txt** for current public keys
5. Keep **FedNow-Service-Message-Validation-Error-Handling-Guide-Version-1-2.txt** handy for troubleshooting
6. Review **Cycle-Day-Rollover-Dec-20-2022.txt** for understanding daily processing cycles

## Document Status

All documents are marked as "INTERNAL FR/OFFICIAL USE" and contain Federal Reserve confidential information. Handle according to your organization's security and confidentiality policies.
