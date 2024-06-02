<script>
    import { tick } from "svelte";
    import { logs } from "../stores/logStore";
    import { toggleUILogger } from "../services/logMessage";
    import Icon from "@iconify/svelte";

    export let enabled = false;
    let consoleDiv;

    function scrollToBottom() {
        if (consoleDiv) {
            consoleDiv.scrollTop = consoleDiv.scrollHeight;
        }
    }

    $: {
        if (enabled) {
            console.log("Console enabled");
            toggleUILogger(true);
        } else {
            console.log("Console disabled");
            toggleUILogger(false);
        }
    }

    $: {
        if ($logs) {
            tick().then(scrollToBottom); // Wait for the DOM to update, then scroll
        }
    }

    // setInterval(() => {
    //     console.log(`new message ${new Date().toISOString()}`);
    // }, 1000);

    // Subscribe to the log store
    // $logs;
</script>

<div id="console" bind:this={consoleDiv}>
    <div class="console-header">
        <Icon icon="material-symbols:terminal" style="color: white" height="20px" />
    </div>
    {#each $logs as log}
        <div class="log {log.type}"><strong></strong> {log.message}</div>
    {/each}
</div>

<style>
    .console-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2px;
        margin-bottom: 4px;
        background: #333;
        border-radius: 4px;
        color: white;
    }

    #console {
        /* Style the console as desired, e.g., a fixed position overlay */
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 300px;
        max-height: 200px;
        overflow: auto;
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        padding: 10px;
        font-family: monospace;
        z-index: 1000;
        border-radius: 6px;
        border: #ffffff5a solid 1px;
    }

    .log {
        margin-bottom: 5px;
    }

    .log.error {
        color: red;
    }

    .log.warn {
        color: yellow;
    }

    .log.log {
        color: rgb(255, 255, 255);
    }
</style>
