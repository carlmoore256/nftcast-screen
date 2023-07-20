<script>
    import Toast from "./Toast.svelte";
    import { errorStore } from "../stores/errorStore";
    import { successStore } from "../stores/successStore";
</script>

<Toast color="DarkRed" store={errorStore} timeout={4000} />
<Toast color="DarkGreen" store={successStore} timeout={4000} />