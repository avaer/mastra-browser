import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { MessagePrimitive, ActionBarPrimitive, BranchPickerPrimitive, ThreadPrimitive, ComposerPrimitive, useExternalStoreRuntime, AssistantRuntimeProvider } from '@assistant-ui/react';
import { CheckIcon, CopyIcon, ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ArrowUp, Copy, Search, RefreshCcwIcon, ChevronRight, SortAsc, SortDesc, Braces, Clock1, ChevronDown, XIcon, Check, LoaderCircle, ExternalLinkIcon, X, Footprints, CircleCheck, CircleX, Workflow, AlertCircleIcon, AlertCircle, CalendarIcon, PlusIcon, TrashIcon, Plus, Loader2 } from 'lucide-react';
import * as React from 'react';
import React__default, { forwardRef, memo, useState, useRef, useEffect, createContext, useContext, useMemo, useCallback, Suspense, Fragment as Fragment$1 } from 'react';
import { Slot } from '@radix-ui/react-slot';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { unstable_memoizeMarkdownComponents, useIsMarkdownCodeBlock, MarkdownTextPrimitive } from '@assistant-ui/react-markdown';
import '@assistant-ui/react-markdown/styles/dot.css';
import remarkGfm from 'remark-gfm';
import { makePrismAsyncSyntaxHighlighter } from '@assistant-ui/react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { MastraClient } from '@mastra/client-js';
import { format, formatDistanceToNow, isValid } from 'date-fns';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { toast } from 'sonner';
import { AnimatePresence } from 'motion/react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { jsonLanguage } from '@codemirror/lang-json';
import { tags } from '@lezer/highlight';
import { githubDarkInit } from '@uiw/codemirror-theme-github';
import CodeMirror from '@uiw/react-codemirror';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { processDataStream } from '@ai-sdk/ui-utils';
import Markdown from 'react-markdown';
import { useDebouncedCallback } from 'use-debounce';
import { MarkerType, Handle, Position, useNodesState, useEdgesState, ReactFlow, Controls, MiniMap, Background, BackgroundVariant, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Dagre from '@dagrejs/dagre';
import { Highlight, themes } from 'prism-react-renderer';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import jsonSchemaToZod from 'json-schema-to-zod';
import { parse } from 'superjson';
import z$1, { z } from 'zod';
import { AutoForm as AutoForm$1, buildZodFieldConfig } from '@autoform/react';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { DayPicker } from 'react-day-picker';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as SelectPrimitive from '@radix-ui/react-select';
import { v4 } from '@lukeed/uuid';
import { ZodProvider, getFieldConfigInZodStack, getDefaultValueInZodStack } from '@autoform/zod';
import { CodeBlock as CodeBlock$1 } from 'react-code-block';

import './index.css';function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f);}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}

const falsyToString = (value)=>typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
const cx = clsx;
const cva = (base, config)=>(props)=>{
        var _config_compoundVariants;
        if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
        const { variants, defaultVariants } = config;
        const getVariantClassNames = Object.keys(variants).map((variant)=>{
            const variantProp = props === null || props === void 0 ? void 0 : props[variant];
            const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
            if (variantProp === null) return null;
            const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
            return variants[variant][variantKey];
        });
        const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param)=>{
            let [key, value] = param;
            if (value === undefined) {
                return acc;
            }
            acc[key] = value;
            return acc;
        }, {});
        const getCompoundVariantClassNames = config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param)=>{
            let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
            return Object.entries(compoundVariantOptions).every((param)=>{
                let [key, value] = param;
                return Array.isArray(value) ? value.includes({
                    ...defaultVariants,
                    ...propsWithoutUndefined
                }[key]) : ({
                    ...defaultVariants,
                    ...propsWithoutUndefined
                })[key] === value;
            }) ? [
                ...acc,
                cvClass,
                cvClassName
            ] : acc;
        }, []);
        return cx(base, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
    };

const CLASS_PART_SEPARATOR = '-';
const createClassGroupUtils = config => {
  const classMap = createClassMap(config);
  const {
    conflictingClassGroups,
    conflictingClassGroupModifiers
  } = config;
  const getClassGroupId = className => {
    const classParts = className.split(CLASS_PART_SEPARATOR);
    // Classes like `-inset-1` produce an empty string as first classPart. We assume that classes for negative values are used correctly and remove it from classParts.
    if (classParts[0] === '' && classParts.length !== 1) {
      classParts.shift();
    }
    return getGroupRecursive(classParts, classMap) || getGroupIdForArbitraryProperty(className);
  };
  const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
    const conflicts = conflictingClassGroups[classGroupId] || [];
    if (hasPostfixModifier && conflictingClassGroupModifiers[classGroupId]) {
      return [...conflicts, ...conflictingClassGroupModifiers[classGroupId]];
    }
    return conflicts;
  };
  return {
    getClassGroupId,
    getConflictingClassGroupIds
  };
};
const getGroupRecursive = (classParts, classPartObject) => {
  if (classParts.length === 0) {
    return classPartObject.classGroupId;
  }
  const currentClassPart = classParts[0];
  const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
  const classGroupFromNextClassPart = nextClassPartObject ? getGroupRecursive(classParts.slice(1), nextClassPartObject) : undefined;
  if (classGroupFromNextClassPart) {
    return classGroupFromNextClassPart;
  }
  if (classPartObject.validators.length === 0) {
    return undefined;
  }
  const classRest = classParts.join(CLASS_PART_SEPARATOR);
  return classPartObject.validators.find(({
    validator
  }) => validator(classRest))?.classGroupId;
};
const arbitraryPropertyRegex = /^\[(.+)\]$/;
const getGroupIdForArbitraryProperty = className => {
  if (arbitraryPropertyRegex.test(className)) {
    const arbitraryPropertyClassName = arbitraryPropertyRegex.exec(className)[1];
    const property = arbitraryPropertyClassName?.substring(0, arbitraryPropertyClassName.indexOf(':'));
    if (property) {
      // I use two dots here because one dot is used as prefix for class groups in plugins
      return 'arbitrary..' + property;
    }
  }
};
/**
 * Exported for testing only
 */
const createClassMap = config => {
  const {
    theme,
    classGroups
  } = config;
  const classMap = {
    nextPart: new Map(),
    validators: []
  };
  for (const classGroupId in classGroups) {
    processClassesRecursively(classGroups[classGroupId], classMap, classGroupId, theme);
  }
  return classMap;
};
const processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
  classGroup.forEach(classDefinition => {
    if (typeof classDefinition === 'string') {
      const classPartObjectToEdit = classDefinition === '' ? classPartObject : getPart(classPartObject, classDefinition);
      classPartObjectToEdit.classGroupId = classGroupId;
      return;
    }
    if (typeof classDefinition === 'function') {
      if (isThemeGetter(classDefinition)) {
        processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
        return;
      }
      classPartObject.validators.push({
        validator: classDefinition,
        classGroupId
      });
      return;
    }
    Object.entries(classDefinition).forEach(([key, classGroup]) => {
      processClassesRecursively(classGroup, getPart(classPartObject, key), classGroupId, theme);
    });
  });
};
const getPart = (classPartObject, path) => {
  let currentClassPartObject = classPartObject;
  path.split(CLASS_PART_SEPARATOR).forEach(pathPart => {
    if (!currentClassPartObject.nextPart.has(pathPart)) {
      currentClassPartObject.nextPart.set(pathPart, {
        nextPart: new Map(),
        validators: []
      });
    }
    currentClassPartObject = currentClassPartObject.nextPart.get(pathPart);
  });
  return currentClassPartObject;
};
const isThemeGetter = func => func.isThemeGetter;

// LRU cache inspired from hashlru (https://github.com/dominictarr/hashlru/blob/v1.0.4/index.js) but object replaced with Map to improve performance
const createLruCache = maxCacheSize => {
  if (maxCacheSize < 1) {
    return {
      get: () => undefined,
      set: () => {}
    };
  }
  let cacheSize = 0;
  let cache = new Map();
  let previousCache = new Map();
  const update = (key, value) => {
    cache.set(key, value);
    cacheSize++;
    if (cacheSize > maxCacheSize) {
      cacheSize = 0;
      previousCache = cache;
      cache = new Map();
    }
  };
  return {
    get(key) {
      let value = cache.get(key);
      if (value !== undefined) {
        return value;
      }
      if ((value = previousCache.get(key)) !== undefined) {
        update(key, value);
        return value;
      }
    },
    set(key, value) {
      if (cache.has(key)) {
        cache.set(key, value);
      } else {
        update(key, value);
      }
    }
  };
};
const IMPORTANT_MODIFIER = '!';
const MODIFIER_SEPARATOR = ':';
const MODIFIER_SEPARATOR_LENGTH = MODIFIER_SEPARATOR.length;
const createParseClassName = config => {
  const {
    prefix,
    experimentalParseClassName
  } = config;
  /**
   * Parse class name into parts.
   *
   * Inspired by `splitAtTopLevelOnly` used in Tailwind CSS
   * @see https://github.com/tailwindlabs/tailwindcss/blob/v3.2.2/src/util/splitAtTopLevelOnly.js
   */
  let parseClassName = className => {
    const modifiers = [];
    let bracketDepth = 0;
    let parenDepth = 0;
    let modifierStart = 0;
    let postfixModifierPosition;
    for (let index = 0; index < className.length; index++) {
      let currentCharacter = className[index];
      if (bracketDepth === 0 && parenDepth === 0) {
        if (currentCharacter === MODIFIER_SEPARATOR) {
          modifiers.push(className.slice(modifierStart, index));
          modifierStart = index + MODIFIER_SEPARATOR_LENGTH;
          continue;
        }
        if (currentCharacter === '/') {
          postfixModifierPosition = index;
          continue;
        }
      }
      if (currentCharacter === '[') {
        bracketDepth++;
      } else if (currentCharacter === ']') {
        bracketDepth--;
      } else if (currentCharacter === '(') {
        parenDepth++;
      } else if (currentCharacter === ')') {
        parenDepth--;
      }
    }
    const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.substring(modifierStart);
    const baseClassName = stripImportantModifier(baseClassNameWithImportantModifier);
    const hasImportantModifier = baseClassName !== baseClassNameWithImportantModifier;
    const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : undefined;
    return {
      modifiers,
      hasImportantModifier,
      baseClassName,
      maybePostfixModifierPosition
    };
  };
  if (prefix) {
    const fullPrefix = prefix + MODIFIER_SEPARATOR;
    const parseClassNameOriginal = parseClassName;
    parseClassName = className => className.startsWith(fullPrefix) ? parseClassNameOriginal(className.substring(fullPrefix.length)) : {
      isExternal: true,
      modifiers: [],
      hasImportantModifier: false,
      baseClassName: className,
      maybePostfixModifierPosition: undefined
    };
  }
  if (experimentalParseClassName) {
    const parseClassNameOriginal = parseClassName;
    parseClassName = className => experimentalParseClassName({
      className,
      parseClassName: parseClassNameOriginal
    });
  }
  return parseClassName;
};
const stripImportantModifier = baseClassName => {
  if (baseClassName.endsWith(IMPORTANT_MODIFIER)) {
    return baseClassName.substring(0, baseClassName.length - 1);
  }
  /**
   * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
   * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
   */
  if (baseClassName.startsWith(IMPORTANT_MODIFIER)) {
    return baseClassName.substring(1);
  }
  return baseClassName;
};

/**
 * Sorts modifiers according to following schema:
 * - Predefined modifiers are sorted alphabetically
 * - When an arbitrary variant appears, it must be preserved which modifiers are before and after it
 */
const createSortModifiers = config => {
  const orderSensitiveModifiers = Object.fromEntries(config.orderSensitiveModifiers.map(modifier => [modifier, true]));
  const sortModifiers = modifiers => {
    if (modifiers.length <= 1) {
      return modifiers;
    }
    const sortedModifiers = [];
    let unsortedModifiers = [];
    modifiers.forEach(modifier => {
      const isPositionSensitive = modifier[0] === '[' || orderSensitiveModifiers[modifier];
      if (isPositionSensitive) {
        sortedModifiers.push(...unsortedModifiers.sort(), modifier);
        unsortedModifiers = [];
      } else {
        unsortedModifiers.push(modifier);
      }
    });
    sortedModifiers.push(...unsortedModifiers.sort());
    return sortedModifiers;
  };
  return sortModifiers;
};
const createConfigUtils = config => ({
  cache: createLruCache(config.cacheSize),
  parseClassName: createParseClassName(config),
  sortModifiers: createSortModifiers(config),
  ...createClassGroupUtils(config)
});
const SPLIT_CLASSES_REGEX = /\s+/;
const mergeClassList = (classList, configUtils) => {
  const {
    parseClassName,
    getClassGroupId,
    getConflictingClassGroupIds,
    sortModifiers
  } = configUtils;
  /**
   * Set of classGroupIds in following format:
   * `{importantModifier}{variantModifiers}{classGroupId}`
   * @example 'float'
   * @example 'hover:focus:bg-color'
   * @example 'md:!pr'
   */
  const classGroupsInConflict = [];
  const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
  let result = '';
  for (let index = classNames.length - 1; index >= 0; index -= 1) {
    const originalClassName = classNames[index];
    const {
      isExternal,
      modifiers,
      hasImportantModifier,
      baseClassName,
      maybePostfixModifierPosition
    } = parseClassName(originalClassName);
    if (isExternal) {
      result = originalClassName + (result.length > 0 ? ' ' + result : result);
      continue;
    }
    let hasPostfixModifier = !!maybePostfixModifierPosition;
    let classGroupId = getClassGroupId(hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
    if (!classGroupId) {
      if (!hasPostfixModifier) {
        // Not a Tailwind class
        result = originalClassName + (result.length > 0 ? ' ' + result : result);
        continue;
      }
      classGroupId = getClassGroupId(baseClassName);
      if (!classGroupId) {
        // Not a Tailwind class
        result = originalClassName + (result.length > 0 ? ' ' + result : result);
        continue;
      }
      hasPostfixModifier = false;
    }
    const variantModifier = sortModifiers(modifiers).join(':');
    const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
    const classId = modifierId + classGroupId;
    if (classGroupsInConflict.includes(classId)) {
      // Tailwind class omitted due to conflict
      continue;
    }
    classGroupsInConflict.push(classId);
    const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
    for (let i = 0; i < conflictGroups.length; ++i) {
      const group = conflictGroups[i];
      classGroupsInConflict.push(modifierId + group);
    }
    // Tailwind class not in conflict
    result = originalClassName + (result.length > 0 ? ' ' + result : result);
  }
  return result;
};

/**
 * The code in this file is copied from https://github.com/lukeed/clsx and modified to suit the needs of tailwind-merge better.
 *
 * Specifically:
 * - Runtime code from https://github.com/lukeed/clsx/blob/v1.2.1/src/index.js
 * - TypeScript types from https://github.com/lukeed/clsx/blob/v1.2.1/clsx.d.ts
 *
 * Original code has MIT license: Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
 */
function twJoin() {
  let index = 0;
  let argument;
  let resolvedValue;
  let string = '';
  while (index < arguments.length) {
    if (argument = arguments[index++]) {
      if (resolvedValue = toValue(argument)) {
        string && (string += ' ');
        string += resolvedValue;
      }
    }
  }
  return string;
}
const toValue = mix => {
  if (typeof mix === 'string') {
    return mix;
  }
  let resolvedValue;
  let string = '';
  for (let k = 0; k < mix.length; k++) {
    if (mix[k]) {
      if (resolvedValue = toValue(mix[k])) {
        string && (string += ' ');
        string += resolvedValue;
      }
    }
  }
  return string;
};
function createTailwindMerge(createConfigFirst, ...createConfigRest) {
  let configUtils;
  let cacheGet;
  let cacheSet;
  let functionToCall = initTailwindMerge;
  function initTailwindMerge(classList) {
    const config = createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst());
    configUtils = createConfigUtils(config);
    cacheGet = configUtils.cache.get;
    cacheSet = configUtils.cache.set;
    functionToCall = tailwindMerge;
    return tailwindMerge(classList);
  }
  function tailwindMerge(classList) {
    const cachedResult = cacheGet(classList);
    if (cachedResult) {
      return cachedResult;
    }
    const result = mergeClassList(classList, configUtils);
    cacheSet(classList, result);
    return result;
  }
  return function callTailwindMerge() {
    return functionToCall(twJoin.apply(null, arguments));
  };
}
const fromTheme = key => {
  const themeGetter = theme => theme[key] || [];
  themeGetter.isThemeGetter = true;
  return themeGetter;
};
const arbitraryValueRegex = /^\[(?:(\w[\w-]*):)?(.+)\]$/i;
const arbitraryVariableRegex = /^\((?:(\w[\w-]*):)?(.+)\)$/i;
const fractionRegex = /^\d+\/\d+$/;
const tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
const lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
const colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/;
// Shadow always begins with x and y offset separated by underscore optionally prepended by inset
const shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
const imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
const isFraction = value => fractionRegex.test(value);
const isNumber = value => !!value && !Number.isNaN(Number(value));
const isInteger = value => !!value && Number.isInteger(Number(value));
const isPercent = value => value.endsWith('%') && isNumber(value.slice(0, -1));
const isTshirtSize = value => tshirtUnitRegex.test(value);
const isAny = () => true;
const isLengthOnly = value =>
// `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
// For example, `hsl(0 0% 0%)` would be classified as a length without this check.
// I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
lengthUnitRegex.test(value) && !colorFunctionRegex.test(value);
const isNever = () => false;
const isShadow = value => shadowRegex.test(value);
const isImage = value => imageRegex.test(value);
const isAnyNonArbitrary = value => !isArbitraryValue(value) && !isArbitraryVariable(value);
const isArbitrarySize = value => getIsArbitraryValue(value, isLabelSize, isNever);
const isArbitraryValue = value => arbitraryValueRegex.test(value);
const isArbitraryLength = value => getIsArbitraryValue(value, isLabelLength, isLengthOnly);
const isArbitraryNumber = value => getIsArbitraryValue(value, isLabelNumber, isNumber);
const isArbitraryPosition = value => getIsArbitraryValue(value, isLabelPosition, isNever);
const isArbitraryImage = value => getIsArbitraryValue(value, isLabelImage, isImage);
const isArbitraryShadow = value => getIsArbitraryValue(value, isLabelShadow, isShadow);
const isArbitraryVariable = value => arbitraryVariableRegex.test(value);
const isArbitraryVariableLength = value => getIsArbitraryVariable(value, isLabelLength);
const isArbitraryVariableFamilyName = value => getIsArbitraryVariable(value, isLabelFamilyName);
const isArbitraryVariablePosition = value => getIsArbitraryVariable(value, isLabelPosition);
const isArbitraryVariableSize = value => getIsArbitraryVariable(value, isLabelSize);
const isArbitraryVariableImage = value => getIsArbitraryVariable(value, isLabelImage);
const isArbitraryVariableShadow = value => getIsArbitraryVariable(value, isLabelShadow, true);
// Helpers
const getIsArbitraryValue = (value, testLabel, testValue) => {
  const result = arbitraryValueRegex.exec(value);
  if (result) {
    if (result[1]) {
      return testLabel(result[1]);
    }
    return testValue(result[2]);
  }
  return false;
};
const getIsArbitraryVariable = (value, testLabel, shouldMatchNoLabel = false) => {
  const result = arbitraryVariableRegex.exec(value);
  if (result) {
    if (result[1]) {
      return testLabel(result[1]);
    }
    return shouldMatchNoLabel;
  }
  return false;
};
// Labels
const isLabelPosition = label => label === 'position' || label === 'percentage';
const isLabelImage = label => label === 'image' || label === 'url';
const isLabelSize = label => label === 'length' || label === 'size' || label === 'bg-size';
const isLabelLength = label => label === 'length';
const isLabelNumber = label => label === 'number';
const isLabelFamilyName = label => label === 'family-name';
const isLabelShadow = label => label === 'shadow';
const getDefaultConfig = () => {
  /**
   * Theme getters for theme variable namespaces
   * @see https://tailwindcss.com/docs/theme#theme-variable-namespaces
   */
  /***/
  const themeColor = fromTheme('color');
  const themeFont = fromTheme('font');
  const themeText = fromTheme('text');
  const themeFontWeight = fromTheme('font-weight');
  const themeTracking = fromTheme('tracking');
  const themeLeading = fromTheme('leading');
  const themeBreakpoint = fromTheme('breakpoint');
  const themeContainer = fromTheme('container');
  const themeSpacing = fromTheme('spacing');
  const themeRadius = fromTheme('radius');
  const themeShadow = fromTheme('shadow');
  const themeInsetShadow = fromTheme('inset-shadow');
  const themeTextShadow = fromTheme('text-shadow');
  const themeDropShadow = fromTheme('drop-shadow');
  const themeBlur = fromTheme('blur');
  const themePerspective = fromTheme('perspective');
  const themeAspect = fromTheme('aspect');
  const themeEase = fromTheme('ease');
  const themeAnimate = fromTheme('animate');
  /**
   * Helpers to avoid repeating the same scales
   *
   * We use functions that create a new array every time they're called instead of static arrays.
   * This ensures that users who modify any scale by mutating the array (e.g. with `array.push(element)`) don't accidentally mutate arrays in other parts of the config.
   */
  /***/
  const scaleBreak = () => ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column'];
  const scalePosition = () => ['center', 'top', 'bottom', 'left', 'right', 'top-left',
  // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
  'left-top', 'top-right',
  // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
  'right-top', 'bottom-right',
  // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
  'right-bottom', 'bottom-left',
  // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
  'left-bottom'];
  const scalePositionWithArbitrary = () => [...scalePosition(), isArbitraryVariable, isArbitraryValue];
  const scaleOverflow = () => ['auto', 'hidden', 'clip', 'visible', 'scroll'];
  const scaleOverscroll = () => ['auto', 'contain', 'none'];
  const scaleUnambiguousSpacing = () => [isArbitraryVariable, isArbitraryValue, themeSpacing];
  const scaleInset = () => [isFraction, 'full', 'auto', ...scaleUnambiguousSpacing()];
  const scaleGridTemplateColsRows = () => [isInteger, 'none', 'subgrid', isArbitraryVariable, isArbitraryValue];
  const scaleGridColRowStartAndEnd = () => ['auto', {
    span: ['full', isInteger, isArbitraryVariable, isArbitraryValue]
  }, isInteger, isArbitraryVariable, isArbitraryValue];
  const scaleGridColRowStartOrEnd = () => [isInteger, 'auto', isArbitraryVariable, isArbitraryValue];
  const scaleGridAutoColsRows = () => ['auto', 'min', 'max', 'fr', isArbitraryVariable, isArbitraryValue];
  const scaleAlignPrimaryAxis = () => ['start', 'end', 'center', 'between', 'around', 'evenly', 'stretch', 'baseline', 'center-safe', 'end-safe'];
  const scaleAlignSecondaryAxis = () => ['start', 'end', 'center', 'stretch', 'center-safe', 'end-safe'];
  const scaleMargin = () => ['auto', ...scaleUnambiguousSpacing()];
  const scaleSizing = () => [isFraction, 'auto', 'full', 'dvw', 'dvh', 'lvw', 'lvh', 'svw', 'svh', 'min', 'max', 'fit', ...scaleUnambiguousSpacing()];
  const scaleColor = () => [themeColor, isArbitraryVariable, isArbitraryValue];
  const scaleBgPosition = () => [...scalePosition(), isArbitraryVariablePosition, isArbitraryPosition, {
    position: [isArbitraryVariable, isArbitraryValue]
  }];
  const scaleBgRepeat = () => ['no-repeat', {
    repeat: ['', 'x', 'y', 'space', 'round']
  }];
  const scaleBgSize = () => ['auto', 'cover', 'contain', isArbitraryVariableSize, isArbitrarySize, {
    size: [isArbitraryVariable, isArbitraryValue]
  }];
  const scaleGradientStopPosition = () => [isPercent, isArbitraryVariableLength, isArbitraryLength];
  const scaleRadius = () => [
  // Deprecated since Tailwind CSS v4.0.0
  '', 'none', 'full', themeRadius, isArbitraryVariable, isArbitraryValue];
  const scaleBorderWidth = () => ['', isNumber, isArbitraryVariableLength, isArbitraryLength];
  const scaleLineStyle = () => ['solid', 'dashed', 'dotted', 'double'];
  const scaleBlendMode = () => ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'];
  const scaleMaskImagePosition = () => [isNumber, isPercent, isArbitraryVariablePosition, isArbitraryPosition];
  const scaleBlur = () => [
  // Deprecated since Tailwind CSS v4.0.0
  '', 'none', themeBlur, isArbitraryVariable, isArbitraryValue];
  const scaleRotate = () => ['none', isNumber, isArbitraryVariable, isArbitraryValue];
  const scaleScale = () => ['none', isNumber, isArbitraryVariable, isArbitraryValue];
  const scaleSkew = () => [isNumber, isArbitraryVariable, isArbitraryValue];
  const scaleTranslate = () => [isFraction, 'full', ...scaleUnambiguousSpacing()];
  return {
    cacheSize: 500,
    theme: {
      animate: ['spin', 'ping', 'pulse', 'bounce'],
      aspect: ['video'],
      blur: [isTshirtSize],
      breakpoint: [isTshirtSize],
      color: [isAny],
      container: [isTshirtSize],
      'drop-shadow': [isTshirtSize],
      ease: ['in', 'out', 'in-out'],
      font: [isAnyNonArbitrary],
      'font-weight': ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'],
      'inset-shadow': [isTshirtSize],
      leading: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'],
      perspective: ['dramatic', 'near', 'normal', 'midrange', 'distant', 'none'],
      radius: [isTshirtSize],
      shadow: [isTshirtSize],
      spacing: ['px', isNumber],
      text: [isTshirtSize],
      'text-shadow': [isTshirtSize],
      tracking: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest']
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ['auto', 'square', isFraction, isArbitraryValue, isArbitraryVariable, themeAspect]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ['container'],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [isNumber, isArbitraryValue, isArbitraryVariable, themeContainer]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      'break-after': [{
        'break-after': scaleBreak()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      'break-before': [{
        'break-before': scaleBreak()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      'break-inside': [{
        'break-inside': ['auto', 'avoid', 'avoid-page', 'avoid-column']
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      'box-decoration': [{
        'box-decoration': ['slice', 'clone']
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ['border', 'content']
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ['block', 'inline-block', 'inline', 'flex', 'inline-flex', 'table', 'inline-table', 'table-caption', 'table-cell', 'table-column', 'table-column-group', 'table-footer-group', 'table-header-group', 'table-row-group', 'table-row', 'flow-root', 'grid', 'inline-grid', 'contents', 'list-item', 'hidden'],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ['sr-only', 'not-sr-only'],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ['right', 'left', 'none', 'start', 'end']
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ['left', 'right', 'both', 'none', 'start', 'end']
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ['isolate', 'isolation-auto'],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      'object-fit': [{
        object: ['contain', 'cover', 'fill', 'none', 'scale-down']
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      'object-position': [{
        object: scalePositionWithArbitrary()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: scaleOverflow()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      'overflow-x': [{
        'overflow-x': scaleOverflow()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      'overflow-y': [{
        'overflow-y': scaleOverflow()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: scaleOverscroll()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      'overscroll-x': [{
        'overscroll-x': scaleOverscroll()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      'overscroll-y': [{
        'overscroll-y': scaleOverscroll()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: scaleInset()
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      'inset-x': [{
        'inset-x': scaleInset()
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      'inset-y': [{
        'inset-y': scaleInset()
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: scaleInset()
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: scaleInset()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: scaleInset()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: scaleInset()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: scaleInset()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: scaleInset()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ['visible', 'invisible', 'collapse'],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [isInteger, 'auto', isArbitraryVariable, isArbitraryValue]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [isFraction, 'full', 'auto', themeContainer, ...scaleUnambiguousSpacing()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      'flex-direction': [{
        flex: ['row', 'row-reverse', 'col', 'col-reverse']
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      'flex-wrap': [{
        flex: ['nowrap', 'wrap', 'wrap-reverse']
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [isNumber, isFraction, 'auto', 'initial', 'none', isArbitraryValue]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ['', isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ['', isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [isInteger, 'first', 'last', 'none', isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      'grid-cols': [{
        'grid-cols': scaleGridTemplateColsRows()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      'col-start-end': [{
        col: scaleGridColRowStartAndEnd()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      'col-start': [{
        'col-start': scaleGridColRowStartOrEnd()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      'col-end': [{
        'col-end': scaleGridColRowStartOrEnd()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      'grid-rows': [{
        'grid-rows': scaleGridTemplateColsRows()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      'row-start-end': [{
        row: scaleGridColRowStartAndEnd()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      'row-start': [{
        'row-start': scaleGridColRowStartOrEnd()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      'row-end': [{
        'row-end': scaleGridColRowStartOrEnd()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      'grid-flow': [{
        'grid-flow': ['row', 'col', 'dense', 'row-dense', 'col-dense']
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      'auto-cols': [{
        'auto-cols': scaleGridAutoColsRows()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      'auto-rows': [{
        'auto-rows': scaleGridAutoColsRows()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: scaleUnambiguousSpacing()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      'gap-x': [{
        'gap-x': scaleUnambiguousSpacing()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      'gap-y': [{
        'gap-y': scaleUnambiguousSpacing()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      'justify-content': [{
        justify: [...scaleAlignPrimaryAxis(), 'normal']
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      'justify-items': [{
        'justify-items': [...scaleAlignSecondaryAxis(), 'normal']
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      'justify-self': [{
        'justify-self': ['auto', ...scaleAlignSecondaryAxis()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      'align-content': [{
        content: ['normal', ...scaleAlignPrimaryAxis()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      'align-items': [{
        items: [...scaleAlignSecondaryAxis(), {
          baseline: ['', 'last']
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      'align-self': [{
        self: ['auto', ...scaleAlignSecondaryAxis(), {
          baseline: ['', 'last']
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      'place-content': [{
        'place-content': scaleAlignPrimaryAxis()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      'place-items': [{
        'place-items': [...scaleAlignSecondaryAxis(), 'baseline']
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      'place-self': [{
        'place-self': ['auto', ...scaleAlignSecondaryAxis()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: scaleUnambiguousSpacing()
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: scaleUnambiguousSpacing()
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: scaleUnambiguousSpacing()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: scaleMargin()
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: scaleMargin()
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: scaleMargin()
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: scaleMargin()
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: scaleMargin()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: scaleMargin()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: scaleMargin()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: scaleMargin()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: scaleMargin()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      'space-x': [{
        'space-x': scaleUnambiguousSpacing()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      'space-x-reverse': ['space-x-reverse'],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      'space-y': [{
        'space-y': scaleUnambiguousSpacing()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      'space-y-reverse': ['space-y-reverse'],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: scaleSizing()
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [themeContainer, 'screen', ...scaleSizing()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      'min-w': [{
        'min-w': [themeContainer, 'screen', /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
        'none', ...scaleSizing()]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      'max-w': [{
        'max-w': [themeContainer, 'screen', 'none', /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
        'prose', /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
        {
          screen: [themeBreakpoint]
        }, ...scaleSizing()]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ['screen', ...scaleSizing()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      'min-h': [{
        'min-h': ['screen', 'none', ...scaleSizing()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      'max-h': [{
        'max-h': ['screen', ...scaleSizing()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      'font-size': [{
        text: ['base', themeText, isArbitraryVariableLength, isArbitraryLength]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      'font-smoothing': ['antialiased', 'subpixel-antialiased'],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      'font-style': ['italic', 'not-italic'],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      'font-weight': [{
        font: [themeFontWeight, isArbitraryVariable, isArbitraryNumber]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      'font-stretch': [{
        'font-stretch': ['ultra-condensed', 'extra-condensed', 'condensed', 'semi-condensed', 'normal', 'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded', isPercent, isArbitraryValue]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      'font-family': [{
        font: [isArbitraryVariableFamilyName, isArbitraryValue, themeFont]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-normal': ['normal-nums'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-ordinal': ['ordinal'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-slashed-zero': ['slashed-zero'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-figure': ['lining-nums', 'oldstyle-nums'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-spacing': ['proportional-nums', 'tabular-nums'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-fraction': ['diagonal-fractions', 'stacked-fractions'],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [themeTracking, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      'line-clamp': [{
        'line-clamp': [isNumber, 'none', isArbitraryVariable, isArbitraryNumber]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [/** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
        themeLeading, ...scaleUnambiguousSpacing()]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      'list-image': [{
        'list-image': ['none', isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      'list-style-position': [{
        list: ['inside', 'outside']
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      'list-style-type': [{
        list: ['disc', 'decimal', 'none', isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      'text-alignment': [{
        text: ['left', 'center', 'right', 'justify', 'start', 'end']
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      'placeholder-color': [{
        placeholder: scaleColor()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      'text-color': [{
        text: scaleColor()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      'text-decoration': ['underline', 'overline', 'line-through', 'no-underline'],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      'text-decoration-style': [{
        decoration: [...scaleLineStyle(), 'wavy']
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      'text-decoration-thickness': [{
        decoration: [isNumber, 'from-font', 'auto', isArbitraryVariable, isArbitraryLength]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      'text-decoration-color': [{
        decoration: scaleColor()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      'underline-offset': [{
        'underline-offset': [isNumber, 'auto', isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      'text-transform': ['uppercase', 'lowercase', 'capitalize', 'normal-case'],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      'text-overflow': ['truncate', 'text-ellipsis', 'text-clip'],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      'text-wrap': [{
        text: ['wrap', 'nowrap', 'balance', 'pretty']
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: scaleUnambiguousSpacing()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      'vertical-align': [{
        align: ['baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom', 'sub', 'super', isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces']
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ['normal', 'words', 'all', 'keep']
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ['break-word', 'anywhere', 'normal']
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ['none', 'manual', 'auto']
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ['none', isArbitraryVariable, isArbitraryValue]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      'bg-attachment': [{
        bg: ['fixed', 'local', 'scroll']
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      'bg-clip': [{
        'bg-clip': ['border', 'padding', 'content', 'text']
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      'bg-origin': [{
        'bg-origin': ['border', 'padding', 'content']
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      'bg-position': [{
        bg: scaleBgPosition()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      'bg-repeat': [{
        bg: scaleBgRepeat()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      'bg-size': [{
        bg: scaleBgSize()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      'bg-image': [{
        bg: ['none', {
          linear: [{
            to: ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']
          }, isInteger, isArbitraryVariable, isArbitraryValue],
          radial: ['', isArbitraryVariable, isArbitraryValue],
          conic: [isInteger, isArbitraryVariable, isArbitraryValue]
        }, isArbitraryVariableImage, isArbitraryImage]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      'bg-color': [{
        bg: scaleColor()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-from-pos': [{
        from: scaleGradientStopPosition()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-via-pos': [{
        via: scaleGradientStopPosition()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-to-pos': [{
        to: scaleGradientStopPosition()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-from': [{
        from: scaleColor()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-via': [{
        via: scaleColor()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-to': [{
        to: scaleColor()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: scaleRadius()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-s': [{
        'rounded-s': scaleRadius()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-e': [{
        'rounded-e': scaleRadius()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-t': [{
        'rounded-t': scaleRadius()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-r': [{
        'rounded-r': scaleRadius()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-b': [{
        'rounded-b': scaleRadius()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-l': [{
        'rounded-l': scaleRadius()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-ss': [{
        'rounded-ss': scaleRadius()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-se': [{
        'rounded-se': scaleRadius()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-ee': [{
        'rounded-ee': scaleRadius()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-es': [{
        'rounded-es': scaleRadius()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-tl': [{
        'rounded-tl': scaleRadius()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-tr': [{
        'rounded-tr': scaleRadius()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-br': [{
        'rounded-br': scaleRadius()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-bl': [{
        'rounded-bl': scaleRadius()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w': [{
        border: scaleBorderWidth()
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-x': [{
        'border-x': scaleBorderWidth()
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-y': [{
        'border-y': scaleBorderWidth()
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-s': [{
        'border-s': scaleBorderWidth()
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-e': [{
        'border-e': scaleBorderWidth()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-t': [{
        'border-t': scaleBorderWidth()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-r': [{
        'border-r': scaleBorderWidth()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-b': [{
        'border-b': scaleBorderWidth()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-l': [{
        'border-l': scaleBorderWidth()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      'divide-x': [{
        'divide-x': scaleBorderWidth()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      'divide-x-reverse': ['divide-x-reverse'],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      'divide-y': [{
        'divide-y': scaleBorderWidth()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      'divide-y-reverse': ['divide-y-reverse'],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      'border-style': [{
        border: [...scaleLineStyle(), 'hidden', 'none']
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      'divide-style': [{
        divide: [...scaleLineStyle(), 'hidden', 'none']
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color': [{
        border: scaleColor()
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-x': [{
        'border-x': scaleColor()
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-y': [{
        'border-y': scaleColor()
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-s': [{
        'border-s': scaleColor()
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-e': [{
        'border-e': scaleColor()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-t': [{
        'border-t': scaleColor()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-r': [{
        'border-r': scaleColor()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-b': [{
        'border-b': scaleColor()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-l': [{
        'border-l': scaleColor()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      'divide-color': [{
        divide: scaleColor()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      'outline-style': [{
        outline: [...scaleLineStyle(), 'none', 'hidden']
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      'outline-offset': [{
        'outline-offset': [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      'outline-w': [{
        outline: ['', isNumber, isArbitraryVariableLength, isArbitraryLength]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      'outline-color': [{
        outline: scaleColor()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
        // Deprecated since Tailwind CSS v4.0.0
        '', 'none', themeShadow, isArbitraryVariableShadow, isArbitraryShadow]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      'shadow-color': [{
        shadow: scaleColor()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      'inset-shadow': [{
        'inset-shadow': ['none', themeInsetShadow, isArbitraryVariableShadow, isArbitraryShadow]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      'inset-shadow-color': [{
        'inset-shadow': scaleColor()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      'ring-w': [{
        ring: scaleBorderWidth()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      'ring-w-inset': ['ring-inset'],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      'ring-color': [{
        ring: scaleColor()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      'ring-offset-w': [{
        'ring-offset': [isNumber, isArbitraryLength]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      'ring-offset-color': [{
        'ring-offset': scaleColor()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      'inset-ring-w': [{
        'inset-ring': scaleBorderWidth()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      'inset-ring-color': [{
        'inset-ring': scaleColor()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      'text-shadow': [{
        'text-shadow': ['none', themeTextShadow, isArbitraryVariableShadow, isArbitraryShadow]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      'text-shadow-color': [{
        'text-shadow': scaleColor()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      'mix-blend': [{
        'mix-blend': [...scaleBlendMode(), 'plus-darker', 'plus-lighter']
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      'bg-blend': [{
        'bg-blend': scaleBlendMode()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      'mask-clip': [{
        'mask-clip': ['border', 'padding', 'content', 'fill', 'stroke', 'view']
      }, 'mask-no-clip'],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      'mask-composite': [{
        mask: ['add', 'subtract', 'intersect', 'exclude']
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      'mask-image-linear-pos': [{
        'mask-linear': [isNumber]
      }],
      'mask-image-linear-from-pos': [{
        'mask-linear-from': scaleMaskImagePosition()
      }],
      'mask-image-linear-to-pos': [{
        'mask-linear-to': scaleMaskImagePosition()
      }],
      'mask-image-linear-from-color': [{
        'mask-linear-from': scaleColor()
      }],
      'mask-image-linear-to-color': [{
        'mask-linear-to': scaleColor()
      }],
      'mask-image-t-from-pos': [{
        'mask-t-from': scaleMaskImagePosition()
      }],
      'mask-image-t-to-pos': [{
        'mask-t-to': scaleMaskImagePosition()
      }],
      'mask-image-t-from-color': [{
        'mask-t-from': scaleColor()
      }],
      'mask-image-t-to-color': [{
        'mask-t-to': scaleColor()
      }],
      'mask-image-r-from-pos': [{
        'mask-r-from': scaleMaskImagePosition()
      }],
      'mask-image-r-to-pos': [{
        'mask-r-to': scaleMaskImagePosition()
      }],
      'mask-image-r-from-color': [{
        'mask-r-from': scaleColor()
      }],
      'mask-image-r-to-color': [{
        'mask-r-to': scaleColor()
      }],
      'mask-image-b-from-pos': [{
        'mask-b-from': scaleMaskImagePosition()
      }],
      'mask-image-b-to-pos': [{
        'mask-b-to': scaleMaskImagePosition()
      }],
      'mask-image-b-from-color': [{
        'mask-b-from': scaleColor()
      }],
      'mask-image-b-to-color': [{
        'mask-b-to': scaleColor()
      }],
      'mask-image-l-from-pos': [{
        'mask-l-from': scaleMaskImagePosition()
      }],
      'mask-image-l-to-pos': [{
        'mask-l-to': scaleMaskImagePosition()
      }],
      'mask-image-l-from-color': [{
        'mask-l-from': scaleColor()
      }],
      'mask-image-l-to-color': [{
        'mask-l-to': scaleColor()
      }],
      'mask-image-x-from-pos': [{
        'mask-x-from': scaleMaskImagePosition()
      }],
      'mask-image-x-to-pos': [{
        'mask-x-to': scaleMaskImagePosition()
      }],
      'mask-image-x-from-color': [{
        'mask-x-from': scaleColor()
      }],
      'mask-image-x-to-color': [{
        'mask-x-to': scaleColor()
      }],
      'mask-image-y-from-pos': [{
        'mask-y-from': scaleMaskImagePosition()
      }],
      'mask-image-y-to-pos': [{
        'mask-y-to': scaleMaskImagePosition()
      }],
      'mask-image-y-from-color': [{
        'mask-y-from': scaleColor()
      }],
      'mask-image-y-to-color': [{
        'mask-y-to': scaleColor()
      }],
      'mask-image-radial': [{
        'mask-radial': [isArbitraryVariable, isArbitraryValue]
      }],
      'mask-image-radial-from-pos': [{
        'mask-radial-from': scaleMaskImagePosition()
      }],
      'mask-image-radial-to-pos': [{
        'mask-radial-to': scaleMaskImagePosition()
      }],
      'mask-image-radial-from-color': [{
        'mask-radial-from': scaleColor()
      }],
      'mask-image-radial-to-color': [{
        'mask-radial-to': scaleColor()
      }],
      'mask-image-radial-shape': [{
        'mask-radial': ['circle', 'ellipse']
      }],
      'mask-image-radial-size': [{
        'mask-radial': [{
          closest: ['side', 'corner'],
          farthest: ['side', 'corner']
        }]
      }],
      'mask-image-radial-pos': [{
        'mask-radial-at': scalePosition()
      }],
      'mask-image-conic-pos': [{
        'mask-conic': [isNumber]
      }],
      'mask-image-conic-from-pos': [{
        'mask-conic-from': scaleMaskImagePosition()
      }],
      'mask-image-conic-to-pos': [{
        'mask-conic-to': scaleMaskImagePosition()
      }],
      'mask-image-conic-from-color': [{
        'mask-conic-from': scaleColor()
      }],
      'mask-image-conic-to-color': [{
        'mask-conic-to': scaleColor()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      'mask-mode': [{
        mask: ['alpha', 'luminance', 'match']
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      'mask-origin': [{
        'mask-origin': ['border', 'padding', 'content', 'fill', 'stroke', 'view']
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      'mask-position': [{
        mask: scaleBgPosition()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      'mask-repeat': [{
        mask: scaleBgRepeat()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      'mask-size': [{
        mask: scaleBgSize()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      'mask-type': [{
        'mask-type': ['alpha', 'luminance']
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      'mask-image': [{
        mask: ['none', isArbitraryVariable, isArbitraryValue]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
        // Deprecated since Tailwind CSS v3.0.0
        '', 'none', isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: scaleBlur()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      'drop-shadow': [{
        'drop-shadow': [
        // Deprecated since Tailwind CSS v4.0.0
        '', 'none', themeDropShadow, isArbitraryVariableShadow, isArbitraryShadow]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      'drop-shadow-color': [{
        'drop-shadow': scaleColor()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ['', isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      'hue-rotate': [{
        'hue-rotate': [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ['', isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ['', isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      'backdrop-filter': [{
        'backdrop-filter': [
        // Deprecated since Tailwind CSS v3.0.0
        '', 'none', isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      'backdrop-blur': [{
        'backdrop-blur': scaleBlur()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      'backdrop-brightness': [{
        'backdrop-brightness': [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      'backdrop-contrast': [{
        'backdrop-contrast': [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      'backdrop-grayscale': [{
        'backdrop-grayscale': ['', isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      'backdrop-hue-rotate': [{
        'backdrop-hue-rotate': [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      'backdrop-invert': [{
        'backdrop-invert': ['', isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      'backdrop-opacity': [{
        'backdrop-opacity': [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      'backdrop-saturate': [{
        'backdrop-saturate': [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      'backdrop-sepia': [{
        'backdrop-sepia': ['', isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      'border-collapse': [{
        border: ['collapse', 'separate']
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      'border-spacing': [{
        'border-spacing': scaleUnambiguousSpacing()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      'border-spacing-x': [{
        'border-spacing-x': scaleUnambiguousSpacing()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      'border-spacing-y': [{
        'border-spacing-y': scaleUnambiguousSpacing()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      'table-layout': [{
        table: ['auto', 'fixed']
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ['top', 'bottom']
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ['', 'all', 'colors', 'opacity', 'shadow', 'transform', 'none', isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      'transition-behavior': [{
        transition: ['normal', 'discrete']
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [isNumber, 'initial', isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ['linear', 'initial', themeEase, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ['none', themeAnimate, isArbitraryVariable, isArbitraryValue]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ['hidden', 'visible']
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [themePerspective, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      'perspective-origin': [{
        'perspective-origin': scalePositionWithArbitrary()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: scaleRotate()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      'rotate-x': [{
        'rotate-x': scaleRotate()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      'rotate-y': [{
        'rotate-y': scaleRotate()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      'rotate-z': [{
        'rotate-z': scaleRotate()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: scaleScale()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      'scale-x': [{
        'scale-x': scaleScale()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      'scale-y': [{
        'scale-y': scaleScale()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      'scale-z': [{
        'scale-z': scaleScale()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      'scale-3d': ['scale-3d'],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: scaleSkew()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      'skew-x': [{
        'skew-x': scaleSkew()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      'skew-y': [{
        'skew-y': scaleSkew()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [isArbitraryVariable, isArbitraryValue, '', 'none', 'gpu', 'cpu']
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      'transform-origin': [{
        origin: scalePositionWithArbitrary()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      'transform-style': [{
        transform: ['3d', 'flat']
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: scaleTranslate()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      'translate-x': [{
        'translate-x': scaleTranslate()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      'translate-y': [{
        'translate-y': scaleTranslate()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      'translate-z': [{
        'translate-z': scaleTranslate()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      'translate-none': ['translate-none'],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: scaleColor()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ['none', 'auto']
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      'caret-color': [{
        caret: scaleColor()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      'color-scheme': [{
        scheme: ['normal', 'dark', 'light', 'light-dark', 'only-dark', 'only-light']
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ['auto', 'default', 'pointer', 'wait', 'text', 'move', 'help', 'not-allowed', 'none', 'context-menu', 'progress', 'cell', 'crosshair', 'vertical-text', 'alias', 'copy', 'no-drop', 'grab', 'grabbing', 'all-scroll', 'col-resize', 'row-resize', 'n-resize', 'e-resize', 's-resize', 'w-resize', 'ne-resize', 'nw-resize', 'se-resize', 'sw-resize', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize', 'zoom-in', 'zoom-out', isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      'field-sizing': [{
        'field-sizing': ['fixed', 'content']
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      'pointer-events': [{
        'pointer-events': ['auto', 'none']
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ['none', '', 'y', 'x']
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      'scroll-behavior': [{
        scroll: ['auto', 'smooth']
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-m': [{
        'scroll-m': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mx': [{
        'scroll-mx': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-my': [{
        'scroll-my': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-ms': [{
        'scroll-ms': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-me': [{
        'scroll-me': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mt': [{
        'scroll-mt': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mr': [{
        'scroll-mr': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mb': [{
        'scroll-mb': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-ml': [{
        'scroll-ml': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-p': [{
        'scroll-p': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-px': [{
        'scroll-px': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-py': [{
        'scroll-py': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-ps': [{
        'scroll-ps': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pe': [{
        'scroll-pe': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pt': [{
        'scroll-pt': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pr': [{
        'scroll-pr': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pb': [{
        'scroll-pb': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pl': [{
        'scroll-pl': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      'snap-align': [{
        snap: ['start', 'end', 'center', 'align-none']
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      'snap-stop': [{
        snap: ['normal', 'always']
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      'snap-type': [{
        snap: ['none', 'x', 'y', 'both']
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      'snap-strictness': [{
        snap: ['mandatory', 'proximity']
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ['auto', 'none', 'manipulation']
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      'touch-x': [{
        'touch-pan': ['x', 'left', 'right']
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      'touch-y': [{
        'touch-pan': ['y', 'up', 'down']
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      'touch-pz': ['touch-pinch-zoom'],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ['none', 'text', 'all', 'auto']
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      'will-change': [{
        'will-change': ['auto', 'scroll', 'contents', 'transform', isArbitraryVariable, isArbitraryValue]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ['none', ...scaleColor()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      'stroke-w': [{
        stroke: [isNumber, isArbitraryVariableLength, isArbitraryLength, isArbitraryNumber]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ['none', ...scaleColor()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      'forced-color-adjust': [{
        'forced-color-adjust': ['auto', 'none']
      }]
    },
    conflictingClassGroups: {
      overflow: ['overflow-x', 'overflow-y'],
      overscroll: ['overscroll-x', 'overscroll-y'],
      inset: ['inset-x', 'inset-y', 'start', 'end', 'top', 'right', 'bottom', 'left'],
      'inset-x': ['right', 'left'],
      'inset-y': ['top', 'bottom'],
      flex: ['basis', 'grow', 'shrink'],
      gap: ['gap-x', 'gap-y'],
      p: ['px', 'py', 'ps', 'pe', 'pt', 'pr', 'pb', 'pl'],
      px: ['pr', 'pl'],
      py: ['pt', 'pb'],
      m: ['mx', 'my', 'ms', 'me', 'mt', 'mr', 'mb', 'ml'],
      mx: ['mr', 'ml'],
      my: ['mt', 'mb'],
      size: ['w', 'h'],
      'font-size': ['leading'],
      'fvn-normal': ['fvn-ordinal', 'fvn-slashed-zero', 'fvn-figure', 'fvn-spacing', 'fvn-fraction'],
      'fvn-ordinal': ['fvn-normal'],
      'fvn-slashed-zero': ['fvn-normal'],
      'fvn-figure': ['fvn-normal'],
      'fvn-spacing': ['fvn-normal'],
      'fvn-fraction': ['fvn-normal'],
      'line-clamp': ['display', 'overflow'],
      rounded: ['rounded-s', 'rounded-e', 'rounded-t', 'rounded-r', 'rounded-b', 'rounded-l', 'rounded-ss', 'rounded-se', 'rounded-ee', 'rounded-es', 'rounded-tl', 'rounded-tr', 'rounded-br', 'rounded-bl'],
      'rounded-s': ['rounded-ss', 'rounded-es'],
      'rounded-e': ['rounded-se', 'rounded-ee'],
      'rounded-t': ['rounded-tl', 'rounded-tr'],
      'rounded-r': ['rounded-tr', 'rounded-br'],
      'rounded-b': ['rounded-br', 'rounded-bl'],
      'rounded-l': ['rounded-tl', 'rounded-bl'],
      'border-spacing': ['border-spacing-x', 'border-spacing-y'],
      'border-w': ['border-w-x', 'border-w-y', 'border-w-s', 'border-w-e', 'border-w-t', 'border-w-r', 'border-w-b', 'border-w-l'],
      'border-w-x': ['border-w-r', 'border-w-l'],
      'border-w-y': ['border-w-t', 'border-w-b'],
      'border-color': ['border-color-x', 'border-color-y', 'border-color-s', 'border-color-e', 'border-color-t', 'border-color-r', 'border-color-b', 'border-color-l'],
      'border-color-x': ['border-color-r', 'border-color-l'],
      'border-color-y': ['border-color-t', 'border-color-b'],
      translate: ['translate-x', 'translate-y', 'translate-none'],
      'translate-none': ['translate', 'translate-x', 'translate-y', 'translate-z'],
      'scroll-m': ['scroll-mx', 'scroll-my', 'scroll-ms', 'scroll-me', 'scroll-mt', 'scroll-mr', 'scroll-mb', 'scroll-ml'],
      'scroll-mx': ['scroll-mr', 'scroll-ml'],
      'scroll-my': ['scroll-mt', 'scroll-mb'],
      'scroll-p': ['scroll-px', 'scroll-py', 'scroll-ps', 'scroll-pe', 'scroll-pt', 'scroll-pr', 'scroll-pb', 'scroll-pl'],
      'scroll-px': ['scroll-pr', 'scroll-pl'],
      'scroll-py': ['scroll-pt', 'scroll-pb'],
      touch: ['touch-x', 'touch-y', 'touch-pz'],
      'touch-x': ['touch'],
      'touch-y': ['touch'],
      'touch-pz': ['touch']
    },
    conflictingClassGroupModifiers: {
      'font-size': ['leading']
    },
    orderSensitiveModifiers: ['*', '**', 'after', 'backdrop', 'before', 'details-content', 'file', 'first-letter', 'first-line', 'marker', 'placeholder', 'selection']
  };
};
const twMerge = /*#__PURE__*/createTailwindMerge(getDefaultConfig);

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const TooltipIconButton = forwardRef(
  ({ children, tooltip, side = "bottom", className, ...rest }, ref) => {
    return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", ...rest, className: cn("size-6 p-1", className), ref, children: [
        children,
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: tooltip })
      ] }) }),
      /* @__PURE__ */ jsx(TooltipContent, { side, children: tooltip })
    ] }) });
  }
);
TooltipIconButton.displayName = "TooltipIconButton";

const Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Image, { ref, className: cn("aspect-square h-full w-full", className), ...props }));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const SyntaxHighlighter$1 = makePrismAsyncSyntaxHighlighter({
  style: coldarkDark,
  customStyle: {
    margin: 0,
    backgroundColor: "black"
  }
});
const MarkdownTextImpl = () => {
  return /* @__PURE__ */ jsx(MarkdownTextPrimitive, { remarkPlugins: [remarkGfm], className: "aui-md", components: defaultComponents });
};
const MarkdownText = memo(MarkdownTextImpl);
const CodeHeader = ({ language, code }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard$1();
  const onCopy = () => {
    if (!code || isCopied) return;
    copyToClipboard(code);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        background: "hsl(0 0% 100% / 0.06)",
        borderTopRightRadius: "0.5rem",
        borderTopLeftRadius: "0.5rem",
        marginTop: "0.5rem",
        border: "1px solid hsl(0 0% 20.4%)",
        borderBottom: "none"
      },
      className: "flex items-center justify-between gap-4 px-4 py-2 text-sm font-semibold text-white",
      children: [
        /* @__PURE__ */ jsx("span", { className: "lowercase [&>span]:text-xs", children: language }),
        /* @__PURE__ */ jsx(TooltipIconButton, { tooltip: "Copy", onClick: onCopy, children: /* @__PURE__ */ jsxs("span", { className: "grid", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              style: {
                gridArea: "1/1"
              },
              className: cn("transition-transform", isCopied ? "scale-100" : "scale-0"),
              children: /* @__PURE__ */ jsx(CheckIcon, { size: 14 })
            },
            "checkmark"
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              style: {
                gridArea: "1/1"
              },
              className: cn("transition-transform", isCopied ? "scale-0" : "scale-100"),
              children: /* @__PURE__ */ jsx(CopyIcon, { size: 14 })
            },
            "copy"
          )
        ] }) })
      ]
    }
  );
};
const useCopyToClipboard$1 = ({
  copiedDuration = 1500
} = {}) => {
  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = (value) => {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), copiedDuration);
    });
  };
  return { isCopied, copyToClipboard };
};
const defaultComponents = unstable_memoizeMarkdownComponents({
  h1: ({ className, ...props }) => /* @__PURE__ */ jsx(
    "h1",
    {
      className: cn("mb-8 scroll-m-20 text-4xl font-extrabold tracking-tight last:mb-0", className),
      ...props,
      style: {
        marginBottom: "2rem"
      }
    }
  ),
  h2: ({ className, ...props }) => /* @__PURE__ */ jsx(
    "h2",
    {
      className: cn("mb-4 mt-8 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 last:mb-0", className),
      ...props,
      style: {
        marginBottom: "1rem",
        marginTop: "2rem"
      }
    }
  ),
  h3: ({ className, ...props }) => /* @__PURE__ */ jsx(
    "h3",
    {
      className: cn("scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 last:mb-0", className),
      ...props,
      style: {
        marginBottom: "1rem",
        marginTop: "1.5rem"
      }
    }
  ),
  h4: ({ className, ...props }) => /* @__PURE__ */ jsx(
    "h4",
    {
      className: cn("scroll-m-20 text-xl font-semibold tracking-tight first:mt-0 last:mb-0", className),
      ...props,
      style: {
        marginBottom: "1rem",
        marginTop: "1.5rem"
      }
    }
  ),
  h5: ({ className, ...props }) => /* @__PURE__ */ jsx(
    "h5",
    {
      className: cn("font-semibold first:mt-0 last:mb-0", className),
      ...props,
      style: {
        marginBottom: "1rem",
        marginTop: "1rem"
      }
    }
  ),
  h6: ({ className, ...props }) => /* @__PURE__ */ jsx(
    "h6",
    {
      className: cn("font-semibold first:mt-0 last:mb-0", className),
      ...props,
      style: {
        marginBottom: "1rem",
        marginTop: "1rem"
      }
    }
  ),
  p: ({ className, ...props }) => /* @__PURE__ */ jsx(
    "p",
    {
      className: cn("leading-7 first:mt-0 last:mb-0", className),
      ...props,
      style: {
        marginBottom: "1.25rem",
        marginTop: "1.25rem"
      }
    }
  ),
  a: ({ className, ...props }) => /* @__PURE__ */ jsx("a", { className: cn("text-primary font-medium underline underline-offset-4", className), ...props }),
  blockquote: ({ className, ...props }) => /* @__PURE__ */ jsx("blockquote", { className: cn("border-l-2 pl-6 italic", className), ...props }),
  ul: ({ className, ...props }) => /* @__PURE__ */ jsx("ul", { className: cn("my-5 ml-6 list-disc [&>li]:mt-2", className), ...props }),
  ol: ({ className, ...props }) => /* @__PURE__ */ jsx("ol", { className: cn("my-5 ml-6 list-decimal [&>li]:mt-2", className), ...props }),
  hr: ({ className, ...props }) => /* @__PURE__ */ jsx("hr", { className: cn("my-5 border-b", className), ...props }),
  table: ({ className, ...props }) => /* @__PURE__ */ jsx("table", { className: cn("my-5 w-full border-separate border-spacing-0 overflow-y-auto", className), ...props }),
  th: ({ className, ...props }) => /* @__PURE__ */ jsx(
    "th",
    {
      className: cn(
        "bg-muted px-4 py-2 text-left font-bold first:rounded-tl-lg last:rounded-tr-lg [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      ),
      ...props
    }
  ),
  td: ({ className, ...props }) => /* @__PURE__ */ jsx(
    "td",
    {
      className: cn(
        "border-b border-l px-4 py-2 text-left last:border-r [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      ),
      ...props
    }
  ),
  tr: ({ className, ...props }) => /* @__PURE__ */ jsx(
    "tr",
    {
      className: cn(
        "m-0 border-b p-0 first:border-t [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg",
        className
      ),
      ...props
    }
  ),
  sup: ({ className, ...props }) => /* @__PURE__ */ jsx("sup", { className: cn("[&>a]:text-xs [&>a]:no-underline", className), ...props }),
  pre: ({ className, ...props }) => /* @__PURE__ */ jsx(
    "pre",
    {
      ...props,
      style: {
        borderBottomRightRadius: "0.5rem",
        borderBottomLeftRadius: "0.5rem",
        background: "transparent",
        fontSize: "0.875rem",
        marginBottom: "0.5rem",
        border: "1px solid hsl(0 0% 20.4%)"
      },
      className: cn("overflow-x-auto p-4 text-white", className)
    }
  ),
  code: function Code({ className, ...props }) {
    const isCodeBlock = useIsMarkdownCodeBlock();
    return /* @__PURE__ */ jsxs(
      "pre",
      {
        style: {
          fontSize: "0.875rem",
          display: "inline"
        },
        children: [
          /* @__PURE__ */ jsx(
            "code",
            {
              className: cn(!isCodeBlock && "bg-muted rounded border font-semibold", className),
              ...props,
              style: {
                fontWeight: "400",
                paddingBlock: !isCodeBlock ? "0.1em" : 0,
                paddingInline: !isCodeBlock ? "0.3em" : 0
              }
            }
          ),
          " "
        ]
      }
    );
  },
  CodeHeader,
  SyntaxHighlighter: SyntaxHighlighter$1
});

const ToolFallback$1 = ({ toolName, argsText, result }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  return /* @__PURE__ */ jsxs("div", { className: "mb-2 flex w-full flex-col gap-3 rounded-lg border py-3 text-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-4", children: [
      /* @__PURE__ */ jsx(CheckIcon, { className: "size-4" }),
      /* @__PURE__ */ jsxs("p", { className: "", children: [
        "Used tool: ",
        /* @__PURE__ */ jsx("b", { children: toolName })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-grow" }),
      /* @__PURE__ */ jsx(Button, { onClick: () => setIsCollapsed(!isCollapsed), children: isCollapsed ? /* @__PURE__ */ jsx(ChevronUpIcon, {}) : /* @__PURE__ */ jsx(ChevronDownIcon, {}) })
    ] }),
    !isCollapsed && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 border-t pt-2", children: [
      /* @__PURE__ */ jsx("div", { className: "px-4", children: /* @__PURE__ */ jsx("pre", { className: "whitespace-pre-wrap", children: argsText }) }),
      result !== void 0 && /* @__PURE__ */ jsxs("div", { className: "border-t border-dashed px-4 pt-2", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Result:" }),
        /* @__PURE__ */ jsx("pre", { className: "whitespace-pre-wrap", children: typeof result === "string" ? result : JSON.stringify(result, null, 2) })
      ] })
    ] })
  ] });
};

const AssistantMessage = ({
  ToolFallback: ToolFallbackCustom
}) => {
  return /* @__PURE__ */ jsxs(MessagePrimitive.Root, { className: "grid group grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] max-w-[var(--thread-max-width)] relative w-full", children: [
    /* @__PURE__ */ jsx("div", { className: "text-foreground max-w-[calc(var(--thread-max-width)*0.8)] sm:max-w-[70%] break-words leading-7 col-span-2 py-2 col-start-2 row-start-1", children: /* @__PURE__ */ jsx(
      MessagePrimitive.Content,
      {
        components: { Text: MarkdownText, tools: { Fallback: ToolFallbackCustom || ToolFallback$1 } }
      }
    ) }),
    /* @__PURE__ */ jsx(AssistantActionBar, {}),
    /* @__PURE__ */ jsx(BranchPicker, { className: "col-start-2 row-start-2 -ml-2 mr-2" })
  ] });
};
const BranchPicker = ({ className, ...rest }) => {
  return /* @__PURE__ */ jsxs(
    BranchPickerPrimitive.Root,
    {
      hideWhenSingleBranch: true,
      className: cn("text-muted-foreground inline-flex items-center text-xs", className),
      ...rest,
      children: [
        /* @__PURE__ */ jsx(BranchPickerPrimitive.Previous, { asChild: true, children: /* @__PURE__ */ jsx(TooltipIconButton, { tooltip: "Previous", children: /* @__PURE__ */ jsx(ChevronLeftIcon, {}) }) }),
        /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
          /* @__PURE__ */ jsx(BranchPickerPrimitive.Number, {}),
          " / ",
          /* @__PURE__ */ jsx(BranchPickerPrimitive.Count, {})
        ] }),
        /* @__PURE__ */ jsx(BranchPickerPrimitive.Next, { asChild: true, children: /* @__PURE__ */ jsx(TooltipIconButton, { tooltip: "Next", children: /* @__PURE__ */ jsx(ChevronRightIcon, {}) }) })
      ]
    }
  );
};
const AssistantActionBar = () => {
  return /* @__PURE__ */ jsx(
    ActionBarPrimitive.Root,
    {
      hideWhenRunning: true,
      autohide: "not-last",
      autohideFloat: "single-branch",
      className: "text-muted-foreground flex gap-1 col-start-3 row-start-2 -ml-1",
      children: /* @__PURE__ */ jsx(ActionBarPrimitive.Copy, { asChild: true, children: /* @__PURE__ */ jsxs(TooltipIconButton, { tooltip: "Copy", children: [
        /* @__PURE__ */ jsx(MessagePrimitive.If, { copied: true, children: /* @__PURE__ */ jsx(CheckIcon, {}) }),
        /* @__PURE__ */ jsx(MessagePrimitive.If, { copied: false, children: /* @__PURE__ */ jsx(CopyIcon, {}) })
      ] }) })
    }
  );
};

const UserMessage = () => {
  return /* @__PURE__ */ jsx(
    MessagePrimitive.Root,
    {
      style: {
        placeItems: "end"
      },
      className: "grid w-full",
      children: /* @__PURE__ */ jsx(
        "div",
        {
          style: {
            maxWidth: "60%"
          },
          className: "bg-primary w-fit text-primary-foreground max-w-[calc(var(--thread-max-width)*0.8)] sm:max-w-[60%] break-words rounded-xl px-3 py-2 text-sm col-start-2 row-start-2",
          children: /* @__PURE__ */ jsx(MessagePrimitive.Content, {})
        }
      )
    }
  );
};

const useAutoscroll = (ref, { enabled = true }) => {
  const shouldScrollRef = useRef(enabled);
  React__default.useEffect(() => {
    if (!enabled) return;
    if (!ref?.current) return;
    const area = ref.current;
    const observer = new MutationObserver(() => {
      if (shouldScrollRef.current) {
        area.scrollTo({ top: area.scrollHeight, behavior: "smooth" });
      }
    });
    observer.observe(area, {
      childList: true,
      // observe direct children changes
      subtree: true,
      // observe all descendants
      characterData: true
      // observe text content changes
    });
    const handleScroll = (e) => {
      const scrollElement = e.target;
      const currentPosition = scrollElement.scrollTop + scrollElement.clientHeight;
      const totalHeight = scrollElement.scrollHeight;
      const isAtEnd = currentPosition >= totalHeight - 1;
      if (isAtEnd) {
        shouldScrollRef.current = true;
      } else {
        shouldScrollRef.current = false;
      }
    };
    area.addEventListener("scroll", handleScroll);
    return () => {
      area.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [enabled, ref]);
};

const suggestions = ["What capabilities do you have?", "How can you help me?", "Tell me about yourself"];
const Thread = ({
  memory,
  ToolFallback
}) => {
  function WrappedAssistantMessage(props) {
    return /* @__PURE__ */ jsx(AssistantMessage, { ...props, ToolFallback });
  }
  const areaRef = useRef(null);
  useAutoscroll(areaRef, { enabled: true });
  return /* @__PURE__ */ jsxs(
    ThreadPrimitive.Root,
    {
      style: {
        margin: "0 auto"
      },
      className: "bg-background  flex flex-col box-border relative h-full",
      children: [
        /* @__PURE__ */ jsxs(
          ThreadPrimitive.Viewport,
          {
            style: {
              paddingTop: "2rem",
              background: "inherit",
              scrollBehavior: "smooth",
              overflowY: "scroll",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: memory ? "calc(100vh - 65px)" : "calc(100vh - 90px)",
              paddingBottom: "108px"
            },
            ref: areaRef,
            autoScroll: false,
            children: [
              /* @__PURE__ */ jsxs("div", { style: { width: "100%", maxWidth: "48rem", paddingInline: "1.5rem" }, children: [
                /* @__PURE__ */ jsx(ThreadWelcome, {}),
                /* @__PURE__ */ jsx(
                  ThreadPrimitive.Messages,
                  {
                    components: {
                      UserMessage,
                      EditComposer,
                      AssistantMessage: WrappedAssistantMessage
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(ThreadPrimitive.If, { empty: false, children: /* @__PURE__ */ jsx("div", { className: "min-h-8 flex-grow" }) })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              width: "100%",
              maxWidth: "48rem",
              position: "absolute",
              bottom: 0,
              margin: "0 auto",
              zIndex: 10,
              paddingBottom: "0.5em",
              left: "50%",
              transform: "translate(-50%)",
              background: "#0f0f0f"
            },
            className: "px-4",
            children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsx(ThreadPrimitive.Empty, { children: /* @__PURE__ */ jsx(ThreadWelcomeSuggestions, {}) }),
              /* @__PURE__ */ jsx(Composer, {}),
              !memory && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-sm text-mastra-el-5", children: [
                /* @__PURE__ */ jsxs(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "14",
                    height: "14",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    className: "text-purple-400",
                    children: [
                      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
                      /* @__PURE__ */ jsx("path", { d: "M12 16v-4" }),
                      /* @__PURE__ */ jsx("path", { d: "M12 8h.01" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-300/60", children: [
                  "Agent will not remember previous messages. To enable memory for agent see",
                  " ",
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: "https://mastra.ai/docs/agents/agent-memory",
                      target: "_blank",
                      rel: "noopener",
                      className: "text-gray-300/60 hover:text-gray-100 underline",
                      children: "docs."
                    }
                  )
                ] })
              ] })
            ] })
          }
        )
      ]
    }
  );
};
const ThreadWelcome = () => {
  return /* @__PURE__ */ jsx(ThreadPrimitive.Empty, { children: /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        maxWidth: "48rem",
        margin: "0 auto"
      },
      className: "max-w-[48rem] flex w-full flex-grow flex-col",
      children: /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-grow flex-col items-center justify-center", children: [
        /* @__PURE__ */ jsx(Avatar, { children: /* @__PURE__ */ jsx(AvatarFallback, { children: "C" }) }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 font-medium", children: "How can I help you today?" })
      ] })
    }
  ) });
};
const ThreadWelcomeSuggestions = () => {
  return /* @__PURE__ */ jsx("div", { className: "mt-3 flex w-full items-stretch justify-center gap-4", children: suggestions.map((suggestion) => /* @__PURE__ */ jsx(
    ThreadPrimitive.Suggestion,
    {
      className: "hover:bg-muted/80 flex max-w-sm grow basis-0 flex-col items-center justify-center rounded-lg border p-3 transition-colors ease-in",
      prompt: suggestion,
      method: "replace",
      autoSend: true,
      children: /* @__PURE__ */ jsx("span", { className: "line-clamp-2 text-ellipsis text-sm font-medium", children: suggestion })
    },
    suggestion
  )) });
};
const Composer = () => {
  return /* @__PURE__ */ jsxs(
    ComposerPrimitive.Root,
    {
      style: {
        borderRadius: "16px",
        background: "#0f0f0f",
        boxShadow: "0px 8px 0px 0px #0f0f0f"
      },
      className: "relative focus-within:border-ring/20 flex w-full flex-wrap items-end border bg-inherit px-2.5 shadow-sm transition-colors ease-in",
      children: [
        /* @__PURE__ */ jsx(ComposerPrimitive.Input, { asChild: true, children: /* @__PURE__ */ jsx(
          "textarea",
          {
            style: {
              height: "98px"
            },
            className: "placeholder:text-muted-foreground max-h-40 w-full flex-grow resize-none border-none bg-transparent px-2 py-4 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed",
            autoFocus: true,
            placeholder: "Write a message...",
            name: "",
            id: ""
          }
        ) }),
        /* @__PURE__ */ jsx(ComposerAction, {})
      ]
    }
  );
};
const ComposerAction = () => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(ThreadPrimitive.If, { running: false, children: /* @__PURE__ */ jsx(ComposerPrimitive.Send, { asChild: true, children: /* @__PURE__ */ jsx(
      TooltipIconButton,
      {
        tooltip: "Send",
        variant: "default",
        style: {
          marginBottom: "0.625rem",
          position: "absolute",
          right: "0.75rem",
          height: "2rem",
          width: "2rem",
          borderRadius: "50%",
          padding: "0.5rem",
          transition: "opacity 0.2s ease-in"
        },
        children: /* @__PURE__ */ jsx(ArrowUp, { className: "h-6 w-6" })
      }
    ) }) }),
    /* @__PURE__ */ jsx(ThreadPrimitive.If, { running: true, children: /* @__PURE__ */ jsx(ComposerPrimitive.Cancel, { asChild: true, children: /* @__PURE__ */ jsx(
      TooltipIconButton,
      {
        tooltip: "Cancel",
        variant: "default",
        style: {
          marginBottom: "0.625rem",
          position: "absolute",
          right: "0.75rem",
          height: "2rem",
          width: "2rem",
          padding: "0.5rem",
          transition: "opacity 0.2s ease-in",
          borderRadius: "50%"
        },
        children: /* @__PURE__ */ jsx(CircleStopIcon, {})
      }
    ) }) })
  ] });
};
const EditComposer = () => {
  return /* @__PURE__ */ jsxs(
    ComposerPrimitive.Root,
    {
      style: {
        maxWidth: "48rem",
        margin: "0 auto"
      },
      className: "bg-muted max-w-[48rem] my-4 flex w-full flex-col gap-2 rounded-xl",
      children: [
        /* @__PURE__ */ jsx(ComposerPrimitive.Input, { className: "text-foreground flex h-8 w-full resize-none bg-transparent p-4 pb-0 outline-none" }),
        /* @__PURE__ */ jsxs("div", { className: "mx-3 mb-3 flex items-center justify-center gap-2 self-end", children: [
          /* @__PURE__ */ jsx(ComposerPrimitive.Cancel, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", children: "Cancel" }) }),
          /* @__PURE__ */ jsx(ComposerPrimitive.Send, { asChild: true, children: /* @__PURE__ */ jsx(Button, { children: "Send" }) })
        ] })
      ]
    }
  );
};
const CircleStopIcon = () => {
  return /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 16 16", fill: "currentColor", width: "16", height: "16", children: /* @__PURE__ */ jsx("rect", { width: "10", height: "10", x: "3", y: "3", rx: "2" }) });
};

const convertMessage$1 = (message) => {
  return message;
};
function MastraRuntimeProvider({
  children,
  agentId,
  initialMessages,
  agentName,
  memory,
  threadId,
  baseUrl,
  refreshThreadList,
  modelSettings = {}
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentThreadId, setCurrentThreadId] = useState(threadId);
  const { frequencyPenalty, presencePenalty, maxRetries, maxSteps, maxTokens, temperature, topK, topP, instructions } = modelSettings;
  useEffect(() => {
    const hasNewInitialMessages = initialMessages && initialMessages?.length > messages?.length;
    if (messages.length === 0 || currentThreadId !== threadId || hasNewInitialMessages && currentThreadId === threadId) {
      if (initialMessages && threadId && memory) {
        const convertedMessages = initialMessages?.map((message) => {
          if (message?.toolInvocations?.length > 0) {
            return {
              ...message,
              content: message.toolInvocations.map((toolInvocation) => ({
                type: "tool-call",
                toolCallId: toolInvocation?.toolCallId,
                toolName: toolInvocation?.toolName,
                args: toolInvocation?.args,
                result: toolInvocation?.result
              }))
            };
          }
          return message;
        }).filter(Boolean);
        setMessages(convertedMessages);
        setCurrentThreadId(threadId);
      }
    }
  }, [initialMessages, threadId, memory]);
  const mastra = new MastraClient({
    baseUrl: baseUrl || ""
  });
  const agent = mastra.getAgent(agentId);
  const onNew = async (message) => {
    if (message.content[0]?.type !== "text") throw new Error("Only text messages are supported");
    const input = message.content[0].text;
    setMessages((currentConversation) => [...currentConversation, { role: "user", content: input }]);
    setIsRunning(true);
    try {
      let updater = function() {
        setMessages((currentConversation) => {
          const message2 = {
            role: "assistant",
            content: [{ type: "text", text: content }]
          };
          if (!assistantMessageAdded) {
            assistantMessageAdded = true;
            return [...currentConversation, message2];
          }
          return [...currentConversation.slice(0, -1), message2];
        });
      };
      const response = await agent.stream({
        messages: [
          {
            role: "user",
            content: input
          }
        ],
        runId: agentId,
        frequencyPenalty,
        presencePenalty,
        maxRetries,
        maxSteps,
        maxTokens,
        temperature,
        topK,
        topP,
        instructions,
        ...memory ? { threadId, resourceId: agentId } : {}
      });
      if (!response.body) {
        throw new Error("No response body");
      }
      const parts = [];
      let content = "";
      let currentTextPart = null;
      let assistantMessageAdded = false;
      await response.processDataStream({
        onTextPart(value) {
          if (currentTextPart == null) {
            currentTextPart = {
              type: "text",
              text: value
            };
            parts.push(currentTextPart);
          } else {
            currentTextPart.text += value;
          }
          content += value;
          updater();
        },
        async onToolCallPart(value) {
          setMessages((currentConversation) => {
            const lastMessage = currentConversation[currentConversation.length - 1];
            if (lastMessage && lastMessage.role === "assistant") {
              const updatedMessage = {
                ...lastMessage,
                content: Array.isArray(lastMessage.content) ? [
                  ...lastMessage.content,
                  {
                    type: "tool-call",
                    toolCallId: value.toolCallId,
                    toolName: value.toolName,
                    args: value.args
                  }
                ] : [
                  ...typeof lastMessage.content === "string" ? [{ type: "text", text: lastMessage.content }] : [],
                  {
                    type: "tool-call",
                    toolCallId: value.toolCallId,
                    toolName: value.toolName,
                    args: value.args
                  }
                ]
              };
              return [...currentConversation.slice(0, -1), updatedMessage];
            }
            const newMessage = {
              role: "assistant",
              content: [
                { type: "text", text: content },
                {
                  type: "tool-call",
                  toolCallId: value.toolCallId,
                  toolName: value.toolName,
                  args: value.args
                }
              ]
            };
            return [...currentConversation, newMessage];
          });
        },
        async onToolResultPart(value) {
          setMessages((currentConversation) => {
            const lastMessage = currentConversation[currentConversation.length - 1];
            if (lastMessage && lastMessage.role === "assistant" && Array.isArray(lastMessage.content)) {
              const updatedContent = lastMessage.content.map((part) => {
                if (typeof part === "object" && part.type === "tool-call" && part.toolCallId === value.toolCallId) {
                  return {
                    ...part,
                    result: value.result
                  };
                }
                return part;
              });
              const updatedMessage = {
                ...lastMessage,
                content: updatedContent
              };
              return [...currentConversation.slice(0, -1), updatedMessage];
            }
            return currentConversation;
          });
        },
        onErrorPart(error) {
          throw new Error(error);
        }
      });
      setIsRunning(false);
      setTimeout(() => {
        refreshThreadList?.();
      }, 500);
    } catch (error) {
      console.error("Error occurred in MastraRuntimeProvider", error);
      setIsRunning(false);
      setMessages((currentConversation) => [
        ...currentConversation,
        { role: "assistant", content: [{ type: "text", text: `Error: ${error}` }] }
      ]);
    }
  };
  const runtime = useExternalStoreRuntime({
    isRunning,
    messages,
    convertMessage: convertMessage$1,
    onNew
  });
  return /* @__PURE__ */ jsxs(AssistantRuntimeProvider, { runtime, children: [
    " ",
    children,
    " "
  ] });
}

const defaultModelSettings = {
  maxRetries: 2,
  maxSteps: 5,
  temperature: 0.5,
  topP: 1
};
const AgentContext = createContext({});
function AgentProvider({ children }) {
  const [modelSettings, setModelSettings] = useState(defaultModelSettings);
  const resetModelSettings = () => {
    setModelSettings(defaultModelSettings);
  };
  return /* @__PURE__ */ jsx(
    AgentContext.Provider,
    {
      value: {
        modelSettings,
        setModelSettings,
        resetModelSettings
      },
      children
    }
  );
}

const AgentChat = ({
  agentId,
  agentName,
  threadId,
  initialMessages,
  memory,
  baseUrl,
  refreshThreadList
}) => {
  const { modelSettings } = useContext(AgentContext);
  return /* @__PURE__ */ jsx(
    MastraRuntimeProvider,
    {
      agentId,
      agentName,
      threadId,
      initialMessages,
      memory,
      baseUrl,
      refreshThreadList,
      modelSettings,
      children: /* @__PURE__ */ jsx(Thread, { memory })
    }
  );
};

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge$1({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}

function CopyableContent({ content, label, multiline = false }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };
  return /* @__PURE__ */ jsxs("div", { className: "group relative flex items-start gap-2", children: [
    /* @__PURE__ */ jsx("span", { className: cn("text-sm text-mastra-el-4", multiline ? "whitespace-pre-wrap" : "truncate"), children: content }),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "ghost",
        size: "sm",
        className: "opacity-0 group-hover:opacity-100 transition-opacity shrink-0 -mt-1",
        onClick: (e) => {
          e.stopPropagation();
          handleCopy();
        },
        "aria-label": `Copy ${label}`,
        children: /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" })
      }
    )
  ] });
}

function FormattedDate({ date }) {
  const formattedDate = {
    relativeTime: formatDistanceToNow(new Date(date), { addSuffix: true }),
    fullDate: format(new Date(date), "PPpp")
  };
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsx(TooltipTrigger, { className: "text-left text-sm text-mastra-el-4", children: formattedDate.relativeTime }),
    /* @__PURE__ */ jsx(TooltipContent, { className: "bg-mastra-bg-1 text-mastra-el-1", children: /* @__PURE__ */ jsx("p", { className: "text-sm", children: formattedDate.fullDate }) })
  ] }) });
}

const inputVariants = cva(
  "flex w-full text-mastra-el-6 rounded-sm border bg-transparent shadow-sm focus-visible:ring-ring transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-mastra-border-1 border-border-1 placeholder:text-muted-foreground",
        filled: "bg-inputFill border-border-1 placeholder:text-muted-foreground",
        unstyled: "border-0 bg-transparent placeholder:text-muted-foreground focus-visible:ring-transparent focus-visible:outline-none"
      },
      customSize: {
        default: "px-[13px] text-[calc(13_/_16_*_1rem)] h-[34px]",
        sm: "h-[30px] px-[13px] text-xs",
        lg: "h-10 px-[17px] rounded-md text-[calc(13_/_16_*_1rem)]"
      }
    },
    defaultVariants: {
      variant: "default",
      customSize: "default"
    }
  }
);
const Input = React.forwardRef(
  ({ className, customSize, testId, variant, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(className, inputVariants({ variant, customSize, className })),
        "data-testid": testId,
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";

function ScoreIndicator({ score }) {
  return /* @__PURE__ */ jsx(Badge$1, { variant: "secondary", children: score.toFixed(2) });
}

function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn("animate-pulse rounded-md bg-muted/50", className), ...props });
}

const Table = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("table", { ref, className: cn("w-full caption-bottom text-sm border-spacing-0", className), ...props })
);
Table.displayName = "Table";
const TableHeader = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("thead", { ref, className: cn("[&_tr]:border-b-[0.5px]", className), ...props })
);
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("tbody", { ref, className: cn("[&_tr:last-child]:border-0", className), ...props })
);
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("tfoot", { ref, className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className), ...props })
);
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "tr",
    {
      ref,
      className: cn(
        "border-b-[0.5px] border-mastra-border-1 transition-colors hover:bg-muted/50 data-[state=selected]:bg-mastra-bg-4/70",
        className
      ),
      ...props
    }
  )
);
TableRow.displayName = "TableRow";
const TableHead = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "th",
    {
      ref,
      className: cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className
      ),
      ...props
    }
  )
);
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("td", { ref, className: cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className), ...props })
);
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("caption", { ref, className: cn("mt-4 text-sm text-muted-foreground", className), ...props })
);
TableCaption.displayName = "TableCaption";

const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.List, { ref, className: cn(className), ...props }));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.Trigger, { ref, className: cn(className), ...props }));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

const useEvalsByAgentId = (agentId, type, baseUrl) => {
  const [evals, setEvals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const client = new MastraClient({
    baseUrl: baseUrl || ""
  });
  const fetchEvals = async (_agentId) => {
    setIsLoading(true);
    const activeAgentId = _agentId ?? agentId;
    try {
      const res = type === "live" ? await client.getAgent(activeAgentId).liveEvals() : await client.getAgent(activeAgentId).evals();
      setEvals(res.evals);
    } catch (error) {
      setEvals([]);
      console.error("Error fetching evals", error);
      toast.error("Error fetching evals");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchEvals(agentId);
  }, [agentId]);
  return { evals, isLoading, refetchEvals: fetchEvals };
};

const AgentEvalsContext = createContext({ handleRefresh: () => {
}, isLoading: true });
const scrollableContentClass = cn(
  "relative overflow-y-auto overflow-x-hidden invisible hover:visible focus:visible",
  "[&::-webkit-scrollbar]:w-1",
  "[&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:rounded-full",
  "[&::-webkit-scrollbar-thumb]:bg-mastra-border/20",
  "[&>*]:visible"
);
const tabIndicatorClass = cn(
  "px-4 py-2 text-sm transition-all border-b-2 border-transparent",
  "data-[state=active]:border-white data-[state=active]:text-white font-medium",
  "data-[state=inactive]:text-mastra-el-4 hover:data-[state=inactive]:text-mastra-el-2",
  "focus-visible:outline-none"
);
const tabContentClass = cn("data-[state=inactive]:mt-0 min-h-0 h-full grid grid-rows-[1fr]");
function AgentEvals({ agentId, baseUrl }) {
  const [activeTab, setActiveTab] = useState("live");
  const {
    evals: liveEvals,
    isLoading: isLiveLoading,
    refetchEvals: refetchLiveEvals
  } = useEvalsByAgentId(agentId, "live", baseUrl);
  const {
    evals: ciEvals,
    isLoading: isCiLoading,
    refetchEvals: refetchCiEvals
  } = useEvalsByAgentId(agentId, "ci", baseUrl);
  const contextValue = {
    handleRefresh,
    isLoading: activeTab === "live" ? isLiveLoading : isCiLoading
  };
  function handleRefresh() {
    if (activeTab === "live") {
      refetchLiveEvals();
    } else {
      refetchCiEvals();
    }
  }
  return /* @__PURE__ */ jsx(AgentEvalsContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsxs(
    Tabs,
    {
      value: activeTab,
      onValueChange: (value) => setActiveTab(value),
      className: "grid grid-rows-[auto_1fr] h-full min-h-0 pb-2",
      children: [
        /* @__PURE__ */ jsx("div", { className: "border-b border-mastra-border/10", children: /* @__PURE__ */ jsxs(TabsList, { className: "bg-transparent border-0 h-auto mx-4", children: [
          /* @__PURE__ */ jsx(TabsTrigger, { value: "live", className: tabIndicatorClass, children: "Live" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "ci", className: tabIndicatorClass, children: "CI" })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "live", className: tabContentClass, children: /* @__PURE__ */ jsx(EvalTable, { evals: liveEvals, isCIMode: false }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "ci", className: tabContentClass, children: /* @__PURE__ */ jsx(EvalTable, { evals: ciEvals, isCIMode: true }) })
      ]
    }
  ) });
}
function EvalTable({ evals, isCIMode = false }) {
  const { handleRefresh, isLoading: isTableLoading } = useContext(AgentEvalsContext);
  const [expandedMetrics, setExpandedMetrics] = useState(/* @__PURE__ */ new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ field: "metricName", direction: "asc" });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-0 grid grid-rows-[auto_1fr]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-4 rounded-lg", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-mastra-el-3" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "search-input",
            placeholder: "Search metrics, inputs, or outputs...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "pl-10"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Badge$1, { variant: "secondary", className: "text-xs", children: [
        evals.length,
        " Total Evaluations"
      ] }),
      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: handleRefresh, disabled: isTableLoading, className: "h-9 w-9", children: isTableLoading ? /* @__PURE__ */ jsx(RefreshCcwIcon, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(RefreshCcwIcon, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-auto", children: /* @__PURE__ */ jsxs(Table, { className: "w-full", children: [
      /* @__PURE__ */ jsx(TableHeader, { className: "bg-mastra-bg-2 h-[var(--table-header-height)] sticky top-0 z-10", children: /* @__PURE__ */ jsxs(TableRow, { className: "border-gray-6 border-b-[0.1px] text-[0.8125rem]", children: [
        /* @__PURE__ */ jsx(TableHead, { className: "w-12 h-12" }),
        /* @__PURE__ */ jsx(
          TableHead,
          {
            className: "min-w-[200px] max-w-[30%] text-mastra-el-3 cursor-pointer",
            onClick: () => toggleSort("metricName"),
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              "Metric ",
              getSortIcon("metricName")
            ] })
          }
        ),
        /* @__PURE__ */ jsx(TableHead, { className: "flex-1 text-mastra-el-3" }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-48 text-mastra-el-3 cursor-pointer", onClick: () => toggleSort("averageScore"), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          "Average Score ",
          getSortIcon("averageScore")
        ] }) }),
        /* @__PURE__ */ jsx(TableHead, { className: "w-48 text-mastra-el-3", children: "Evaluations" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { className: "border-b border-gray-6 relative", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", presenceAffectsLayout: false, children: isTableLoading ? Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ jsxs(TableRow, { className: "border-b-gray-6 border-b-[0.1px] text-[0.8125rem]", children: [
        /* @__PURE__ */ jsx(TableCell, { className: "w-12 h-12", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-8 rounded-full" }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "min-w-[200px] max-w-[30%]", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-3/4" }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "flex-1", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "w-48", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-20" }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "w-48", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-20" }) })
      ] }, i)) : groupEvals(evals).length === 0 ? /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { className: "h-12 w-16" }),
        /* @__PURE__ */ jsx(TableCell, { colSpan: 4, className: "h-32 px-4 text-center text-mastra-el-3", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
          /* @__PURE__ */ jsx(Search, { className: "size-5" }),
          /* @__PURE__ */ jsx("p", { children: "No evaluations found" }),
          searchTerm && /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Try adjusting your search terms" })
        ] }) })
      ] }) : groupEvals(evals).map((group) => /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
        /* @__PURE__ */ jsxs(
          TableRow,
          {
            className: "border-b-gray-6 border-b-[0.1px] text-[0.8125rem] cursor-pointer hover:bg-mastra-bg-3",
            onClick: () => toggleMetric(group.metricName),
            children: [
              /* @__PURE__ */ jsx(TableCell, { className: "w-12", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-full flex items-center justify-center", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: cn(
                    "transform transition-transform duration-200",
                    expandedMetrics.has(group.metricName) ? "rotate-90" : ""
                  ),
                  children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 text-mastra-el-5" })
                }
              ) }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "min-w-[200px] max-w-[30%] font-medium text-mastra-el-5", children: group.metricName }),
              /* @__PURE__ */ jsx(TableCell, { className: "flex-1 text-mastra-el-5" }),
              /* @__PURE__ */ jsx(TableCell, { className: "w-48 text-mastra-el-5", children: /* @__PURE__ */ jsx(ScoreIndicator, { score: group.averageScore }) }),
              /* @__PURE__ */ jsx(TableCell, { className: "w-48 text-mastra-el-5", children: /* @__PURE__ */ jsx(Badge$1, { variant: "secondary", children: group.evals.length }) })
            ]
          }
        ),
        expandedMetrics.has(group.metricName) && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(
          TableCell,
          {
            colSpan: 5 + (getHasReasons(group.evals) ? 1 : 0) + (isCIMode ? 1 : 0),
            className: "p-0",
            children: /* @__PURE__ */ jsx("div", { className: "bg-mastra-bg-3 rounded-lg m-2", children: /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxs(Table, { className: "w-full", children: [
              /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "text-[0.7rem] text-mastra-el-3 hover:bg-transparent", children: [
                /* @__PURE__ */ jsx(TableHead, { className: "pl-12 w-[120px]", children: "Timestamp" }),
                /* @__PURE__ */ jsx(TableHead, { className: "w-[300px]", children: "Instructions" }),
                /* @__PURE__ */ jsx(TableHead, { className: "w-[300px]", children: "Input" }),
                /* @__PURE__ */ jsx(TableHead, { className: "w-[300px]", children: "Output" }),
                /* @__PURE__ */ jsx(TableHead, { className: "w-[80px]", children: "Score" }),
                getHasReasons(group.evals) && /* @__PURE__ */ jsx(TableHead, { className: "w-[250px]", children: "Reason" }),
                isCIMode && /* @__PURE__ */ jsx(TableHead, { className: "w-[120px]", children: "Test Name" })
              ] }) }),
              /* @__PURE__ */ jsx(TableBody, { children: group.evals.map((evaluation, index) => /* @__PURE__ */ jsxs(
                TableRow,
                {
                  className: "text-[0.8125rem] hover:bg-mastra-bg-2/50",
                  children: [
                    /* @__PURE__ */ jsx(TableCell, { className: "pl-12 text-mastra-el-4 align-top py-4", children: /* @__PURE__ */ jsx(FormattedDate, { date: evaluation.createdAt }) }),
                    /* @__PURE__ */ jsx(TableCell, { className: "text-mastra-el-4 align-top py-4", children: /* @__PURE__ */ jsx("div", { className: cn("max-w-[300px] max-h-[200px]", scrollableContentClass), children: /* @__PURE__ */ jsx(
                      CopyableContent,
                      {
                        content: evaluation.instructions,
                        label: "instructions",
                        multiline: true
                      }
                    ) }) }),
                    /* @__PURE__ */ jsx(TableCell, { className: "text-mastra-el-4 align-top py-4", children: /* @__PURE__ */ jsx("div", { className: cn("max-w-[300px] max-h-[200px]", scrollableContentClass), children: /* @__PURE__ */ jsx(CopyableContent, { content: evaluation.input, label: "input", multiline: true }) }) }),
                    /* @__PURE__ */ jsx(TableCell, { className: "text-mastra-el-4 align-top py-4", children: /* @__PURE__ */ jsx("div", { className: cn("max-w-[300px] max-h-[200px]", scrollableContentClass), children: /* @__PURE__ */ jsx(CopyableContent, { content: evaluation.output, label: "output", multiline: true }) }) }),
                    /* @__PURE__ */ jsx(TableCell, { className: "text-mastra-el-4 align-top py-4", children: /* @__PURE__ */ jsx(ScoreIndicator, { score: evaluation.result.score }) }),
                    getHasReasons(group.evals) && /* @__PURE__ */ jsx(TableCell, { className: "text-mastra-el-4 align-top py-4", children: /* @__PURE__ */ jsx("div", { className: cn("max-w-[300px] max-h-[200px]", scrollableContentClass), children: /* @__PURE__ */ jsx(
                      CopyableContent,
                      {
                        content: evaluation.result.info?.reason || "",
                        label: "reason",
                        multiline: true
                      }
                    ) }) }),
                    isCIMode && /* @__PURE__ */ jsx(TableCell, { className: "text-mastra-el-4 align-top py-4", children: evaluation.testInfo?.testName && /* @__PURE__ */ jsx(Badge$1, { variant: "secondary", className: "text-xs", children: evaluation.testInfo.testName }) })
                  ]
                },
                `${group.metricName}-${index}`
              )) })
            ] }) }) })
          }
        ) })
      ] }, group.metricName)) }) })
    ] }) })
  ] });
  function getHasReasons(groupEvals2) {
    return groupEvals2.some((eval_) => eval_.result.info?.reason);
  }
  function toggleMetric(metricName) {
    const newExpanded = new Set(expandedMetrics);
    if (newExpanded.has(metricName)) {
      newExpanded.delete(metricName);
    } else {
      newExpanded.add(metricName);
    }
    setExpandedMetrics(newExpanded);
  }
  function toggleSort(field) {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc"
    }));
  }
  function getSortIcon(field) {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === "asc" ? /* @__PURE__ */ jsx(SortAsc, { className: "h-4 w-4 ml-1" }) : /* @__PURE__ */ jsx(SortDesc, { className: "h-4 w-4 ml-1" });
  }
  function groupEvals(evaluations) {
    let groups = evaluations.reduce((groups2, evaluation) => {
      const existingGroup = groups2.find((g) => g.metricName === evaluation.metricName);
      if (existingGroup) {
        existingGroup.evals.push(evaluation);
        existingGroup.averageScore = existingGroup.evals.reduce((sum, e) => sum + e.result.score, 0) / existingGroup.evals.length;
      } else {
        groups2.push({
          metricName: evaluation.metricName,
          averageScore: evaluation.result.score,
          evals: [evaluation]
        });
      }
      return groups2;
    }, []);
    if (searchTerm) {
      groups = groups.filter(
        (group) => group.metricName.toLowerCase().includes(searchTerm.toLowerCase()) || group.evals.some(
          (metric) => metric.input?.toLowerCase().includes(searchTerm.toLowerCase()) || metric.output?.toLowerCase().includes(searchTerm.toLowerCase()) || metric.instructions?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    groups.sort((a, b) => {
      const direction = sortConfig.direction === "asc" ? 1 : -1;
      switch (sortConfig.field) {
        case "metricName":
          return direction * a.metricName.localeCompare(b.metricName);
        case "averageScore":
          return direction * (a.averageScore - b.averageScore);
        default:
          return 0;
      }
    });
    return groups;
  }
}

const useResizeColumn = ({
  defaultWidth,
  minimumWidth,
  maximumWidth,
  setCurrentWidth
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(defaultWidth);
  const containerRef = useRef(null);
  const dragStartXRef = useRef(0);
  const initialWidthRef = useRef(0);
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    initialWidthRef.current = sidebarWidth;
  };
  useEffect(() => {
    setSidebarWidth(defaultWidth);
    setCurrentWidth?.(defaultWidth);
  }, [defaultWidth]);
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const deltaX = dragStartXRef.current - e.clientX;
      const deltaPercentage = deltaX / containerWidth * 100;
      const newWidth = Math.min(Math.max(initialWidthRef.current + deltaPercentage, minimumWidth), maximumWidth);
      setSidebarWidth(newWidth);
      setCurrentWidth?.(newWidth);
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);
  return { sidebarWidth, isDragging, handleMouseDown, containerRef };
};

const MastraResizablePanel = ({
  children,
  defaultWidth,
  minimumWidth,
  maximumWidth,
  className,
  disabled = false,
  setCurrentWidth,
  dividerPosition = "left"
}) => {
  const { sidebarWidth, isDragging, handleMouseDown, containerRef } = useResizeColumn({
    defaultWidth: disabled ? 100 : defaultWidth,
    minimumWidth,
    maximumWidth,
    setCurrentWidth
  });
  return /* @__PURE__ */ jsxs("div", { className: cn("w-full h-full relative", className), ref: containerRef, style: { width: `${sidebarWidth}%` }, children: [
    !disabled && dividerPosition === "left" ? /* @__PURE__ */ jsx(
      "div",
      {
        className: `w-1 bg-mastra-bg-1 bg-[#121212] h-full cursor-col-resize hover:w-1.5 hover:bg-mastra-border-2 hover:bg-[#424242] active:bg-mastra-border-3 active:bg-[#3e3e3e] transition-colors absolute inset-y-0 -left-1 -right-1 z-10
          ${isDragging ? "bg-mastra-border-2 bg-[#424242] w-1.5 cursor- col-resize" : ""}`,
        onMouseDown: handleMouseDown
      }
    ) : null,
    children,
    !disabled && dividerPosition === "right" ? /* @__PURE__ */ jsx(
      "div",
      {
        className: `w-1 bg-mastra-bg-1 bg-[#121212] h-full cursor-col-resize hover:w-1.5 hover:bg-mastra-border-2 hover:bg-[#424242] active:bg-mastra-border-3 active:bg-[#3e3e3e] transition-colors absolute inset-y-0 -left-1 -right-1 z-10
          ${isDragging ? "bg-mastra-border-2 bg-[#424242] w-1.5 cursor- col-resize" : ""}`,
        onMouseDown: handleMouseDown
      }
    ) : null
  ] });
};

const ScrollArea = React.forwardRef(
  ({ className, children, viewPortClassName, maxHeight, autoScroll = false, ...props }, ref) => {
    const areaRef = React.useRef(null);
    useAutoscroll(areaRef, { enabled: autoScroll });
    return /* @__PURE__ */ jsxs(ScrollAreaPrimitive.Root, { ref, className: cn("relative overflow-hidden", className), ...props, children: [
      /* @__PURE__ */ jsx(
        ScrollAreaPrimitive.Viewport,
        {
          ref: areaRef,
          className: cn("h-full w-full rounded-[inherit] [&>div]:!block", viewPortClassName),
          style: maxHeight ? { maxHeight } : void 0,
          children
        }
      ),
      /* @__PURE__ */ jsx(ScrollBar, {}),
      /* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
    ] });
  }
);
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsx(
  ScrollAreaPrimitive.ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ScrollAreaPrimitive.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

const TraceContext = createContext({});
function TraceProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [trace, setTrace] = useState(null);
  const [traces, setTraces] = useState([]);
  const [currentTraceIndex, setCurrentTraceIndex] = useState(0);
  const [span, setSpan] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const nextTrace = () => {
    if (currentTraceIndex < traces.length - 1) {
      const nextIndex = currentTraceIndex + 1;
      setCurrentTraceIndex(nextIndex);
      const nextTrace2 = traces[nextIndex].trace;
      setTrace(nextTrace2);
      const parentSpan = nextTrace2.find((span2) => span2.parentSpanId === null) || nextTrace2[0];
      setSpan(parentSpan);
    }
  };
  const prevTrace = () => {
    if (currentTraceIndex > 0) {
      const prevIndex = currentTraceIndex - 1;
      setCurrentTraceIndex(prevIndex);
      const prevTrace2 = traces[prevIndex].trace;
      setTrace(prevTrace2);
      const parentSpan = prevTrace2.find((span2) => span2.parentSpanId === null) || prevTrace2[0];
      setSpan(parentSpan);
    }
  };
  const clearData = () => {
    setOpen(false);
    setTrace(null);
    setSpan(null);
    setOpenDetail(false);
  };
  return /* @__PURE__ */ jsx(
    TraceContext.Provider,
    {
      value: {
        isOpen: open,
        setIsOpen: setOpen,
        trace,
        setTrace,
        traces,
        setTraces,
        currentTraceIndex,
        setCurrentTraceIndex,
        nextTrace,
        prevTrace,
        span,
        setSpan,
        openDetail,
        setOpenDetail,
        clearData
      },
      children
    }
  );
}

function formatDuration(duration, fixedPoint = 2) {
  const durationInSecs = duration / 1e3;
  return durationInSecs.toFixed(fixedPoint);
}
function formatOtelTimestamp(otelTimestamp) {
  const date = new Date(otelTimestamp / 1e3);
  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true
  }).format(date);
}
function formatOtelTimestamp2(otelTimestamp) {
  const date = new Date(otelTimestamp / 1e6);
  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true
  }).format(date);
}
function transformKey(key) {
  if (key.includes(".argument.")) {
    return `Input`;
  }
  if (key.includes(".result")) {
    return "Output";
  }
  return key.split(".").join(" ").split("_");
}
function cleanString(string) {
  return string.replace(/\\n/g, "").replace(/\n/g, "").replace(/\s+/g, " ").trim();
}
const refineTraces = (traces, isWorkflow = false) => {
  const listOfSpanIds = /* @__PURE__ */ new Set();
  const newName = (name) => {
    if (name?.startsWith("workflow.") && isWorkflow) {
      return name?.split(".")?.slice(2)?.join(".");
    }
    if (name?.startsWith("agent.") && !isWorkflow) {
      return name?.split(".")?.slice(1)?.join(".");
    }
    return name;
  };
  const groupedTraces = traces?.reduce((acc, curr) => {
    const newCurr = { ...curr, name: newName(curr.name), duration: curr.endTime - curr.startTime };
    listOfSpanIds.add(curr.id);
    return { ...acc, [curr.traceId]: [...acc[curr.traceId] || [], newCurr] };
  }, {});
  const tracesData = Object.entries(groupedTraces).map(([key, value]) => {
    const parentSpan = value.find((span) => !span.parentSpanId || !listOfSpanIds.has(span.parentSpanId));
    const enrichedSpans = value.map((span) => ({
      ...span,
      parentSpanId: parentSpan?.id === span.id ? null : span?.parentSpanId,
      relativePercentage: parentSpan ? span.duration / parentSpan.duration : 0
    }));
    const failedStatus = value.find((span) => span.status.code !== 0)?.status;
    return {
      traceId: key,
      serviceName: parentSpan?.name || key,
      duration: parentSpan?.duration || value.reduce((acc, curr) => acc + curr.duration, 0),
      status: failedStatus || parentSpan?.status || value[0].status,
      started: value[0].startTime,
      trace: enrichedSpans
    };
  });
  return tracesData;
};
const allowedAiSpanAttributes = [
  "operation.name",
  "ai.operationId",
  "ai.model.provider",
  "ai.model.id",
  "ai.prompt.format",
  "ai.prompt.messages",
  "ai.prompt.tools",
  "ai.prompt.toolChoice",
  "ai.settings.toolChoice",
  "ai.schema",
  "ai.settings.output",
  "ai.response.object",
  "ai.response.text",
  "ai.response.timestamp",
  "componentName",
  "ai.usage.promptTokens",
  "ai.usage.completionTokens"
];

function Traces({ traces }) {
  const { trace: currentTrace } = useContext(TraceContext);
  const [prevTracesId, setPrevTracesId] = useState(/* @__PURE__ */ new Set());
  useEffect(() => {
    if (!prevTracesId.size && traces) {
      setPrevTracesId(new Set(traces.map((trace) => trace.traceId)));
    }
  }, [traces]);
  const isNew = (traceId) => {
    if (!prevTracesId.size) return false;
    return !prevTracesId.has(traceId);
  };
  const currentTraceParentSpan = currentTrace?.find((span) => span.parentSpanId === void 0) || currentTrace?.[0];
  return /* @__PURE__ */ jsx("div", { className: "h-full w-[calc(100%_-_325px)]", children: /* @__PURE__ */ jsx(ScrollArea, { className: "h-full", children: /* @__PURE__ */ jsxs(Table, { children: [
    /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 z-10 bg-[#0F0F0F]", style: { outline: "1px solid 0_0%_20.4%" }, children: /* @__PURE__ */ jsxs(TableRow, { className: "border-gray-6 border-b-[0.1px] text-[0.8125rem]", children: [
      /* @__PURE__ */ jsx(TableHead, { className: "text-mastra-el-3 h-10", children: "Trace" }),
      /* @__PURE__ */ jsxs(TableHead, { className: "text-mastra-el-3 flex items-center gap-1 h-10", children: [
        /* @__PURE__ */ jsx(Braces, { className: "h-3 w-3" }),
        " Trace Id"
      ] }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-mastra-el-3 h-10", children: "Started" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-mastra-el-3 h-10", children: "Total Duration" })
    ] }) }),
    /* @__PURE__ */ jsx(TableBody, { className: "border-b border-gray-6", children: !traces.length ? /* @__PURE__ */ jsx(TableRow, { className: "border-b-gray-6 border-b-[0.1px] text-[0.8125rem]", children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, className: "h-24 text-center", children: "No traces found" }) }) : traces.map((trace, index) => /* @__PURE__ */ jsxs(
      TableRow,
      {
        className: cn(
          "border-b-gray-6 border-b-[0.1px] text-[0.8125rem]",
          isNew(trace.traceId) ? "animate-fade-in" : "not-new",
          {
            "bg-muted/50": currentTraceParentSpan?.traceId === trace.traceId
          }
        ),
        children: [
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
            TraceButton,
            {
              trace: trace.trace,
              name: trace.serviceName,
              traceIndex: index,
              status: trace.status
            }
          ) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-mastra-el-5", children: trace.traceId }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-mastra-el-5 text-sm", children: formatOtelTimestamp(trace.started) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 text-[#F1CA5E]", children: [
            /* @__PURE__ */ jsx(Clock1, { className: "h-3 w-3" }),
            formatDuration(trace.duration, 3),
            "ms"
          ] }) })
        ]
      },
      trace.traceId
    )) })
  ] }) }) });
}
function TraceButton({
  trace,
  name,
  traceIndex,
  status
}) {
  const {
    setTrace,
    isOpen: open,
    setIsOpen: setOpen,
    trace: currentTrace,
    setSpan,
    setOpenDetail,
    setCurrentTraceIndex
  } = useContext(TraceContext);
  return /* @__PURE__ */ jsxs(
    Button,
    {
      variant: "ghost",
      className: "flex h-0 items-center gap-2 p-0",
      onClick: () => {
        setTrace(trace);
        const parentSpan = trace.find((span) => span.parentSpanId === null) || trace[0];
        setSpan(parentSpan);
        setCurrentTraceIndex(traceIndex);
        if (open && currentTrace?.[0]?.id !== trace[0].id) return;
        setOpen((prev) => !prev);
        setOpenDetail((prev) => !prev);
      },
      children: [
        status.code === 0 ? /* @__PURE__ */ jsx(
          "svg",
          {
            className: "h-3 w-3",
            xmlns: "http://www.w3.org/2000/svg",
            width: "13",
            height: "12",
            viewBox: "0 0 13 12",
            fill: "none",
            children: /* @__PURE__ */ jsx(
              "path",
              {
                fillRule: "evenodd",
                clipRule: "evenodd",
                d: "M6.37695 12C9.69067 12 12.377 9.31371 12.377 6C12.377 2.68629 9.69067 0 6.37695 0C3.06325 0 0.376953 2.68629 0.376953 6C0.376953 9.31371 3.06325 12 6.37695 12ZM9.62004 4.65344C9.87907 4.36036 9.8651 3.90005 9.58884 3.6253C9.3125 3.35055 8.87861 3.3654 8.61958 3.65847L5.6477 7.02105L4.08967 5.55197C3.80661 5.28508 3.37319 5.31213 3.12159 5.61237C2.87 5.91262 2.89549 6.37239 3.17854 6.63927L4.90294 8.26517C5.36588 8.70171 6.07235 8.6676 6.49598 8.18829L9.62004 4.65344Z",
                fill: "#6CD063"
              }
            )
          }
        ) : /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "#FF4500", width: "13", height: "12", children: /* @__PURE__ */ jsx(
          "path",
          {
            fillRule: "evenodd",
            d: "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z",
            clipRule: "evenodd"
          }
        ) }),
        /* @__PURE__ */ jsx("span", { className: "truncate max-w-[150px]", children: name })
      ]
    }
  );
}

function TreeNode({ node, depth = 0 }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const { setOpenDetail, setSpan, openDetail, span } = useContext(TraceContext);
  const containerRef = useRef(null);
  const widthPercentage = Math.min(node.relativePercentage ? node?.relativePercentage * 100 : 0, 100);
  return /* @__PURE__ */ jsxs("div", { ref: containerRef, children: [
    /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "ghost",
        className: cn("relative flex w-full items-center justify-start gap-2 py-3 pr-1 text-sm", {
          "text-accent-foreground bg-accent": span?.id === node.id
        }),
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          setSpan(node);
          if (openDetail && node.id !== span?.id) return;
          setOpenDetail(true);
        },
        style: { paddingLeft: `${depth > 0 ? depth * 35 + 28 - depth * 3 : 24}px` },
        children: [
          hasChildren ? /* @__PURE__ */ jsx(
            "div",
            {
              onClick: () => setIsExpanded(!isExpanded),
              className: "relative grid h-auto flex-shrink-0 place-items-center rounded-sm bg-mastra-bg-3 p-2",
              children: /* @__PURE__ */ jsx(
                "svg",
                {
                  className: cn("!h-2 !w-2 transition-transform", isExpanded ? "" : "-rotate-90"),
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "7",
                  height: "6",
                  viewBox: "0 0 7 6",
                  fill: "none",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M3.9338 5.5C3.74135 5.83333 3.26022 5.83333 3.06777 5.5L0.469694 0.999999C0.277244 0.666666 0.517814 0.25 0.902714 0.25L6.09886 0.25C6.48376 0.25 6.72433 0.666666 6.53188 1L3.9338 5.5Z",
                      fill: "#939393"
                    }
                  )
                }
              )
            }
          ) : null,
          /* @__PURE__ */ jsxs("div", { className: "flex w-full gap-4 pr-4", children: [
            /* @__PURE__ */ jsx(
              "p",
              {
                className: cn("max-w-[250px] text-sm", {
                  "text-white": node?.status?.code === 0,
                  "text-[#FF4500]": node?.status?.code !== 0,
                  "px-1": depth === 0,
                  truncate: containerRef.current?.offsetWidth && containerRef.current?.offsetWidth < 450 && depth > 1 && node.name?.length > 16
                }),
                children: node.name
              }
            ),
            node.duration > 0 && /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-[11px] h-px w-full bg-[hsl(220,14%,19%)]" }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    width: `${widthPercentage}%`,
                    left: 0
                  },
                  className: cn(
                    "absolute top-[9px] z-0 h-[5px] rounded-[5px] bg-white transition-all",
                    node.name.includes("agent") && "left-1/2 bg-green-500",
                    node.name.includes("llm") && "bg-[#5699A8]",
                    node.name.includes("ai") && "left-2/4 w-5 bg-[#F09A56]"
                  )
                }
              ),
              /* @__PURE__ */ jsxs("span", { className: "absolute left-0 top-3 text-[0.63rem] text-mastra-el-3", children: [
                formatDuration(node.duration),
                "ms"
              ] })
            ] })
          ] })
        ]
      }
    ),
    hasChildren && isExpanded && /* @__PURE__ */ jsx(Fragment, { children: node.children.map((child) => /* @__PURE__ */ jsx(TreeNode, { node: child, depth: depth + 1 }, child.id)) })
  ] });
}

function TreeView({ tree }) {
  return /* @__PURE__ */ jsx("ul", { children: tree.map((node) => /* @__PURE__ */ jsx(TreeNode, { node }, node.id)) });
}
function buildTree(items, parentSpanId = null) {
  return items.filter((item) => item.parentSpanId === parentSpanId).map((item) => ({
    ...item,
    children: buildTree(items, item.id)
  }));
}
function SpanView({ trace }) {
  const tree = buildTree(trace.concat([]).reverse());
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(TreeView, { tree }) });
}

function TraceDetails() {
  const { trace, currentTraceIndex, prevTrace, nextTrace, traces, clearData } = useContext(TraceContext);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 pt-[1.56rem]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-[1.125rem]", children: [
          "Trace Span",
          trace?.length && trace.length > 1 ? "s" : ""
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-mastra-el-3", children: [
          trace?.length ? trace.length : 0,
          " span",
          trace?.length && trace.length > 1 ? "s" : ""
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              onClick: () => {
                prevTrace();
              },
              disabled: currentTraceIndex === 0,
              variant: "secondary",
              size: "icon",
              className: "!h-3 !w-3 rotate-180 !px-3 py-3 text-mastra-el-3 transition-colors hover:text-white",
              children: /* @__PURE__ */ jsx(ChevronDown, {})
            }
          ),
          " ",
          /* @__PURE__ */ jsx(
            Button,
            {
              onClick: () => {
                nextTrace();
              },
              disabled: currentTraceIndex === traces.length - 1,
              variant: "secondary",
              size: "icon",
              className: "!h-3 !w-3 !px-3 py-3 text-mastra-el-3 transition-colors hover:text-white",
              children: /* @__PURE__ */ jsx(ChevronDown, {})
            }
          )
        ] }),
        /* @__PURE__ */ jsx("span", { className: "bg-secondary inline-block h-5 w-px" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => {
              clearData();
            },
            variant: "secondary",
            size: "icon",
            className: "!h-3 !w-3 !px-3 py-3 text-mastra-el-3 transition-colors hover:text-white",
            children: /* @__PURE__ */ jsx(XIcon, {})
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 px-1", children: [
      " ",
      trace && /* @__PURE__ */ jsx(SpanView, { trace })
    ] })
  ] });
}

const useCodemirrorTheme = () => {
  return useMemo(
    () => githubDarkInit({
      settings: {
        fontFamily: "var(--geist-mono)",
        fontSize: "0.8rem",
        foreground: "#030712",
        background: "#1a1a1a",
        gutterBackground: "#1a1a1a",
        gutterForeground: "#94A3B8",
        gutterBorder: "#1a1a1a",
        lineHighlight: "transparent"
      },
      styles: [{ tag: [tags.className, tags.propertyName], color: "#22c5ee" }]
    }),
    []
  );
};
const SyntaxHighlighter = ({ data }) => {
  const formattedCode = JSON.stringify(data, null, 2);
  const theme = useCodemirrorTheme();
  return /* @__PURE__ */ jsx("div", { className: "rounded-md bg-[#1a1a1a] p-1 font-mono", children: /* @__PURE__ */ jsx(CodeMirror, { value: formattedCode, theme, extensions: [jsonLanguage] }) });
};

function SpanDetail() {
  const { span } = useContext(TraceContext);
  const isAiSpan = span?.name?.startsWith("ai.");
  const aiSpanAttributes = Object.entries(span?.attributes || {}).filter(([key]) => allowedAiSpanAttributes.includes(key)).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: value
    };
  }, {});
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6 pb-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-6 pt-[1.56rem]", children: [
      /* @__PURE__ */ jsx("span", { className: "rounded bg-[#314431] p-0.5", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "21", height: "20", viewBox: "0 0 21 20", fill: "none", children: /* @__PURE__ */ jsx(
        "path",
        {
          fillRule: "evenodd",
          clipRule: "evenodd",
          d: "M9.3726 2.10787C9.99493 1.48554 11.0066 1.48705 11.6274 2.10787L13.1306 3.61106C13.7529 4.23339 13.7514 5.24504 13.1306 5.86586L11.6274 7.36906C11.0051 7.99138 9.99342 7.98988 9.3726 7.36906L7.86941 5.86586C7.24708 5.24354 7.24858 4.23188 7.86941 3.61106L9.3726 2.10787ZM4.11141 7.36906C4.73374 6.74673 5.74539 6.74824 6.36621 7.36906L7.86941 8.87225C8.49173 9.49458 8.49023 10.5062 7.8694 11.127L6.36621 12.6302C5.74388 13.2526 4.73223 13.2511 4.11141 12.6302L2.60822 11.127C1.98589 10.5047 1.9874 9.49307 2.60822 8.87225L4.11141 7.36906ZM14.6338 7.36906C15.2561 6.74673 16.2678 6.74824 16.8886 7.36906L18.3918 8.87225C19.0141 9.49458 19.0126 10.5062 18.3918 11.127L16.8886 12.6302C16.2663 13.2526 15.2546 13.2511 14.6338 12.6302L13.1306 11.127C12.5083 10.5047 12.5098 9.49307 13.1306 8.87225L14.6338 7.36906ZM9.3726 12.6302C9.99493 12.0079 11.0066 12.0094 11.6274 12.6302L13.1306 14.1334C13.7529 14.7558 13.7514 15.7674 13.1306 16.3882L11.6274 17.8914C11.0051 18.5138 9.99342 18.5123 9.3726 17.8914L7.86941 16.3882C7.24708 15.7659 7.24859 14.7543 7.86941 14.1334L9.3726 12.6302Z",
          fill: "white"
        }
      ) }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-[0.9rem] font-medium", children: span?.name })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-1 px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs text-mastra-el-3", children: "Duration" }),
        /* @__PURE__ */ jsxs("span", { className: "font-mono text-xs", children: [
          " ",
          span?.duration ? formatDuration(span?.duration) : "",
          "ms"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs text-mastra-el-3", children: "Time" }),
        /* @__PURE__ */ jsx("span", { className: "font-mono text-xs", children: span?.startTime ? formatOtelTimestamp(span?.startTime) : "" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs text-mastra-el-3", children: "Status" }),
        /* @__PURE__ */ jsx("span", { className: cn("font-mono text-xs", span?.status?.code == 0 ? "text-[#6CD063]" : "text-[#FF4500]"), children: span?.status?.code == 0 ? "OK" : "ERROR" })
      ] })
    ] }),
    span?.status?.code !== 0 ? /* @__PURE__ */ jsx("div", { className: "border-t-[0.5px] px-6 pt-4", children: span && span?.events?.length > 0 && /* @__PURE__ */ jsx(Events, { span }) }) : null,
    /* @__PURE__ */ jsx("div", { className: "border-t-[0.5px] px-6 pt-4", children: span && /* @__PURE__ */ jsx(Attributes, { span: { ...span, attributes: isAiSpan ? aiSpanAttributes : span?.attributes } }) }),
    span?.status?.code === 0 ? /* @__PURE__ */ jsx("div", { className: "border-t-[0.5px] px-6 pt-4", children: span && span?.events?.length > 0 && /* @__PURE__ */ jsx(Events, { span }) }) : null
  ] });
}
function Events({ span }) {
  if (!span.events) return null;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col px-2", children: [
    /* @__PURE__ */ jsx("p", { className: "text-lg", children: "Events" }),
    span.events.map((event) => {
      const eventAttributes = event?.attributes?.map((att) => ({ [att?.key]: att?.value }));
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: cn("flex flex-col gap-2 border-b-[0.5px] last:border-b-0 pt-4 pb-2 first:pb-4"),
          children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-mastra-el-3", children: "Name" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-xs", children: event.name }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-mastra-el-3", children: "Time" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-xs", children: event.timeUnixNano ? formatOtelTimestamp2(Number(event.timeUnixNano)) : "" }),
            event.attributes?.length > 0 ? /* @__PURE__ */ jsx(AttributesValues, { attributes: eventAttributes }) : null
          ]
        },
        event.name
      );
    })
  ] });
}
function Attributes({ span }) {
  if (!span.attributes) return null;
  return /* @__PURE__ */ jsx(AttributesValues, { attributes: span.attributes });
}
function AttributesValues({
  attributes,
  depth = 0,
  keyName
}) {
  if (attributes === null || attributes === void 0 || Array.isArray(attributes) && attributes.length === 0 || typeof attributes === "object" && attributes !== null && Object.keys(attributes).length === 0) {
    return /* @__PURE__ */ jsx("span", { className: "text-sm overflow-x-scroll", children: "N/A" });
  }
  if (typeof attributes === "string") {
    try {
      const attr = JSON.parse(attributes);
      if (typeof attr === "object" || Array.isArray(attr)) {
        return /* @__PURE__ */ jsx(SyntaxHighlighter, { data: attr });
      }
    } catch {
      const val = attributes ? cleanString(attributes.toString()) : "N/A";
      if (keyName === "Input" && val === "[Not Serializable]") {
        return /* @__PURE__ */ jsx("span", { className: "text-sm overflow-x-scroll", children: "No input" });
      }
      return /* @__PURE__ */ jsx("span", { className: "text-sm overflow-x-scroll", children: attributes ? cleanString(attributes.toString()) : "N/A" });
    }
  }
  const processedValue = attributes;
  if (Array.isArray(processedValue)) {
    if (processedValue.length === 0) return null;
    return /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { className: "mt-1 gap-3", children: processedValue.map((item, index) => /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1", children: /* @__PURE__ */ jsx(AttributesValues, { attributes: item, depth: depth + 1 }, index) }, index)) }) });
  }
  if (typeof processedValue === "object") {
    const entries = Object.entries(processedValue);
    if (entries.length === 0) return null;
    return /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { className: "mt-1", children: entries.map(([key, val]) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 p-2 pl-0", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm capitalize text-mastra-el-3", children: transformKey(key) }),
      /* @__PURE__ */ jsx(AttributesValues, { attributes: val, depth: depth + 1, keyName: transformKey(key) })
    ] }, key)) }) });
  }
  if (typeof processedValue === "boolean")
    return /* @__PURE__ */ jsx("span", { className: "font-mono text-sm", children: processedValue.toString() || "N/A" });
  if (typeof processedValue === "number") return /* @__PURE__ */ jsx("span", { className: "font-mono text-sm", children: processedValue.toString() });
  if (typeof processedValue === "string")
    return /* @__PURE__ */ jsx("span", { className: "font-mono text-sm", children: processedValue ? cleanString(processedValue.toString()) : "N/A" });
  return /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: String(processedValue) });
}

function usePolling({
  fetchFn,
  interval = 3e3,
  enabled = false,
  onSuccess,
  onError,
  shouldContinue = () => true,
  restartPolling = false
}) {
  const [isPolling, setIsPolling] = useState(enabled);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [firstCallLoading, setFirstCallLoading] = useState(false);
  const timeoutRef = useRef(null);
  const mountedRef = useRef(true);
  const [restart, setRestart] = useState(restartPolling);
  const cleanup = useCallback(() => {
    console.log("cleanup");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);
  const stopPolling = useCallback(() => {
    console.log("stopPolling");
    setIsPolling(false);
    cleanup();
  }, [cleanup]);
  const startPolling = useCallback(() => {
    console.log("startPolling");
    setIsPolling(true);
    setError(null);
  }, []);
  const executePoll = useCallback(
    async (refetch2 = true) => {
      if (!mountedRef.current) return;
      setIsLoading(true);
      try {
        const result = await fetchFn();
        setData(result);
        setError(null);
        onSuccess?.(result);
        if (shouldContinue(result) && refetch2) {
          timeoutRef.current = setTimeout(executePoll, interval);
        } else {
          stopPolling();
        }
      } catch (err) {
        if (!mountedRef.current) return;
        setError(err);
        onError?.(err);
        stopPolling();
      } finally {
        if (mountedRef.current) {
          setFirstCallLoading(false);
          setIsLoading(false);
        }
      }
    },
    [fetchFn, interval, onSuccess, onError, shouldContinue, stopPolling]
  );
  const refetch = useCallback(
    (withPolling = false) => {
      console.log("refetch", { withPolling });
      if (withPolling) {
        setIsPolling(true);
      } else {
        executePoll(false);
      }
      setError(null);
    },
    [executePoll]
  );
  useEffect(() => {
    mountedRef.current = true;
    if (enabled && isPolling) {
      executePoll(true);
    }
    return () => {
      console.log("cleanup poll");
      mountedRef.current = false;
      cleanup();
    };
  }, [enabled, isPolling, executePoll, cleanup]);
  useEffect(() => {
    setRestart(restartPolling);
  }, [restartPolling]);
  useEffect(() => {
    if (restart && !isPolling) {
      setIsPolling(true);
      executePoll();
      setRestart(false);
    }
  }, [restart]);
  return {
    isPolling,
    isLoading,
    error,
    data,
    startPolling,
    stopPolling,
    firstCallLoading,
    refetch
  };
}

const useTraces = (componentName, baseUrl, isWorkflow = false) => {
  const [traces, setTraces] = useState([]);
  const { setTraces: setTraceContextTraces } = useContext(TraceContext);
  const client = useMemo(
    () => new MastraClient({
      baseUrl: baseUrl || ""
    }),
    [baseUrl]
  );
  const fetchFn = useCallback(async () => {
    try {
      const res = await client.getTelemetry({
        attribute: {
          componentName
        }
      });
      if (!res.traces) {
        throw new Error("Error fetching traces");
      }
      const refinedTraces = refineTraces(res?.traces?.traces || [], isWorkflow);
      return refinedTraces;
    } catch (error2) {
      throw error2;
    }
  }, [client, componentName, isWorkflow]);
  const onSuccess = useCallback(
    (newTraces) => {
      if (newTraces.length > 0) {
        setTraces(() => newTraces);
        setTraceContextTraces(() => newTraces);
      }
    },
    [setTraceContextTraces]
  );
  const onError = useCallback((error2) => {
    toast.error(error2.message);
  }, []);
  const shouldContinue = useCallback(() => {
    return true;
  }, []);
  const { firstCallLoading, error } = usePolling({
    fetchFn,
    interval: 3e3,
    onSuccess,
    onError,
    shouldContinue,
    enabled: true
  });
  return { traces, firstCallLoading, error };
};

function AgentTraces({
  agentName,
  baseUrl,
  sidebarChild
}) {
  return /* @__PURE__ */ jsx(TraceProvider, { children: /* @__PURE__ */ jsx(AgentTracesInner, { agentName, baseUrl, sidebarChild }) });
}
function AgentTracesInner({
  agentName,
  baseUrl,
  sidebarChild
}) {
  const { traces, error, firstCallLoading } = useTraces(agentName, baseUrl);
  const { isOpen: open } = useContext(TraceContext);
  if (firstCallLoading) {
    return /* @__PURE__ */ jsxs("main", { className: "flex-1 relative overflow-hidden h-full", children: [
      /* @__PURE__ */ jsx("div", { className: "h-full w-[calc(100%_-_325px)]", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 z-10 bg-[#0F0F0F]", children: /* @__PURE__ */ jsxs(TableRow, { className: "border-gray-6 border-b-[0.1px] text-[0.8125rem]", children: [
          /* @__PURE__ */ jsx(TableHead, { className: "text-mastra-el-3 h-10", children: "Trace" }),
          /* @__PURE__ */ jsxs(TableHead, { className: "text-mastra-el-3 flex items-center gap-1 h-10", children: [
            /* @__PURE__ */ jsx(Braces, { className: "h-3 w-3" }),
            " Trace Id"
          ] }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-mastra-el-3 h-10", children: "Started" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-mastra-el-3 h-10", children: "Total Duration" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { className: "border-b border-gray-6", children: /* @__PURE__ */ jsxs(TableRow, { className: "border-b-gray-6 border-b-[0.1px] text-[0.8125rem]", children: [
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-full" }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-full" }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-full" }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-full" }) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx(SidebarItems$1, { sidebarChild, className: "min-w-[325px]" })
    ] });
  }
  if (!traces || traces.length === 0) {
    return /* @__PURE__ */ jsxs("main", { className: "flex-1 h-full relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "h-full w-[calc(100%_-_325px)]", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 z-10 bg-[#0F0F0F]", children: /* @__PURE__ */ jsxs(TableRow, { className: "border-gray-6 border-b-[0.1px] text-[0.8125rem]", children: [
          /* @__PURE__ */ jsx(TableHead, { className: "text-mastra-el-3 h-10", children: "Trace" }),
          /* @__PURE__ */ jsxs(TableHead, { className: "text-mastra-el-3 flex items-center gap-1 h-10", children: [
            /* @__PURE__ */ jsx(Braces, { className: "h-3 w-3" }),
            " Trace Id"
          ] }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-mastra-el-3 h-10", children: "Started" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-mastra-el-3 h-10", children: "Total Duration" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { className: "border-b border-gray-6", children: /* @__PURE__ */ jsx(TableRow, { className: "border-b-gray-6 border-b-[0.1px] text-[0.8125rem]", children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, className: "h-24 text-center", children: error?.message || "No traces found" }) }) })
      ] }) }),
      /* @__PURE__ */ jsx(SidebarItems$1, { sidebarChild, className: "min-w-[325px]" })
    ] });
  }
  return /* @__PURE__ */ jsxs("main", { className: "flex-1 h-full relative overflow-hidden", children: [
    /* @__PURE__ */ jsx(Traces, { traces }),
    /* @__PURE__ */ jsx(SidebarItems$1, { sidebarChild, className: cn(open ? "grid grid-cols-2 w-[60%]" : "min-w-[325px]") })
  ] });
}
function SidebarItems$1({ sidebarChild, className }) {
  const { openDetail, isOpen: open } = useContext(TraceContext);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(40);
  return /* @__PURE__ */ jsxs(
    MastraResizablePanel,
    {
      className: cn(
        "absolute right-0 top-0 h-full z-20 overflow-x-scroll border-l-[0.5px] bg-mastra-bg-1 bg-[#121212]",
        className
      ),
      defaultWidth: open ? 60 : 20,
      minimumWidth: open ? 50 : 20,
      maximumWidth: open ? 90 : 60,
      children: [
        open && /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-full overflow-x-scroll px-0 absolute left-0 top-0 min-w-[50%] bg-mastra-bg-1 bg-[#121212]",
            style: { width: `${100 - rightSidebarWidth}%` },
            children: /* @__PURE__ */ jsx(TraceDetails, {})
          }
        ),
        /* @__PURE__ */ jsx(
          MastraResizablePanel,
          {
            defaultWidth: 50,
            minimumWidth: 30,
            maximumWidth: 80,
            className: cn("h-full overflow-y-hidden border-l-[0.5px] right-0 top-0 z-20 bg-mastra-bg-1 bg-[#121212]", {
              absolute: open,
              "unset-position": !open
            }),
            disabled: !open,
            setCurrentWidth: setRightSidebarWidth,
            children: /* @__PURE__ */ jsx("div", { className: "h-full overflow-y-scroll", children: !openDetail ? sidebarChild : /* @__PURE__ */ jsx(SpanDetail, {}) })
          }
        )
      ]
    }
  );
}

const AgentIcon = ({ className }) => {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "13",
      height: "13",
      viewBox: "0 0 13 13",
      fill: "none",
      className,
      children: [
        /* @__PURE__ */ jsx(
          "path",
          {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M6.75 11.4875C9.50452 11.4875 11.7375 9.25452 11.7375 6.5C11.7375 3.74548 9.50452 1.5125 6.75 1.5125C3.99548 1.5125 1.7625 3.74548 1.7625 6.5C1.7625 9.25452 3.99548 11.4875 6.75 11.4875ZM6.75 12.625C10.1327 12.625 12.875 9.88274 12.875 6.5C12.875 3.11726 10.1327 0.375 6.75 0.375C3.36726 0.375 0.625 3.11726 0.625 6.5C0.625 9.88274 3.36726 12.625 6.75 12.625Z",
            fill: "currentColor"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M12.4851 8.45587C11.668 10.7366 9.4873 12.3682 6.92552 12.3682C6.88211 12.3682 6.83881 12.3677 6.79563 12.3668C6.20679 10.9554 5.94996 9.47004 6.16613 7.85695C6.24097 7.58925 6.34464 7.19828 6.32806 6.8443C6.32047 6.68231 6.14275 6.70194 6.09813 6.85785C6.04374 7.04794 5.96784 7.24722 5.87163 7.42336C5.76132 7.44142 5.62051 7.45405 5.44307 7.44362C4.88421 7.41074 4.47225 7.11911 4.38425 7.02482C4.22438 7.09725 4.21437 7.15094 4.20478 7.2023C4.19876 7.2346 4.1929 7.26597 4.15006 7.30052L4.1369 7.31126C4.0592 7.37515 4.0024 7.42185 3.82397 7.15106C3.66346 6.8363 3.54511 6.37667 4.02775 5.8823C4.31486 5.5882 4.88893 5.34805 4.97072 5.33548C4.97072 4.87028 5.33534 4.03169 6.37911 3.7382C7.48025 3.42859 8.75139 3.74318 9.48574 4.81665C9.94707 5.49103 9.99232 5.88068 10.0269 6.17804C10.0629 6.48794 10.0872 6.69759 10.5588 7.02482C10.6891 7.11521 10.8199 7.20344 10.9519 7.2924C11.4398 7.62134 11.9426 7.96033 12.4851 8.45587ZM6.72628 5.39078C6.90062 5.39078 7.04195 5.24945 7.04195 5.07511C7.04195 4.90077 6.90062 4.75944 6.72628 4.75944C6.55194 4.75944 6.41061 4.90077 6.41061 5.07511C6.41061 5.24945 6.55194 5.39078 6.72628 5.39078Z",
            fill: "currentColor"
          }
        )
      ]
    }
  );
};

const DataTable = ({
  title,
  icon,
  withoutBorder = false,
  columns,
  data,
  className,
  pagination,
  gotoNextPage,
  gotoPreviousPage,
  maxHeight,
  withoutRadius = false,
  disabledFlex,
  emptyStateHeight,
  getRowId,
  selectedRowId,
  isLoading,
  emptyText
}) => {
  const [sorting, setSorting] = useState([]);
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: pagination ? Math.floor(pagination.offset / pagination.limit) : 0,
    pageSize: pagination?.limit ?? 10
  });
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination ? Math.ceil(pagination.total / pagination.limit) : -1,
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize
      },
      rowSelection
    },
    getRowId,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    onRowSelectionChange: setRowSelection
  });
  return /* @__PURE__ */ jsxs("div", { className: cn("flex flex-col", disabledFlex ? "block" : ""), children: [
    /* @__PURE__ */ jsx("div", { className: cn("border", !withoutRadius && "rounded-md", className), children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0", children: table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ jsxs(TableRow, { className: cn("z-50 bg-[#0f0f0f]", title && "hover:bg-transparent"), children: [
        icon && !title ? /* @__PURE__ */ jsx(TableHead, { className: "w-9 rounded-tl-md" }) : null,
        title ? /* @__PURE__ */ jsx(
          TableHead,
          {
            className: cn("px-0", !withoutRadius && "rounded-tl-md rounded-tr-md"),
            colSpan: headerGroup.headers.length + (icon ? 1 : 0),
            children: title
          }
        ) : headerGroup.headers.map((header) => {
          return /* @__PURE__ */ jsx(
            TableHead,
            {
              className: cn(
                "last:pr-3",
                !icon && "first:pl-3",
                !withoutBorder && "border-r last:border-r-0",
                !withoutRadius && "last:rounded-tr-md",
                !withoutRadius && !icon && "first:rounded-tl-md"
              ),
              children: header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())
            },
            header.id
          );
        })
      ] }, headerGroup.id)) }),
      /* @__PURE__ */ jsx(TableBody, { children: isLoading ? /* @__PURE__ */ jsx(Fragment, { children: Array.from({ length: 5 }).map((_, index) => /* @__PURE__ */ jsxs(TableRow, { className: "border-b-gray-6 border-b-[0.1px] text-[0.8125rem]", children: [
        /* @__PURE__ */ jsx(TableCell, { className: "p-2", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-full" }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "p-2", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-full" }) }),
        /* @__PURE__ */ jsx(TableCell, { className: "p-2", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-full" }) })
      ] }, index)) }) : table.getRowModel().rows?.length ? table.getRowModel().rows.map((row) => /* @__PURE__ */ jsxs(TableRow, { "data-state": (row.getIsSelected() || row.id === selectedRowId) && "selected", children: [
        icon && /* @__PURE__ */ jsx(TableCell, { className: "w-9 first:pl-3", children: icon }),
        row.getVisibleCells().map((cell) => /* @__PURE__ */ jsx(
          TableCell,
          {
            className: cn(
              "p-0 last:pr-3",
              !icon && "first:pl-3",
              !withoutBorder && "border-r last:border-r-0"
            ),
            children: flexRender(cell.column.columnDef.cell, cell.getContext())
          },
          cell.id
        ))
      ] }, row.id)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsxs(TableCell, { colSpan: columns.length, className: cn("h-24 text-center", emptyStateHeight), children: [
        "No ",
        emptyText || "results"
      ] }) }) })
    ] }) }),
    pagination && /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between px-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground text-sm", children: [
        "Showing ",
        pagination.offset + 1,
        " to ",
        Math.min(pagination.offset + data.length, pagination.total),
        " of",
        " ",
        pagination.total,
        " results"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-6 lg:space-x-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: gotoPreviousPage, disabled: !pagination.offset, children: "Previous" }),
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: gotoNextPage, disabled: !pagination.hasMore, children: "Next" })
      ] }) })
    ] })
  ] });
};

const AgentsTable = ({
  title,
  agentsList,
  columns,
  isLoading
}) => {
  return /* @__PURE__ */ jsx(
    DataTable,
    {
      emptyText: "Agents",
      title,
      isLoading,
      withoutBorder: true,
      withoutRadius: true,
      icon: /* @__PURE__ */ jsx(AgentIcon, { className: "h-4 w-4" }),
      columns,
      data: agentsList,
      className: "!border-t-0 border-[0.5px] border-x-0"
    }
  );
};

const convertMessage = (message) => {
  return message;
};
function MastraNetworkRuntimeProvider({
  children,
  agentId,
  initialMessages,
  memory,
  threadId,
  baseUrl,
  refreshThreadList
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState(initialMessages || []);
  const [currentThreadId, setCurrentThreadId] = useState(threadId);
  useEffect(() => {
    if (messages.length === 0 || currentThreadId !== threadId) {
      if (initialMessages && threadId && memory) {
        setMessages(initialMessages);
        setCurrentThreadId(threadId);
      }
    }
  }, [initialMessages, threadId, memory, messages]);
  const mastra = new MastraClient({
    baseUrl: baseUrl || ""
  });
  console.log("MastraClient initialized");
  console.log(messages, "###");
  const network = mastra.getNetwork(agentId);
  const onNew = async (message) => {
    if (message.content[0]?.type !== "text") throw new Error("Only text messages are supported");
    const input = message.content[0].text;
    setMessages((currentConversation) => [...currentConversation, { role: "user", content: input }]);
    setIsRunning(true);
    try {
      let updater = function() {
        setMessages((currentConversation) => {
          const message2 = {
            role: "assistant",
            content: [{ type: "text", text: content }]
          };
          if (!assistantMessageAdded) {
            assistantMessageAdded = true;
            return [...currentConversation, message2];
          }
          return [...currentConversation.slice(0, -1), message2];
        });
      };
      const response = await network.stream({
        messages: [
          {
            role: "user",
            content: input
          }
        ],
        runId: agentId,
        ...memory ? { threadId, resourceId: agentId } : {}
      });
      if (!response.body) {
        throw new Error("No response body");
      }
      const parts = [];
      let content = "";
      let currentTextPart = null;
      let assistantMessageAdded = false;
      await processDataStream({
        stream: response.body,
        onTextPart(value) {
          if (currentTextPart == null) {
            currentTextPart = {
              type: "text",
              text: value
            };
            parts.push(currentTextPart);
          } else {
            currentTextPart.text += value;
          }
          content += value;
          updater();
        },
        async onToolCallPart(value) {
          console.log("Tool call received:", value);
          setMessages((currentConversation) => {
            const lastMessage = currentConversation[currentConversation.length - 1];
            if (lastMessage && lastMessage.role === "assistant") {
              const updatedMessage = {
                ...lastMessage,
                content: Array.isArray(lastMessage.content) ? [
                  ...lastMessage.content,
                  {
                    type: "tool-call",
                    toolCallId: value.toolCallId,
                    toolName: value.toolName,
                    args: value.args
                  }
                ] : [
                  ...typeof lastMessage.content === "string" ? [{ type: "text", text: lastMessage.content }] : [],
                  {
                    type: "tool-call",
                    toolCallId: value.toolCallId,
                    toolName: value.toolName,
                    args: value.args
                  }
                ]
              };
              return [...currentConversation.slice(0, -1), updatedMessage];
            }
            const newMessage = {
              role: "assistant",
              content: [
                { type: "text", text: content },
                {
                  type: "tool-call",
                  toolCallId: value.toolCallId,
                  toolName: value.toolName,
                  args: value.args
                }
              ]
            };
            return [...currentConversation, newMessage];
          });
        },
        async onToolResultPart(value) {
          console.log("Tool call result received:", value);
          setMessages((currentConversation) => {
            const lastMessage = currentConversation[currentConversation.length - 1];
            if (lastMessage && lastMessage.role === "assistant" && Array.isArray(lastMessage.content)) {
              const updatedContent = lastMessage.content.map((part) => {
                if (typeof part === "object" && part.type === "tool-call" && part.toolCallId === value.toolCallId) {
                  return {
                    ...part,
                    result: value.result
                  };
                }
                return part;
              });
              const updatedMessage = {
                ...lastMessage,
                content: updatedContent
              };
              return [...currentConversation.slice(0, -1), updatedMessage];
            }
            return currentConversation;
          });
        },
        onErrorPart(error) {
          throw new Error(error);
        }
      });
      console.log(messages);
      setIsRunning(false);
    } catch (error) {
      console.error("Error occured in MastraRuntimeProvider", error);
      setIsRunning(false);
    }
  };
  const runtime = useExternalStoreRuntime({
    isRunning,
    messages,
    convertMessage,
    onNew
  });
  return /* @__PURE__ */ jsxs(AssistantRuntimeProvider, { runtime, children: [
    " ",
    children,
    " "
  ] });
}

function useCopyToClipboard({ text, copyMessage = "Copied to clipboard!" }) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef(null);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(copyMessage);
      setIsCopied(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      timeoutRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 2e3);
    }).catch(() => {
      toast.error("Failed to copy to clipboard.");
    });
  }, [text, copyMessage]);
  return { isCopied, handleCopy };
}

function CopyButton({ content, copyMessage, classname }) {
  const { isCopied, handleCopy } = useCopyToClipboard({
    text: content,
    copyMessage
  });
  return /* @__PURE__ */ jsxs(
    Button,
    {
      variant: "ghost",
      size: "icon",
      className: cn("relative h-6 w-6", classname),
      "aria-label": "Copy to clipboard",
      onClick: handleCopy,
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(Check, { className: cn("h-4 w-4 transition-transform ease-in-out", isCopied ? "scale-100" : "scale-0") }) }),
        /* @__PURE__ */ jsx(Copy, { className: cn("h-4 w-4 transition-transform ease-in-out", isCopied ? "scale-0" : "scale-100") })
      ]
    }
  );
}

async function highlight(code, language) {
  const { codeToTokens, bundledLanguages } = await import('shiki');
  if (!(language in bundledLanguages)) return null;
  const { tokens } = await codeToTokens(code, {
    lang: language,
    defaultColor: false,
    themes: {
      light: "github-light",
      dark: "github-dark"
    }
  });
  return tokens;
}

function MarkdownRenderer({ children }) {
  const processedText = children.replace(/\\n/g, "\n");
  return /* @__PURE__ */ jsx(Markdown, { remarkPlugins: [remarkGfm], components: COMPONENTS, className: "space-y-3", children: processedText });
}
const HighlightedPre = React__default.memo(({ children, language, ...props }) => {
  const [tokens, setTokens] = useState([]);
  useEffect(() => {
    highlight(children, language).then((tokens2) => {
      if (tokens2) setTokens(tokens2);
    });
  }, [children, language]);
  if (!tokens.length) {
    return /* @__PURE__ */ jsx("pre", { ...props, children });
  }
  return /* @__PURE__ */ jsx("pre", { ...props, children: /* @__PURE__ */ jsx("code", { children: tokens.map((line, lineIndex) => /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("span", { children: line.map((token, tokenIndex) => {
      const style = typeof token.htmlStyle === "string" ? void 0 : token.htmlStyle;
      return /* @__PURE__ */ jsx(
        "span",
        {
          className: "text-shiki-light bg-shiki-light-bg dark:text-shiki-dark dark:bg-shiki-dark-bg",
          style,
          children: token.content
        },
        tokenIndex
      );
    }) }, lineIndex),
    lineIndex !== tokens.length - 1 && "\n"
  ] })) }) });
});
HighlightedPre.displayName = "HighlightedCode";
const CodeBlock = ({ children, className, language, ...restProps }) => {
  const code = typeof children === "string" ? children : childrenTakeAllStringContents(children);
  const preClass = cn(
    "overflow-x-scroll rounded-md border bg-background/50 p-4 font-mono text-sm [scrollbar-width:none]",
    className
  );
  return /* @__PURE__ */ jsxs("div", { className: "group/code relative mb-4", children: [
    /* @__PURE__ */ jsx(
      Suspense,
      {
        fallback: /* @__PURE__ */ jsx("pre", { className: preClass, ...restProps, children }),
        children: /* @__PURE__ */ jsx(HighlightedPre, { language, className: preClass, children: code })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "invisible absolute right-2 top-2 flex space-x-1 rounded-lg p-1 opacity-0 transition-all duration-200 group-hover/code:visible group-hover/code:opacity-100", children: /* @__PURE__ */ jsx(CopyButton, { content: code, copyMessage: "Copied code to clipboard" }) })
  ] });
};
function childrenTakeAllStringContents(element) {
  if (typeof element === "string") {
    return element;
  }
  if (element?.props?.children) {
    let children = element.props.children;
    if (Array.isArray(children)) {
      return children.map((child) => childrenTakeAllStringContents(child)).join("");
    } else {
      return childrenTakeAllStringContents(children);
    }
  }
  return "";
}
const COMPONENTS = {
  h1: ({ children, ...props }) => /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", ...props, children }),
  h2: ({ children, ...props }) => /* @__PURE__ */ jsx("h2", { className: "font-semibold text-xl", ...props, children }),
  h3: ({ children, ...props }) => /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg", ...props, children }),
  h4: ({ children, ...props }) => /* @__PURE__ */ jsx("h4", { className: "font-semibold text-base", ...props, children }),
  h5: ({ children, ...props }) => /* @__PURE__ */ jsx("h5", { className: "font-medium", ...props, children }),
  strong: ({ children, ...props }) => /* @__PURE__ */ jsx("strong", { className: "font-semibold", ...props, children }),
  a: ({ children, ...props }) => /* @__PURE__ */ jsx("a", { className: "underline underline-offset-2", ...props, children }),
  blockquote: ({ children, ...props }) => /* @__PURE__ */ jsx("blockquote", { className: "border-l-2 border-primary pl-4", ...props, children }),
  code: ({ children, className, ...rest }) => {
    const match = /language-(\w+)/.exec(className || "");
    return match ? /* @__PURE__ */ jsx(CodeBlock, { className, language: match[1], ...rest, children }) : /* @__PURE__ */ jsx(
      "code",
      {
        className: cn(
          "font-mono [:not(pre)>&]:rounded-md [:not(pre)>&]:bg-background/50 [:not(pre)>&]:px-1 [:not(pre)>&]:py-0.5"
        ),
        ...rest,
        children
      }
    );
  },
  pre: ({ children }) => children,
  ol: ({ children, ...props }) => /* @__PURE__ */ jsx("ol", { className: "list-decimal space-y-2 pl-6", ...props, children }),
  ul: ({ children, ...props }) => /* @__PURE__ */ jsx("ul", { className: "list-disc space-y-2 pl-6", ...props, children }),
  li: ({ children, ...props }) => /* @__PURE__ */ jsx("li", { className: "my-1.5", ...props, children }),
  table: ({ children, ...props }) => /* @__PURE__ */ jsx("table", { className: "w-full border-collapse overflow-y-auto rounded-md border border-foreground/20", ...props, children }),
  th: ({ children, ...props }) => /* @__PURE__ */ jsx(
    "th",
    {
      className: "border border-foreground/20 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
      ...props,
      children
    }
  ),
  td: ({ children, ...props }) => /* @__PURE__ */ jsx(
    "td",
    {
      className: "border border-foreground/20 px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
      ...props,
      children
    }
  ),
  tr: ({ children, ...props }) => /* @__PURE__ */ jsx("tr", { className: "m-0 border-t p-0 even:bg-muted", ...props, children }),
  p: ({ children, ...props }) => /* @__PURE__ */ jsx("p", { className: "whitespace-pre-wrap leading-relaxed", ...props, children }),
  hr: ({ ...props }) => /* @__PURE__ */ jsx("hr", { className: "border-foreground/20", ...props })
};

const purpleClasses = {
  bg: "bg-[rgba(124,80,175,0.25)]",
  text: "text-[rgb(180,140,230)]",
  hover: "hover:text-[rgb(200,160,250)]"};
const ToolFallback = (props) => {
  const { toolCallId, toolName, args, argsText, result, status } = props;
  const [expandedAgents, setExpandedAgents] = useState({});
  const actions = args?.actions || [];
  if (actions.length === 0) {
    return null;
  }
  const toggleAgent = (agentId) => {
    setExpandedAgents((prev) => ({
      ...prev,
      [agentId]: !prev[agentId]
    }));
  };
  const extractUrls = (text) => {
    if (typeof text !== "string") return [];
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  };
  return /* @__PURE__ */ jsx("div", { className: "mb-4 w-full rounded-lg border border-gray-700 overflow-hidden shadow-md", children: actions.map((action, index) => {
    const agentId = `${toolCallId || "tool"}-${action.agent}-${index}`;
    const isExpanded = expandedAgents[agentId] || false;
    const urls = result ? extractUrls(result) : [];
    return /* @__PURE__ */ jsxs("div", { className: `border-b border-gray-700 ${index === actions.length - 1 ? "border-b-0" : ""}`, children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex items-center justify-between px-4 py-3 bg-gray-900 hover:bg-gray-800 cursor-pointer",
          onClick: () => toggleAgent(agentId),
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: cn("flex h-6 w-6 items-center justify-center rounded-full", purpleClasses.bg), children: status?.type === "running" ? /* @__PURE__ */ jsx(LoaderCircle, { className: cn("h-4 w-4 animate-spin", purpleClasses.text) }) : /* @__PURE__ */ jsx(CheckIcon, { className: cn("h-4 w-4", purpleClasses.text) }) }),
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { className: "font-medium text-sm text-gray-100", children: action.agent?.replaceAll("_", " ") }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: cn("text-xs px-2 py-1 rounded-full", purpleClasses.bg, purpleClasses.text), children: status?.type === "running" ? "Processing..." : "Complete" }),
              isExpanded ? /* @__PURE__ */ jsx(ChevronUpIcon, { className: "h-4 w-4 text-gray-300" }) : /* @__PURE__ */ jsx(ChevronDownIcon, { className: "h-4 w-4 text-gray-300" })
            ] })
          ]
        }
      ),
      isExpanded && /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 bg-[#111]", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-300 mb-1", children: "Query:" }),
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-gray-900 rounded border border-gray-700", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-200 whitespace-pre-wrap", children: action.input }) })
        ] }),
        result && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-300 mb-1", children: "Result:" }),
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-gray-900 rounded border border-gray-700 max-h-60 overflow-auto", children: typeof result === "string" ? /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-200", children: /* @__PURE__ */ jsx(MarkdownRenderer, { children: result }) }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-200 whitespace-pre-wrap", children: JSON.stringify(result, null, 2) }) }),
          urls.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-gray-300 mb-1", children: "Sources:" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
              urls.slice(0, 3).map((url, i) => /* @__PURE__ */ jsxs(
                "a",
                {
                  href: url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: cn(
                    "inline-flex items-center gap-1 text-xs hover:underline",
                    purpleClasses.text,
                    purpleClasses.hover
                  ),
                  children: [
                    /* @__PURE__ */ jsxs("span", { children: [
                      "Source ",
                      i + 1
                    ] }),
                    /* @__PURE__ */ jsx(ExternalLinkIcon, { className: "h-3 w-3" })
                  ]
                },
                i
              )),
              urls.length > 3 && /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-400", children: [
                "+",
                urls.length - 3,
                " more"
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }, agentId);
  }) });
};

const NetworkChat = ({ agentId, memory }) => {
  return /* @__PURE__ */ jsx(MastraNetworkRuntimeProvider, { agentId, memory, children: /* @__PURE__ */ jsx(Thread, { memory, ToolFallback }) });
};

function WorkflowTraces({
  workflowName,
  baseUrl,
  sidebarChild
}) {
  return /* @__PURE__ */ jsx(TraceProvider, { children: /* @__PURE__ */ jsx(WorkflowTracesInner, { workflowName, baseUrl, sidebarChild }) });
}
function WorkflowTracesInner({
  workflowName,
  baseUrl,
  sidebarChild
}) {
  const { traces, error, firstCallLoading } = useTraces(workflowName, baseUrl, true);
  const { isOpen: open } = useContext(TraceContext);
  if (firstCallLoading) {
    return /* @__PURE__ */ jsxs("main", { className: "flex-1 h-full relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "h-full w-[calc(100%_-_325px)]", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 z-10 bg-[#0F0F0F]", children: /* @__PURE__ */ jsxs(TableRow, { className: "border-gray-6 border-b-[0.1px] text-[0.8125rem]", children: [
          /* @__PURE__ */ jsx(TableHead, { className: "text-mastra-el-3 h-10", children: "Trace" }),
          /* @__PURE__ */ jsxs(TableHead, { className: "text-mastra-el-3 flex items-center gap-1 h-10", children: [
            /* @__PURE__ */ jsx(Braces, { className: "h-3 w-3" }),
            " Trace Id"
          ] }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-mastra-el-3 h-10", children: "Started" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-mastra-el-3 h-10", children: "Total Duration" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { className: "border-b border-gray-6", children: /* @__PURE__ */ jsxs(TableRow, { className: "border-b-gray-6 border-b-[0.1px] text-[0.8125rem]", children: [
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-full" }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-full" }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-full" }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-full" }) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx(SidebarItems, { sidebarChild, className: "min-w-[325px]" })
    ] });
  }
  if (!traces || traces.length === 0) {
    return /* @__PURE__ */ jsxs("main", { className: "flex-1 h-full relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "h-full w-[calc(100%_-_325px)]", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 z-10 bg-[#0F0F0F]", children: /* @__PURE__ */ jsxs(TableRow, { className: "border-gray-6 border-b-[0.1px] text-[0.8125rem]", children: [
          /* @__PURE__ */ jsx(TableHead, { className: "text-mastra-el-3 h-10", children: "Trace" }),
          /* @__PURE__ */ jsxs(TableHead, { className: "text-mastra-el-3 flex items-center gap-1 h-10", children: [
            /* @__PURE__ */ jsx(Braces, { className: "h-3 w-3" }),
            " Trace Id"
          ] }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-mastra-el-3 h-10", children: "Started" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-mastra-el-3 h-10", children: "Total Duration" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { className: "border-b border-gray-6", children: /* @__PURE__ */ jsx(TableRow, { className: "border-b-gray-6 border-b-[0.1px] text-[0.8125rem]", children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, className: "h-24 text-center", children: error?.message || "No traces found" }) }) })
      ] }) }),
      /* @__PURE__ */ jsx(SidebarItems, { sidebarChild, className: "min-w-[325px]" })
    ] });
  }
  return /* @__PURE__ */ jsxs("main", { className: "flex-1 h-full relative overflow-hidden", children: [
    /* @__PURE__ */ jsx(Traces, { traces }),
    /* @__PURE__ */ jsx(SidebarItems, { className: cn(open ? "grid grid-cols-2 w-[60%]" : "min-w-[325px]"), sidebarChild })
  ] });
}
function SidebarItems({ sidebarChild, className }) {
  const { openDetail, isOpen: open } = useContext(TraceContext);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(40);
  return /* @__PURE__ */ jsxs(
    MastraResizablePanel,
    {
      className: cn(
        "absolute right-0 top-0 h-full z-20 overflow-x-scroll border-l-[0.5px] bg-mastra-bg-1 bg-[#121212]",
        className
      ),
      defaultWidth: open ? 60 : 20,
      minimumWidth: open ? 50 : 20,
      maximumWidth: open ? 90 : 60,
      children: [
        open && /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-full overflow-x-scroll px-0 absolute left-0 top-0 min-w-[50%] bg-mastra-bg-1 bg-[#121212]",
            style: { width: `${100 - rightSidebarWidth}%` },
            children: /* @__PURE__ */ jsx(TraceDetails, {})
          }
        ),
        /* @__PURE__ */ jsx(
          MastraResizablePanel,
          {
            defaultWidth: 50,
            minimumWidth: 30,
            maximumWidth: 80,
            className: cn("h-full overflow-y-hidden border-l-[0.5px] right-0 top-0 z-20 bg-mastra-bg-1 bg-[#121212]", {
              absolute: open,
              "unset-position": !open
            }),
            disabled: !open,
            setCurrentWidth: setRightSidebarWidth,
            children: /* @__PURE__ */ jsx("div", { className: "h-full overflow-y-scroll", children: !openDetail ? sidebarChild : /* @__PURE__ */ jsx(SpanDetail, {}) })
          }
        )
      ]
    }
  );
}

const useWorkflow = (workflowId, baseUrl) => {
  const [workflow, setWorkflow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const client = new MastraClient({
    baseUrl: baseUrl || ""
  });
  useEffect(() => {
    const fetchWorkflow = async () => {
      setIsLoading(true);
      try {
        if (!workflowId) {
          setWorkflow(null);
          setIsLoading(false);
          return;
        }
        const res = await client.getWorkflow(workflowId).details();
        if (!res) {
          setWorkflow(null);
          console.error("Error fetching workflow");
          toast.error("Error fetching workflow");
          return;
        }
        const steps = res.steps;
        const stepsWithWorkflow = await Promise.all(
          Object.values(steps)?.map(async (step) => {
            if (!step.workflowId) return step;
            const wFlow = await client.getWorkflow(step.workflowId).details();
            if (!res) return step;
            return { ...step, stepGraph: wFlow.stepGraph, stepSubscriberGraph: wFlow.stepSubscriberGraph };
          })
        );
        const _steps = stepsWithWorkflow.reduce((acc, b) => {
          return { ...acc, [b.id]: b };
        }, {});
        setWorkflow({ ...res, steps: _steps });
      } catch (error) {
        setWorkflow(null);
        console.error("Error fetching workflow", error);
        toast.error("Error fetching workflow");
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkflow();
  }, [workflowId]);
  return { workflow, isLoading };
};
const useExecuteWorkflow = (baseUrl) => {
  const [isExecutingWorkflow, setIsExecutingWorkflow] = useState(false);
  const client = new MastraClient({
    baseUrl: baseUrl || ""
  });
  const createWorkflowRun = async ({ workflowId, prevRunId }) => {
    try {
      const workflow = client.getWorkflow(workflowId);
      const { runId: newRunId } = await workflow.createRun({ runId: prevRunId });
      return { runId: newRunId };
    } catch (error) {
      console.error("Error creating workflow run:", error);
      throw error;
    }
  };
  const startWorkflowRun = async ({ workflowId, runId, input }) => {
    try {
      const workflow = client.getWorkflow(workflowId);
      await workflow.start({ runId, triggerData: input || {} });
    } catch (error) {
      console.error("Error starting workflow run:", error);
      throw error;
    }
  };
  return { startWorkflowRun, createWorkflowRun, isExecutingWorkflow };
};
const useWatchWorkflow = (baseUrl) => {
  const [isWatchingWorkflow, setIsWatchingWorkflow] = useState(false);
  const [watchResult, setWatchResult] = useState(null);
  const debouncedSetWatchResult = useDebouncedCallback((record) => {
    const formattedResults = Object.entries(record.results || {}).reduce(
      (acc, [key, value]) => {
        let output = value.status === "success" ? value.output : void 0;
        if (output) {
          output = Object.entries(output).reduce(
            (_acc, [_key, _value]) => {
              const val = _value;
              _acc[_key] = val.type?.toLowerCase() === "buffer" ? { type: "Buffer", data: `[...buffered data]` } : val;
              return _acc;
            },
            {}
          );
        }
        acc[key] = { ...value, output };
        return acc;
      },
      {}
    );
    const sanitizedRecord = {
      ...record,
      sanitizedOutput: record ? JSON.stringify({ ...record, results: formattedResults }, null, 2).slice(0, 5e4) : null
    };
    setWatchResult(sanitizedRecord);
  }, 100);
  const watchWorkflow = async ({ workflowId, runId }) => {
    try {
      setIsWatchingWorkflow(true);
      const client = new MastraClient({
        baseUrl
      });
      const workflow = client.getWorkflow(workflowId);
      await workflow.watch({ runId }, (record) => {
        try {
          debouncedSetWatchResult(record);
        } catch (err) {
          console.error("Error processing workflow record:", err);
          setWatchResult({
            ...record
          });
        }
      });
    } catch (error) {
      console.error("Error watching workflow:", error);
      throw error;
    } finally {
      setIsWatchingWorkflow(false);
    }
  };
  return { watchWorkflow, isWatchingWorkflow, watchResult };
};
const useResumeWorkflow = (baseUrl) => {
  const [isResumingWorkflow, setIsResumingWorkflow] = useState(false);
  const resumeWorkflow = async ({
    workflowId,
    stepId,
    runId,
    context
  }) => {
    try {
      setIsResumingWorkflow(true);
      const client = new MastraClient({
        baseUrl: baseUrl || ""
      });
      const response = await client.getWorkflow(workflowId).resume({ stepId, runId, context });
      return response;
    } catch (error) {
      console.error("Error resuming workflow:", error);
      throw error;
    } finally {
      setIsResumingWorkflow(false);
    }
  };
  return { resumeWorkflow, isResumingWorkflow };
};

function extractConditions(group, type) {
  let result = [];
  if (!group) return result;
  function recurse(group2, conj) {
    if (typeof group2 === "string") {
      result.push({ type, fnString: group2 });
    } else {
      const simpleCondition = Object.entries(group2).find(([key]) => key.includes("."));
      if (simpleCondition) {
        const [key, queryValue] = simpleCondition;
        const [stepId, ...pathParts] = key.split(".");
        const ref = {
          step: {
            id: stepId
          },
          path: pathParts.join(".")
        };
        result.push({
          type,
          ref,
          query: { [queryValue === true || queryValue === false ? "is" : "eq"]: String(queryValue) },
          conj
        });
      }
      if ("ref" in group2) {
        const { ref, query } = group2;
        result.push({ type, ref, query, conj });
      }
      if ("and" in group2) {
        for (const subGroup of group2.and) {
          recurse({ ...subGroup }, "and");
        }
      }
      if ("or" in group2) {
        for (const subGroup of group2.or) {
          recurse({ ...subGroup }, "or");
        }
      }
      if ("not" in group2) {
        recurse({ ...group2.not }, "not");
      }
    }
  }
  recurse(group);
  return result.reverse();
}
const getLayoutedElements = (nodes, edges) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB" });
  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach(
    (node) => g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 274,
      height: node.measured?.height ?? (node?.data?.isLarge ? 260 : 100)
    })
  );
  Dagre.layout(g);
  const fullWidth = g.graph()?.width ? g.graph().width / 2 : 0;
  const fullHeight = g.graph()?.height ? g.graph().height / 2 : 0;
  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      const positionX = position.x - (node.measured?.width ?? 274) / 2;
      const positionY = position.y - (node.measured?.height ?? (node?.data?.isLarge ? 260 : 100)) / 2;
      const x = positionX;
      const y = positionY;
      return { ...node, position: { x, y } };
    }),
    edges,
    fullWidth,
    fullHeight
  };
};
const defaultEdgeOptions = {
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: "#8e8e8e"
  }
};
const contructNodesAndEdges = ({
  stepGraph,
  stepSubscriberGraph,
  steps: mainSteps = {}
}) => {
  if (!stepGraph) {
    return { nodes: [], edges: [] };
  }
  const { initial, ...stepsList } = stepGraph;
  if (!initial.length) {
    return { nodes: [], edges: [] };
  }
  let nodes = [];
  let edges = [];
  let allSteps = [];
  for (const [_index, _step] of initial.entries()) {
    const step = _step.step;
    const stepId = step.id;
    const steps = [_step, ...stepsList?.[stepId] || []]?.reduce((acc, step2, i) => {
      const { stepGraph: stepWflowGraph, stepSubscriberGraph: stepWflowSubscriberGraph } = mainSteps[step2.step.id] || {};
      const hasGraph = !!stepWflowGraph;
      const nodeId = nodes.some((node) => node.id === step2.step.id) ? `${step2.step.id}-${i}` : step2.step.id;
      let newStep = {
        ...step2.step,
        label: step2.step.id,
        originalId: step2.step.id,
        type: hasGraph ? "nested-node" : "default-node",
        id: nodeId,
        stepGraph: stepWflowGraph,
        stepSubscriberGraph: stepWflowSubscriberGraph
      };
      let conditionType = "when";
      if (step2.config?.serializedWhen) {
        conditionType = step2.step.id?.endsWith("_if") ? "if" : step2.step.id?.endsWith("_else") ? "else" : "when";
        const conditions = extractConditions(step2.config.serializedWhen, conditionType);
        const conditionStep = {
          id: crypto.randomUUID(),
          conditions,
          type: "condition-node",
          isLarge: (conditions?.length > 1 || conditions.some(({ fnString }) => !!fnString)) && conditionType !== "else"
        };
        acc.push(conditionStep);
      }
      if (conditionType === "if" || conditionType === "else") {
        newStep = {
          ...newStep,
          label: conditionType === "if" ? "start if" : "start else"
        };
      }
      newStep = {
        ...newStep,
        label: step2.config?.loopLabel || newStep.label
      };
      acc.push(newStep);
      return acc;
    }, []);
    allSteps = [...allSteps, ...steps];
    const newNodes = [...steps].map((step2, index) => {
      const subscriberGraph = stepSubscriberGraph?.[step2.id];
      return {
        id: step2.id,
        position: { x: _index * 300, y: index * 100 },
        type: step2.type,
        data: {
          conditions: step2.conditions,
          label: step2.label,
          description: step2.description,
          withoutTopHandle: subscriberGraph?.[step2.id] ? false : index === 0,
          withoutBottomHandle: subscriberGraph ? false : index === steps.length - 1,
          isLarge: step2.isLarge,
          stepGraph: step2.stepGraph,
          stepSubscriberGraph: step2.stepSubscriberGraph
        }
      };
    });
    nodes = [...nodes, ...newNodes];
    const edgeSteps = [...steps].slice(0, -1);
    const newEdges = edgeSteps.map((step2, index) => ({
      id: `e${step2.id}-${steps[index + 1].id}`,
      source: step2.id,
      target: steps[index + 1].id,
      ...defaultEdgeOptions
    }));
    edges = [...edges, ...newEdges];
  }
  if (!stepSubscriberGraph || !Object.keys(stepSubscriberGraph).length) {
    const { nodes: layoutedNodes2, edges: layoutedEdges2 } = getLayoutedElements(nodes, edges);
    return { nodes: layoutedNodes2, edges: layoutedEdges2 };
  }
  for (const [connectingStepId, stepInfoGraph] of Object.entries(stepSubscriberGraph)) {
    const { initial: initial2, ...stepsList2 } = stepInfoGraph;
    let untilOrWhileConditionId;
    const loopResultSteps = [];
    let finishedLoopStep;
    let otherLoopStep;
    if (initial2.length) {
      for (const [_index, _step] of initial2.entries()) {
        const step = _step.step;
        const stepId = step.id;
        const steps = [_step, ...stepsList2?.[stepId] || []]?.reduce((acc, step2, i) => {
          const { stepGraph: stepWflowGraph, stepSubscriberGraph: stepWflowSubscriberGraph } = mainSteps[step2.step.id] || {};
          const hasGraph = !!stepWflowGraph;
          const nodeId = nodes.some((node) => node.id === step2.step.id) ? `${step2.step.id}-${i}` : step2.step.id;
          let newStep = {
            ...step2.step,
            originalId: step2.step.id,
            label: step2.step.id,
            type: hasGraph ? "nested-node" : "default-node",
            id: nodeId,
            stepGraph: stepWflowGraph,
            stepSubscriberGraph: stepWflowSubscriberGraph
          };
          let conditionType = "when";
          const isFinishedLoop = step2.config?.loopLabel?.endsWith("loop finished");
          if (step2.config?.serializedWhen && !isFinishedLoop) {
            conditionType = step2.step.id?.endsWith("_if") ? "if" : step2.step.id?.endsWith("_else") ? "else" : step2.config?.loopType ?? "when";
            const conditions = extractConditions(step2.config.serializedWhen, conditionType);
            const conditionStep = {
              id: crypto.randomUUID(),
              conditions,
              type: "condition-node",
              isLarge: (conditions?.length > 1 || conditions.some(({ fnString }) => !!fnString)) && conditionType !== "else"
            };
            if (conditionType === "until" || conditionType === "while") {
              untilOrWhileConditionId = conditionStep.id;
            }
            acc.push(conditionStep);
          }
          if (isFinishedLoop) {
            const loopResultStep = {
              id: crypto.randomUUID(),
              type: "loop-result-node",
              loopType: "finished",
              loopResult: step2.config.loopType === "until" ? true : false
            };
            loopResultSteps.push(loopResultStep);
            acc.push(loopResultStep);
          }
          if (!isFinishedLoop && step2.config?.loopType) {
            const loopResultStep = {
              id: crypto.randomUUID(),
              type: "loop-result-node",
              loopType: step2.config.loopType,
              loopResult: step2.config.loopType === "until" ? false : true
            };
            loopResultSteps.push(loopResultStep);
            acc.push(loopResultStep);
          }
          if (conditionType === "if" || conditionType === "else") {
            newStep = {
              ...newStep,
              label: conditionType === "if" ? "start if" : "start else"
            };
          }
          if (step2.config.loopType) {
            if (isFinishedLoop) {
              finishedLoopStep = newStep;
            } else {
              otherLoopStep = newStep;
            }
          }
          newStep = {
            ...newStep,
            loopType: isFinishedLoop ? "finished" : step2.config.loopType,
            label: step2.config?.loopLabel || newStep.label
          };
          acc.push(newStep);
          return acc;
        }, []);
        let afterStep = [];
        let afterStepStepList = connectingStepId?.includes("&&") ? connectingStepId.split("&&") : [];
        if (connectingStepId?.includes("&&")) {
          afterStep = [
            {
              id: connectingStepId,
              label: connectingStepId,
              type: "after-node",
              steps: afterStepStepList
            }
          ];
        }
        const newNodes = [...steps, ...afterStep].map((step2, index) => {
          const subscriberGraph = stepSubscriberGraph?.[step2.id];
          const withBottomHandle = step2.originalId === connectingStepId || subscriberGraph;
          return {
            id: step2.id,
            position: { x: _index * 300 + 300, y: index * 100 + 100 },
            type: step2.type,
            data: {
              conditions: step2.conditions,
              label: step2.label,
              description: step2.description,
              result: step2.loopResult,
              loopType: step2.loopType,
              steps: step2.steps,
              withoutBottomHandle: withBottomHandle ? false : index === steps.length - 1,
              isLarge: step2.isLarge,
              stepGraph: step2.stepGraph,
              stepSubscriberGraph: step2.stepSubscriberGraph
            }
          };
        });
        nodes = [...nodes, ...newNodes].map((node) => ({
          ...node,
          data: {
            ...node.data,
            withoutBottomHandle: afterStepStepList.includes(node.id) ? false : node.data.withoutBottomHandle
          }
        }));
        const edgeSteps = [...steps].slice(0, -1);
        const firstEdgeStep = steps[0];
        const lastEdgeStep = steps[steps.length - 1];
        const afterEdges = afterStepStepList?.map((step2) => ({
          id: `e${step2}-${connectingStepId}`,
          source: step2,
          target: connectingStepId,
          ...defaultEdgeOptions
        }));
        const finishedLoopResult = loopResultSteps?.find((step2) => step2.loopType === "finished");
        const newEdges = edgeSteps.map((step2, index) => ({
          id: `e${step2.id}-${steps[index + 1].id}`,
          source: step2.id,
          target: steps[index + 1].id,
          remove: finishedLoopResult?.id === steps[index + 1].id,
          //remove if target is a finished loop result
          ...defaultEdgeOptions
        }))?.filter((edge) => !edge.remove);
        const connectingEdge = connectingStepId === firstEdgeStep.id ? [] : [
          {
            id: `e${connectingStepId}-${firstEdgeStep.id}`,
            source: connectingStepId,
            target: firstEdgeStep.id,
            remove: finishedLoopResult?.id === firstEdgeStep.id,
            ...defaultEdgeOptions
          }
        ]?.filter((edge) => !edge.remove);
        const lastEdge = lastEdgeStep.originalId === connectingStepId ? [
          {
            id: `e${lastEdgeStep.id}-${connectingStepId}`,
            source: lastEdgeStep.id,
            target: connectingStepId,
            ...defaultEdgeOptions
          }
        ] : [];
        edges = [...edges, ...afterEdges, ...connectingEdge, ...newEdges, ...lastEdge];
        allSteps = [...allSteps, ...steps];
      }
      if (untilOrWhileConditionId && loopResultSteps.length && finishedLoopStep && otherLoopStep) {
        const loopResultStepsEdges = loopResultSteps.map((step) => ({
          id: `e${untilOrWhileConditionId}-${step.id}`,
          source: untilOrWhileConditionId,
          target: step.id,
          ...defaultEdgeOptions
        }));
        const finishedLoopResult = loopResultSteps?.find((res) => res.loopType === "finished");
        const otherLoopResult = loopResultSteps?.find((res) => res.loopType !== "finished");
        const otherLoopEdge = {
          id: `e${otherLoopResult?.id}-${otherLoopStep?.id}`,
          source: otherLoopResult?.id,
          target: otherLoopStep.id,
          ...defaultEdgeOptions
        };
        const finishedLoopEdge = {
          id: `e${finishedLoopResult?.id}-${finishedLoopStep?.id}`,
          source: finishedLoopResult?.id,
          target: finishedLoopStep.id,
          ...defaultEdgeOptions
        };
        edges = [...edges, ...loopResultStepsEdges, otherLoopEdge, finishedLoopEdge];
      }
    }
  }
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
  return { nodes: layoutedNodes, edges: layoutedEdges };
};

const textVariants = cva("block", {
  variants: {
    variant: {
      primary: "text-text",
      secondary: "text-text-dim"
    },
    size: {
      default: "text-base",
      xs: "text-xs",
      sm: "text-sm",
      md: "text-md",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl"
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold"
    }
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
    weight: "normal"
  }
});
const Text = ({ className, weight, variant, as: Tag = "span", size, ...props }) => {
  return /* @__PURE__ */ jsx(Tag, { className: cn(textVariants({ size, variant, weight, className })), ...props });
};

const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Description, { ref, className: cn("text-sm text-muted-foreground", className), ...props }));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

function WorkflowConditionNode({ data }) {
  const { conditions } = data;
  const [open, setOpen] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const type = conditions[0]?.type;
  const isCollapsible = (conditions.some((condition) => condition.fnString) || conditions?.length > 1) && type !== "else";
  return /* @__PURE__ */ jsxs(
    Collapsible,
    {
      open: !isCollapsible ? true : open,
      onOpenChange: (_open) => {
        if (isCollapsible) {
          setOpen(_open);
        }
      },
      className: cn("bg-mastra-bg-3 rounded-md w-[274px] flex flex-col p-2 gap-2"),
      children: [
        /* @__PURE__ */ jsx(Handle, { type: "target", position: Position.Top, style: { visibility: "hidden" } }),
        /* @__PURE__ */ jsxs(CollapsibleTrigger, { className: "flex items-center justify-between w-full", children: [
          /* @__PURE__ */ jsx(
            Text,
            {
              size: "xs",
              weight: "medium",
              className: "text-mastra-el-3 bg-mastra-bg-11 my-auto block rounded-[0.125rem] px-2 py-1 text-[10px] w-fit",
              children: type?.toUpperCase()
            }
          ),
          isCollapsible && /* @__PURE__ */ jsx(
            ChevronDown,
            {
              className: cn("w-4 h-4 transition-transform", {
                "transform rotate-180": open
              })
            }
          )
        ] }),
        type === "else" ? null : /* @__PURE__ */ jsx(CollapsibleContent, { className: "flex flex-col gap-2", children: conditions.map((condition, index) => {
          return condition.fnString ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
            /* @__PURE__ */ jsx(Highlight, { theme: themes.oneDark, code: String(condition.fnString).trim(), language: "javascript", children: ({ className, style, tokens, getLineProps, getTokenProps }) => /* @__PURE__ */ jsx(
              "pre",
              {
                className: `${className} relative font-mono text-sm overflow-x-auto p-3 w-full cursor-pointer rounded-lg mt-2`,
                style: {
                  ...style,
                  backgroundColor: "transparent",
                  border: "1px solid #343434",
                  maxHeight: "9.62rem"
                },
                onClick: () => setOpenDialog(true),
                children: tokens.map((line, i) => /* @__PURE__ */ jsxs("div", { ...getLineProps({ line }), children: [
                  /* @__PURE__ */ jsx("span", { className: "inline-block mr-2 text-muted-foreground", children: i + 1 }),
                  line.map((token, key) => /* @__PURE__ */ jsx("span", { ...getTokenProps({ token }) }, key))
                ] }, i))
              }
            ) }),
            /* @__PURE__ */ jsx(Dialog, { open: openDialog, onOpenChange: setOpenDialog, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-[30rem] bg-[#121212] p-[0.5rem]", children: [
              /* @__PURE__ */ jsx(DialogTitle, { className: "sr-only", children: "Condition Function" }),
              /* @__PURE__ */ jsx(ScrollArea, { className: "w-full p-2", maxHeight: "400px", children: /* @__PURE__ */ jsx(Highlight, { theme: themes.oneDark, code: String(condition.fnString).trim(), language: "javascript", children: ({ className, style, tokens, getLineProps, getTokenProps }) => /* @__PURE__ */ jsx(
                "pre",
                {
                  className: `${className} relative font-mono text-sm overflow-x-auto p-3 w-full rounded-lg mt-2 dark:bg-zinc-800`,
                  style: {
                    ...style,
                    backgroundColor: "#121212",
                    padding: "0 0.75rem 0 0"
                  },
                  children: tokens.map((line, i) => /* @__PURE__ */ jsxs("div", { ...getLineProps({ line }), children: [
                    /* @__PURE__ */ jsx("span", { className: "inline-block mr-2 text-muted-foreground", children: i + 1 }),
                    line.map((token, key) => /* @__PURE__ */ jsx("span", { ...getTokenProps({ token }) }, key))
                  ] }, i))
                }
              ) }) })
            ] }) })
          ] }, `${condition.fnString}-${index}`) : /* @__PURE__ */ jsx(Fragment$1, { children: condition.ref?.step ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            index === 0 ? null : /* @__PURE__ */ jsx(
              Text,
              {
                size: "xs",
                weight: "medium",
                className: "text-mastra-el-3 bg-mastra-bg-11 my-auto block rounded-[0.125rem] px-2 py-1 text-[10px]",
                children: condition.conj?.toLocaleUpperCase() || "WHEN"
              }
            ),
            /* @__PURE__ */ jsxs(Text, { size: "xs", className: " text-mastra-el-3 flex-1", children: [
              condition.ref.step.id || condition.ref.step,
              "'s ",
              condition.ref.path,
              " ",
              Object.entries(condition.query).map(([key, value]) => `${key} ${String(value)}`)
            ] })
          ] }) : null }, `${condition.ref?.path}-${index}`);
        }) }),
        /* @__PURE__ */ jsx(Handle, { type: "source", position: Position.Bottom, style: { visibility: "hidden" } })
      ]
    }
  );
}

function WorkflowDefaultNode({ data }) {
  const { label, description, withoutTopHandle, withoutBottomHandle } = data;
  return /* @__PURE__ */ jsxs("div", { className: cn("bg-mastra-bg-8 rounded-md w-[274px]"), children: [
    !withoutTopHandle && /* @__PURE__ */ jsx(Handle, { type: "target", position: Position.Top, style: { visibility: "hidden" } }),
    /* @__PURE__ */ jsx("div", { className: "p-2", children: /* @__PURE__ */ jsxs("div", { className: "text-sm bg-mastra-bg-9 flex items-center gap-[6px] rounded-sm  p-2", children: [
      /* @__PURE__ */ jsx(Footprints, { className: "text-current w-4 h-4" }),
      /* @__PURE__ */ jsx(Text, { size: "xs", weight: "medium", className: "text-mastra-el-6 capitalize", children: label })
    ] }) }),
    description && /* @__PURE__ */ jsx("div", { className: "bg-mastra-bg-4 rounded-b-md p-2 text-[10px] text-left text-mastra-el-4", children: description }),
    !withoutBottomHandle && /* @__PURE__ */ jsx(Handle, { type: "source", position: Position.Bottom, style: { visibility: "hidden" } })
  ] });
}

function WorkflowAfterNode({ data }) {
  const { steps } = data;
  const [open, setOpen] = useState(true);
  return /* @__PURE__ */ jsxs(
    Collapsible,
    {
      open,
      onOpenChange: setOpen,
      className: cn("bg-mastra-bg-3 rounded-md w-[274px] flex flex-col p-2 gap-2"),
      children: [
        /* @__PURE__ */ jsx(Handle, { type: "target", position: Position.Top, style: { visibility: "hidden" } }),
        /* @__PURE__ */ jsxs(CollapsibleTrigger, { className: "flex items-center justify-between w-full", children: [
          /* @__PURE__ */ jsx(
            Text,
            {
              size: "xs",
              weight: "medium",
              className: "text-mastra-el-3 bg-mastra-bg-11 my-auto block rounded-[0.125rem] px-2 py-1 text-[10px] w-fit",
              children: "AFTER"
            }
          ),
          /* @__PURE__ */ jsx(
            ChevronDown,
            {
              className: cn("w-4 h-4 transition-transform", {
                "transform rotate-180": open
              })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(CollapsibleContent, { className: "flex flex-col gap-2", children: steps.map((step) => /* @__PURE__ */ jsxs("div", { className: "text-sm bg-mastra-bg-9 flex items-center gap-[6px] rounded-sm  p-2", children: [
          /* @__PURE__ */ jsx(Footprints, { className: "text-current w-4 h-4" }),
          /* @__PURE__ */ jsx(Text, { size: "xs", weight: "medium", className: "text-mastra-el-6 capitalize", children: step })
        ] }, step)) }),
        /* @__PURE__ */ jsx(Handle, { type: "source", position: Position.Bottom, style: { visibility: "hidden" } })
      ]
    }
  );
}

function WorkflowLoopResultNode({ data }) {
  const { result } = data;
  return /* @__PURE__ */ jsxs("div", { className: cn("bg-mastra-bg-8 rounded-md w-[274px]"), children: [
    /* @__PURE__ */ jsx(Handle, { type: "target", position: Position.Top, style: { visibility: "hidden" } }),
    /* @__PURE__ */ jsx("div", { className: "p-2", children: /* @__PURE__ */ jsxs("div", { className: "text-sm bg-mastra-bg-9 flex items-center gap-[6px] rounded-sm  p-2", children: [
      result ? /* @__PURE__ */ jsx(CircleCheck, { className: "text-current w-4 h-4" }) : /* @__PURE__ */ jsx(CircleX, { className: "text-current w-4 h-4" }),
      /* @__PURE__ */ jsx(Text, { size: "xs", weight: "medium", className: "text-mastra-el-6 capitalize", children: String(result) })
    ] }) }),
    /* @__PURE__ */ jsx(Handle, { type: "source", position: Position.Bottom, style: { visibility: "hidden" } })
  ] });
}

function Spinner({ color = "#fff", className }) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      className: cn("animate-spin duration-700", className),
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ jsx("path", { d: "M21 12a9 9 0 1 1-6.219-8.56", stroke: color })
    }
  );
}

function WorkflowNestedGraph({
  stepGraph,
  stepSubscriberGraph,
  open
}) {
  const { nodes: initialNodes, edges: initialEdges } = contructNodesAndEdges({
    stepGraph,
    stepSubscriberGraph
  });
  const [isMounted, setIsMounted] = useState(false);
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);
  const nodeTypes = {
    "default-node": WorkflowDefaultNode,
    "condition-node": WorkflowConditionNode,
    "after-node": WorkflowAfterNode,
    "loop-result-node": WorkflowLoopResultNode
  };
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setIsMounted(true);
      }, 500);
    }
  }, [open]);
  return /* @__PURE__ */ jsx("div", { className: "w-full h-full relative", children: isMounted ? /* @__PURE__ */ jsxs(
    ReactFlow,
    {
      nodes,
      edges,
      fitView: true,
      fitViewOptions: { maxZoom: 0.85 },
      nodeTypes,
      onNodesChange,
      children: [
        /* @__PURE__ */ jsx(Controls, {}),
        /* @__PURE__ */ jsx(MiniMap, { pannable: true, zoomable: true, maskColor: "#121212", bgColor: "#171717", nodeColor: "#2c2c2c" }),
        /* @__PURE__ */ jsx(Background, { variant: BackgroundVariant.Lines, gap: 12, size: 0.5 })
      ]
    }
  ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Spinner, {}) }) });
}

const WorkflowNestedGraphContext = createContext(
  {}
);
function WorkflowNestedGraphProvider({ children }) {
  const [stepGraph, setStepGraph] = useState(null);
  const [stepSubscriberGraph, setStepSubscriberGraph] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [label, setLabel] = useState("");
  const closeNestedGraph = () => {
    setOpenDialog(false);
    setStepGraph(null);
    setStepSubscriberGraph(null);
    setLabel("");
  };
  const showNestedGraph = ({
    label: label2,
    stepGraph: stepGraph2,
    stepSubscriberGraph: stepSubscriberGraph2
  }) => {
    setLabel(label2);
    setStepGraph(stepGraph2);
    setStepSubscriberGraph(stepSubscriberGraph2);
    setOpenDialog(true);
  };
  return /* @__PURE__ */ jsxs(
    WorkflowNestedGraphContext.Provider,
    {
      value: {
        showNestedGraph,
        closeNestedGraph
      },
      children: [
        children,
        /* @__PURE__ */ jsx(Dialog, { open: openDialog, onOpenChange: closeNestedGraph, children: /* @__PURE__ */ jsx(DialogPortal, { children: /* @__PURE__ */ jsxs(DialogContent, { className: "w-[40rem] h-[40rem] bg-[#121212] p-[0.5rem]", children: [
          /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-1.5 absolute top-2.5 left-2.5", children: [
            /* @__PURE__ */ jsx(Workflow, { className: "text-current w-4 h-4" }),
            /* @__PURE__ */ jsxs(Text, { size: "xs", weight: "medium", className: "text-mastra-el-6 capitalize", children: [
              label,
              " workflow"
            ] })
          ] }),
          /* @__PURE__ */ jsx(ReactFlowProvider, { children: /* @__PURE__ */ jsx(WorkflowNestedGraph, { stepGraph, open: openDialog, stepSubscriberGraph }) })
        ] }) }) })
      ]
    }
  );
}

function WorkflowNestedNode({ data }) {
  const { label, withoutTopHandle, withoutBottomHandle, stepGraph, stepSubscriberGraph } = data;
  const { showNestedGraph } = useContext(WorkflowNestedGraphContext);
  return /* @__PURE__ */ jsxs("div", { className: cn("bg-[rgba(29,29,29,0.5)] rounded-md h-full overflow-scroll w-[274px]"), children: [
    !withoutTopHandle && /* @__PURE__ */ jsx(Handle, { type: "target", position: Position.Top, style: { visibility: "hidden" } }),
    /* @__PURE__ */ jsx("div", { className: "p-2 cursor-pointer", onClick: () => showNestedGraph({ label, stepGraph, stepSubscriberGraph }), children: /* @__PURE__ */ jsxs("div", { className: "text-sm bg-mastra-bg-9 flex items-center gap-1.5 rounded-sm p-2 cursor-pointer", children: [
      /* @__PURE__ */ jsx(Workflow, { className: "text-current w-4 h-4" }),
      /* @__PURE__ */ jsx(Text, { size: "xs", weight: "medium", className: "text-mastra-el-6 capitalize", children: label })
    ] }) }),
    !withoutBottomHandle && /* @__PURE__ */ jsx(Handle, { type: "source", position: Position.Bottom, style: { visibility: "hidden" } })
  ] });
}

function WorkflowGraphInner({ workflow }) {
  const { nodes: initialNodes, edges: initialEdges } = contructNodesAndEdges({
    stepGraph: workflow.serializedStepGraph || workflow.stepGraph,
    stepSubscriberGraph: workflow.serializedStepSubscriberGraph || workflow.stepSubscriberGraph,
    steps: workflow.steps
  });
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);
  const nodeTypes = {
    "default-node": WorkflowDefaultNode,
    "condition-node": WorkflowConditionNode,
    "after-node": WorkflowAfterNode,
    "loop-result-node": WorkflowLoopResultNode,
    "nested-node": WorkflowNestedNode
  };
  return /* @__PURE__ */ jsx("div", { className: "w-full h-full", children: /* @__PURE__ */ jsxs(
    ReactFlow,
    {
      nodes,
      edges,
      nodeTypes,
      onNodesChange,
      fitView: true,
      fitViewOptions: {
        maxZoom: 0.85
      },
      children: [
        /* @__PURE__ */ jsx(Controls, {}),
        /* @__PURE__ */ jsx(MiniMap, { pannable: true, zoomable: true, maskColor: "#121212", bgColor: "#171717", nodeColor: "#2c2c2c" }),
        /* @__PURE__ */ jsx(Background, { variant: BackgroundVariant.Dots, gap: 12, size: 0.5 })
      ]
    }
  ) });
}

const lodashTitleCase = (str) => {
  const camelCased = str.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : "").replace(/^(.)/, (char) => char.toLowerCase());
  return camelCased.replace(/([A-Z])/g, " $1").replace(/^./, (str2) => str2.toUpperCase()).trim();
};

function WorkflowGraph({ workflowId, baseUrl }) {
  const { workflow, isLoading } = useWorkflow(workflowId, baseUrl);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsx(Skeleton, { className: "h-[600px]" }) });
  }
  if (!workflow) {
    return /* @__PURE__ */ jsx("div", { className: "grid h-full place-items-center", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
      /* @__PURE__ */ jsx(AlertCircleIcon, {}),
      /* @__PURE__ */ jsxs("div", { children: [
        "We couldn't find ",
        lodashTitleCase(workflowId),
        " workflow."
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsx(WorkflowNestedGraphProvider, { children: /* @__PURE__ */ jsx(ReactFlowProvider, { children: /* @__PURE__ */ jsx(WorkflowGraphInner, { workflow }) }) });
}

const AutomationIcon = ({ className }) => {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      className,
      children: /* @__PURE__ */ jsx(
        "path",
        {
          fillRule: "evenodd",
          clipRule: "evenodd",
          d: "M5.34375 1.52812C5.34375 1.14153 5.65715 0.828125 6.04375 0.828125H9.45625C9.84282 0.828125 10.1562 1.14153 10.1562 1.52812V3.84687C10.1562 4.23348 9.84282 4.54688 9.45625 4.54688H8.625V6.81161L9.35414 8.80852C9.24863 8.78166 9.13761 8.7546 9.0215 8.72661L8.95218 8.70993C8.60891 8.62742 8.20123 8.52943 7.8784 8.4013C7.83782 8.3852 7.79469 8.36718 7.75 8.3469C7.70531 8.36718 7.66218 8.3852 7.6216 8.4013C7.29877 8.52943 6.89109 8.62742 6.54782 8.70993L6.4785 8.72661C6.36239 8.7546 6.25137 8.78166 6.14583 8.80852L6.875 6.81161V4.54688H6.04375C5.65715 4.54688 5.34375 4.23348 5.34375 3.84687V1.52812ZM6.14583 8.80852C6.14583 8.80852 6.14584 8.80852 6.14583 8.80852L5.54531 10.4531H5.95625C6.34285 10.4531 6.65625 10.7666 6.65625 11.1531V13.4719C6.65625 13.8584 6.34285 14.1719 5.95625 14.1719H2.54375C2.15715 14.1719 1.84375 13.8584 1.84375 13.4719V11.1531C1.84375 10.7666 2.15715 10.4531 2.54375 10.4531H3.23402C3.26169 10.1309 3.29979 9.79285 3.35272 9.47531C3.41692 9.09013 3.51527 8.65353 3.68612 8.31182C3.95256 7.77895 4.49413 7.51868 4.84581 7.3804C5.24023 7.2253 5.69736 7.11478 6.06837 7.02535C6.4139 6.94205 6.67918 6.87786 6.875 6.81161L6.14583 8.80852ZM5.54531 10.4531L6.14583 8.80852C5.89267 8.87296 5.67101 8.93634 5.48623 9.00901C5.32663 9.07176 5.25672 9.11838 5.23318 9.13484C5.18762 9.24554 5.13062 9.45274 5.07891 9.76301C5.04306 9.97818 5.01422 10.2137 4.99122 10.4531H5.54531ZM9.35414 8.80852L8.625 6.81161C8.82082 6.87786 9.0861 6.94205 9.43166 7.02535C9.80266 7.11478 10.2598 7.2253 10.6542 7.3804C11.0059 7.51868 11.5474 7.77895 11.8138 8.31182C11.9847 8.65353 12.0831 9.09013 12.1473 9.47531C12.2002 9.79285 12.2383 10.1309 12.266 10.4531H12.9563C13.3428 10.4531 13.6562 10.7666 13.6562 11.1531V13.4719C13.6562 13.8584 13.3428 14.1719 12.9563 14.1719H9.54375C9.15715 14.1719 8.84375 13.8584 8.84375 13.4719V11.1531C8.84375 10.7666 9.15715 10.4531 9.54375 10.4531H9.95474L9.35414 8.80852ZM9.35414 8.80852L9.95474 10.4531H10.5088C10.4858 10.2137 10.457 9.97818 10.4211 9.76301C10.3694 9.45274 10.3124 9.24554 10.2668 9.13484C10.2433 9.11838 10.1734 9.07176 10.0138 9.00901C9.829 8.93634 9.60736 8.87296 9.35414 8.80852Z",
          fill: "currentColor"
        }
      )
    }
  );
};

const WorkflowsTable = ({
  title,
  workflowsList,
  columns,
  isLoading
}) => {
  return /* @__PURE__ */ jsx(
    DataTable,
    {
      emptyText: "Workflows",
      title,
      withoutBorder: true,
      withoutRadius: true,
      isLoading,
      icon: /* @__PURE__ */ jsx(AutomationIcon, { className: "h-4 w-4" }),
      columns,
      data: workflowsList,
      className: "border-t-0' border-[0.5px] border-x-0"
    }
  );
};

const Form = React__default.forwardRef(({ children, ...props }, ref) => {
  return /* @__PURE__ */ jsx("form", { ref, className: "space-y-4", ...props, children });
});

const labelVariants = cva("text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(LabelPrimitive.Root, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = LabelPrimitive.Root.displayName;

const DISABLED_LABELS = ["boolean", "object", "array"];
const FieldWrapper = ({ label, children, id, field, error }) => {
  const isDisabled = DISABLED_LABELS.includes(field.type);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    !isDisabled && /* @__PURE__ */ jsxs(Label, { htmlFor: id, children: [
      label,
      field.required && /* @__PURE__ */ jsx("span", { className: "text-destructive", children: " *" })
    ] }),
    children,
    field.fieldConfig?.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: field.fieldConfig.description }),
    error && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: error })
  ] });
};

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Alert = React.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, role: "alert", className: cn(alertVariants({ variant }), className), ...props }));
Alert.displayName = "Alert";
const AlertTitle = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("h5", { ref, className: cn("mb-1 font-medium leading-none tracking-tight", className), ...props })
);
AlertTitle.displayName = "AlertTitle";
const AlertDescription = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("text-sm [&_p]:leading-relaxed", className), ...props })
);
AlertDescription.displayName = "AlertDescription";

const ErrorMessage = ({ error }) => /* @__PURE__ */ jsxs(Alert, { variant: "destructive", children: [
  /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
  /* @__PURE__ */ jsx(AlertTitle, { children: error })
] });

const SubmitButton = ({ children }) => /* @__PURE__ */ jsx(Button, { type: "submit", children });

const StringField = ({ inputProps, error, id }) => {
  const { key, ...props } = inputProps;
  return /* @__PURE__ */ jsx(Input, { id, className: error ? "border-destructive" : "", ...props });
};

const NumberField = ({ inputProps, error, id }) => {
  const { key, ...props } = inputProps;
  return /* @__PURE__ */ jsx(
    Input,
    {
      id,
      type: "number",
      className: error ? "border-destructive" : "",
      ...props,
      onChange: (e) => {
        const value = e.target.value;
        if (value !== "" && !isNaN(Number(value))) {
          props.onChange({
            target: { value, name: inputProps.name }
          });
        }
      },
      onBlur: (e) => {
        const value = e.target.value;
        if (value !== "" && !isNaN(Number(value))) {
          props.onChange({
            target: { value: Number(value), name: inputProps.name }
          });
        }
      }
    }
  );
};

const Checkbox = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  CheckboxPrimitive.Root,
  {
    ref,
    className: cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(CheckboxPrimitive.Indicator, { className: cn("flex items-center justify-center text-current"), children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
  }
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const BooleanField = ({ field, label, id, inputProps }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
  /* @__PURE__ */ jsx(
    Checkbox,
    {
      id,
      onCheckedChange: (checked) => {
        const event = {
          target: {
            name: field.key,
            value: checked
          }
        };
        inputProps.onChange(event);
      },
      checked: inputProps.value
    }
  ),
  /* @__PURE__ */ jsxs(Label, { htmlFor: id, children: [
    label,
    field.required && /* @__PURE__ */ jsx("span", { className: "text-destructive", children: " *" })
  ] })
] });

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  return /* @__PURE__ */ jsx(
    DayPicker,
    {
      showOutsideDays,
      className: cn("p-3", className),
      classNames: {
        months: "flex flex-col space-y-4 sm:space-y-0",
        month: "space-y-4",
        // month_caption: 'flex justify-center pt-1 relative items-center',
        caption_label: "text-sm text-text font-medium",
        nav: "space-x-1 flex items-center",
        nav_button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          "absolute left-4 top-[56px] z-10"
        ),
        nav_button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          "absolute right-4 top-[56px] z-10"
        ),
        dropdown_month: "w-full border-collapse space-y-1",
        weeknumber: "flex",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range" ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md" : "[&:has([aria-selected])]:rounded-md",
          "h-8 w-8 p-0 hover:bg-lightGray-7/50 font-normal aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected: "!bg-primary !text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-lightGray-7/50 text-accent-foreground",
        day_outside: "day-outside text-muted-foreground opacity-50  aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames
      },
      components: {
        // IconDropdown: ({  }) => (
        //   <CalendarIcon
        //     className={cn('h-4 w-4', {
        //       'rotate-180': orientation === 'up',
        //       'rotate-90': orientation === 'left',
        //       '-rotate-90': orientation === 'right',
        //     })}
        //   />
        // ),
      },
      ...props
    }
  );
}
Calendar.displayName = "Calendar";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  PopoverPrimitive.Content,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const DatePicker = ({
  value,
  setValue,
  children,
  className,
  placeholder,
  ...props
}) => {
  const [openPopover, setOpenPopover] = React.useState(false);
  return /* @__PURE__ */ jsxs(Popover, { open: openPopover, onOpenChange: setOpenPopover, children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: children ? children : /* @__PURE__ */ jsx(
      DefaultButton,
      {
        value,
        placeholder,
        className,
        "data-testid": "datepicker-button"
      }
    ) }),
    /* @__PURE__ */ jsx(
      PopoverContent,
      {
        className: "backdrop-blur-4xl w-auto p-0 bg-[#171717]",
        align: "start",
        "data-testid": "datepicker-calendar",
        children: /* @__PURE__ */ jsx(
          DatePickerOnly,
          {
            value,
            setValue: (v) => setValue(v ? /* @__PURE__ */ new Date(`${v}z`) : null),
            clearable: props.clearable,
            setOpenPopover,
            ...props
          }
        )
      }
    )
  ] });
};
const DatePickerOnly = ({
  value,
  setValue,
  setOpenPopover,
  clearable,
  placeholder,
  className,
  ...props
}) => {
  const [inputValue, setInputValue] = React.useState(value ? format(value, "PP") : "");
  const [selected, setSelected] = React.useState(value ? new Date(value) : void 0);
  const debouncedDateUpdate = useDebouncedCallback((date) => {
    if (isValid(date)) {
      setSelected(date);
      setValue?.(date);
      setOpenPopover?.(false);
    }
  }, 2e3);
  const handleInputChange = (e) => {
    setInputValue(e.currentTarget.value);
    const date = new Date(e.target.value);
    debouncedDateUpdate(date);
  };
  const handleDaySelect = (date) => {
    setSelected(date);
    setValue?.(date);
    setOpenPopover?.(false);
    if (date) {
      setInputValue(format(date, "PP"));
    } else {
      setInputValue("");
    }
  };
  const handleMonthSelect = (date) => {
    setSelected(date);
    if (date) {
      setInputValue(format(date, "PP"));
    } else {
      setInputValue("");
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "aria-label": "Choose date",
      className: "relative mt-2 flex flex-col gap-2",
      onKeyDown: (e) => {
        e.stopPropagation();
        if (e.key === "Escape") {
          setOpenPopover?.(false);
        }
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "w-full px-3", children: /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            value: inputValue,
            onChange: handleInputChange,
            placeholder,
            className
          }
        ) }),
        /* @__PURE__ */ jsx(
          Calendar,
          {
            mode: "single",
            month: selected,
            selected,
            onMonthChange: handleMonthSelect,
            onSelect: handleDaySelect,
            ...props
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "px-3 pb-2", children: clearable && /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            tabIndex: 0,
            className: "w-full !opacity-50 duration-200 hover:!opacity-100",
            onClick: () => {
              setValue(null);
              setSelected(void 0);
              setInputValue("");
              setOpenPopover?.(false);
            },
            children: "Clear"
          }
        ) })
      ]
    }
  );
};
const DefaultButton = React.forwardRef(
  ({ value, placeholder, className, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      Button,
      {
        ref,
        variant: "outline",
        className: cn(
          "bg-neutral-825 border-neutral-775 w-full justify-start whitespace-nowrap rounded-md border px-2 py-0 text-left flex items-center gap-1",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsx(CalendarIcon, { className: "h-4 w-4" }),
          value ? /* @__PURE__ */ jsx("span", { className: "text-white", children: format(value, "PPP") }) : /* @__PURE__ */ jsx("span", { className: "text-gray", children: placeholder ?? "Pick a date" })
        ]
      }
    );
  }
);
DefaultButton.displayName = "DefaultButton";

const DateField = ({ inputProps, error, id }) => {
  const { key, ...props } = inputProps;
  const [value, setValue] = useState(null);
  return /* @__PURE__ */ jsx(
    DatePicker,
    {
      id,
      className: error ? "border-destructive" : "",
      value,
      setValue: (date) => {
        const newDate = date ? new Date(date).toISOString() : date;
        if (newDate) {
          props.onChange({
            target: { value: newDate?.toString(), name: inputProps.name }
          });
          setValue(new Date(newDate));
        }
      },
      clearable: true
    }
  );
};

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: /* @__PURE__ */ jsx(
      SelectPrimitive.Viewport,
      {
        className: cn(
          "p-1",
          position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        ),
        children
      }
    )
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-mastra-el-5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectField = ({ field, inputProps, error, id }) => {
  const { key, ...props } = inputProps;
  return /* @__PURE__ */ jsxs(
    Select,
    {
      ...props,
      onValueChange: (value) => {
        const syntheticEvent = {
          target: {
            value,
            name: field.key
          }
        };
        props.onChange(syntheticEvent);
      },
      defaultValue: field.default,
      children: [
        /* @__PURE__ */ jsx(SelectTrigger, { id, className: error ? "border-destructive" : "", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select an option" }) }),
        /* @__PURE__ */ jsx(SelectContent, { children: (field.options || []).map(([key2, label]) => /* @__PURE__ */ jsx(SelectItem, { value: key2, children: label }, key2)) })
      ]
    }
  );
};

const ObjectWrapper = ({ label, children }) => {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 border p-2 rounded-md", children: [
    label === "​" ? /* @__PURE__ */ jsx(Fragment, {}) : /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium", children: label }),
    children
  ] });
};

const ArrayWrapper = ({ label, children, onAddItem }) => {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium", children: label }),
    children,
    /* @__PURE__ */ jsx(
      Button,
      {
        className: "w-full flex items-center justify-center",
        onClick: onAddItem,
        variant: "outline",
        size: "sm",
        type: "button",
        children: /* @__PURE__ */ jsx(PlusIcon, { className: "h-4 w-4" })
      }
    )
  ] });
};

const ArrayElementWrapper = ({ children, onRemove }) => {
  return /* @__PURE__ */ jsxs("div", { className: "relative border p-4 rounded-md mt-2", children: [
    /* @__PURE__ */ jsx(Button, { onClick: onRemove, variant: "ghost", className: "absolute top-2 right-2", type: "button", children: /* @__PURE__ */ jsx(TrashIcon, { className: "h-4 w-4" }) }),
    children
  ] });
};

const RecordField = ({ inputProps, error, id }) => {
  const { key, value = {}, onChange, ...props } = inputProps;
  const [pairs, setPairs] = React.useState(
    () => Object.entries(value).map(([key2, val]) => ({
      id: key2 || v4(),
      key: key2,
      value: val
    }))
  );
  React.useEffect(() => {
    if (pairs.length === 0) {
      setPairs([{ id: v4(), key: "", value: "" }]);
    }
  }, [pairs]);
  const updateForm = React.useCallback(
    (newPairs) => {
      const newValue = newPairs.reduce(
        (acc, pair) => {
          if (pair.key) {
            acc[pair.key] = pair.value;
          }
          return acc;
        },
        {}
      );
      onChange?.({
        target: { value: newValue, name: inputProps.name }
      });
    },
    [onChange, inputProps.name]
  );
  const handleChange = (id2, field, newValue) => {
    setPairs((prev) => prev.map((pair) => pair.id === id2 ? { ...pair, [field]: newValue } : pair));
  };
  const handleBlur = () => {
    updateForm(pairs);
  };
  const addPair = () => {
    const newPairs = [...pairs, { id: v4(), key: "", value: "" }];
    setPairs(newPairs);
    updateForm(newPairs);
  };
  const removePair = (id2) => {
    const newPairs = pairs.filter((p) => p.id !== id2);
    if (newPairs.length === 0) {
      newPairs.push({ id: v4(), key: "", value: "" });
    }
    setPairs(newPairs);
    updateForm(newPairs);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    pairs.map((pair) => /* @__PURE__ */ jsxs("div", { className: "relative space-y-2 rounded-lg border p-4", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "ghost",
          size: "icon",
          className: "absolute right-2 top-2",
          onClick: () => removePair(pair.id),
          children: /* @__PURE__ */ jsx(TrashIcon, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 pt-6", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Key",
            value: pair.key,
            onChange: (e) => handleChange(pair.id, "key", e.target.value),
            onBlur: handleBlur
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Value",
            value: pair.value,
            onChange: (e) => handleChange(pair.id, "value", e.target.value),
            onBlur: handleBlur
          }
        )
      ] })
    ] }, pair.id)),
    /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", size: "sm", className: "w-full", onClick: addPair, children: [
      /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
      "Add Key-Value Pair"
    ] })
  ] });
};

const ShadcnUIComponents = {
  Form,
  FieldWrapper,
  ErrorMessage,
  SubmitButton,
  ObjectWrapper,
  ArrayWrapper,
  ArrayElementWrapper
};
const ShadcnAutoFormFieldComponents = {
  string: StringField,
  number: NumberField,
  boolean: BooleanField,
  date: DateField,
  select: SelectField,
  record: RecordField
};
function AutoForm({ uiComponents, formComponents, ...props }) {
  return /* @__PURE__ */ jsx(
    AutoForm$1,
    {
      ...props,
      uiComponents: { ...ShadcnUIComponents, ...uiComponents },
      formComponents: { ...ShadcnAutoFormFieldComponents, ...formComponents }
    }
  );
}

buildZodFieldConfig();

function inferFieldType(schema, fieldConfig) {
  if (fieldConfig?.fieldType) {
    return fieldConfig.fieldType;
  }
  if (schema instanceof z.ZodObject) return "object";
  if (schema instanceof z.ZodNumber) return "number";
  if (schema instanceof z.ZodBoolean) return "boolean";
  if (schema instanceof z.ZodDate || schema?.isDatetime || schema?.isDate) return "date";
  if (schema instanceof z.ZodString) return "string";
  if (schema instanceof z.ZodEnum) return "select";
  if (schema instanceof z.ZodNativeEnum) return "select";
  if (schema instanceof z.ZodArray) return "array";
  if (schema instanceof z.ZodRecord) return "record";
  return "string";
}

function parseField(key, schema) {
  const baseSchema = getBaseSchema(schema);
  const fieldConfig = getFieldConfigInZodStack(schema);
  const type = inferFieldType(baseSchema, fieldConfig);
  const defaultValue = getDefaultValueInZodStack(schema);
  const options = baseSchema._def?.values;
  let optionValues = [];
  if (options) {
    if (!Array.isArray(options)) {
      optionValues = Object.entries(options);
    } else {
      optionValues = options.map((value) => [value, value]);
    }
  }
  let subSchema = [];
  if (baseSchema instanceof z.ZodObject) {
    subSchema = Object.entries(baseSchema.shape).map(([key2, field]) => parseField(key2, field));
  }
  if (baseSchema instanceof z.ZodArray) {
    subSchema = [parseField("0", baseSchema._def.type)];
  }
  return {
    key,
    type,
    required: !schema.isOptional(),
    default: defaultValue,
    description: baseSchema.description,
    fieldConfig,
    options: optionValues,
    schema: subSchema
  };
}
function getBaseSchema(schema) {
  if ("innerType" in schema._def) {
    return getBaseSchema(schema._def.innerType);
  }
  if ("schema" in schema._def) {
    return getBaseSchema(schema._def.schema);
  }
  return schema;
}
function parseSchema(schema) {
  const objectSchema = schema instanceof z.ZodEffects ? schema.innerType() : schema;
  const shape = objectSchema.shape;
  const fields = Object.entries(shape).map(([key, field]) => parseField(key, field));
  return { fields };
}
class CustomZodProvider extends ZodProvider {
  _schema;
  constructor(schema) {
    super(schema);
    this._schema = schema;
  }
  parseSchema() {
    return parseSchema(this._schema);
  }
}

function DynamicForm({
  schema,
  onSubmit,
  defaultValues,
  isSubmitLoading,
  submitButtonLabel = "Submit"
}) {
  if (!schema) {
    console.error("no form schema found");
    return null;
  }
  const normalizedSchema = (schema2) => {
    return z$1.object({
      "​": schema2
    });
  };
  const schemaProvider = new CustomZodProvider(normalizedSchema(schema));
  const formProps = {
    schema: schemaProvider,
    onSubmit: async (values) => {
      await onSubmit(values["​"]);
    },
    defaultValues,
    formProps: {
      className: "space-y-4 p-4"
    },
    uiComponents: {
      SubmitButton: ({ children }) => /* @__PURE__ */ jsx(Button, { className: "w-full", type: "submit", disabled: isSubmitLoading, children: isSubmitLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : children || submitButtonLabel })
    },
    formComponents: {
      Label: ({ value }) => /* @__PURE__ */ jsx(Label, { className: "text-sm font-normal", children: value })
    },
    withSubmit: true
  };
  return /* @__PURE__ */ jsx(ScrollArea, { className: "h-full w-full", children: /* @__PURE__ */ jsx(AutoForm, { ...formProps }) });
}

function resolveSerializedZodOutput(obj) {
  return Function("z", `"use strict";return (${obj});`)(z);
}

function CodeBlockDemo({
  code = "",
  language = "ts",
  filename,
  className
}) {
  return /* @__PURE__ */ jsxs(CodeBlock$1, { code, language, theme: themes.oneDark, children: [
    filename ? /* @__PURE__ */ jsx("div", { className: "absolute w-full px-6 py-2 pl-4 text-sm rounded bg-mastra-bg-2 text-mastra-el-6/50", children: filename }) : null,
    /* @__PURE__ */ jsx(
      CodeBlock$1.Code,
      {
        className: cn("bg-transparent h-full p-6 rounded-xl whitespace-pre-wrap", filename ? "pt-10" : "", className),
        children: /* @__PURE__ */ jsx("div", { className: "table-row", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(CodeBlock$1.LineNumber, { className: "table-cell pr-4 text-sm text-right select-none text-gray-500/50" }),
          /* @__PURE__ */ jsx(CodeBlock$1.LineContent, { className: "flex", children: /* @__PURE__ */ jsx(CodeBlock$1.Token, { className: "font-mono text-sm mastra-token" }) })
        ] }) })
      }
    )
  ] });
}

const WorkflowRunContext = createContext({});
function WorkflowRunProvider({ children }) {
  const [result, setResult] = useState(null);
  const [payload, setPayload] = useState(null);
  const clearData = () => {
    setResult(null);
    setPayload(null);
  };
  return /* @__PURE__ */ jsx(
    WorkflowRunContext.Provider,
    {
      value: {
        result,
        setResult,
        payload,
        setPayload,
        clearData
      },
      children
    }
  );
}

function WorkflowTrigger({
  workflowId,
  baseUrl,
  setRunId
}) {
  const { result, setResult, payload, setPayload } = useContext(WorkflowRunContext);
  const { isLoading, workflow } = useWorkflow(workflowId, baseUrl);
  const { createWorkflowRun, startWorkflowRun } = useExecuteWorkflow(baseUrl);
  const { watchWorkflow, watchResult, isWatchingWorkflow } = useWatchWorkflow(baseUrl);
  const { resumeWorkflow, isResumingWorkflow } = useResumeWorkflow(baseUrl);
  const [suspendedSteps, setSuspendedSteps] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const triggerSchema = workflow?.triggerSchema;
  const handleExecuteWorkflow = async (data) => {
    try {
      if (!workflow) return;
      setIsRunning(true);
      setResult(null);
      const { runId } = await createWorkflowRun({ workflowId });
      setRunId?.(runId);
      watchWorkflow({ workflowId, runId });
      startWorkflowRun({ workflowId, runId, input: data });
    } catch (err) {
      setIsRunning(false);
      toast.error("Error executing workflow");
    }
  };
  const handleResumeWorkflow = async (step) => {
    if (!workflow) return;
    const { stepId, runId: prevRunId, context } = step;
    const { runId } = await createWorkflowRun({ workflowId, prevRunId });
    watchWorkflow({ workflowId, runId });
    await resumeWorkflow({
      stepId,
      runId,
      context,
      workflowId
    });
  };
  const watchResultToUse = result ?? watchResult;
  const workflowActivePaths = watchResultToUse?.activePaths ?? [];
  useEffect(() => {
    setIsRunning(isWatchingWorkflow);
  }, [isWatchingWorkflow]);
  useEffect(() => {
    if (!watchResultToUse?.activePaths || !result?.runId) return;
    const suspended = Object.entries(watchResultToUse.activePaths).filter(([_, { status }]) => status === "suspended").map(([stepId, { suspendPayload }]) => ({
      stepId,
      runId: result.runId,
      suspendPayload
    }));
    setSuspendedSteps(suspended);
  }, [watchResultToUse, result]);
  useEffect(() => {
    if (watchResult) {
      setResult(watchResult);
    }
  }, [watchResult]);
  if (isLoading) {
    return /* @__PURE__ */ jsx(ScrollArea, { className: "h-[calc(100vh-126px)] pt-2 px-4 pb-4 text-xs", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10" })
    ] }) });
  }
  if (!workflow) return null;
  const isSuspendedSteps = suspendedSteps.length > 0;
  const zodInputSchema = triggerSchema ? resolveSerializedZodOutput(jsonSchemaToZod(parse(triggerSchema))) : null;
  return /* @__PURE__ */ jsx(ScrollArea, { className: "h-[calc(100vh-126px)] pt-2 px-4 pb-4 text-xs w-full", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    !isSuspendedSteps && /* @__PURE__ */ jsx(Fragment, { children: zodInputSchema ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between w-full", children: [
        /* @__PURE__ */ jsx(Text, { variant: "secondary", className: "px-4 text-mastra-el-3", size: "xs", children: "Input" }),
        isResumingWorkflow ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Loader2, { className: "w-3 h-3 animate-spin text-mastra-el-accent" }),
          " Resuming workflow"
        ] }) : /* @__PURE__ */ jsx(Fragment, {})
      ] }),
      /* @__PURE__ */ jsx(
        DynamicForm,
        {
          schema: zodInputSchema,
          defaultValues: payload,
          isSubmitLoading: isWatchingWorkflow,
          onSubmit: (data) => {
            setPayload(data);
            handleExecuteWorkflow(data);
          }
        }
      )
    ] }) : /* @__PURE__ */ jsxs("div", { className: "px-4 space-y-4", children: [
      isResumingWorkflow ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "w-3 h-3 animate-spin text-mastra-el-accent" }),
        " Resuming workflow"
      ] }) : /* @__PURE__ */ jsx(Fragment, {}),
      /* @__PURE__ */ jsx(Button, { className: "w-full", disabled: isRunning, onClick: () => handleExecuteWorkflow(null), children: isRunning ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : "Trigger" })
    ] }) }),
    Object.values(workflowActivePaths).length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx(Text, { variant: "secondary", className: "px-4 text-mastra-el-3", size: "xs", children: "Status" }),
      /* @__PURE__ */ jsx("div", { className: "px-4 flex flex-col gap-4", children: Object.entries(workflowActivePaths)?.map(([stepId, { status: pathStatus, stepPath }]) => {
        return /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1", children: stepPath?.map((path, idx) => {
          const status = pathStatus === "completed" ? "Completed" : stepId === path ? pathStatus.charAt(0).toUpperCase() + pathStatus.slice(1) : "Completed";
          const statusIcon = status === "Completed" ? /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full" }) : /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-yellow-500 rounded-full animate-pulse" });
          return /* @__PURE__ */ jsx("div", { className: "flex flex-col overflow-hidden border", children: /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between p-3`, children: [
            /* @__PURE__ */ jsx(Text, { variant: "secondary", className: "text-mastra-el-3", size: "xs", children: path.charAt(0).toUpperCase() + path.slice(1) }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Text, { variant: "secondary", className: "text-mastra-el-3", size: "xs", children: statusIcon }),
              status
            ] })
          ] }) }, idx);
        }) });
      }) })
    ] }),
    isSuspendedSteps && suspendedSteps?.map((step) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col px-4", children: [
      /* @__PURE__ */ jsx(Text, { variant: "secondary", className: "text-mastra-el-3", size: "xs", children: step.stepId }),
      step.suspendPayload && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        CodeBlockDemo,
        {
          className: "w-full overflow-x-auto p-2",
          code: JSON.stringify(step.suspendPayload, null, 2),
          language: "json"
        }
      ) }),
      /* @__PURE__ */ jsx(
        DynamicForm,
        {
          schema: z.record(z.string(), z.any()),
          isSubmitLoading: isResumingWorkflow,
          submitButtonLabel: "Resume",
          onSubmit: (data) => {
            handleResumeWorkflow({
              stepId: step.stepId,
              runId: step.runId,
              suspendPayload: step.suspendPayload,
              context: data
            });
          }
        }
      )
    ] })),
    result && /* @__PURE__ */ jsxs("div", { className: "flex flex-col group relative", children: [
      /* @__PURE__ */ jsx(Text, { variant: "secondary", className: "px-4 text-mastra-el-3", size: "xs", children: "Output" }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: /* @__PURE__ */ jsx(
        CopyButton,
        {
          classname: "absolute z-40 w-8 h-8 p-0 transition-opacity duration-150 ease-in-out opacity-0 top-4 right-4 group-hover:opacity-100",
          content: JSON.stringify(result, null, 2)
        }
      ) }),
      /* @__PURE__ */ jsx(
        CodeBlockDemo,
        {
          className: "w-full overflow-x-auto",
          code: result.sanitizedOutput || JSON.stringify(result, null, 2),
          language: "json"
        }
      )
    ] })
  ] }) });
}

const sizes = {
  default: "[&>svg]:h-icon-default [&>svg]:w-icon-default",
  lg: "[&>svg]:h-icon-lg [&>svg]:w-icon-lg"
};
const Icon = ({ children, className, size = "default", ...props }) => {
  return /* @__PURE__ */ jsx("div", { className: clsx(sizes[size], className), ...props, children });
};

const variantClasses = {
  default: "text-icon3",
  success: "text-accent1",
  error: "text-accent2",
  info: "text-accent3"
};
const Badge = ({ icon, variant = "default", className, children, ...props }) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "bg-surface4 text-ui-sm gap-md h-badge-default inline-flex items-center rounded-md",
        icon ? "pl-md pr-1.5" : "px-1.5",
        icon || variant === "default" ? "text-icon5" : variantClasses[variant],
        className
      ),
      ...props,
      children: [
        icon && /* @__PURE__ */ jsx("span", { className: variantClasses[variant], children: /* @__PURE__ */ jsx(Icon, { children: icon }) }),
        children
      ]
    }
  );
};

const DarkLogo = (props) => /* @__PURE__ */ jsxs("svg", { width: "100", height: "100", viewBox: "0 0 100 100", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props, children: [
  /* @__PURE__ */ jsx("rect", { width: "100", height: "100", fill: "black" }),
  /* @__PURE__ */ jsx(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M49.9996 13.1627C29.6549 13.1627 13.1622 29.6553 13.1622 50.0001C13.1622 70.3449 29.6549 86.8375 49.9996 86.8375C70.3444 86.8375 86.8371 70.3449 86.8371 50.0001C86.8371 29.6553 70.3444 13.1627 49.9996 13.1627ZM10 50.0001C10 27.9089 27.9084 10.0005 49.9996 10.0005C72.0908 10.0005 89.9992 27.9089 89.9992 50.0001C89.9992 72.0913 72.0908 89.9997 49.9996 89.9997C27.9084 89.9997 10 72.0913 10 50.0001Z",
      fill: "currentColor"
    }
  ),
  /* @__PURE__ */ jsx(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M43.3709 19.4582C35.493 17.9055 28.4985 19.4076 23.954 23.9521C19.4094 28.4967 17.9073 35.4911 19.46 43.3691C21.0103 51.235 25.5889 59.7924 32.8993 67.1028C40.2097 74.4132 48.7671 78.9918 56.633 80.5421C64.511 82.0948 71.5054 80.5927 76.05 76.0481C80.5945 71.5036 82.0966 64.5091 80.5439 56.6312C78.9936 48.7653 74.415 40.2079 67.1046 32.8975C59.7942 25.5871 51.2368 21.0085 43.3709 19.4582ZM43.9824 16.3557C52.5432 18.043 61.6476 22.9685 69.3406 30.6615C77.0336 38.3545 81.9591 47.4589 83.6464 56.0197C85.3313 64.5685 83.8044 72.7657 78.286 78.2841C72.7675 83.8026 64.5704 85.3295 56.0216 83.6446C47.4607 81.9573 38.3563 77.0317 30.6633 69.3388C22.9704 61.6458 18.0448 52.5414 16.3575 43.9805C14.6726 35.4317 16.1995 27.2346 21.718 21.7161C27.2364 16.1977 35.4336 14.6708 43.9824 16.3557Z",
      fill: "currentColor"
    }
  ),
  /* @__PURE__ */ jsx(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M65.8864 51.719H34.314V48.5568H65.8864V51.719Z",
      fill: "currentColor"
    }
  ),
  /* @__PURE__ */ jsx(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M59.2351 43.2352L43.194 59.2763L40.958 57.0403L56.9991 40.9992L59.2351 43.2352Z",
      fill: "currentColor"
    }
  ),
  /* @__PURE__ */ jsx(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M43.1969 40.9992L59.2379 57.0403L57.002 59.2763L40.9609 43.2352L43.1969 40.9992Z",
      fill: "currentColor"
    }
  ),
  /* @__PURE__ */ jsx(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M23.7151 33.0924C17.0466 37.565 13.1629 43.573 13.1629 49.9999C13.1629 56.4269 17.0466 62.4349 23.7151 66.9075C30.3734 71.3733 39.662 74.1867 50.0004 74.1867C60.3388 74.1867 69.6274 71.3733 76.2857 66.9075C82.9541 62.4349 86.8378 56.4269 86.8378 49.9999C86.8378 43.573 82.9541 37.565 76.2857 33.0924C69.6274 28.6266 60.3388 25.8132 50.0004 25.8132C39.662 25.8132 30.3734 28.6266 23.7151 33.0924ZM21.9537 30.4662C29.2002 25.6059 39.1209 22.651 50.0004 22.651C60.8799 22.651 70.8006 25.6059 78.0471 30.4662C85.2834 35.3197 90 42.1957 90 49.9999C90 57.8042 85.2834 64.6802 78.0471 69.5337C70.8006 74.394 60.8799 77.3489 50.0004 77.3489C39.1209 77.3489 29.2002 74.394 21.9537 69.5337C14.7174 64.6802 10.0008 57.8042 10.0008 49.9999C10.0008 42.1957 14.7174 35.3197 21.9537 30.4662Z",
      fill: "currentColor"
    }
  )
] });

const variants = {
  "header-md": "text-header-md leading-header-md",
  "ui-lg": "text-ui-lg leading-ui-lg",
  "ui-md": "text-ui-md leading-ui-md",
  "ui-sm": "text-ui-sm leading-ui-sm",
  "ui-xs": "text-ui-xs leading-ui-xs"
};
const fonts = {
  mono: "font-mono"
};
const Txt = ({ as: Root = "p", className, variant = "ui-md", font, ...props }) => {
  return /* @__PURE__ */ jsx(Root, { className: clsx(variants[variant], font && fonts[font], className), ...props });
};

export { AgentChat, AgentContext, AgentEvals, AgentProvider, AgentTraces, AgentsTable, Badge, DarkLogo, DynamicForm, MastraResizablePanel, NetworkChat, Txt, WorkflowGraph, WorkflowRunContext, WorkflowRunProvider, WorkflowTraces, WorkflowTrigger, WorkflowsTable };
//# sourceMappingURL=index.es.js.map
