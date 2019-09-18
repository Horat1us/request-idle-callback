import { IdleCallback, IdleCallbackOptions, IdleDeadline, IdleHandle } from "./implementation";
import { cancelIdleCallback, requestIdleCallback } from "./polyfill";

export interface IdlePromiseCancel extends Error {
    readonly reason: string | undefined;
}
export const IdlePromiseCancel = (reason?: string): IdlePromiseCancel => {
    const error: IdlePromiseCancel = new Error("Idle Promise Cancel") as IdlePromiseCancel;
    Object.defineProperty(error, "reason", {
        value: reason,
        writable: false,
        configurable: false,
        enumerable: false,
    });
    return error;
};

export interface IdlePromise extends Promise<IdleDeadline> {
    cancel(reason?: string): void;
}
export const IdlePromise = (options?: IdleCallbackOptions): IdlePromise => {
    let handleCancellation: ((reason?: string) => void) | undefined = undefined;
    const promise: IdlePromise = new Promise<IdleDeadline>(
        (resolve, reject) => {
            let handle: IdleHandle;
            handleCancellation = (reason?: string) => {
                handle = undefined;
                cancelIdleCallback(handle);
                handleCancellation = undefined;
                reject(IdlePromiseCancel(reason))
            };
            const idleCallback: IdleCallback = (deadLine => {
                handle = undefined;
                handleCancellation = undefined;
                resolve(deadLine);
            });
            requestIdleCallback(idleCallback, options);
        }
    ) as IdlePromise;
    Object.defineProperty(promise, "cancel", {
        value: (reason: string) => handleCancellation && handleCancellation(reason),
        writable: false,
        configurable: false,
        enumerable: false,
    });
    return promise;
};
