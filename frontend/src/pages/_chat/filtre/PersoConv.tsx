import { FaUser } from 'react-icons/fa6'

const PersoConv = () => {
	return (
	<div>
		{/*USER*/}
		<div className="flex flex-row h-12 md:mx-2">
			<div className="w-full h-full md:w-[45px] md:h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center md:mr-4">
				<FaUser className="text-lilac"/>
			</div>
			<div className="pt-3 hidden md:block">
				<p className="text-base text-lilac">Name</p>
				<div className="flex flex-row">
					<p className="text-sm  pt-1 text-lilac text-opacity-60 mr-2">Lorem ipsum dolor…</p>
					<p className="text-sm pt-1 text-lilac text-opacity-60">12:00</p>
				</div>
			</div>
		</div>

	</div>
	)
}

export default PersoConv