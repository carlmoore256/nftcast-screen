<script lang="ts">
    import { fade } from "svelte/transition";
    import { fly } from "svelte/transition";
    import { onDestroy } from "svelte";
    import type { Readable } from "svelte/store";

    export let color: string = "green";
    export let store: Readable<string | null>;
    export let timeout: number = 4000;

    let message: string | null = null;

    let unsubscribe = store.subscribe((value) => {
        message = value;
        
        setTimeout(() => {
            message = null;
        }, timeout);
    });

    onDestroy(unsubscribe);
</script>

{#if message}
    <div
        class="container"
        style="--color: {color};"
        in:fly={{ y: -100, duration: 300 }}
        out:fade={{ duration: 1000 }}
    >
        <div class="message">
            <p>{message}</p>
        </div>
    </div>
{/if}

<style>
    .container {
        position: fixed;
        display: flex;
        flex-direction: column;
        align-items: center;
        top: 10px;
        max-width: 300px;
        opacity: 100%;
        z-index: 100;
        filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.24));
    }

    .message {
        background-color: var(--color);
        border-radius: 4px;
        width: 100%;
        padding: 5px 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        max-height: 100px;
    }

    p {
        margin: 0;
        color: white;
        font-size: 0.9rem;
    }
</style>
