'use strict';
var path = require('path'),
    util = require('util'),
    html = require('html-wiring'),
    chalk = require('chalk'),
    yeoman = require('yeoman-generator'),
    shelljs = require('shelljs'),
    engine = require('ejs').render,
    _ = require('lodash');

module.exports = Generator;

function Generator() {
    yeoman.Base.apply(this, arguments);
}

util.inherits(Generator, yeoman.Base);

  
Generator.prototype.addEntityToMenu = function(routerName, enableTranslation) {
    try {
        var fullPath = 'src/main/webapp/app/layouts/navbar/navbar.html';
        this.rewriteFile({
            file: fullPath,
            needle: 'jhipster-needle-add-entity-to-menu',
            splicable: [
                '<md-list-item>\n' +
                '                                 <md-icon class="md-default-theme" class="material-icons">&#xE0C9;</md-icon>\n' +
                '                                <p>' + routerName + '</p>\n' +
                '                        </md-list-item>>'
            ]
        }, this);
    } catch (e) {
        console.log('addEntityToMenu ' + e );
    }
};


Generator.prototype.rewriteFile = function(args, _this) {
    args.path = args.path || process.cwd();
    var fullPath = path.join(args.path, args.file);

    args.haystack = _this.fs.read(fullPath);
    var body = _this.rewrite(args);
    _this.fs.write(fullPath, body);
}

Generator.prototype.replaceContent = function(args, _this) {
    args.path = args.path || process.cwd();
    var fullPath = path.join(args.path, args.file);

    var re = args.regex ? new RegExp(args.pattern, 'g') : args.pattern;

    var body = _this.fs.read(fullPath);
    body = body.replace(re, args.content);
    _this.fs.write(fullPath, body);
}

Generator.prototype.rewrite = function(args) {
    var re = new RegExp(args.splicable.map(function (line) {
        return '\s*' + line.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    }).join('\n'));

    if (re.test(args.haystack)) {
        return args.haystack;
    }

    var lines = args.haystack.split('\n');

    var otherwiseLineIndex = -1;
    lines.forEach(function (line, i) {
        if (line.indexOf(args.needle) !== -1) {
            otherwiseLineIndex = i;
        }
    });

    var spaces = 0;
    while (lines[otherwiseLineIndex].charAt(spaces) === ' ') {
        spaces += 1;
    }

    var spaceStr = '';
    while ((spaces -= 1) >= 0) {
        spaceStr += ' ';
    }

    lines.splice(otherwiseLineIndex, 0, args.splicable.map(function (line) {
        return spaceStr + line;
    }).join('\n'));

    return lines.join('\n');
}

// _.classify uses _.titleize which lowercase the string,
// so if the user chooses a proper ClassName it will not rename properly
Generator.prototype.classify = function(string) {
    string = string.replace(/[\W_](\w)/g, function (match) {
        return ' ' + match[1].toUpperCase();
    }).replace(/\s/g, '');
    return string.charAt(0).toUpperCase() + string.slice(1);
}

Generator.prototype.rewriteJSONFile = function(filePath, rewriteFile, _this) {
    var jsonObj = _this.fs.readJSON(filePath);
    rewriteFile(jsonObj, _this);
    _this.fs.writeJSON(filePath, jsonObj, null, 4);
}

Generator.prototype.copyWebResource = function(source, dest, regex, type, _this, _opt, template) {

    _opt = _opt !== undefined ? _opt : {};
    if (_this.enableTranslation) {
        // uses template method instead of copy if template boolean is set as true
        template ? _this.template(source, dest, _this, _opt) : _this.copy(source, dest);
    } else {
        var body = stripContent(source, regex, _this, _opt);
        switch (type) {
        case 'html' :
            body = replacePlaceholders(body, _this);
            break;
        case 'js' :
            body = replaceTitle(body, _this, template);
            break;
        }
        _this.write(dest, body);
    }
}


Generator.prototype.replaceTitle = function(body, _this, template) {
    var re = /pageTitle[\s]*:[\s]*[\'|\"]([a-zA-Z0-9\.\-\_]+)[\'|\"]/g;
    var match;

    while ((match = re.exec(body)) !== null) {
        // match is now the next match, in array form and our key is at index 1, index 1 is replace target.
        var key = match[1], target = key;
        var jsonData = geti18nJson(key, _this);
        var keyValue = jsonData !== undefined ? deepFind(jsonData, key) : undefined;

        body = body.replace(target, keyValue !== undefined ? keyValue : _this.baseName);
    }

    return body;
}

Generator.prototype.replacePlaceholders = function(body, _this) {
    var re = /placeholder=[\'|\"]([\{]{2}[\'|\"]([a-zA-Z0-9\.\-\_]+)[\'|\"][\s][\|][\s](translate)[\}]{2})[\'|\"]/g;
    var match;

    while ((match = re.exec(body)) !== null) {
        // match is now the next match, in array form and our key is at index 2, index 1 is replace target.
        var key = match[2], target = match[1];
        var jsonData = geti18nJson(key, _this);
        var keyValue = jsonData !== undefined ? deepFind(jsonData, key, true) : undefined; // dirty fix to get placeholder as it is not in proper json format, name has a dot in it. Assuming that all placeholders are in similar format

        body = body.replace(target, keyValue !== undefined ? keyValue : '');
    }

    return body;
}


Generator.prototype.deepFind = function(obj, path, placeholder) {
    var paths = path.split('.'), current = obj, i;
    if (placeholder) {// dirty fix for placeholders, the json files needs to be corrected
        paths[paths.length - 2] = paths[paths.length - 2] + '.' + paths[paths.length - 1];
        paths.pop();
    }
    for (i = 0; i < paths.length; ++i) {
        if (current[paths[i]] === undefined) {
            return undefined;
        } else {
            current = current[paths[i]];
        }
    }
    return current;
}

Generator.prototype.wordwrap = function(text, width, seperator, keepLF) {
    var wrappedText = '';
    var rows = text.split('\n');
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (keepLF === true && i !== 0) {
            wrappedText = wrappedText + '\\n';
        }
        wrappedText = wrappedText + seperator + _.padEnd(row,width) + seperator;
    }
    return wrappedText;
}
