import globalThis from "globalthis";
import { polyfill } from "./polyfill";
import { IdleHandler } from "./implementation";

declare global {
    interface Window extends IdleHandler {
    }

    namespace NodeJS {
        interface Global extends IdleHandler {
        }
    }
}

export function shim(): IdleHandler {
    const handler = polyfill();

    if (handler !== globalThis) {
        const shim: (property: "requestIdleCallback" | "cancelIdleCallback", value: Function) => any =
            (("function" === typeof Object.defineProperty)
                && ("function" === typeof Object.getOwnPropertyDescriptor))
                ? (property, value) => Object.defineProperty(globalThis, property, {
                    configurable: true,
                    enumerable: false,
                    writable: false,
                    value,
                })
                : (property, value) => globalThis[ property ] = value;

        shim("requestIdleCallback", handler.requestIdleCallback);
        shim("requestIdleCallback", handler.cancelIdleCallback);
    }

    return globalThis as IdleHandler;
}
