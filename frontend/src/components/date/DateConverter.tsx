import React, { useState, useEffect } from 'react';

interface DateConverterProps {
	initialDate: string;
}

const DateConverter: React.FC<DateConverterProps> = ({ initialDate }) => {
	const [convertedDate, setConvertedDate] = useState<string>('');

	useEffect(() => {
	const formatDate = () => {
		const date = new Date(initialDate);
		const jour = date.getDate();
		const mois = date.getMonth() + 1;
		const annee = date.getFullYear();

		const dateConvertie = `${jour}/${mois}/${annee}`;
		setConvertedDate(dateConvertie);
	};

	formatDate();
	}, [initialDate]);

	return (
	<div className="text-xs font-light text-lilac">
		Member since {convertedDate}
	</div>
	);
	};

export default DateConverter;
