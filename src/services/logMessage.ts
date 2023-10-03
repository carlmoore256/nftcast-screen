// import { get } from 'svelte/store';
import { logs } from '../stores/logStore';

// Keep a reference to the original console.log
const originalConsoleLog = console.log;
const originalConsoleError = console.error;


export function toggleUILogger(isEnabled: boolean) {
    if (isEnabled) {

        console.log = function (...args) {
            const message = args.join(' ');
            logs.update(logs => [...logs, {
                type: 'log',
                message
            }]);
            originalConsoleLog.apply(console, args);
        };

        console.error = function (...args) {
            console.log("GOT ERROR!!!!");
            const message = args.join(' ');
            logs.update(logs => [...logs, {
                type: 'error',
                message
            }]);
            originalConsoleError.apply(console, args);
        };

    } else {
        // Restore the original console.log and console.error
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
    }
}
