<script lang="ts">
    import type { User, Organization } from '../prisma';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	// import AccountDropdown from './AccountDropdown.svelte';
	export let timeout = 30000;
	export let transitionDuration = 500;

	let isShowing = true;
	let timeoutToken: any;

	function setVisibilityTimeout() {
		if (timeoutToken) clearTimeout(timeoutToken);
		isShowing = true;
		timeoutToken = setTimeout(() => {
			isShowing = false;
		}, timeout);
	}

	onMount(() => {
		setVisibilityTimeout();
		return () => {
			if (timeoutToken) clearTimeout(timeoutToken);
		};
	});

	export let user: Pick<User, 'id' | 'name' | 'email'> & {
		organization: Pick<Organization, 'name' | 'id'>;
	};
</script>

<svelte:window on:mousemove={setVisibilityTimeout} />

<div class="p-1">
	{#if isShowing}
		<div
			class="navbar bg-base-200 bg-opacity-50 rounded-md"
			transition:fade={{ duration: transitionDuration }}
		>
			<div class="flex-1">
				<div class="p-2">
					<h2>
						Welcome back, <strong>{user.name || user.email}</strong>
					</h2>
					<p class="text-xs">
						You are a member of <strong>{user.organization.name}</strong>
					</p>
				</div>
			</div>

			<div class="flex-none gap-2">
				<!-- <AccountDropdown /> -->
			</div>
		</div>
	{/if}
</div>
