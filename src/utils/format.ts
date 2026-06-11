const dateFormatter = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
});

export const formatDate = (date: Date): string => dateFormatter.format(date);
