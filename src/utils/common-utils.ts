export const preventDefault = (e: Event) => e.preventDefault();

export const getTodayTimestamp = () => {
	const currentDate = new Date();
	const startOfDay = new Date(currentDate);
	startOfDay.setHours(0, 0, 0, 0);

	return currentDate.getTime() - startOfDay.getTime();
};
