import type {
  BasicOperator,
  NumericOperator,
  ArrayOperator,
  ElementOperator,
  LogicalOperator,
  RegexOperator,
  VectorFilter,
} from '../filter';

export type OperatorType =
  | BasicOperator
  | NumericOperator
  | ArrayOperator
  | ElementOperator
  | LogicalOperator
  | '$contains'
  | Exclude<RegexOperator, '$options'>;

type FilterOperator = {
  sql: string;
  needsValue: boolean;
  transformValue?: (value: any) => any;
};

type OperatorFn = (key: string, value?: any) => FilterOperator;

// Helper functions to create operators
const createBasicOperator = (symbol: string) => {
  return (key: string): FilterOperator => ({
    sql: `CASE 
      WHEN $1 IS NULL THEN metadata->>'${handleKey(key)}' IS ${symbol === '=' ? '' : 'NOT'} NULL
      ELSE metadata->>'${handleKey(key)}' ${symbol} $1
    END`,
    needsValue: true,
  });
};
const createNumericOperator = (symbol: string) => {
  return (key: string): FilterOperator => ({
    sql: `CAST(metadata->>'${handleKey(key)}' AS NUMERIC) ${symbol} $1`,
    needsValue: true,
  });
};

const validateJsonArray = (key: string) =>
  `jsonb_typeof(metadata->'${handleKey(key)}') = 'array'`;

// Define all filter operators
export const FILTER_OPERATORS: Record<string, OperatorFn> = {
  $eq: createBasicOperator('='),
  $ne: createBasicOperator('!='),
  $gt: createNumericOperator('>'),
  $gte: createNumericOperator('>='),
  $lt: createNumericOperator('<'),
  $lte: createNumericOperator('<='),

  // Array Operators
  $in: (key: string, value: any) => ({
    sql: `metadata->>'${handleKey(key)}' IN (${value.map((_: any, i: number) => `$${i + 1}`).join(',')})`,
    needsValue: true,
  }),

  $nin: (key: string, value: any) => ({
    sql: `metadata->>'${handleKey(key)}' NOT IN (${value.map((_: any, i: number) => `$${i + 1}`).join(',')})`,
    needsValue: true,
  }),
  $all: (key: string) => ({
    sql: `metadata->>'${handleKey(key)}' = $1`,
    needsValue: true,
    transformValue: (value: any) => {
      const arrayValue = Array.isArray(value) ? value : [value];
      if (arrayValue.length === 0) {
        return {
          sql: '1 = 0',
          values: [],
        };
      }

      return {
        sql: `(
          CASE
            WHEN ${validateJsonArray(key)} THEN
                NOT EXISTS (
                    SELECT value 
                    FROM jsonb_array_elements_text($1::jsonb) 
                    WHERE value::text NOT IN (
                    SELECT value::text 
                    FROM jsonb_array_elements_text(metadata->'${handleKey(key)}')
                )
            )
            ELSE FALSE
          END
        )`,
        values: [JSON.stringify(arrayValue)],
      };
    },
  }),
  $elemMatch: (key: string) => ({
    sql: `metadata->>'${handleKey(key)}' = $1`,
    needsValue: true,
    transformValue: (value: any) => {
      if (typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('$elemMatch requires an object with conditions');
      }

      // For nested object conditions
      const conditions = Object.entries(value).map(([field, fieldValue]) => {
        if (field.startsWith('$')) {
          // Direct operators on array elements ($in, $gt, etc)
          const { sql, values } = buildCondition('elem.value', { [field]: fieldValue }, '');
          // Replace the metadata path with elem.value
          const pattern = /metadata->>'[^']*'/g;
          const elemSql = sql.replace(pattern, 'elem.value');
          return { sql: elemSql, values };
        } else if (typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
          // Nested field with operators (count: { $gt: 20 })
          const { sql, values } = buildCondition(field, fieldValue, '');
          // Replace the field path with elem.value path
          const pattern = /metadata->>'[^']*'/g;
          const elemSql = sql.replace(pattern, `elem.value->>'${field}'`);
          return { sql: elemSql, values };
        } else {
          // Simple field equality (warehouse: 'A')
          return {
            sql: `elem.value->>'${field}' = $1`,
            values: [fieldValue],
          };
        }
      });

      return {
        sql: `(
          CASE
            WHEN ${validateJsonArray(key)} THEN
              EXISTS (
                SELECT 1 
                FROM jsonb_array_elements(metadata->'${handleKey(key)}') as elem
                WHERE ${conditions.map(c => c.sql).join(' AND ')}
              )
            ELSE FALSE
          END
        )`,
        values: conditions.flatMap(c => c.values),
      };
    },
  }),

  // Element Operators
  $exists: (key: string) => ({
    sql: `metadata ? '${handleKey(key)}'`,
    needsValue: false,
  }),

  // Logical Operators
  $and: (key: string) => ({
    sql: `(${key})`,
    needsValue: false,
  }),
  $or: (key: string) => ({
    sql: `(${key})`,
    needsValue: false,
  }),
  $not: key => ({ sql: `NOT (${key})`, needsValue: false }),
  $nor: (key: string) => ({
    sql: `NOT (${key})`,
    needsValue: false,
  }),
  $size: (key: string) => ({
    sql: `(
    CASE
      WHEN jsonb_typeof(metadata->'${handleKey(key)}') = 'array' THEN 
        jsonb_array_length(metadata->'${handleKey(key)}') = $1
      ELSE FALSE
    END
  )`,
    needsValue: true,
  }),
  $contains: (key: string) => ({
    sql: `metadata->>'${handleKey(key)}' = $1`,
    needsValue: true,
    transformValue: (value: any) => {
      // Array containment
      if (Array.isArray(value)) {
        return {
          sql: `(
            SELECT ${validateJsonArray(key)}
            AND EXISTS (
              SELECT 1 
              FROM jsonb_array_elements(metadata->'${handleKey(key)}') as m
              WHERE m.value IN (SELECT value FROM jsonb_array_elements($1::jsonb))
            )
          )`,
          values: [JSON.stringify(value)],
        };
      }

      // Nested object traversal
      if (value && typeof value === 'object') {
        const paths: string[] = [];
        const values: any[] = [];

        function traverse(obj: any, path: string[] = []) {
          for (const [k, v] of Object.entries(obj)) {
            const currentPath = [...path, k];
            if (v && typeof v === 'object' && !Array.isArray(v)) {
              traverse(v, currentPath);
            } else {
              paths.push(currentPath.join('->'));
              values.push(v);
            }
          }
        }

        traverse(value);
        return {
          sql: `(${paths.map((path, i) => `metadata->'${handleKey(key)}'->>'${path}' = $${i + 1}`).join(' AND ')})`,
          values,
        };
      }

      return value;
    },
  }),
};

export interface FilterResult {
  sql: string;
  values: any[];
}

export const handleKey = (key: string) => {
  return key.replace(/\./g, '->>');
};

export function buildFilterQuery(filter: VectorFilter): FilterResult {
  if (!filter) {
    return { sql: '', values: [] };
  }

  const values: any[] = [];
  const conditions = Object.entries(filter)
    .map(([key, value]) => {
      const condition = buildCondition(key, value, '');
      values.push(...condition.values);
      return condition.sql;
    })
    .join(' AND ');

  return {
    sql: conditions ? `WHERE ${conditions}` : '',
    values,
  };
}

function buildCondition(key: string, value: any, parentPath: string): FilterResult {
  // Handle logical operators ($and/$or)
  if (['$and', '$or', '$not', '$nor'].includes(key)) {
    return handleLogicalOperator(key as '$and' | '$or' | '$not' | '$nor', value, parentPath);
  }

  // If condition is not a FilterCondition object, assume it's an equality check
  if (!value || typeof value !== 'object') {
    return {
      sql: `metadata->>'${key}' = $1`,
      values: [value],
    };
  }

  // Handle operator conditions
  return handleOperator(key, value);
}

function handleLogicalOperator(
  key: '$and' | '$or' | '$not' | '$nor',
  value: VectorFilter[] | VectorFilter,
  parentPath: string,
): FilterResult {
  // Handle empty conditions
  if (!value || value.length === 0) {
    switch (key) {
      case '$and':
      case '$nor':
        return { sql: 'true', values: [] };
      case '$or':
        return { sql: 'false', values: [] };
      case '$not':
        throw new Error('$not operator cannot be empty');
      default:
        return { sql: 'true', values: [] };
    }
  }

  if (key === '$not') {
    // For top-level $not
    const entries = Object.entries(value);
    const conditions = entries.map(([fieldKey, fieldValue]) => buildCondition(fieldKey, fieldValue, key));
    return {
      sql: `NOT (${conditions.map(c => c.sql).join(' AND ')})`,
      values: conditions.flatMap(c => c.values),
    };
  }

  const values: any[] = [];
  const joinOperator = key === '$or' || key === '$nor' ? 'OR' : 'AND';
  const conditions = Array.isArray(value)
    ? value.map(f => {
        const entries = Object.entries(f);
        return entries.map(([k, v]) => buildCondition(k, v, key));
      })
    : [buildCondition(key, value, parentPath)];

  const joined = conditions
    .flat()
    .map(c => {
      values.push(...c.values);
      return c.sql;
    })
    .join(` ${joinOperator} `);

  return {
    sql: key === '$nor' ? `NOT (${joined})` : `(${joined})`,
    values,
  };
}

function handleOperator(key: string, value: any): FilterResult {
  if (typeof value === 'object' && !Array.isArray(value)) {
    const entries = Object.entries(value);
    const results = entries.map(([operator, operatorValue]) =>
      operator === '$not'
        ? {
            sql: `NOT (${Object.entries(operatorValue as Record<string, any>)
              .map(([op, val]) => processOperator(key, op, val).sql)
              .join(' AND ')})`,
            values: Object.entries(operatorValue as Record<string, any>).flatMap(
              ([op, val]) => processOperator(key, op, val).values,
            ),
          }
        : processOperator(key, operator, operatorValue),
    );

    return {
      sql: `(${results.map(r => r.sql).join(' AND ')})`,
      values: results.flatMap(r => r.values),
    };
  }

  // Handle single operator
  const [[operator, operatorValue] = []] = Object.entries(value);
  return processOperator(key, operator as string, operatorValue);
}

const processOperator = (key: string, operator: string, operatorValue: any): FilterResult => {
  if (!operator.startsWith('$') || !FILTER_OPERATORS[operator]) {
    throw new Error(`Invalid operator: ${operator}`);
  }
  const operatorFn = FILTER_OPERATORS[operator]!;
  const operatorResult = operatorFn(key, operatorValue);

  if (!operatorResult.needsValue) {
    return { sql: operatorResult.sql, values: [] };
  }

  const transformed = operatorResult.transformValue ? operatorResult.transformValue(operatorValue) : operatorValue;

  if (transformed && typeof transformed === 'object' && 'sql' in transformed) {
    return transformed;
  }

  return {
    sql: operatorResult.sql,
    values: Array.isArray(transformed) ? transformed : [transformed],
  };
};
