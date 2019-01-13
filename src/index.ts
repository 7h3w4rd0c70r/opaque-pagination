
import { CursorConfig } from '../index.d'

export class Cursor {
    public static parse(cursor: string|CursorConfig): Cursor {
        let limit: number = 0
        let skip: number = 0

        if (typeof cursor === 'string') {
            const cursorParts = Buffer.from(cursor, 'base64').toString('ascii').split(':')
            if (!isNaN(cursorParts[0] as any)) {
                limit = Number(cursorParts[0])
            }
            if (!isNaN(cursorParts[1] as any)) {
                skip = Number(cursorParts[1])
            }
        } else if (cursor) {
            limit = cursor.limit
            skip = cursor.skip
        }

        return new Cursor({ limit, skip })
    }

    constructor(config: CursorConfig) {
        this._limit = config.limit
        this._skip = config.skip
    }

    private _limit: number = 1
    public limit(): number
    public limit(limit: number): Cursor
    public limit(limit?: number): Cursor|number {
        if (typeof limit === 'number') {
            this._limit = limit
            return this
        }
        return this._limit
    }

    private _skip: number = 0
    public skip(): number
    public skip(skip: number): Cursor
    public skip(skip?: number): Cursor|number {
        if (typeof skip === 'number') {
            this._skip = skip
            return this
        }
        return this._skip
    }

    public previous(): Cursor {
        const limit = this.limit()
        let skip = this.skip() - this.limit()
        if (skip < 1) {
            skip = 0
        }
        return new Cursor({ limit, skip })
    }

    public next(): Cursor {
        const limit = this.limit()
        const skip = this.skip() + this.limit()
        return new Cursor({ limit, skip })
    }

    public opaque(): string {
        return Buffer.from(this.toString()).toString('base64')
    }

    public toString(): string {
        return `${this.limit()}:${this.skip()}`
    }
}
