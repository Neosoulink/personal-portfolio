export interface IframeMouseDispatcherEventDetails {
	clientX: number;
	clientY: number;
	button: number;
	buttons: number;
}

export interface IframeMouseDispatcherEvent
	extends CustomEvent<IframeMouseDispatcherEventDetails> {}

export interface IframeLinkClickEventDetails {
	link: string;
}

export interface IframeLinkClickEvent
	extends CustomEvent<IframeLinkClickEventDetails> {}

/**
 * @param iframe Iframe Html element
 * @param callback A function called after the `dispatchEvent`
 * @returns `cleanUp` A cleanUp function to remove the event listener
 */
export const iframeMouseMoveDispatcher = (
	iframe: HTMLIFrameElement,
	callback?: (e: IframeMouseDispatcherEvent) => unknown
) => {
	const onMouseMove = (e: MouseEvent) => {
		const boundingClientReact = iframe.getBoundingClientRect();

		const customEvent = new CustomEvent<IframeMouseDispatcherEventDetails>(
			"iframemousemove",
			{
				bubbles: true,
				cancelable: false,
				detail: {
					...e,
					clientX: e.clientX + boundingClientReact.left,
					clientY: e.clientY + boundingClientReact.top,
				},
			}
		);

		iframe.dispatchEvent(customEvent);
		callback?.(customEvent);
	};

	iframe.contentWindow?.addEventListener("mousemove", onMouseMove);

	return () =>
		iframe.contentWindow?.removeEventListener("mousemove", onMouseMove);
};
