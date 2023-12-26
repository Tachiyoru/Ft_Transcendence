import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaPaperPlane, FaUserGroup } from "react-icons/fa6";
import ChannelOptions from "../../../components/popin/ChannelOptions";
import SidebarRightMobile from "./SidebarRightMobile";

const ContentConv2 = () => {
	const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

	const toggleRightSidebar = () => {
		setIsRightSidebarOpen(!isRightSidebarOpen);
	};

	return (
	<div className="flex-1 flex flex-col justify-between bg-dark-violet text-gray-300 text-xs relative p-8">
		{/*NAME*/}
		<div>
			<div className="flex flex-row justify-between">
				<h3 className="text-base text-lilac">Name</h3>
				<div className="flex-end flex">
					<ChannelOptions/>
					<button className="lg:hidden" onClick={toggleRightSidebar}>
						<FaUserGroup className="w-4 h-4 text-lilac"/>
					</button>
				</div>
			</div>
			{/*CONTENT*/}
			<div className="flex flex-row h-12 mt-6">
				<div className="w-[45px] h-[45px] mt-2 bg-purple rounded-full grid justify-items-center items-center mr-4">
					<FaUser className="text-lilac"/>
				</div>
				<div className="pt-3">
					<p className="text-base text-lilac">Name</p>
					<div className="flex flex-row">
						<p className="text-sm  pt-1 text-lilac text-opacity-60 mr-2">Lorem ipsum dolor…</p>
						<p className="text-sm pt-1 text-lilac text-opacity-60">12:00</p>
					</div>
				</div>
			</div>
		</div>

		{/*SEND*/}
		<div>
			<div className="flex items-center relative">
				<input className="py-2 bg-lilac w-full rounded-md"/>
				<span className="absolute right-4">
					<FaPaperPlane className="w-3 h-3 text-violet-dark"/>
				</span>
			</div>
		</div>

		<SidebarRightMobile isRightSidebarOpen={isRightSidebarOpen} toggleRightSidebar={toggleRightSidebar} />
	</div>
	)
}

export default ContentConv2