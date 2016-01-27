'use strict';

const os = require('os');
const join = require('path').join;
const dirname = require('path').dirname;
const writeFile = require('fs').writeFileSync;

const uuid = require('node-uuid');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const object = require('mout/object');

class Temp {

    constructor(location) {

        const tmpDir = os.tmpdir ? os.tmpdir() : os.tmpDir();

        this.tmpLocation = join(tmpDir, location);

        const tmpLocationUUID = join(this.tmpLocation, uuid.v4().slice(0, 8));

        this.path = join(tmpLocationUUID, uuid.v4());

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
        rimraf.sync(this.tmpLocation);
    }
}

module.exports = Temp;
