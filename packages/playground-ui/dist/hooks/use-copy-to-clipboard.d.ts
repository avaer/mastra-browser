type UseCopyToClipboardProps = {
    text: string;
    copyMessage?: string;
};
export declare function useCopyToClipboard({ text, copyMessage }: UseCopyToClipboardProps): {
    isCopied: boolean;
    handleCopy: () => void;
};
export {};
