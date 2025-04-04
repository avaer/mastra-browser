import { BaseFilterTranslator } from '../filter';
import type { FieldCondition, VectorFilter, OperatorSupport } from '../filter';

/**
 * Translates MongoDB-style filters to PGlite compatible filters for use with pgvector.
 */
export class PGliteFilterTranslator extends BaseFilterTranslator {
  protected override getSupportedOperators(): OperatorSupport {
    return {
      ...BaseFilterTranslator.DEFAULT_OPERATORS,
      regex: [],
      custom: ['$contains', '$size'],
    };
  }

  translate(filter?: VectorFilter): VectorFilter {
    if (this.isEmpty(filter)) {
      return filter;
    }
    this.validateFilter(filter);
    return this.translateNode(filter);
  }

  private translateNode(node: VectorFilter | FieldCondition, currentPath: string = ''): any {
    if (this.isRegex(node)) {
      throw new Error('Direct regex pattern format is not supported in PGlite');
    }
    // Helper to wrap result with path if needed
    const withPath = (result: any) => (currentPath ? { [currentPath]: result } : result);

    // Handle primitives
    if (this.isPrimitive(node)) {
      return withPath({ $eq: this.normalizeComparisonValue(node) });
    }

    // Handle arrays
    if (Array.isArray(node)) {
      return withPath({ $in: this.normalizeArrayValues(node) });
    }

    const entries = Object.entries(node as Record<string, any>);
    const result: Record<string, any> = {};

    // Process remaining entries
    for (const [key, value] of entries) {
      const newPath = currentPath ? `${currentPath}.${key}` : key;

      if (this.isLogicalOperator(key)) {
        result[key] = Array.isArray(value)
          ? value.map((filter: VectorFilter) => this.translateNode(filter))
          : this.translateNode(value);
      } else if (this.isOperator(key)) {
        if (this.isArrayOperator(key) && !Array.isArray(value) && key !== '$elemMatch') {
          result[key] = [value];
        } else if (this.isBasicOperator(key) && Array.isArray(value)) {
          result[key] = JSON.stringify(value);
        } else {
          result[key] = value;
        }
      } else if (typeof value === 'object' && value !== null) {
        // Handle nested objects
        const hasOperators = Object.keys(value).some(k => this.isOperator(k));
        if (hasOperators) {
          result[newPath] = this.translateNode(value);
        } else {
          Object.assign(result, this.translateNode(value, newPath));
        }
      } else {
        result[newPath] = this.translateNode(value);
      }
    }

    return result;
  }
}
