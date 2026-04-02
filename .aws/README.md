# .AWS

This folder contains resources that CodeBuild will use. These resources are crucial for automating the build and deployment process of AWS Lambda functions.

- **buildspec.yml**: This file defines the build process for AWS CodeBuild. It includes installation of dependencies, packaging of the source code, and commands to update and publish new versions of the Lambda function.
- **appspec.yml**: This file provides deployment instructions and is used by AWS CodeDeploy to manage deployment tasks. It includes placeholders that are replaced at build time.
