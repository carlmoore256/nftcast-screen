<script>
  // ContentDisplay checks for info & displays content
  import { onMount } from "svelte";
  import { APIClient } from "../services/api-client";
  import { getCurrentContentForDevice } from "../services/api/device";

  export let deviceId = null;

  onMount(async () => {
    await checkForInfo();
  });

  async function checkForInfo() {
    // const content = await api.get(
    //   `device/current-content/${deviceId}`,
    //   {
    //     setupName: "default",
    //   },
    //   { credentials: "include" }
    // );
    const content = await getCurrentContentForDevice(deviceId);
    console.log("Got info: " + content);
  }

  // onMount(async () => {
  //   const api = new APIClient();
  //   content = await api.get("device/current-content/:id", {
  //     setupName: "default",
  //   });
  // });

  // just continually check for info
</script>

<div>
  <h2>yoo</h2>
  <h1>Device ID: {deviceId}</h1>
  <!-- <h1>Content: {content}</h1> -->
</div>
