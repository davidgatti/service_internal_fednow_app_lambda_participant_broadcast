let { createLogger, setModuleContext } = require('../helpers/logger');

//
//  TODO: Add comment
//
let logger = createLogger();

//
//  This function takes a full file path and logs only the portion
//  after the base path to clearly show the relevant folder structure.
//
module.exports = (fn, file, base) => {

    //
    //  TODO: Add comment
    //
    return async (container) => {

        //
        //  1.  Initialize relativePath with the full file path.
        //
        let relativePath = file;

        //
        //  2.  If the file path starts with the base path, strip the base
        //      path from the file path, leaving only the part after the
        //      base path.
        //
        if (file.startsWith(base)) {

            //
            //  1.  Remove the base path from the file path to get the
            //      relative path.
            //
            relativePath = file.slice(base.length);

        }

        //
        //  3.  Set current module context for automatic injection
        //      into all logs.
        //
        setModuleContext(relativePath);

        //
        //  TODO: Add comment
        //
        if (!container.logger) {

            //
            //  Use the wrapper logger with module filename
            //  (module auto-injected via mixin)
            //
            logger.info(relativePath);

        }

        //
        //  TODO: Add comment
        //
        if (container.logger) {

            //
            //  Use the child logger from container with module
            //  filename (includes messageId automatically, module
            //  auto-injected via mixin)
            //
            container.logger.info(relativePath);

        }

        //
        //  4.  Execute the passed function.
        //      Enrich any errors with module context.
        //
        try {

            //
            //  TODO: Add comment
            //
            let result = await fn(container);

            //
            //  Clear module context after execution completes
            //
            setModuleContext(null);

            //
            //  TODO: Add comment
            //
            return result;

        } catch (err) {

            //
            //  Clear module context even on error
            //
            setModuleContext(null);

            //
            //  TODO: Add comment
            //
            if (!container.error) {

                //
                //  Initialize error object
                //
                container.error = {};

            }

            //
            //  TODO: Add comment
            //
            container.error.module = relativePath;

            //
            //  Annotate error; loader will log context
            //
            let err_msg = relativePath + ' failed: ' + err.message;

            //
            //  TODO: Add comment
            //
            throw new Error(err_msg);

        }

    };

};
