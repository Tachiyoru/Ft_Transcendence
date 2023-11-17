import { useLocation } from "react-router-dom";
import MainLayout from "../../components/nav/MainLayout"

const Game = () => {
	const location = useLocation();
	const currentPage = location.pathname;

	return (
	<MainLayout currentPage={currentPage}>
		<div>Game</div>
	</MainLayout>
	)
}

export default Game