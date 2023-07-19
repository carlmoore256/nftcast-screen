<script>
    import { onMount } from "svelte";
    import PairingDisplay from "./components/PairingDisplay.svelte";
    import ContentDisplay from "./components/ContentDisplay.svelte";
    import { deviceId } from "./stores/deviceIdStore";
    import { getIsAuthenticated } from "./services/api/device";
    // import { isAuthenticated } from "./stores/isAuthenticatedStore";

    let authenticated = false;
    
    onMount(async () => {
        authenticated = await getIsAuthenticated();
    });
</script>

<div class="container">
    {#if authenticated}
        <ContentDisplay deviceId={$deviceId} />
    {:else}
        <PairingDisplay
            onPaired={() => {
                console.log("Paired!");
            }}
        />
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
