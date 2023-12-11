import { FaUser } from "react-icons/fa6";

const SidebarRight = () => {
	return (
	<div className="w-[26~0px] md:rounded-r-lg bg-violet-black p-4 text-gray-300 text-xs hidden lg:block">
		{/*TEST USER FRIEND*/}
		<div className="flex flex-col items-center relative px-6">
			<div className="w-[80px] h-[80px] mt-2 bg-purple rounded-full grid justify-items-center items-center">
				<FaUser className="w-[30px] h-[30px] text-lilac"/>
			</div>
			<p className="text-sm text-lilac pt-2">Name</p>
		</div>
	</div>
	);
};

export default SidebarRight;
