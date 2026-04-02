let fs = require('fs');
let path = require('path');
let util = require('util');

//
//  TODO: Add comment
//
let readdir = util.promisify(fs.readdir);

//
//  TODO: Add comment
//
let modules_folder = path.join(__dirname, 'modules');

let wrapper = require('./wrapper');

//
//  <<>> Define an async handler function for AWS Lambda to invoke.
//
module.exports = async (container) => {

    //
    //  1.  Initialize steps for conditional execution.
    //
    container.steps = {};

    //
    //  2.  Load and execute modules in order based on filename.
    //
    await load_and_execute_modules(container);

    //
    //  ->  End of pipeline.
    //
    return container;

};

//
//  For testing: allow overriding the modules folder path
//
module.exports.__setModulesFolder = newFolder => {

    //
    //  TODO: Add comment
    //
    modules_folder = newFolder;

};

//
//  This function is designed to load JavaScript modules dynamically from a
//  directory structure and execute them.
//
//
//  Load and execute modules in numeric order from the modules folder.
//  Only top-level .js files are considered; subdirectories are ignored.
//
async function load_and_execute_modules(container) {

    //
    //  TODO: Add comment
    //
    let entries = await readdir(modules_folder, { withFileTypes: true });

    //
    //  TODO: Add comment
    //
    let jsFiles = entries
        .filter(entry => entry.isFile() && path.extname(entry.name) === '.js')
        .map(entry => path.join(modules_folder, entry.name))
        .sort((a, b) => path.basename(a).localeCompare(path.basename(b)));

    //
    //  TODO: Add comment
    //
    for (let file of jsFiles) {

        //
        //  TODO: Add comment
        //
        let fileName = path.basename(file);

        //
        //  strip numeric prefix to get base name, then drop extension
        //
        let normalizedName = fileName.replace(/^\d+_/, '');

        //
        //  TODO: Add comment
        //
        normalizedName = normalizedName.replace(/\.js$/, '');

        //
        //  TODO: Add comment
        //
        let should_skip = false;

        //
        //  TODO: Add comment
        //
        for (let [key, value] of Object.entries(container.steps)) {

            //
            //  normalize step key:
            //  drop prefix, extension & surrounding underscores
            //
            let normalizedKey = key
                .replace(/^\d+_/, '')
                .replace(/\.js$/, '')
                .replace(/^_+|_+$/g, '');

            //
            //  skip if disabled and step key appears in module name
            //
            if (value === false && normalizedName.includes(normalizedKey)) {

                //
                //  TODO: Add comment
                //
                should_skip = true;

                //
                //  TODO: Add comment
                //
                break;

            }

        }

        //
        //  TODO: Add comment
        //
        if (should_skip) {

            //
            //  TODO: Add comment
            //
            continue;

        }

        let moduleFn = require(file);

        //
        //  TODO: Add comment
        //
        let wrappedModule = wrapper(moduleFn, file, modules_folder);

        //
        //  TODO: Add comment
        //
        await wrappedModule(container);

    }

}
