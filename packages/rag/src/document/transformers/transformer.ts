import type { Document } from '../types';

export interface Transformer {
  transformDocuments(documents: Document[]): Document[];
}
