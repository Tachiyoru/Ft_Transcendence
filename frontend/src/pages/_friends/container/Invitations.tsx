import { FaUser } from "react-icons/fa6"
import { FaCheck, FaXmark } from "react-icons/fa6";

const Invitations = () => {
  return (
	<div className="mt-10 m-4 gap-4 flex flex-wrap">
		{/*TEST USER PENDING*/}
		<div className="flex flex-col items-center px-6">
			<div className="w-[80px] h-[80px] mt-2 bg-purple rounded-full grid justify-items-center items-center">
				<FaUser className="w-[30px] h-[30px] text-lilac"/>
			</div>
			<p className="text-sm text-lilac pt-2">Name</p>
			<div className="flex flex-row justify-between space-x-5">
				<div className="w-[26px] h-[26px] mt-1 bg-dark-violet rounded-full grid justify-items-center items-center">
					<FaCheck className="w-[10px] h-[10px] text-acid-green"/>
				</div>
				<div className="w-[26px] h-[26px] mt-1 bg-dark-violet rounded-full grid justify-items-center items-center">
					<FaXmark className="w-[10px] h-[10px] text-red-orange"/>
				</div>
			</div>
		</div>
	</div>
  )
}

export default Invitations