"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cursor = (function () {
    function Cursor(config) {
        this._limit = 1;
        this._skip = 0;
        this._limit = config.limit;
        this._skip = config.skip;
    }
    Cursor.parse = function (cursor) {
        var limit = 0;
        var skip = 0;
        if (typeof cursor === 'string') {
            var cursorParts = Buffer.from(cursor, 'base64').toString('ascii').split(':');
            if (!isNaN(cursorParts[0])) {
                limit = Number(cursorParts[0]);
            }
            if (!isNaN(cursorParts[1])) {
                skip = Number(cursorParts[1]);
            }
        }
        else if (cursor) {
            limit = cursor.limit;
            skip = cursor.skip;
        }
        return new Cursor({ limit: limit, skip: skip });
    };
    Object.defineProperty(Cursor.prototype, "limit", {
        get: function () { return this._limit; },
        set: function (limit) {
            this._limit = limit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cursor.prototype, "skip", {
        get: function () { return this._skip; },
        set: function (skip) {
            this._skip = skip;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cursor.prototype, "previousSkip", {
        get: function () {
            var skip = this._skip - this.limit;
            if (skip < 1) {
                return 0;
            }
            return skip;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cursor.prototype, "nextSkip", {
        get: function () {
            return this._skip + this.limit;
        },
        enumerable: true,
        configurable: true
    });
    Cursor.prototype.previousCursor = function () {
        var limit = this.limit;
        var skip = this.previousSkip;
        return new Cursor({ limit: limit, skip: skip });
    };
    Cursor.prototype.nextCursor = function () {
        var limit = this.limit;
        var skip = this.nextSkip;
        return new Cursor({ limit: limit, skip: skip });
    };
    Cursor.prototype.opaque = function () {
        return Buffer.from(this.toString()).toString('base64');
    };
    Cursor.prototype.toString = function () {
        return this._limit + ":" + this._skip;
    };
    return Cursor;
}());
exports.Cursor = Cursor;
//# sourceMappingURL=index.js.map