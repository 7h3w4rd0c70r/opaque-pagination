
export interface CursorConfig {
    limit?: number
    skip?: number
}

declare module 'opaque-pagination' {
    export class Cursor {
        public static parse(cursor: string|CursorConfig): Cursor

        constructor(config: CursorConfig)

        public limit(): number
        public limit(limit: number): Cursor

        public skip(): number
        public skip(skip: number): Cursor

        public previous(): Cursor
        public next(): Cursor

        public opaque(): string
        public toString(): string
    }
}
