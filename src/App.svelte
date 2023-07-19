<script>
  import PairingDisplay from "./components/PairingDisplay.svelte";
  import ContentDisplay from "./components/ContentDisplay.svelte";
  import { deviceId } from "./stores/deviceIdStore";
</script>

<div class="container">
  {#if $deviceId == null}
    <PairingDisplay
      onPaired={() => {
        console.log("Paired!");
      }}
    />
  {:else}
    <ContentDisplay deviceId={$deviceId} />
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
  }
</style>
