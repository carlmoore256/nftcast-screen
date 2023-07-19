<script>
    import PairingDisplay from "./components/PairingDisplay.svelte";


</script>

<div class="container">
  <PairingDisplay onPaired={() => {
    console.log("Paired!");
  }}/>
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
