
export interface CursorConfig {
    limit?: number
    skip?: number
}

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

    private _limit: number = 1
    private _skip: number = 0

    constructor(config: CursorConfig) {
        this._limit = config.limit
        this._skip = config.skip
    }

    public get limit(): number { return this._limit }
    public set limit(limit: number) {
        this._limit = limit
    }

    public get skip(): number { return this._skip }
    public set skip(skip: number) {
        this._skip = skip
    }

    public get previousSkip(): number {
        let skip = this._skip - this.limit
        if (skip < 1) {
            return 0
        }
        return skip
    }

    public get nextSkip(): number {
        return this._skip + this.limit
    }

    previousCursor(): Cursor {
        const limit = this.limit
        const skip = this.previousSkip
        return new Cursor({ limit, skip })
    }

    nextCursor(): Cursor {
        const limit = this.limit
        const skip = this.nextSkip
        return new Cursor({ limit, skip })
    }

    opaque(): string {
        return Buffer.from(this.toString()).toString('base64')
    }

    toString(): string {
        return `${this._limit}:${this._skip}`
    }
}
