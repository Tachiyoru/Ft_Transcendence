const Animation = () => {
	return (
	<div className="w-full relative lg:w-40">
		<div className="bg-purple lg:w-40 h-40 rounded-lg my-5 bg-opacity-80">
			<div className="shadow-inner-custom px-4 h-40 rounded-lg">
			<div className="line-container">
				<div className="colorful-line" style={{ "--i": 4 }}></div>
				<div className="colorful-line" style={{ "--i": 8 }}></div>
				<div className="colorful-line" style={{ "--i": 1 }}></div>
				<div className="colorful-line" style={{ "--i": 3 }}></div>
				<div className="colorful-line" style={{ "--i": 7 }}></div>
				<div className="colorful-line" style={{ "--i": 2 }}></div>
				<div className="colorful-line" style={{ "--i": 5 }}></div>
				<div className="colorful-line" style={{ "--i": 6 }}></div>
			</div>
			</div>
		</div>
	</div>
	);
};

export default Animation;
