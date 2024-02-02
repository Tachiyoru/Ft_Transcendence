import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { WebSocketContext } from "../socket/socket";
import { useFrame } from "@react-three/fiber";
import { Game } from "../../../backend/src/game/game.class";

function DetectPress(key: string) {
	const [isDown, setIsDown] = useState<boolean>(false);
	const keys = Array.isArray(key) ? key : [key];

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (!isDown && keys.includes(event.key)) {
				setIsDown(true);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[...keys, isDown]
	);
	const handleKeyUp = useCallback(
		(event: KeyboardEvent) => {
			if (isDown && keys.includes(event.key)) {
				setIsDown(false);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[...keys, isDown]
	);
	
	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [handleKeyDown, handleKeyUp]);

	return (isDown);
}

export default function Paddle({game}: Game) {

	const { gameSocket } = useParams();
	const socket = useContext(WebSocketContext);

	const arrowLeftState = DetectPress("ArrowLeft");
	const arrowRightState = DetectPress("ArrowRight");
	
	if (arrowLeftState)
		socket.emit("movesInputs", {gameSocket: gameSocket, move: "ArrowLeft", upDown: arrowLeftState});
	if (arrowRightState)
		socket.emit("movesInputs", {gameSocket: gameSocket, move: "ArrowRight", upDown: arrowRightState});
	
	return(
		<>
		<mesh position={[game.paddle[0].x, game.paddle[0].y, game.paddle[0].z]}>
			<boxGeometry args={[50, 5, 5]} />
			<meshStandardMaterial color='red' />
		</mesh>
		<mesh position={[game.paddle[1].x, game.paddle[1].y, game.paddle[1].z]}>
			<boxGeometry args={[50, 5, 5]} />
			<meshStandardMaterial color='green' />
		</mesh>
		</>
	)
}
