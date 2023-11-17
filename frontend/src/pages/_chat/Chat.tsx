import MainLayout from "../../components/nav/MainLayout"
import { useLocation } from 'react-router-dom';

const Chat = () => {
	const location = useLocation();
	const currentPage = location.pathname;

	return (
	<MainLayout currentPage={currentPage}>
	<div className="flex justify-between" style={{ height: '30rem' }}>
		<div className="w-1/4 bg-gray-200 p-6 mr-4">Chat</div>
		<div className="w-1/2 bg-gray-300 p-6 mr-4"></div>
		<div className="w-1/4 bg-gray-200 p-6"></div>
	</div>
	</MainLayout>
	)
}

export default Chat