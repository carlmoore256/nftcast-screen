<script lang="ts">
    import { onMount } from "svelte";
    import { deviceIdStore } from "../stores/deviceIdStore";
    import type {
        IPairingCodeResponse,
        IPairingStatusResponse,
    } from "../models/pairing-types";
    import { pairingId } from "../stores/pairingIdStore";
    import { getPairingCode, getPairingStatus } from "../services/api/pair";
    import { isAuthenticated } from "../stores/isAuthenticatedStore";
    import { successStore } from "../stores/successStore";
    import { getIsAuthenticated } from "../services/api/device";

    onMount(setPairingCode);

    $: pairingCode = null;

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
            const response = await getPairingStatus(pairingCode);
            if (response.status === "claimed") {
                deviceIdStore.set(response.deviceId);
                successStore.set("Device claimed");
                $isAuthenticated = await getIsAuthenticated();
                return;
            }
        } catch (error) {
            throw new Error(`Error getting pairing code` + error);
        }
        if (!$isAuthenticated) {
            setTimeout(checkPairingStatus, 1000); 
        }
    }
</script>

<div class="container">
    <div class="heading prevent-select">
        <h3>Pairing Code</h3>
    </div>
    <div class="code">
        {#if pairingCode}
            <p>{pairingCode}</p>
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

    .code {
        background-color: rgb(65, 65, 65);
        padding: 4px;
        width: 80%;
        text-align: center;
        font-weight: 800;
        font-size: larger;
        border-radius: 5px;
    }
</style>
