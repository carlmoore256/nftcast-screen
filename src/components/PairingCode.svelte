<script lang="ts">
    import { charToHue } from "../utils/charToHue";
    import { onMount } from "svelte";
    // import { QRCode } from "qrcode";
    // import { QRCode } from "qrcode";
    import QRCode from "qrcode";

    export let code = "";
    export let partialCode = 0;
    $: colors = Array.from(code).map((c, i) =>
        partialCode && i < partialCode ? "red" : charToHue(c, 60, 80)
    ); // If 'partialCode' is not null and 'i' is less than 'partialCode.length', make it red. Else, compute the color.
    $: {
        console.log(`Code: ${code}`);
        console.log(`Partial Code: ${partialCode}`);
        colors = Array.from(code).map((c, i) =>
            partialCode && i < partialCode ? "tomato" : charToHue(c, 60, 80)
        ); // If 'partialCode' is not null and 'i' is less than 'partialCode.length', make it red. Else, compute the color.
        console.log(`Colors: ${colors}`);
    }

    let canvasElement;

    onMount(() => {
        if (canvasElement) {
            QRCode.toCanvas(canvasElement, code, {
                width: 100,
                margin: 0,
                color: {
                    dark: "#000000",
                    light: "#ffffff",
                },
            });
        }
    });

    $: if (canvasElement) {
        QRCode.toCanvas(canvasElement, code, {
            width: 100,
            margin: 0,
            color: {
                dark: "#000000",
                light: "#ffffff",
            },
        });
    }
</script>

<div class="code">
    {#if code}
        <canvas bind:this={canvasElement} />

        {#each colors as color, i (i)}
            <!-- <span style="color: {color};">{code[i]}</span> -->
            <span
                class={color === "tomato" ? "glow" : ""}
                style="color: {color};">{code[i]}</span
            >
        {/each}
    {/if}
</div>

<style>
    .code {
        padding: 4px;
        width: 100%;
        text-align: center;
        font-weight: 600;
        padding: 10px;
        font-size: 7.5rem;
    }

    .number {
        color: rgb(255, 255, 255);
    }

    .letter {
        color: rgb(200, 200, 200);
    }

    .glow {
        text-shadow: 0px 0px 20px rgba(255, 8, 8, 0.589);
    }
</style>
