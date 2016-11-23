'use strict';

const os = require('os');
const join = require('path').join;
const dirname = require('path').dirname;
const writeFile = require('fs').writeFileSync;

const uuid = require('uuid');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const object = require('mout/object');

function getOsTmpDir() {
    return os.tmpdir ? os.tmpdir() : os.tmpDir();
}

function guidify(location) {
    return join(location, uuid.v4().slice(0, 8), uuid.v4())
}

class Temp {

    constructor(location) {
        this._location = location;
        this.baseDir   = getOsTmpDir();
        this.location  = guidify(this._location);
        this.path      = join(this.baseDir, this.location);
    }

    create(files) {

        if (files) {
            object.forOwn(files, (contents, filepath) => {

                if (typeof contents === 'object') {
                    contents = JSON.stringify(contents, null, ' ') + '\n';
                }

                const fullPath = join(this.path, filepath);
                mkdirp.sync(dirname(fullPath));

                writeFile(fullPath, contents);
            });
        }
    }

    cleanUp() {
        rimraf.sync(join(this.baseDir, this._location));
    }
}

module.exports = Temp;
