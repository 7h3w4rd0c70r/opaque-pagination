"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cursor = (function () {
    function Cursor(config) {
        this._limit = 1;
        this._skip = 0;
        this._sort = {};
        if (typeof config.limit === 'number') {
            this._limit = config.limit;
        }
        if (typeof config.skip) {
            this._skip = config.skip;
        }
        if (config.sort !== null && typeof config.sort === 'object') {
            this._sort = config.sort;
        }
    }
    Cursor.parse = function (cursor) {
        if (typeof cursor === 'string') {
            var limit = 0;
            var skip = 0;
            var sort = {};
            var cursorParts = Buffer.from(cursor, 'base64').toString('ascii').split(':');
            if (!isNaN(cursorParts[0])) {
                limit = Number(cursorParts[0]);
            }
            if (!isNaN(cursorParts[1])) {
                skip = Number(cursorParts[1]);
            }
            if (typeof cursorParts[2] === 'string' && cursorParts[2].length > 0) {
                try {
                    sort = JSON.parse(Buffer.from(cursorParts[2], 'hex').toString('utf8'));
                }
                catch (err) {
                    sort = {};
                }
            }
            return new Cursor({ limit: limit, skip: skip, sort: sort });
        }
        return new Cursor(cursor);
    };
    Cursor.prototype.limit = function (limit) {
        if (typeof limit === 'number') {
            this._limit = limit;
            return this;
        }
        return this._limit;
    };
    Cursor.prototype.skip = function (skip) {
        if (typeof skip === 'number') {
            this._skip = skip;
            return this;
        }
        return this._skip;
    };
    Cursor.prototype.sort = function (sort) {
        if (sort !== null && typeof sort === 'object') {
            this._sort = Object.assign({}, sort);
            return this;
        }
        return Object.assign({}, this._sort);
    };
    Cursor.prototype.withSort = function (sortKey, sortDirection) {
        this._sort[sortKey] = sortDirection;
        return this;
    };
    Cursor.prototype.withoutSort = function (sortKey) {
        delete this._sort[sortKey];
        return this;
    };
    Cursor.prototype.previous = function () {
        var sort = this.sort();
        var limit = this.limit();
        var skip = this.skip() - limit;
        if (skip < 1) {
            skip = 0;
        }
        return new Cursor({ limit: limit, skip: skip, sort: sort });
    };
    Cursor.prototype.next = function () {
        var sort = this.sort();
        var limit = this.limit();
        var skip = this.skip() + limit;
        return new Cursor({ limit: limit, skip: skip, sort: sort });
    };
    Cursor.prototype.opaque = function () {
        return Buffer.from(this.toString()).toString('base64');
    };
    Cursor.prototype.toString = function () {
        return this.limit() + ":" + this.skip() + ":" + Buffer.from(JSON.stringify(this.sort()), 'utf8').toString('hex');
    };
    return Cursor;
}());
exports.Cursor = Cursor;
//# sourceMappingURL=index.js.map