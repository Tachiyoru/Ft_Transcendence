import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import MainLayout from "../../components/nav/MainLayout"
import { useContext, useEffect } from "react";
import { WebSocketContext } from "../../socket/socket";

const Friends = () => {
	const location = useLocation();
	const currentPage = location.pathname;
	const socket = useContext(WebSocketContext);

	useEffect(() => {
		socket.emit("notInGame");
		socket.emit('updateStatusUser')
	},[]);
	
	return (
		<MainLayout currentPage={currentPage}>
			<Outlet/>
		</MainLayout>
	)
}

export default Friends