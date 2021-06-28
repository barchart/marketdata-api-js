const fs = require('fs');

module.exports = (() => {
    'use strict';

    class ReplayFileReader {
        constructor(path) {
            this._position = 0;

            this._data = fs.readFileSync(path, 'UTF-8').split(/\r?\n/);
        }

        next() {
            return this.scroll(this._position + 1);
        }

        scroll(to) {
            const lines = [ ];

            for (; this._position < Math.min(to, this._data.length); this._position++) {
                lines.push(this._data[this._position]);
            }

            return { lines: lines, position: this._position, eof: this._position === this._data.length };
        }

        reset() {
            this._position = 0;

            return { position: this._position, eof: this._data.length === this._position };
        }

        static for(path) {
            if (!ReplayFileReader.checkFile(path)) {
                throw new Error(`File doesn't exist [ ${path} ]`);
            }

            return new ReplayFileReader(path);
        }

        static checkFile(path) {
            return fs.existsSync(path);
        }
    }

    return ReplayFileReader;
})();