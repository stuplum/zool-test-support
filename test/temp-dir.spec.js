'use strict';

const fs = require('fs');
const rimraf = require('rimraf');

describe('temp-dir', function () {

    let TempDir;

    let mockGuid;
    let mockOsTmpDir;

    let targetDirectory;

    before(function () {

        mockGuid = 'some-long-guid';
        mockOsTmpDir = __dirname;

        targetDirectory = 'target';

        TempDir = Sandbox.require('../lib/temp-dir', {
            requires: {
                'os': { tmpdir: sinon.stub().returns(mockOsTmpDir) },
                'node-uuid': { v4: sinon.stub().returns(mockGuid) }
            }
        });

    });

    after(function () {
        rimraf.sync(`${mockOsTmpDir}/${targetDirectory}`);
    });

    it('should expose location of files', function () {

        // Given:
            const tempDir = new TempDir(targetDirectory);

        // When:
            tempDir.create({ 'some.txt': 'some text' });

        // Then:
            expect(tempDir.path).to.equal(`${mockOsTmpDir}/${targetDirectory}/some-lon/some-long-guid`);

    });

    it('should create a text file', function () {

        // Given:
            const tempDir = new TempDir(targetDirectory);

        // When:
            tempDir.create({ 'some.txt': 'some text' });

        // Then:
            const filePath = `${mockOsTmpDir}/${targetDirectory}/some-lon/some-long-guid/some.txt`;
            expect(fs.readFileSync(filePath, 'utf-8')).to.equal('some text');

    });

    it('should create a nexted text file', function () {

        // Given:
            const tempDir = new TempDir(targetDirectory);

        // When:
            tempDir.create({ 'child/child.txt': 'some text' });

        // Then:
            const filePath = `${mockOsTmpDir}/${targetDirectory}/some-lon/some-long-guid/child/child.txt`;
            expect(fs.readFileSync(filePath, 'utf-8')).to.equal('some text');

    });

    it('should create a json file', function () {

        // Given:
            const tempDir = new TempDir(targetDirectory);

        // When:
            tempDir.create({ 'some.json': { some: 'json' } });

        // Then:
            const filePath = `${mockOsTmpDir}/${targetDirectory}/some-lon/some-long-guid/some.json`;
            const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            expect(json.some).to.be.equal('json');

    });

    it('should create multiple files', function () {

        // Given:
            const tempDir = new TempDir(targetDirectory);

        // When:
            tempDir.create({
                'multi-1.txt': 'some text',
                'multi-2.txt': 'more text'
            });

        // Then:
            const filePath_1 = `${mockOsTmpDir}/${targetDirectory}/some-lon/some-long-guid/multi-1.txt`;
            expect(fs.existsSync(filePath_1)).to.be.true;

        // And:
            const filePath_2 = `${mockOsTmpDir}/${targetDirectory}/some-lon/some-long-guid/multi-2.txt`;
            expect(fs.existsSync(filePath_2)).to.be.true;

    });

    it('should remove files', function () {

        // Given:
            const tempDir = new TempDir(targetDirectory);

        // When:
            tempDir.create({ 'remove-me.txt': 'some text' });

        // And:
            tempDir.cleanUp();

        // Then:
            const filePath = `${mockOsTmpDir}/${targetDirectory}/some-lon/some-long-guid/some.json`;
            expect(fs.existsSync(filePath)).to.be.false;

    });

    it('should remove the the temporary directory', function () {

        // Given:
            const tempDir = new TempDir(targetDirectory);

        // When:
            tempDir.create({ 'remove-me.txt': 'some text' });

        // And:
            tempDir.cleanUp();

        // Then:
            const filePath = `${mockOsTmpDir}/${targetDirectory}`;
            expect(fs.existsSync(filePath)).to.be.false;

    });

});
