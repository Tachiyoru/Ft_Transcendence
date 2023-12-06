import { FaUser } from "react-icons/fa6"
import { SlOptions } from "react-icons/sl";

const AllFriends = () => {
  return (
	<div className="mt-10 m-4 gap-4 flex flex-wrap">
		{/*TEST USER PENDING*/}
		<div className="flex flex-col items-center px-6">
			<div className="w-[80px] h-[80px] mt-2 bg-purple rounded-full grid justify-items-center items-center">
				<FaUser className="w-[30px] h-[30px] text-lilac"/>
			</div>
			<p className="text-sm text-lilac pt-2">Name</p>
			<p className="text-xs text-lilac opacity-40 italic pt-1">Pending...</p>
		</div>

		{/*TEST USER FRIEND*/}
		<div className="flex flex-col items-center relative px-6">
			<SlOptions className="transform rotate-90 absolute right-0 text-lilac"/>
			<div className="w-[80px] h-[80px] mt-2 bg-purple rounded-full grid justify-items-center items-center">
				<FaUser className="w-[30px] h-[30px] text-lilac"/>
			</div>
			<p className="text-sm text-lilac pt-2">Name</p>
		</div>

		{/*TEST USER FRIEND*/}
		<div className="flex flex-col items-center relative px-6">
			<SlOptions className="transform rotate-90 absolute right-0 text-lilac"/>
			<div className="w-[80px] h-[80px] mt-2 bg-purple rounded-full grid justify-items-center items-center">
				<FaUser className="w-[30px] h-[30px] text-lilac"/>
			</div>
			<p className="text-sm text-lilac pt-2">Name</p>
		</div>

		{/*TEST USER FRIEND*/}
		<div className="flex flex-col items-center relative px-6">
			<SlOptions className="transform rotate-90 absolute right-0 text-lilac"/>
			<div className="w-[80px] h-[80px] mt-2 bg-purple rounded-full grid justify-items-center items-center">
				<FaUser className="w-[30px] h-[30px] text-lilac"/>
			</div>
			<p className="text-sm text-lilac pt-2">Name</p>
		</div>
		

	</div>
  )
}

export default AllFriends