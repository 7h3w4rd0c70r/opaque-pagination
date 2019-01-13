
export interface CursorConfig {

}

declare module 'opaque-pagination' {
    export class Cursor {
        constructor(config: CursorConfig)

        public limit(): number
        public limit(limit: number): Cursor

        public skip(): number
        public skip(skip: number): Cursor
    }
}
