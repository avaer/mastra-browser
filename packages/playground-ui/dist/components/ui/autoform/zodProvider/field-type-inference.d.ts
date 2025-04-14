import { FieldConfig } from '@autoform/core';
import { z } from 'zod';

export declare function inferFieldType(schema: z.ZodTypeAny, fieldConfig?: FieldConfig): string;
