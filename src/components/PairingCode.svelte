<script lang="ts">
    import { onMount } from "svelte";
    import QRCode from "qrcode";
    import { charToHue } from "../utils/charToHue";
    // import { PUBLIC_URL } from '$env/static/public';

    export let code = "";
    export let partialCode = 0;
    const APP_URL = import.meta.env.VITE_APP_URL;

    $: colors = Array.from(code).map((c, i) =>
        partialCode && i < partialCode ? "red" : charToHue(c, 60, 80)
    ); // If 'partialCode' is not null and 'i' is less than 'partialCode.length', make it red. Else, compute the color.
    $: {
        console.log(`Code: ${code}`);
        console.log(`Partial Code: ${partialCode}`);
        colors = Array.from(code).map((c, i) =>
            partialCode && i < partialCode ? "tomato" : charToHue(c, 60, 80)
        ); // If 'partialCode' is not null and 'i' is less than 'partialCode.length', make it red. Else, compute the color.
    }

    let canvasElement: HTMLCanvasElement | null = null;

    onMount(() => {
        if (canvasElement) {
            QRCode.toCanvas(canvasElement, `${APP_URL}/claim/${code}`, {
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
        QRCode.toCanvas(canvasElement, `${APP_URL}/claim/${code}`, {
            width: 100,
            margin: 0,
            color: {
                dark: "#000000",
                light: "#ffffff",
            },
        });
    }
</script>

<div class="relative p-2 w-full flex flex-col items-center gap-5 container">
    {#if code}
        <canvas class="w-full" bind:this={canvasElement} />
        <div
            class="text-center bg-base-300 p-2 rounded-md"
            style="font-size: 40px; font-weight: bold;"
        >
            {#each colors as color, i (i)}
                <!-- <span style="color: {color};">{code[i]}</span> -->
                <span
                    class={`${color === "tomato" ? "glow" : ""} text-6xl ${
                        isNaN(parseInt(code[i])) ? "letter" : "number"
                    }`}
                    style="color: {color};">{code[i]}</span
                >
            {/each}
        </div>

        <div class="info-text">
            <!-- <h4>Connect this Display</h4> -->
            <p>Enter code in the <a href={`${import.meta.env.VITE_APP_URL}/dashboard`}>nftcast dashboard</a></p>
        </div>
    {/if}
</div>

<style>

    .info-text {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        margin-top: 20px;
    }

    .info-text h4 {
        font-size: 1.5rem;
        margin: 0;
    }

    .info-text p {
        font-size: 1rem;
        margin: 0;
    }

    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
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
