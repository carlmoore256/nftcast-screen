<script lang="ts">
    import type { IContent } from "../models/types";

    export let content: IContent;
    export let style: string;

    let type = "image"; // only for legacy db without mimetypes, remove me
    if (content.mimetype) {
        type = content.mimetype.split("/")[0];
    }
</script>

{#if type == "image"}
    <img src={content.uri} alt="Content" {style} />
{:else if type == "video"}
    <!-- svelte-ignore a11y-media-has-caption -->
    <video src={content.uri} loop autoplay muted {style} />
{:else if type == "audio"}
    <audio src={content.uri} controls autoplay loop {style} />
{:else if type == "text"}
    <!-- svelte-ignore a11y-missing-attribute -->
    <iframe src={content.uri} {style} />
{/if}

<style>
    * {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        /* make object-fit: cover; if we want it to fill */
    }
</style>
