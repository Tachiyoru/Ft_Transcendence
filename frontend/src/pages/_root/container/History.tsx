
const History = () => {
	return (
	<div className="flex mx-2 flex-row gap-4 md:gap-6">
		<div className="w-full relative">
			<p><span className="text-2xl pl-4 font-audiowide absolute text-lilac">Matches history</span></p>
			<div className="bg-violet-black text-normal h-80 rounded-md m-2 mt-5 mb-2 px-4 py-2 pt-4">

				<div className="flex flex-col justify-content mt-4">
				{/*MATCH RESUME*/}
					<div className="w-full overflow-x-auto">
					<p className="text-dark-violet mb-2">today</p>
					<table className="w-full">
						<tbody className="text-xs px-2">
						<tr className="text-lilac">
							<td>5-1</td>
							<td>Thonthon</td>
							<td>Victory</td>
							<td>6 bonus</td>
						</tr>
						</tbody>
					</table>
					</div>
				</div>

			</div>
		</div>
	</div>
	)
}

export default History