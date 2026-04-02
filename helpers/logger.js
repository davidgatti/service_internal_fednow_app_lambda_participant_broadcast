let pino = require('pino');

//
//  Determine environment (local vs production)
//
let environment = process.env.NODE_ENV;

//
//  Default to local when NODE_ENV is not set
//
if (!environment) {

    //
    //  Set default environment
    //
    environment = 'local';

}

//
//  TODO: Add comment
//
let is_local = environment === 'local';

//
//  Storage for current module context (set by wrapper.js)
//
let current_module = null;

//
//  Resolve log level
//
let log_level = process.env.LOG_LEVEL;

//
//  Default to info when LOG_LEVEL is not set
//
if (!log_level) {

    //
    //  Set default log level
    //
    log_level = 'info';

}

//
//  Configure Pino logger based on environment.
//
let logger = pino({
    level: log_level,

    //
    //  Mixin: Automatically inject module field into every log entry
    //
    mixin() {

        //
        //  TODO: Add comment
        //
        if (current_module) {

            //
            //  TODO: Add comment
            //
            return { module: current_module };

        }

        //
        //  TODO: Add comment
        //
        return {};

    },
    //
    //  Redact sensitive fields automatically
    //
    redact: {
        paths: [
            'headers.authorization',
            'auth_headers.authorization',
            '*.authorization',
            'password',
            'apiKey',
            'api_key'
        ],
        censor: '[REDACTED]'
    },

    //
    //  Enable pretty logging for local development
    //
    ...(is_local && {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss',
                messageFirst: true,
                singleLine: true,
                sync: true
            }
        }
    }),

    //
    //  Include metadata in production environments, exclude in local
    //
    ...(!is_local && {
        base: {
            environment: environment,
            awsRegion: _resolve_aws_region(),
            containerId: _resolve_container_id()
        }
    })
});

//
//  Resolve AWS region for logger base metadata
//
function _resolve_aws_region() {

    //
    //  Check AWS_REGION first
    //
    if (process.env.AWS_REGION) {

        //
        //  Return primary region variable
        //
        return process.env.AWS_REGION;

    }

    //
    //  Check AWS_DEFAULT_REGION as fallback
    //
    if (process.env.AWS_DEFAULT_REGION) {

        //
        //  Return fallback region variable
        //
        return process.env.AWS_DEFAULT_REGION;

    }

    //
    //  Return unknown when no region is set
    //
    return 'unknown';

}

//
//  Resolve container ID for logger base metadata
//
function _resolve_container_id() {

    //
    //  Check HOSTNAME
    //
    if (process.env.HOSTNAME) {

        //
        //  Return hostname
        //
        return process.env.HOSTNAME;

    }

    //
    //  Return unknown when no hostname is set
    //
    return 'unknown';

}

//
//  Component-specific logger factory
//  Creates a logger that automatically adds component field to all log entries
//
function createLogger(component) {

    //
    //  TODO: Add comment
    //
    return {

        //
        //  Each log level method automatically adds the component field
        //
        info: (message, context = {}) => {

            //
            //  TODO: Add comment
            //
            logger.info({ component,
                ...context }, message);

        },
        error: (message, context = {}) => {

            //
            //  TODO: Add comment
            //
            logger.error({ component,
                ...context }, message);

        },
        warn: (message, context = {}) => {

            //
            //  TODO: Add comment
            //
            logger.warn({ component,
                ...context }, message);

        },
        debug: (message, context = {}) => {

            //
            //  TODO: Add comment
            //
            logger.debug({ component,
                ...context }, message);

        },
        trace: (message, context = {}) => {

            //
            //  TODO: Add comment
            //
            logger.trace({ component,
                ...context }, message);

        },
        //
        //  The child() method creates a new logger that binds additional fields
        //  beyond just the component. Perfect for transaction tracking.
        //
        child: (bindings = {}) => {

            //
            //  TODO: Add comment
            //
            return {
                info: (message, context = {}) => {

                    //
                    //  TODO: Add comment
                    //
                    logger.info({ component,
                        ...bindings,
                        ...context }, message);

                },
                error: (message, context = {}) => {

                    //
                    //  TODO: Add comment
                    //
                    logger.error({ component,
                        ...bindings,
                        ...context }, message);

                },
                warn: (message, context = {}) => {

                    //
                    //  TODO: Add comment
                    //
                    logger.warn({ component,
                        ...bindings,
                        ...context }, message);

                },
                debug: (message, context = {}) => {

                    //
                    //  TODO: Add comment
                    //
                    logger.debug({ component,
                        ...bindings,
                        ...context }, message);

                },
                trace: (message, context = {}) => {

                    //
                    //  TODO: Add comment
                    //
                    logger.trace({ component,
                        ...bindings,
                        ...context }, message);

                }
            };

        }
    };

}

//
//  Export both the raw logger and the factory
//
module.exports = {

    //
    //  Default logger without component
    //
    logger: logger,

    //
    //  Factory for component loggers
    //
    createLogger: createLogger,

    //
    //  Direct Pino instance (advanced usage)
    //
    rawLogger: logger,

    //
    //  Function to set current module context (called by wrapper.js)
    //
    setModuleContext: (module_name) => {

        //
        //  TODO: Add comment
        //
        current_module = module_name;

    }
};
