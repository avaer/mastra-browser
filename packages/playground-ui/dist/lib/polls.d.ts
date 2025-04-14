export interface PollingOptions<TData, TError = Error> {
    /** Async function that fetches the data */
    fetchFn: () => Promise<TData>;
    /** Polling interval in milliseconds */
    interval?: number;
    /** Whether polling is enabled initially */
    enabled?: boolean;
    /** Callback function called with new data */
    onSuccess?: (data: TData) => void;
    /** Callback function called on error */
    onError?: (error: TError) => void;
    /** Function to determine if polling should continue */
    shouldContinue?: (data: TData) => boolean;
    /** Restarts the polling when true */
    restartPolling?: boolean;
}
export interface PollingResult<TData, TError> {
    /** Current polling status */
    isPolling: boolean;
    /** Loading state for current request */
    isLoading: boolean;
    /** Loading state for first call */
    firstCallLoading: boolean;
    /** Current error state */
    error: TError | null;
    /** Latest data received */
    data: TData | null;
    /** Function to start polling */
    startPolling: () => void;
    /** Function to stop polling */
    stopPolling: () => void;
    /** Refetch the data on demand with/without polling. default is false */
    refetch: (withPolling?: boolean) => void;
}
export declare function usePolling<TData, TError = Error>({ fetchFn, interval, enabled, onSuccess, onError, shouldContinue, restartPolling, }: PollingOptions<TData, TError>): PollingResult<TData, TError>;
export default usePolling;
