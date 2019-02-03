// create curried versions of npm-debug for logging...
// format specifiers include:
//  %O for object, multiple lines
//  %o for object, one line
//  %s, string
//  %d for number (float or int)
//  %j for JSON
const color = require("supports-color"); 
function debugFactory(postFix) {
    const jdebug = {};
    jdebug.error = require("debug")(`jbj:error:${postFix}`);
    jdebug.info = require("debug")(`jbj:info:${postFix}`);
    jdebug.warn = require("debug")(`jbj:warn:${postFix}`);
    return jdebug;
}

module.exports = { debugFactory };
