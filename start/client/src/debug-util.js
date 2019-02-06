// create curried versions of npm-debug for logging...
// format specifiers include:
//  %O for object, multiple lines
//  %o for object, one line
//  %s, string
//  %d for number (float or int)
//  %j for JSON
// Call by:
// const { debugFactory } = require("../debug-util");
// jlog = debugFactory("launch");

const color = require("supports-color");
function debugFactory(postFix) {
    const jdebug = {};
    jdebug.error = require("debug")(`jbj:error:${postFix}`);
    jdebug.info = require("debug")(`jbj:info:${postFix}`);
    jdebug.warn = require("debug")(`jbj:warn:${postFix}`);
    jdebug.debug = require("debug")(`jbj:debug:${postFix}`);
    return jdebug;
}

module.exports = { debugFactory };
