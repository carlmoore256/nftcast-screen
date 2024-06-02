<script lang="ts">
	// import { browser } from '$app/environment';
	// import { invalidateAll } from '$app/navigation';
	import {
		displayWebsocket,
		type DisplayWebsocketEvent,
		type DisplayWebsocketMessage
	} from "../services/display-websocket";
	import { alertStore } from "../stores/alert-store";
	import type { DisplayClientView, DisplayContentPairClientView } from "../models/api-types";
	import type { Style } from "../prisma";
	import { onMount } from 'svelte';

	export let display: DisplayClientView;
	export let viewType: 'user' | null = null;
	export let reconnectDuration = 10000;

	let reconnectionToken: any | null = null;
	let isConnectionOpen = false;
	let cursorStyle = 'show-cursor';
	let cancellationToken: any | null = null;
	let contentLoaded = false;
	let style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		backgroundColor: `#000000`,
		objectFit: 'contain'
	};

	onMount(() => {
		tryConnect();
		return () => {
			displayWebsocket.close();
			clearTimeout(reconnectionToken);
		};
	});

	function cssStringify(styles: { [key: string]: string | number }): string {
		return Object.entries(styles)
			.map(([prop, value]) => `${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
			.join('; ');
	}

	async function tryConnect() {
		if (isConnectionOpen) return;
		try {
			reconnectionToken && clearTimeout(reconnectionToken);
			await displayWebsocket.open(viewType ? { displayId: display.id, viewType } : undefined);
		} catch (e) {
			console.log('Websocket connection failed', e);
			alertStore.set({
				message: `Websocket connection failed, retrying in ${reconnectDuration}ms`,
				type: 'error',
				duration: 2000
			});
			reconnectionToken = setTimeout(tryConnect, reconnectDuration);
		}
	}

	function handleDeleteDisplay() {
		alertStore.set({ message: `Display deleted`, type: 'warning' });
		fetch('/api/display/reset')
			.then(() => {
				// invalidateAll();
                location.reload();
				alertStore.set({ message: 'Display reset', type: 'success' });
			})
			.catch(() => {
				alertStore.set({ message: 'Failed to reset display', type: 'error' });
			});
	}

	function handleWebsocketMessage(message: DisplayWebsocketMessage) {
		switch (message.messageType) {
			case 'content-pair': {
				const newContentPair = message.data as DisplayContentPairClientView;
				if (newContentPair.content.id !== display.currentDisplayContentPair?.content.id) {
					contentLoaded = false;
				}
				display.currentDisplayContentPair = newContentPair;
				display = { ...display };
				break;
			}
			case 'display-style': {
				display.style = { ...display.style, ...message.data };
				break;
			}
			case 'content-style': {
				if (!display.currentDisplayContentPair) return;
				display.currentDisplayContentPair.style = {
					...display.currentDisplayContentPair.style,
					...message.data
				};
				break;
			}
			case 'transform': {
				// display.transform = message.transform;
				break;
			}
			case 'status-update': {
				displayWebsocket.send({
					messageType: 'status-update',
					data: {
						connected: true,
						errors: ['foo']
					}
				});
				break;
			}
			case 'update': {
				if (message.data.currentDisplayContentPair?.id !== display.currentDisplayContentPair?.content.id) {
					contentLoaded = false;
				}
				display = message.data;
				// contentLoaded = false;
				alertStore.set({ message: `Display updated`, type: 'info' });
				break;
			}
			case 'delete': {
				handleDeleteDisplay();
				break;
			}
			case 'refresh': {
				// invalidateAll().then(() => {
				// 	alertStore.set({ message: `Display refreshed`, type: 'info' });
				// });
                location.reload()
                alertStore.set({ message: `Display refreshed`, type: 'info' });
				break;
			}
			default: {
				console.log('Unknown message type', message.messageType);
				break;
			}
		}
	}

	function onWebsocketEvent(event: DisplayWebsocketEvent) {
		switch (event.type) {
			case 'open': {
				alertStore.set({ message: 'Websocket connected', type: 'success' });
				isConnectionOpen = true;
				break;
			}
			case 'close': {
				alertStore.set({ message: 'Websocket closed', type: 'warning', duration: 5000 });
				clearTimeout(reconnectionToken);
				reconnectionToken = setTimeout(tryConnect, reconnectDuration);
				isConnectionOpen = false;
				break;
			}
			case 'error': {
				alertStore.set({ message: 'Websocket error', type: 'error' });
				break;
			}
			case 'message': {
				if (!event.message) throw new Error('No message in event');
				handleWebsocketMessage(event.message);
				break;
			}
			default: {
				console.log('Unknown event type', event);
			}
		}
	}

	function combineStyles(styles: (Partial<Style> | null | undefined)[]) {
		const accumulatedValues = {
			posX: 0,
			posY: 0,
			size: 1,
			rotation: 0
		};
		for (const _style of styles) {
			if (!_style) continue;
			_style.posX && (accumulatedValues.posX += _style.posX);
			_style.posY && (accumulatedValues.posY += _style.posY);
			_style.size && (accumulatedValues.size *= _style.size);
			_style.rotation && (accumulatedValues.rotation += _style.rotation);
		}
		return accumulatedValues;
	}

	$: $displayWebsocket && onWebsocketEvent($displayWebsocket);
	$: isConnectionOpen && clearTimeout(reconnectionToken);
	$: currentContent = display.currentDisplayContentPair?.content;
	$: type = currentContent?.mimetype.split('/')[0] || 'image';
	$: cursorStyle = currentContent ? 'hide-cursor' : 'show-cursor';

	$: {
		const { size, posX, posY, rotation } = combineStyles([
			display.style,
			display.currentDisplayContentPair?.style,
			display.currentDisplayContentPair?.content.style
		]);

		style.top = `calc(50% + ${posY * 100}%)`;
		style.left = `calc(50% + ${posX * 100}%)`;
		style.transform = `translate(-50%, -50%) scale(${size}) rotate(${rotation}deg)`;

		// if (display.style) {
		// 	const { size, posX, posY, rotation } = display.style;
		// 	style.top = `calc(50% + ${posY * 100}%)`;
		// 	style.left = `calc(50% + ${posX * 100}%)`;
		// 	style.transform = `translate(-50%, -50%) scale(${size}) rotate(${rotation}deg)`;
		// }
	}
</script>

<svelte:window
	on:mousemove={() => {
		if (!currentContent) return;

		if (cursorStyle !== 'show-cursor') {
			cursorStyle = 'show-cursor';
			console.log('show cursor');
		}
		if (cancellationToken) {
			clearTimeout(cancellationToken);
		}
		cancellationToken = setTimeout(() => {
			console.log('hide cursor');
			cursorStyle = 'hide-cursor';
		}, 1000);
	}}
/>

{#if currentContent && !contentLoaded}
	<div class="absolute z-20 flex w-full h-full justify-center">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
{/if}

{#if currentContent}
	<div class={`${cursorStyle} overflow-hidden w-full h-full bg-black relative`}>
		{#if type == 'image'}
			<img
				class="rendered-content"
				src={currentContent.uri}
				alt="Content"
				style={cssStringify(style)}
				on:load={() => {
					contentLoaded = true;
				}}
			/>
		{:else if type == 'video'}
			<video
				class="rendered-content"
				src={currentContent.uri}
				loop
				autoplay
				muted
				style={cssStringify(style)}
			/>
		{:else if type == 'audio'}
			<audio
				class="rendered-content"
				src={currentContent.uri}
				controls
				autoplay
				loop
				style={cssStringify(style)}
			/>
		{:else if type == 'text'}
			<iframe
				class="rendered-content"
				title="content"
				src={currentContent.uri}
				style={cssStringify(style)}
			/>
		{/if}
	</div>
{:else}
	<div class="w-full h-full flex flex-col items-center justify-center bg-black">
		<div class="px-4 py-2 rounded-md bg-base-300 flex flex-col items-center gap-2">
			<span class="text-xs text-neutral-content">Connected Display</span>
			<h1 class="text-4xl font-bold text-center my-2">{display.name}</h1>
			<p class="text-xs">{display.id}</p>
		</div>
		<div class="p-4 flex flex-col items-center">
			<h4>Waiting for content...</h4>
			<p>{JSON.stringify(display.style)}</p>
		</div>
	</div>
{/if}

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 25px;
		background-color: rgb(0, 0, 0);
		overflow: hidden;
	}

	.rendered-content {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.hide-cursor {
		cursor: none;
	}

	.show-cursor {
		cursor: auto;
	}
</style>
