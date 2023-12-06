import { FaUser } from "react-icons/fa6"

const Blocked = () => {
  return (
	<div className="mt-10 m-4 gap-4 flex flex-wrap">
		{/*TEST USER PENDING*/}
		<div className="flex flex-col items-center px-6">
			<div className="w-[80px] h-[80px] mt-2 bg-fushia rounded-full grid justify-items-center items-center">
				<FaUser className="w-[30px] h-[30px] "/>
			</div>
			<p className="text-sm text-fushia bg-opacity-40 pt-2">Name</p>
			<p className="text-xs text-lilac pt-2 underline">Unblock Friend</p>
		</div>
	</div>
  )
}

export default Blocked