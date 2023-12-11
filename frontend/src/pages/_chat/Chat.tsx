import MainLayout from "../../components/nav/MainLayout"
import { useLocation } from 'react-router-dom';
import { ChangeEvent, useState } from "react";
import SidebarLeft from "./container/SidebaLeft";
import ContentConv from "./container/ContentConv";
import SidebarRight from "./container/SidebarRight";

const Chat = () => {
	const location = useLocation();
	const currentPage = location.pathname;
	const [isTyping, setIsTyping] = useState(false);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
			const inputValue = e.target.value;
			setIsTyping(inputValue !== '');
	};

	return (
	<MainLayout currentPage={currentPage}>
		<div className="flex flex-row h-[80vh]">
		
			{/*LEFT SIDE BAR*/}
			<SidebarLeft
				handleInputChange={handleInputChange}
				isTyping={isTyping}
			/>

			{/*MIDDLE*/}
			<ContentConv/>

			{/*RIGHT SIDE BAR*/}
			<SidebarRight/>

		</div>
	</MainLayout>
	)
}

export default Chat