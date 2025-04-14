declare function CodeBlockDemo({ code, language, filename, className, }: {
    code?: string;
    language: 'ts' | 'json';
    filename?: string;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
export { CodeBlockDemo };
