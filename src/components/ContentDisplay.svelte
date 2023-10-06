<script lang="ts">
    import {
        deviceInfoStore,
        currentContentStore,
        currentTransformStore,
        currentStyleStore,
    } from "../services/websocketService";

    function cssStringify(styles: { [key: string]: string | number }): string {
        return Object.entries(styles)
            .map(
                ([prop, value]) =>
                    `${prop.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value}`
            )
            .join("; ");
    }

    let style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: `#000000`,
        objectFit: "contain",
        cursor: "none",
    };

    let type = "image";

    $: {
        if ($currentTransformStore) {
            const { size, posX, posY, rotation } = $currentTransformStore;
            style.top = `calc(50% + ${posY * 100}%)`;
            style.left = `calc(50% + ${posX * 100}%)`;
            style.transform = `translate(-50%, -50%) scale(${size}) rotate(${rotation}deg)`;
        }

        if ($currentStyleStore) {
            const { backgroundColor } = $currentStyleStore;
            style.backgroundColor = backgroundColor;
        }

        if ($currentContentStore) {
            const { mimetype } = $currentContentStore;
            if (mimetype) {
                type = mimetype.split("/")[0];
            } else {
                type = "image";
            }
        }
    }
</script>

<div class={$currentContentStore ? "hide-cursor" : ""}>
    {#if $currentContentStore}
        {#if type == "image"}
            <img
                class="rendered-content"
                src={$currentContentStore.uri}
                alt="Content"
                style={cssStringify(style)}
            />
        {:else if type == "video"}
            <!-- svelte-ignore a11y-media-has-caption -->
            <video
                class="rendered-content"
                src={$currentContentStore.uri}
                loop
                autoplay
                muted
                style={cssStringify(style)}
            />
        {:else if type == "audio"}
            <audio
                class="rendered-content"
                src={$currentContentStore.uri}
                controls
                autoplay
                loop
                style={cssStringify(style)}
            />
        {:else if type == "text"}
            <!-- svelte-ignore a11y-missing-attribute -->
            <iframe
                class="rendered-content"
                src={$currentContentStore.uri}
                style={cssStringify(style)}
            />
        {/if}
        <!-- <ContentRenderer content={currentContent} {style} /> -->
    {:else if !$deviceInfoStore}
        <h1>Device Info: No info yet</h1>
    {:else}
        <div class="container">
            <h1>{$deviceInfoStore.name}</h1>
            <h4>Id: {$deviceInfoStore.id}</h4>
            <h4>Waiting for content...</h4>
        </div>
    {/if}
</div>

<!-- let ws;

    let currentContent: IContent | null = null;
    let currentTransform: ITransform | null = null;
    let currentStyle: IStyle | null = null;
    let deviceInfo: IDevice | null = null;

    // let deviceContentPairConfig: IDeviceContentPairConfig | null = null;
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
                const { key, value } = JSON.parse(event.data);
                console.log(
                    `Received ${key} with value ${JSON.stringify(value)}`
                );
                switch (key) {
                    case "deviceInfo":
                        deviceInfo = {...value};
                        break;
                    case "content":
                        const { content, transform, style } = value;
                        currentContent = content;
                        currentTransform = transform;
                        currentStyle = style;
                        break;
                    case "transform":
                        currentTransform = value;
                        break;
                    case "style":
                        currentStyle = value;
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
    } -->

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
