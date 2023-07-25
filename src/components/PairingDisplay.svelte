<script lang="ts">
    import { onMount } from "svelte";
    import { deviceIdStore } from "../stores/deviceIdStore";
    import { pairingId } from "../stores/pairingIdStore";
    import { getPairingCode, getPairingStatus } from "../services/api/pair";
    import { isAuthenticated } from "../stores/isAuthenticatedStore";
    import { successStore } from "../stores/successStore";
    import { getIsAuthenticated } from "../services/api/device";
    import { errorStore } from "../stores/errorStore";
    import PairingCode from "./PairingCode.svelte";

    const FAST_POLL_RATE = 100; // how often to poll the server when the user is typing in the code
    const SLOW_POLL_RATE = 1000; // how often to poll the server when the user is not typing in the code
    const INACTIVITY_TIMEOUT = 5000; // when the user starts typing in the code, the polling rate increases
    // until this amount of time, after which it decreases again

    onMount(setPairingCode);

    let pairingCode = null;
    let partialCode = null;
    let lastPartialCode = null;
    let hadPartialCode = false;
    let resetDelayTimer = null;

    $: if (partialCode !== lastPartialCode) {
        lastPartialCode = partialCode;
        hadPartialCode = true;

        // If a new partial code is detected, set a timer to reset delay to 1000ms after 5 seconds
        if (resetDelayTimer) clearTimeout(resetDelayTimer);  // clear the old timer
        resetDelayTimer = setTimeout(() => {
            hadPartialCode = false;
        }, INACTIVITY_TIMEOUT); // reset after 5 seconds of inactivity
    }

    async function setPairingCode() {
        try {
            const response = await getPairingCode();
            pairingCode = response.code;
            pairingId.set(response.pairingId);
            checkPairingStatus();
        } catch (error) {
            throw new Error(`Error getting pairing code` + error);
        }
    }

    async function checkPairingStatus() {
        try {
            const { status, partial, deviceId } = await getPairingStatus(pairingCode);
            if (status === "claimed") {
                $isAuthenticated = await getIsAuthenticated();
                if (!$isAuthenticated) {
                    errorStore.set("Device claimed, but could not authenticate");
                    return;
                }
                deviceIdStore.set(deviceId);
                successStore.set("Device claimed!");
                return;
            } else if (partial) {
                partialCode = partial;
            }
        } catch (error) {
            throw new Error(`Error getting pairing code` + error);
        }
        if (!$isAuthenticated) {
            let timeout = hadPartialCode ? FAST_POLL_RATE : SLOW_POLL_RATE;
            console.log(`Checking pairing status in ${timeout}ms`);
            setTimeout(checkPairingStatus, timeout);
        }
    }
</script>

<div class="container">
    <div class="heading prevent-select">
        <h3>Pairing Code</h3>
    </div>
    <div class="code">
        {#if pairingCode}
            <PairingCode code={pairingCode} {partialCode} />
        {:else}
            <p>Generating...</p>
        {/if}
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        background-color: rgb(24, 24, 24);
        padding: 20px 50px;
        /* make a drop shadow */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.238);
    }
</style>
