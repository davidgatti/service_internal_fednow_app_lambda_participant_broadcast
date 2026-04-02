<!--- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(c) 2022-2023 Federal Reserve Banks. Pilot Confidential/FedNow Confidential Information. Materials are not to be used or shared without consent.

The FedNowSM Service XML Schema Quick Start Package ("Schemas") provides technical details about the FedNow Service.
The Federal Reserve Banks may change the Schemas at any time and will endeavor to provide at least 30 days' notice for material changes.
The FedNow Service will be governed by applicable law and the terms of an operating circular issued by each of the Federal Reserve Banks.
Other Federal Reserve Banks operating circulars applicable to the Federal Reserve Banks provision of financial services, including operating circulars that govern the account relationships and electronic connection with the Participants, will also apply.
The Federal Reserve Banks provide no warranties with respect to the Schemas provided, are not responsible for its accuracy or use within your environment, and disclaim all liability in connection with its use. At a minimum, use of the Schemas in  your environment is subject to your internal quality, security, and control processes.
The Financial Services logo and "FedNow" are service marks of the Federal Reserve Banks. A list of marks related to financial services products that are offered to financial institutions by the Federal Reserve Banks is available at FRBservices.org.
Products and company names of third parties identified in this document are trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them.
-->
<!---->

FedNow XML Schema Quick Start Package:
This package has been made available to assist FedNow Service Participants in setting up or updating XML schemas for messaging within the FedNow Service. A new package will be distributed whenever a new message type is introduced into the service or an existing message type's schema is updated — Participants will be notified that they need to obtain the updated version. This package contains the schemas that are currently supported for the FedNow Service. Instructions for their use can be found under the "Usage" section.

NOTE: The package file name uses a date in lieu of a file version.

Release Notes
March 31, 2023 - Initial release of the FedNow XML Schema Quick Start Package. 

June 1, 2023 - Updated with minor corrections and clarifications to the admi.007, pain.014, camt.029 and camt.052 schemas. No change to XML content for Participants sending messages to the FedNow Service. Please see the Document Change History section of the FedNow Service ISO20022 Implementation Guide for more details.

Contents
The package includes:
  - This README.quickstart.txt file
  - application_schemas – a directory containing the schemas to be used in your application:
      - FedNow Service Technical Wrapper XML Schemas:
          - fednow-incoming_external.xsd
          - fednow-outgoing_external.xsd
      - The FedNow Service Key Management Schema:
          - fednow/FedNowKeyExchange.xsd
      - The FedNow Service Participant List Message Schema:
          - fednow/sup_FedNowParticipantFile_admi_998_001_02.xsd
      - The ISO® 20022 Standard XML Schemas supported by the FedNow Service:
          - iso/head.001.001.02.xsd
          - iso/...
  - test_schemas - a directory containing the schemas used by the FedNow Service for Service Release 1 provided to support your application test suite:
      - FedNow Service Technical Wrapper XML Schemas:
          - fednow-incoming_external-testing.xsd
          - fednow-outgoing_external-testing.xsd
      - The FedNow Service Key Management Schema:
          - fednow/FedNowKeyExchange.xsd
      - The FedNow Service Participant List Message Schema:
          - fednow/sup_FedNowParticipantFile_admi_998_001_02.xsd
      - The FedNow variants of the ISO® 20022 Standard XML Schemas supported by the FedNow Service:
          - fednow-variants/BusinessApplicationHeader_head.001.001.02.xsd
          - fednow-variants/...



Usage
Unzip the FedNow XML Schema Quick Start Package and place the schema files from the application_schemas directory in your application schema store.

- If the directory structure in the package is used, the FedNow Service Technical Wrapper XML
  Schemas can find referenced ISO 20022 Standard XML Schemas by relative file path.

- If schemas are placed in an alternate directory structure, the FedNow Service Technical Wrapper XML
  Schemas need to have the file path references updated to the new paths.

Important Note
 The FedNow Service XML Schemas for Service Release 1 (contained in the test_schemas directory) are not intended to be used for message creation by Participants. However, in recognition that some Participants may desire to validate their outgoing messages to the FedNow Service against the FedNow Service requirements, they have been included in this package. This allows a Participant application to construct an outgoing message based on the ISO 20022 Standard XML Schemas (contained in the application_schemas/iso directory), then validate the message in the Participant test suite against the requirements imposed by the FedNow Service using the FedNow variants of the ISO® 20022 Standard XML Schemas (contained in the test_schemas/fednow-variants directory).

Related References
Refer to the "FedNow Services Messages" section of the FedNow Services Technical Specifications, Version 1.1 for more detailed information on using ISO 20022 Standard XML Schemas and FedNow Service Technical Wrapper XML Schemas in FedNow Service messaging.

Footnotes
The FedNow Service has implemented enhanced XML schemas that place additional requirements on the ISO 20022 Standard XML Schemas for two main reasons:

1) To impose data type requirements that align with the FedNow Service data needs rather than the more generic requirements stipulated by the standard ISO schemas.

2) To allow the FedNow Service to implement design changes that simplify development and implementation (for example, the camt.029.001.09 and camt.052.001.08 standard ISO schemas occupy the same namespace and have been combined into a single "shared common namespace").
