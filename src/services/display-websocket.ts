import { writable } from 'svelte/store';
import { getDisplayToken } from "./api/display";

export type DisplayWebsocketMessage = {
	messageType: string;
	data: any;
};

export type DisplayWebsocketEvent = {
	type: 'open' | 'message' | 'error' | 'close';
	message?: DisplayWebsocketMessage;
};

function createDisplayWebsocket(url: string = import.meta.env.VITE_WEBSOCKET_API_URL) {
	const { subscribe, set } = writable<DisplayWebsocketEvent>();

	const websocketStore = writable<WebSocket | null>(null);

	function open(alternateView?: { displayId: string; viewType: string }) {
		return new Promise<void>(async (resolve, reject) => {
			let token: string;
			try {
				token = await getDisplayToken();
			} catch (error) {
				console.error('Failed to get display token', error);
				reject();
				return;
			}

			const params = new URLSearchParams({ token });
			let _url = url;
			if (alternateView) {
				params.set('displayId', alternateView.displayId);
				params.set('viewType', alternateView.viewType);
			}

			_url += '?' + params.toString();

			const ws = new WebSocket(_url);
			console.log('Opening websocket connection', _url);

			websocketStore.update((oldWs) => {
				if (oldWs) {
					oldWs.close();
				}
				return ws;
			});

			ws.onopen = () => {
				console.log('Websocket connection opened');
				set({ type: 'open' });
				resolve();
			};
			ws.onmessage = (event) => {
				try {
					const { messageType, data } = JSON.parse(event.data) as DisplayWebsocketMessage;
					set({
						type: 'message',
						message: {
							messageType,
							data: JSON.parse(data)
						}
					});
				} catch (error) {
					console.error('Error parsing message', error);
					set({ type: 'error' });
				}
			};
			ws.onerror = (error) => {
				set({ type: 'error' });
			};
			ws.onclose = () => {
				set({ type: 'close' });
				reject();
			};
		});
	}

	function send(message: DisplayWebsocketMessage) {
		websocketStore.update((ws) => {
			console.log('Sending message', message);
			if (ws) {
				ws.send(JSON.stringify(message));
			}
			return ws;
		});
	}

	function close() {
		websocketStore.update((ws) => {
			if (ws) {
				ws.close();
			}
			return null;
		});
	}

	return {
		subscribe,
		open,
		send,
		close,
		set
	};
}

export const displayWebsocket = createDisplayWebsocket();

// export const websocketMessage = writable<DisplayWebsocketMessage>();

// export class DisplayWebsocket {
// 	constructor(private connectionUrl: string = PUBLIC_WEBSOCKET_API_URL) {}
// }
