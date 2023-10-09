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
    };

    let type = "image";
    let cursorStyle = "show-cursor";


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
        } else {
            cursorStyle = "show-cursor";
        }
    }

    let cancellationToken: any | null = null;
</script>

<svelte:window on:mousemove={() => {
    if (!$currentContentStore) return;

    if (cursorStyle !== "show-cursor") {
        cursorStyle = "show-cursor";
        console.log("show cursor");
    }
    if (cancellationToken) {
        clearTimeout(cancellationToken);
    }
    cancellationToken = setTimeout(() => {
        console.log("hide cursor");
        cursorStyle = "hide-cursor";
    }, 1000);
}}/>

<div class={cursorStyle}>
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

    .show-cursor {
        cursor: auto;
    }
</style>
