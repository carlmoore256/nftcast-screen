<script lang="ts">
    import { getConnection } from "../services/api/device";
    import type {
        IDevice,
        IContent,
        IDeviceContentPairConfig,
    } from "../models/types";
    import { errorStore } from "../stores/errorStore";
    import { deviceIdStore } from "../stores/deviceIdStore";
    import { isAuthenticated } from "../stores/isAuthenticatedStore";
    import ContentRenderer from "./ContentRenderer.svelte";

    let ws;
    let currentContent: IContent | null = null;
    let deviceInfo: IDevice | null = null;
    let deviceContentPairConfig: IDeviceContentPairConfig | null = null;
    let reconnectionAttempt = 0;
    const MAX_RECONNECTION_ATTEMPTS = 50;
    const RECONNECTION_DELAY = 500;

    establishWSConnection();

    function connectToWebsocket(connectionToken: string) {
        ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/${connectionToken}`);
        ws.onopen = () => {
            console.log("WebSocket is connected");
            reconnectionAttempt = 0;
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
            handleReconnection();
        };

        ws.onclose = (event) => {
            if (reconnectionAttempt === 0) {
                errorStore.set("Connection closed with server");
            }
            handleReconnection();
        };
    }

    async function handleReconnection() {
        if (reconnectionAttempt > MAX_RECONNECTION_ATTEMPTS) {
            errorStore.set("Max reconnection attempts reached");
            return;
        }
        const connectionToken = await getConnection($deviceIdStore);

        if (connectionToken) {
            connectToWebsocket(connectionToken);
            return;
        } else {
            if (reconnectionAttempt === 0) {
                errorStore.set("Connection could not be established");
            }
            setTimeout(async () => {
                console.log(`Reconnecting attempt #${reconnectionAttempt + 1}`);
                handleReconnection();
                reconnectionAttempt += 1;
            }, RECONNECTION_DELAY);
            return;
        }
    }

    async function establishWSConnection() {
        const connectionToken = await getConnection($deviceIdStore);
        if (connectionToken) {
            connectToWebsocket(connectionToken);
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

    let type = "image"; // only for legacy db without mimetypes, remove me
    $: if (currentContent && currentContent.uri) {
        console.log(`Mimetype: ${currentContent.mimetype}`);
        if (currentContent.mimetype) {
            type = currentContent.mimetype.split("/")[0];
        } else {
            type = "image";
        }
        console.log(`Type Set: ${type}`);
    }
</script>

<div class={currentContent ? "hide-cursor" : ""}>
    {#if currentContent}
        {#if type == "image"}
            <img class="rendered-content" src={currentContent.uri} alt="Content" {style} />
        {:else if type == "video"}
            <!-- svelte-ignore a11y-media-has-caption -->
            <video class="rendered-content" src={currentContent.uri} loop autoplay muted {style} />
        {:else if type == "audio"}
            <audio class="rendered-content" src={currentContent.uri} controls autoplay loop {style} />
        {:else if type == "text"}
            <!-- svelte-ignore a11y-missing-attribute -->
            <iframe class="rendered-content" src={currentContent.uri} {style} />
        {/if}
        <!-- <ContentRenderer content={currentContent} {style} /> -->
    {:else if !deviceInfo}
        <h1>Device Info: No info yet</h1>
    {:else}
        <div class="container">
            <h1>{deviceInfo.name}</h1>
            <h4>Id: {deviceInfo.id}</h4>
            <h4>Waiting for content...</h4>
        </div>
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
        background-color: rgb(0, 0, 0);
    }

    .rendered-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .hide-cursor {
        cursor: none;
    }
</style>
