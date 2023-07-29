// Ensure that 'self' is of type 'ServiceWorkerGlobalScope'
// declare var self: ServiceWorkerGlobalScope;

const worker = self as unknown as ServiceWorkerGlobalScope;

worker.addEventListener('install', (event: ExtendableEvent) => {
    event.waitUntil(worker.skipWaiting());
});

worker.addEventListener('activate', (event: ExtendableEvent) => {
    event.waitUntil(worker.clients.claim());
});

let totalBytes = 0;

worker.addEventListener('fetch', (event: FetchEvent) => {
    if (event.request.method !== 'GET') {
        // Ignore non-GET requests
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // clone the response to count its size without interfering
                const clonedResponse = response.clone();
                return clonedResponse.blob();
            })
            .then((blob) => {
                // increase totalBytes with the blob size
                totalBytes += blob.size;
                console.log(`Total bytes: ${totalBytes}`);

                // Fetch the response again to pass it along
                return fetch(event.request);
            })
    );
});