import React, { useState, useEffect } from 'react';

interface DateConverterProps {
	initialDate: string;
}

const TimeConverter: React.FC<DateConverterProps> = ({ initialDate }) => {
	
	const timestamp = new Date(initialDate);
	const heure = timestamp.getHours();
	const minutes = timestamp.getMinutes();

	return (
	<div>
		<p className="text-sm pt-1 text-lilac text-opacity-60">{heure}:{minutes}</p>
	</div>
);
}

export default TimeConverter