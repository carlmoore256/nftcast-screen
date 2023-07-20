<script lang="ts">
    import { getConnection } from "../services/api/device";
    import type { IContent } from "../models/content-types";
    import type { IDevice } from "../models/device-types";
    import { errorStore } from "../stores/errorStore";
    import { successStore } from "../stores/successStore";
    import { deviceIdStore } from "../stores/deviceIdStore";
    import { isAuthenticated } from "../stores/isAuthenticatedStore";
    // export let deviceId = null;

    let ws;
    let currentContent: IContent | null = null;
    let deviceInfo: IDevice | null = null;

    establishWSConnection();

    function connect(connectionToken: string) {
        ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/${connectionToken}`);
        ws.onopen = () => {
            console.log("WebSocket is connected");
            ws.send(JSON.stringify({ request: "update" }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                switch(data.key) {
                    case "deviceUpdateInfo":
                        deviceInfo = data.value.deviceInfo;
                        currentContent = data.value.currentContent;
                        break;
                    case "deviceDeleted":
                        currentContent = null;
                        deviceInfo = null;
                        errorStore.set("Device deleted");
                        isAuthenticated.set(false);
                        break;
                }
            } catch (error) {
                errorStore.set("Error parsing data");
            }
        };

        ws.onerror = (event) => {
            errorStore.set("WebSocket error with server");
        };

        ws.onclose = (event) => {
            console.log("Connection closed with server");
        };
    }

    async function establishWSConnection() {
        const connectionToken = await getConnection($deviceIdStore);
        if (connectionToken) {
            connect(connectionToken);
        } else {
            errorStore.set("Connection could not be established");
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
        <img src={currentContent.uri} alt="Content" />
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
