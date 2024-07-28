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
    import Console from "./components/Console.svelte";

    onMount(async () => {
        isAuthenticated.set(await getIsAuthenticated());

        // successStore.set(`DeviceID is ${$deviceIdStore}`);

        // let _isAuthenticated = false;
        // _isAuthenticated = ;

        // if (!_isAuthenticated && $deviceIdStore) {
        //     console.log("not authenticated, trying to renew cookie", $deviceIdStore);
        //     const isRenewed = await renewCookie($deviceIdStore); // try to renew the cookie
        //     if (isRenewed) {
        //         _isAuthenticated = await getIsAuthenticated();
        //     }

        //     if (!_isAuthenticated) {
        //         // if still not authenticated, then clear the device id
        //         deviceIdStore.set(null);
        //         return;
        //     }
        // }

        // isAuthenticated.set(_isAuthenticated);
        // hasConnected = true;
    });

    $: {
        if ($isAuthenticated) {
            // if the device id store

        } else {
            if ($deviceIdStore) {
                deviceIdStore.set(null);
                await renewCookie($deviceIdStore);
            }
        }
    }
</script>

<div class="container">
    {#if $deviceSettingsStore.showConsole}
        <Console enabled={true} />
    {/if}
    <Notifications />
    {#if $isAuthenticated}
        <ContentDisplay />
    {:else}
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
