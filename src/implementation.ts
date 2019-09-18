export interface IdleDeadline {
    readonly didTimeout: boolean;

    timeRemaining(): DOMHighResTimeStamp;
}

export interface IdleCallback {
    (deadLine: IdleDeadline): void;
}

export interface IdleCallbackOptions {
    timeout?: number;
}

export type IdleHandle = any;

export interface RequestIdleCallback {
    (callback: IdleCallback, options?: IdleCallbackOptions): IdleHandle;
}

export interface CancelIdleCallback {
    (handle: IdleHandle): void;
}

export interface IdleHandler {
    readonly requestIdleCallback: RequestIdleCallback;
    readonly cancelIdleCallback: CancelIdleCallback;
}

export const implementation: IdleHandler = Object.freeze<IdleHandler>({
    requestIdleCallback: (callback: IdleCallback): IdleHandle => {
        const start = Date.now();
        const handleIdle = () => {
            callback(Object.freeze({
                didTimeout: false,
                timeRemaining: function () {
                    return Math.max(0, 50 - (Date.now() - start));
                },
            }));
        };
        return setTimeout(handleIdle, 1);
    },
    cancelIdleCallback: clearTimeout
});
