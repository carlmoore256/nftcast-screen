<script>
    import { onMount } from "svelte";
    import PairingDisplay from "./components/PairingDisplay.svelte";
    import ContentDisplay from "./components/ContentDisplay.svelte";
    import { deviceId } from "./stores/deviceIdStore";
    import { getIsAuthenticated } from "./services/api/device";
    import { isAuthenticated } from "./stores/isAuthenticatedStore";
    
    let hasConnected = false;

    onMount(async () => {
        $isAuthenticated = await getIsAuthenticated();
        hasConnected = true;
        console.log("Authenticated: " + $isAuthenticated);
    });
</script>

<div class="container">
    {#if $isAuthenticated}
        <ContentDisplay deviceId={$deviceId} />
    {:else if hasConnected}
        <PairingDisplay/>
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
