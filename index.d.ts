
export interface CursorConfig {
    limit?: number
    skip?: number
    sort?: { [key: string]: 'asc'|'desc' }
}

declare module 'opaque-pagination' {
    export class Cursor {
        public static parse(cursor: string|CursorConfig): Cursor

        constructor(config: CursorConfig)

        public limit(): number
        public limit(limit: number): Cursor

        public skip(): number
        public skip(skip: number): Cursor

        public sort(): { [key: string]: 'asc'|'desc' }
        public sort(sort: { [key: string]: 'asc'|'desc' }): Cursor

        public withSort(sortKey: string, sortDirection: 'asc'|'desc'): Cursor
        public withoutSort(sortKey: string): Cursor

        public previous(): Cursor
        public next(): Cursor

        public opaque(): string
        public toString(): string
    }
}
