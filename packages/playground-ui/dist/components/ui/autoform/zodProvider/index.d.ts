import { ParsedSchema } from '@autoform/core';
import { ZodObjectOrWrapped, ZodProvider } from '@autoform/zod';

export declare function parseSchema(schema: ZodObjectOrWrapped): ParsedSchema;
export declare class CustomZodProvider<T extends ZodObjectOrWrapped> extends ZodProvider<T> {
    private _schema;
    constructor(schema: T);
    parseSchema(): ParsedSchema;
}
