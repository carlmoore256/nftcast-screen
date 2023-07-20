<script lang="ts">
    // ContentDisplay checks for info & displays content
    import { onMount } from "svelte";
    import { getCurrentContentForDevice } from "../services/api/device";
    import { getConnection } from "../services/api/device";
    import { API_WS_URL } from "../services/api/constants";
    import type { IContent } from "../models/content-types";
    import type { IDevice } from "../models/device-types";

    export let deviceId = null;

    let ws;
    let currentContent: IContent | null = null;
    let deviceInfo: IDevice | null = null;

    establishWSConnection();

    function connect(connectionToken: string) {
        ws = new WebSocket(`${API_WS_URL}/${connectionToken}`);
        ws.onopen = () => {
            console.log("WebSocket is connected");
            ws.send(JSON.stringify({ request: "update" }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.key == "deviceUpdateInfo") {
                    console.log("Got info: " + JSON.stringify(data.value));
                    console.log(`Yo current content: ${data.value.deviceInfo}`);
                    deviceInfo = data.value.deviceInfo;
                    currentContent = data.value.currentContent;
                }
            } catch (error) {
                console.error("Error parsing data: " + error);
            }
        };

        ws.onerror = (event) => {
            console.error(`WebSocket error: ${event}`);
        };

        ws.onclose = (event) => {
            console.log("WebSocket is closed now.");
        };
    }

    async function establishWSConnection() {
        const connectionToken = await getConnection(deviceId);
        if (connectionToken) {
            connect(connectionToken);
        } else {
            console.log("No connection token");
        }
    }
</script>

<div>
    {#if !deviceInfo && !currentContent}
        <h1>Device Info: No info yet</h1>
    {/if}

    {#if deviceInfo && !currentContent}
        <div class="container">
            <h1>{deviceInfo.name}</h1>
            <h4>Id: {deviceInfo.id}</h4>
            <h4>Waiting for content...</h4>
        </div>
    {:else}
        <h1>Device Info: No info yet</h1>
    {/if}

    {#if currentContent}
        <img src={currentContent.uri} alt="Content"/>
    {/if}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 25px;
        border-radius: 8px;
        background-color: rgb(24, 24, 24);
    }

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain; 
      /* make object-fit: cover; if we want it to fill */
    }
</style>
