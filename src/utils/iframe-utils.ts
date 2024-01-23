export interface IframeMouseMoveDispatcherEvent
	extends CustomEvent<{
		clientX: number;
		clientY: number;
		button: number;
		buttons: number;
	}> {}

/**
 * @param iframe Iframe Html element
 * @param callback A function called after the `dispatchEvent`
 * @returns `cleanUp` A cleanUp function to remove the event listener
 */
export const iframeMouseMoveDispatcher = (
	iframe: HTMLIFrameElement,
	callback?: (e: IframeMouseMoveDispatcherEvent) => unknown
) => {
	const onMouseMoveEvent = (e: MouseEvent) => {
		const boundingClientReact = iframe.getBoundingClientRect();

		const customEvent = new CustomEvent<{
			clientX: number;
			clientY: number;
			button: number;
			buttons: number;
		}>("mousemove", {
			bubbles: true,
			cancelable: false,
			detail: {
				...e,
				clientX: e.clientX + boundingClientReact.left,
				clientY: e.clientY + boundingClientReact.top,
			},
		});

		iframe.dispatchEvent(customEvent);
		callback?.(customEvent);
	};

	iframe.contentWindow?.addEventListener("mousemove", onMouseMoveEvent);

	return () => {
		iframe.contentWindow?.removeEventListener("mousemove", onMouseMoveEvent);
	};
};

/**
 * @param iframe Iframe Html element
 * @param callback A function called after the `dispatchEvent`
 * @returns `cleanUp` A cleanUp function to remove the event listener
 */
export const iframeClickDispatcher = (
	iframe: HTMLIFrameElement,
	callback?: (e: IframeMouseMoveDispatcherEvent) => unknown
) => {
	const onClickEvent = (e: MouseEvent) => {
		const boundingClientReact = iframe.getBoundingClientRect();

		const customEvent = new CustomEvent<{
			clientX: number;
			clientY: number;
			button: number;
			buttons: number;
		}>("click", {
			bubbles: true,
			cancelable: false,
			detail: {
				clientX: e.clientX + boundingClientReact.left,
				clientY: e.clientY + boundingClientReact.top,
				button: e.button,
				buttons: e.buttons,
			},
		});

		callback?.(customEvent);

		iframe.dispatchEvent(customEvent);
	};
	iframe.contentWindow?.addEventListener("click", onClickEvent);

	return () => {
		iframe.contentWindow?.removeEventListener("click", onClickEvent);
	};
};
