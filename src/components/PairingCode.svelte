<script>
    import { charToHue } from "../utils/charToHue";
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
</script>

<div class="code">
    {#if code}
        {#each colors as color, i (i)}
            <!-- <span style="color: {color};">{code[i]}</span> -->
            <span class={color === 'tomato' ? 'glow' : ''} style="color: {color};">{code[i]}</span>

        {/each}
    {/if}
</div>

<style>
    .code {
        background-color: rgb(65, 65, 65);
        padding: 4px;
        width: 100%;
        text-align: center;
        font-weight: 600;
        padding: 10px;
        font-size: 10.5rem;
        border-radius: 5px;
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
