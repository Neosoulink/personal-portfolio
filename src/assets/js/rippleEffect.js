export default function createRipple(event) {
	const button = event.currentTarget;
	const btnClientRect = button.getBoundingClientRect();

	const circle = document.createElement("span");
	const diameter = Math.max(window.innerWidth, window.innerHeight);
	const radius = diameter / 2;

	circle.style.width = circle.style.height = `${diameter}px`;
	circle.style.left = `${event.clientX - (btnClientRect.left + radius)}px`;
	circle.style.top = `${event.clientY - (btnClientRect.top + radius)}px`;
	circle.classList.add("ripple");

	const ripple = button.getElementsByClassName("ripple")[0];

	if (ripple) {
		ripple.remove();
	}

	button.appendChild(circle);
}
