import { BaseFilterTranslator } from '../filter';
import type { VectorFilter, OperatorSupport, FieldCondition } from '../filter';

/**
 * Filter translator for in-memory vector store
 * Maintains MongoDB-style query language that evaluates directly on objects
 */
export class MemoryFilterTranslator extends BaseFilterTranslator {
  protected override getSupportedOperators(): OperatorSupport {
    return {
      ...BaseFilterTranslator.DEFAULT_OPERATORS,
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
      throw new Error('Direct regex pattern format is not supported');
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

    // Process object entries
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

/**
 * Evaluates a filter condition against a metadata object
 * Used to filter vectors by their metadata
 */
export function evaluateFilter(metadata: Record<string, any>, filter?: VectorFilter): boolean {
  if (!filter) return true;
  
  return Object.entries(filter).every(([key, condition]) => {
    // Handle logical operators
    if (key === '$and') {
      return Array.isArray(condition) && condition.every(subFilter => evaluateFilter(metadata, subFilter));
    }
    
    if (key === '$or') {
      return Array.isArray(condition) && condition.some(subFilter => evaluateFilter(metadata, subFilter));
    }
    
    if (key === '$not') {
      return !evaluateFilter(metadata, condition as VectorFilter);
    }
    
    if (key === '$nor') {
      return Array.isArray(condition) && !condition.some(subFilter => evaluateFilter(metadata, subFilter));
    }
    
    // Handle field conditions
    if (!key.startsWith('$')) {
      const value = getNestedValue(metadata, key);
      return evaluateCondition(value, condition);
    }
    
    return false;
  });
}

/**
 * Evaluates a specific condition on a value
 */
function evaluateCondition(value: any, condition: any): boolean {
  if (condition === null) {
    return value === null;
  }
  
  if (typeof condition !== 'object' || condition === null) {
    return value === condition;
  }
  
  return Object.entries(condition).every(([operator, operand]) => {
    switch (operator) {
      case '$eq':
        return value === operand;
      case '$ne':
        return value !== operand;
      case '$gt':
        return value > operand;
      case '$gte':
        return value >= operand;
      case '$lt':
        return value < operand;
      case '$lte':
        return value <= operand;
      case '$in':
        return Array.isArray(operand) && operand.includes(value);
      case '$nin':
        return Array.isArray(operand) && !operand.includes(value);
      case '$exists':
        return operand ? value !== undefined : value === undefined;
      case '$all':
        return Array.isArray(value) && 
               Array.isArray(operand) && 
               operand.every(item => value.includes(item));
      case '$elemMatch':
        return Array.isArray(value) && 
               value.some(item => typeof item === 'object' && 
                                evaluateFilter(item, operand as VectorFilter));
      case '$size':
        return Array.isArray(value) && value.length === operand;
      case '$contains':
        if (Array.isArray(value) && Array.isArray(operand)) {
          return operand.some(item => value.includes(item));
        } else if (typeof value === 'object' && value !== null && typeof operand === 'object' && operand !== null) {
          return Object.entries(operand).every(([k, v]) => {
            const nestedValue = getNestedValue(value, k);
            return nestedValue === v;
          });
        }
        return false;
      default:
        return false;
    }
  });
}

/**
 * Gets a nested value from an object using dot notation
 */
function getNestedValue(obj: Record<string, any>, path: string): any {
  const keys = path.split('.');
  return keys.reduce((current, key) => {
    return current !== undefined && current !== null ? current[key] : undefined;
  }, obj);
}