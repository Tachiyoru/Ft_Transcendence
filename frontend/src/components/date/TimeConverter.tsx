import React from 'react';

interface DateConverterProps {
	initialDate: string;
}

const TimeConverter: React.FC<DateConverterProps> = ({ initialDate }) => {
	
	const timestamp = new Date(initialDate);
	const heure = timestamp.getHours();
	const minutes = timestamp.getMinutes().toString().padStart(2, '0');

	return (
	<div>
		<p className="text-sm pt-1 text-lilac text-opacity-60">{heure}:{minutes}</p>
	</div>
);
}

export default TimeConverter