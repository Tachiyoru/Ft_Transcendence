import React, { useRef } from 'react';

interface HighlightMiddleProps {
	children: React.ReactNode;
}

const HighlightMiddle: React.FC<HighlightMiddleProps> = ({ children }) => {
	const containerRef = useRef<HTMLDivElement>(null);

	const highlightMiddle = () => {
		if (containerRef.current) {
		const options = containerRef.current.childNodes;

		const middleIndex = Math.floor(options.length / 2);

		options.forEach((option: Node, index: number) => {
			const distanceToMiddle = Math.abs(index - middleIndex);
			const paddingValue = middleIndex - distanceToMiddle > 0 ? (middleIndex - distanceToMiddle) * 5 : 0;

			if (option instanceof HTMLElement) {
			option.style.paddingLeft = `${paddingValue}px`;

			if (index === middleIndex) {
				option.classList.add('highlight');
			} else {
				option.classList.remove('highlight');
			}
			}
		});
		}
	};

	return (
		<div ref={containerRef} onMouseOver={highlightMiddle}>
		{children}
		</div>
	);
};

export default HighlightMiddle;
