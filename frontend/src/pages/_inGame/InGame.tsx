import { useLocation } from "react-router-dom";
import MainLayout from "../../components/nav/MainLayout"
import { useContext, useEffect } from "react";
import { Websocket } from "../../components/Websocket";
import { WebSocketContext } from "../../socket/socket";


const InGame = () => {
    const location = useLocation();
	const currentPage = location.pathname;
	const socket = useContext(WebSocketContext);
	const connectServ = () =>	{
		socket.emit("saucisse");
		// console.log(socket.id);
	}
	useEffect(() => {
		const script = document.createElement('script');
		
		script.src = "src/game/SceneManager.js";
		script.async = true;
		
		document.body.appendChild(script);
		
		return () => {
			document.body.removeChild(script);
		}
		}, []);
		return (
			<MainLayout currentPage={currentPage}>
				<div className="h-full w-full">
					<div id="gameCanvas" className="h-full w-full"></div>
					{/* Bouton pour appeler connectServ */}
					<button onClick={connectServ}>Se connecter au serveur</button>
				</div>
			</MainLayout>
		);
}

export default InGame