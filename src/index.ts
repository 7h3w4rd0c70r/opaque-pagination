
import { CursorConfig } from '../index.d'

export class Cursor {
    public static parse(cursor: string|CursorConfig): Cursor {        
        if (typeof cursor === 'string') {
            let limit: number = 0
            let skip: number = 0
            let sort: { [key: string]: 'asc'|'desc' } = {}

            const cursorParts = Buffer.from(cursor, 'base64').toString('ascii').split(':')
            if (!isNaN(cursorParts[0] as any)) {
                limit = Number(cursorParts[0])
            }
            if (!isNaN(cursorParts[1] as any)) {
                skip = Number(cursorParts[1])
            }
            if (typeof cursorParts[2] === 'string' && cursorParts[2].length > 0) {
                try {
                    sort = JSON.parse(Buffer.from(cursorParts[2], 'hex').toString('utf8'))
                } catch (err) {
                    sort = {}
                }
            }

            return new Cursor({ limit, skip, sort })
        }

        return new Cursor(cursor)
    }

    constructor(config: CursorConfig) {
        if (typeof config.limit === 'number') {
            this._limit = config.limit
        }
        if (typeof config.skip) {
            this._skip = config.skip
        }
        if (config.sort !== null && typeof config.sort === 'object') {
            this._sort = config.sort
        }
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

    private _sort: { [key: string]: 'asc'|'desc' } = {}
    public sort(): { [key: string]: 'asc'|'desc' }
    public sort(sort: { [key: string]: 'asc'|'desc' }): Cursor
    public sort(sort?: { [key: string]: 'asc'|'desc' }): Cursor|{ [key: string]: 'asc'|'desc' } {
        if (sort !== null && typeof sort === 'object') {
            this._sort = Object.assign({}, sort)
            return this
        }
        return Object.assign({}, this._sort)
    }

    public withSort(sortKey: string, sortDirection: 'asc'|'desc'): Cursor {
        this._sort[sortKey] = sortDirection
        return this
    }

    public withoutSort(sortKey: string): Cursor {
        delete this._sort[sortKey]
        return this
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
        return `${this.limit()}:${this.skip()}:${Buffer.from(JSON.stringify(this.sort()), 'utf8').toString('hex')}`
    }
}
