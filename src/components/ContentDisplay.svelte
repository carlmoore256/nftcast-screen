<script lang="ts">
    import { getConnection } from "../services/api/device";
    import type {
        IDevice,
        IContent,
        IDeviceContentPairConfig,
    } from "../models/types";
    import { errorStore } from "../stores/errorStore";
    import { successStore } from "../stores/successStore";
    import { deviceIdStore } from "../stores/deviceIdStore";
    import { isAuthenticated } from "../stores/isAuthenticatedStore";
    // export let deviceId = null;

    let ws;
    let currentContent: IContent | null = null;
    let deviceInfo: IDevice | null = null;
    let deviceContentPairConfig: IDeviceContentPairConfig | null = null;
    let reconnectionAttempt = 0;
    const MAX_RECONNECTION_ATTEMPTS = 5;
    const RECONNECTION_DELAY = 5000;

    establishWSConnection();

    function connect(connectionToken: string) {
        // wss://api.nftcast.app:3000
        // import.meta.env.VITE_WS_URL
        ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/${connectionToken}`);
        ws.onopen = () => {
            console.log("WebSocket is connected");
            ws.send(JSON.stringify({ request: "update" }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                switch (data.key) {
                    case "deviceUpdateInfo":
                        deviceInfo = data.value.deviceInfo;
                        currentContent = data.value.currentContent;
                        deviceContentPairConfig = data.value.dcpConfig;
                        break;
                    case "deviceDeleted":
                        currentContent = null;
                        deviceInfo = null;
                        errorStore.set("Device deleted");
                        isAuthenticated.set(false);
                        break;
                    case "deviceContentPairConfig":
                        console.log(
                            `Received update config: ${JSON.stringify(
                                data.value
                            )}`
                        );
                        deviceContentPairConfig = { ...data.value };
                        break;
                }
            } catch (error) {
                errorStore.set("Error parsing data");
            }
        };

        ws.onerror = (event) => {
            errorStore.set("WebSocket error with server");
            handleReconnection(connectionToken);
        };

        ws.onclose = (event) => {
            errorStore.set("Connection closed with server");
            handleReconnection(connectionToken);
        };
    }

    function handleReconnection(connectionToken: string) {
        if (reconnectionAttempt < MAX_RECONNECTION_ATTEMPTS) {
            setTimeout(() => {
                console.log(`Reconnecting attempt #${reconnectionAttempt + 1}`);
                connect(connectionToken);
                reconnectionAttempt += 1;
            }, RECONNECTION_DELAY);
        } else {
            console.log("Max reconnection attempts reached");
        }
    }
    async function establishWSConnection() {
        const connectionToken = await getConnection($deviceIdStore);
        if (connectionToken) {
            connect(connectionToken);
        } else {
            errorStore.set("Connection could not be established");
        }
    }

    let style = "";
    // let containerStyle = "background-color: rgb(24, 24, 24);";
    $: if (deviceContentPairConfig) {
        const { size, posX, posY, rotation, backgroundColor } =
            deviceContentPairConfig;
        const styleObj = {
            position: "absolute",
            top: `calc(50% + ${posY * 100}%)`,
            left: `calc(50% + ${posX * 100}%)`,
            transform: `translate(-50%, -50%) scale(${size}) rotate(${rotation}deg)`,
            backgroundColor: `#${backgroundColor}`,
            objectFit: "contain",
            cursor: "none",
        };
        // containerStyle = `background-color: #${backgroundColor}`;
        console.log(`new style: ${JSON.stringify(styleObj)}`);
        style = Object.entries(styleObj)
            .map(([prop, value]) => `${prop}: ${value}`)
            .join("; ");
    }
</script>

<div class={currentContent ? "hide-cursor" : ""}>
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
        <img src={currentContent.uri} alt="Content" {style} />
    {/if}
    <!-- {#if currentContent}
        <img src={currentContent.uri} alt="Content" />
    {/if} -->
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 25px;
        border-radius: 8px;
        background-color: rgb(0, 0, 0);
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

    .hide-cursor {
        cursor: none;
    }
</style>
