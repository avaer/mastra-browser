export declare const useCodemirrorTheme: () => import('@uiw/react-codemirror').Extension;
export declare const SyntaxHighlighter: ({ data }: {
    data: Record<string, unknown>;
}) => import("react/jsx-runtime").JSX.Element;
export declare function highlight(code: string, language: string): Promise<import('shiki').ThemedToken[][] | null>;
