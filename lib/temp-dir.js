'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');

const uuid = require('node-uuid');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const object = require('mout/object');


module.exports = (function() {

    function TempDir (location, defaults) {

        const tmpDir = os.tmpdir ? os.tmpdir() : os.tmpDir();

        this.tmpLocation = path.join(tmpDir, location);

        const tmpLocationUUID = path.join(this.tmpLocation, uuid.v4().slice(0, 8));

        this.path = path.join(tmpLocationUUID, uuid.v4());
        this.defaults = defaults;
    }

    TempDir.prototype.create = function (files) {

        var that = this;

        if (files) {
            object.forOwn(files, function (contents, filepath) {
                if (typeof contents === 'object') {
                    contents = JSON.stringify(contents, null, ' ') + '\n';
                }

                var fullPath = path.join(that.path, filepath);
                mkdirp.sync(path.dirname(fullPath));

                fs.writeFileSync(fullPath, contents);
            });
        }

        return this;
    };

    TempDir.prototype.prepare = function (files) {
        rimraf.sync(this.path);
        mkdirp.sync(this.path);
        this.create(files);

        return this;
    };

    TempDir.prototype.clean = function () {
        rimraf.sync(this.tmpLocation);
    };

    return TempDir;

})();