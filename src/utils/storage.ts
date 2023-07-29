
/**
 * Number of Mb storage used by the application
 */
export async function getStorageUsage() {
    const estimate = await navigator.storage.estimate()
    return estimate.usage / 1024 / 1024;
}
