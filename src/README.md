# Source Code

This folder contains the main source code for the project. It is structured to house all the logic and functionality required for the application to run. The source code is dynamically loaded and executed at the start, ensuring a modular architecture that promotes reusability and flexibility.

## Folder Structure

- **index.js**: The main entry point for the application. It disables certain logs based on the environment, sets up the execution flow, and dynamically loads and executes JavaScript modules.
- **wrapper.js**: A utility module that wraps each dynamically loaded function to log its name, providing a clear step-by-step execution trace in the log output. This helps quickly identify at which stage of execution something failed.
- **modules/**: Contains the source code modularized into individual files for clarity and ease of workflow.
