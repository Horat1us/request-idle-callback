# IdleCallback

Available as *commonjs* and *esm* module with typescript typings.  
See [Using requestIdleCallback](https://developers.google.com/web/updates/2015/08/using-requestidlecallback)
for details.

This package implements the [es-shim API](https://github.com/es-shims/api) interface. It works in an ES3-supported environment and complies with the [spec](http://www.ecma-international.org/ecma-262/6.0/).

Includes **TypeScript** typings and source code.

## Installation
Using [npm](https//npmjs.com/package/@horat1us/request-idle-callback):
```bash
npm i @horat1us/request-idle-callback
```

## Usage
Most common usage:
```javascript

var handler = require('@horat1us/request-idle-callback')();
	/* or */
handler = require('@horat1us/request-idle-callback/polyfill')(); 

// returns native requestIdleCallback/cancelIdleCallback if compliant
handler.requestIdleCallback;
handler.cancelIdleCallback;
```
ESM module also available:
```javascript
import { requestIdleCallback, cancelIdleCallback } from "@horat1us/request-idle-callback"
```

To shim (replace global) you need to use:
```javascript
require("@horat1us/request-idle-callback").shim();
// or
require("@horat1us/request-idle-callback/auto");
```
Or ESM (prefered):
```javascript
import {shim} from "@horat1us/request-idle-callback/esm";
shim();
```

### IdlePromise
You can also use [IdlePromise](./src/IdlePromise.ts).  
*Note: Promise support in runtime environment is required*
```javascript
import { IdlePromise, IdlePromiseCancel } from "./src/IdlePromise";

// Create Promise
const promise = new IdlePromise({
    timeout: 5000,
});

// Process event, handle rejections
promise
    .then((deadline) => {
        // resolved, same as requestIdleCallback
        console.log(deadline)
    })
    .catch((error) => {
        if (error instanceof IdlePromiseCancel) {
            // handle cancellation
            return;
        }
        // handle rejection
    });

// You can also cancel idleCallack resolving
promise.cancel("Some Reason");
```

## License
[MIT](./LICENSE)
