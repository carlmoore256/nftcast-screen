<script>
    import { onMount } from "svelte";
    import PairingDisplay from "./components/PairingDisplay.svelte";
    import ContentDisplay from "./components/ContentDisplay.svelte";
    import { deviceIdStore } from "./stores/deviceIdStore";
    import { getIsAuthenticated, renewCookie } from "./services/api/device";
    import { isAuthenticated } from "./stores/isAuthenticatedStore";
    import Notifications from "./components/Notifications.svelte";

    let hasConnected = false;

    onMount(async () => {
        $isAuthenticated = await getIsAuthenticated();
        if (!$isAuthenticated) {
            // try to renew the cookie
            const isRenewed = await renewCookie($deviceIdStore);
            if (isRenewed) {
                $isAuthenticated = await getIsAuthenticated();
            }
        }

        hasConnected = true;
    });
</script>

<div class="container">
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
