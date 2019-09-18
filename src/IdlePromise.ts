import { IdleCallback, IdleCallbackOptions, IdleDeadline, IdleHandle } from "./implementation";
import { cancelIdleCallback, requestIdleCallback } from "./polyfill";

export class IdlePromiseCancel extends Error {
    constructor(public readonly reason?: string) {
        super("Idle Promise Cancel");
    }
}

export class IdlePromise extends Promise<IdleDeadline> {
    constructor(options?: IdleCallbackOptions) {
        let handleCancellation: ((reason?: string) => void) | undefined = undefined;
        super((resolve, reject) => {
            let handle: IdleHandle;
            handleCancellation = (reason?: string) => {
                handle = undefined;
                cancelIdleCallback(handle);
                handleCancellation = undefined;
                reject(new IdlePromiseCancel())
            };
            const idleCallback: IdleCallback = (deadLine => {
                handle = undefined;
                handleCancellation = undefined;
                resolve(deadLine);
            });
            requestIdleCallback(idleCallback, options);
        });
        this.cancel = (reason) => handleCancellation && handleCancellation(reason);
    }

    public readonly cancel: (reason?: string) => void;
}
