<script>
    import { onMount } from "svelte";
    import PairingDisplay from "./components/PairingDisplay.svelte";
    import ContentDisplay from "./components/ContentDisplay.svelte";
    import { deviceIdStore } from "./stores/deviceIdStore";
    import { getIsAuthenticated, renewCookie } from "./services/api/device";
    import { isAuthenticated } from "./stores/isAuthenticatedStore";
    import Notifications from "./components/Notifications.svelte";
    import { successStore } from "./stores/successStore";
    import { deviceSettingsStore } from "./services/websocketService";
    // import { registerServiceWorker } from "./services/service-workers/register-worker";
    import Console from "./components/Console.svelte";

    let hasConnected = false;

    // try to get it to re-establish connection
    // window.addEventListener("focus", function () {
    //     location.reload();
    // });

    // registerServiceWorker("/monitor-network-worker.js")

    onMount(async () => {
        // successStore.set(`DeviceID is ${$deviceIdStore}`);

        let _isAuthenticated = false;

        _isAuthenticated = await getIsAuthenticated();

        if (!_isAuthenticated && $deviceIdStore) {
            // try to renew the cookie
            const isRenewed = await renewCookie($deviceIdStore);
            if (isRenewed) {
                _isAuthenticated = await getIsAuthenticated();
            }
            
            if (!_isAuthenticated) {
                // if still not authenticated, then clear the device id
                // deviceIdStore.set(null);
                return;
            }
        }
        
        isAuthenticated.set(_isAuthenticated);
        hasConnected = true;
    });
</script>

<div class="container">
    {#if $deviceSettingsStore.showConsole}
        <Console enabled={true} />
    {/if}
    <Notifications />
    {#if $isAuthenticated}
        <ContentDisplay />
    {:else if hasConnected}
        <PairingDisplay />
    {/if}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        width: 100vw;
    }
</style>
