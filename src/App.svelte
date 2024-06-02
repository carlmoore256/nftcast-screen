<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import PairingDisplay from "./components/PairingDisplay.svelte";
    import ContentDisplay from "./components/ContentDisplay.svelte";
    import { deviceIdStore } from "./stores/deviceIdStore";
    import { getIsAuthenticated, renewCookie } from "./services/api/display";
    import { isAuthenticated } from "./stores/isAuthenticatedStore";
    import Notifications from "./components/Notifications.svelte";
    import { successStore } from "./stores/successStore";
    import { deviceSettingsStore } from "./services/websocketService";
    // import { registerServiceWorker } from "./services/service-workers/register-worker";
    import Console from "./components/Console.svelte";
    import { getLoadDataPayload } from "./services/api/display";
    import ScreenNavbar from "./components/ScreenNavbar.svelte";
    import PairingCode from "./components/PairingCode.svelte";
    import { getPairingStatus } from "./services/api/pair";
    import { patchDisplay } from "./services/api/display";

    let data: Awaited<ReturnType<typeof getLoadDataPayload>> = null;
    let interval: any = null;

    function patchDisplaySize() {
        if (!data.display) return;
        patchDisplay(data.display.id, { width: window.innerWidth, height: window.innerHeight });
    }

    onMount(async () => {
        // successStore.set(`DeviceID is ${$deviceIdStore}`);

        data = await getLoadDataPayload();

        if (data.pairingCode) {
            const code = data.pairingCode;
            const interval = setInterval(async () => {
                // const response = await fetch(`/api/pair/status/${code.code}`);
                const { status } = await getPairingStatus(code.code);
                if (status === "claimed") {
                    clearInterval(interval);
                    location.reload(); // reload the page to get the new data
                }
            }, 1000);
        }
        if (data.display) {
            if (
                data.display.width !== window.innerWidth ||
                data.display.height !== window.innerHeight
            ) {
                console.log("Display dimensions do not match window dimensions, updating...");
                patchDisplaySize();
            }
        }
    });

    onDestroy(() => {
        if (interval) clearInterval(interval);
    });
</script>

{#if data?.user}
    <div class="navbar">
        <ScreenNavbar user={data.user} />
    </div>
{/if}

{#if data}
    {#if data?.display}
        <div class="h-screen w-screen">
            <ContentDisplay display={data.display} />
        </div>
    {:else}
        {#if $deviceSettingsStore.showConsole}
            <Console enabled={true} />
        {/if}
        <div class="hero min-h-screen bg-black">
            <!-- Here we can switch the behavior for different types of displays -->
            {#if data.deviceType !== "SmartTV" && data.user === null}
                <div class="absolute top-2 right-2" style="position: absolute; top: 0px; right: 0px; padding: 10px;">
                    <button
                        class="btn btn-primary"
                        style="padding: 10px; font-size: 1.0rem;"
                        on:click={() => (window.location.href = `${import.meta.env.VITE_APP_URL}/login`)}>Login</button
                    >
                </div>
            {/if}

            <!-- Idea - the pairing code should take you directly to the claim link -->

            {#if data.pairingCode}
                <div class="m-20">
                    <PairingCode code={data.pairingCode.code} />
                </div>
            {/if}
        </div>
    {/if}
{:else}
<div class="container">
    <div class="no-connection">
        <div>
            <h1>No connection to the server</h1>
            <p>nftcast API is unavailable</p>
        </div>
    </div>
</div>
{/if}

<!-- <div class="container"> -->
<!-- <Notifications />
    {#if $isAuthenticated}
        <ContentDisplay display={data.display}/>
    {:else if hasConnected}
        <PairingDisplay />
    {/if} -->
<!-- </div> -->

<style>
    .no-connection {
        background-color: #603532;
        padding: 10px 30px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .navbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        width: 100vw;
    }
</style>
