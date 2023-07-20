<script lang="ts">
    import { onMount } from "svelte";
    import { deviceId } from "../stores/deviceIdStore";
    import { APIClient } from "../services/api-client";
    import type {
        IPairingCodeResponse,
        IPairingStatusResponse,
    } from "../models/pairing-types";
    import { pairingId } from "../stores/pairingIdStore";
    import { getPairingCode, getPairingStatus } from "../services/api/pair";
    import { isAuthenticated } from "../stores/isAuthenticatedStore";

    export let onPaired: () => void = () => {};

    onMount(setPairingCode);

    $: pairingCode = null;

    async function setPairingCode() {
        try {
            const response = await getPairingCode();
            console.log(`Pairing Code Reponse: ${JSON.stringify(response)}`);
            pairingCode = response.code;
            pairingId.set(response.pairingId);
            checkPairingStatus();
        } catch (error) {
            throw new Error(`Error getting pairing code` + error);
        }
    }

    async function checkPairingStatus() {
        console.log("Checking pairing status for code: " + pairingCode);
        try {
            const response = await getPairingStatus(pairingCode);
            console.log(`Pairing Status Reponse: ${JSON.stringify(response)}`);
            if (response.status === "claimed") {
                console.log("Paired! Got Device ID: " + response.deviceId);
                deviceId.set(response.deviceId);
                onPaired();
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
        width: 40%;
        height: 20%;
        background-color: rgb(24, 24, 24);
        padding: 10px;
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