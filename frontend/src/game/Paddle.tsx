import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { WebSocketContext } from "../socket/socket";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";

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

export default function PaddlePos() {

	const { gameSocket } = useParams();
	const socket = useContext(WebSocketContext);
	const ref = useRef();
	const refPaddle2 = useRef();
	const [paddles, setPaddles] = useState({ paddle1: { x: 0, y: 3.5, z: 87.5 }, paddle2: { x: 0, y: 3.5, z: -87.5 } });
	
	const paddleobj1 = useLoader(GLTFLoader, '/src/paddlePink.glb')
	const paddleobj2 = useLoader(GLTFLoader, '/src/paddleBlue.glb')

	const arrowLeftState = DetectPress("ArrowLeft");
	const arrowRightState = DetectPress("ArrowRight");

	useFrame(() => {
		if (arrowLeftState)
			socket.emit("movesInputs", { gameSocket: gameSocket, move: "ArrowLeft", upDown: arrowLeftState });
		if (arrowRightState)
			socket.emit("movesInputs", { gameSocket: gameSocket, move: "ArrowRight", upDown: arrowRightState });
	});
	
	
	useEffect(() => {
		socket.on("findpos", findPosHandler => {
			if (ref.current && ref.current.position) {
				ref.current.position.x = findPosHandler[0].x;
				ref.current.position.y = findPosHandler[0].y;
				ref.current.position.z = findPosHandler[0].z;
			}

			if (refPaddle2.current && refPaddle2.current.position){
				refPaddle2.current.position.x = findPosHandler[1].x;
				refPaddle2.current.position.y = findPosHandler[1].y;
				refPaddle2.current.position.z = findPosHandler[1].z;
			}
		});
			
		}, [socket]);

		return(
		<>
		{/* {/* <mesh ref={ref} position={[paddles.paddle1.x, paddles.paddle1.y, paddles.paddle1.z]}>
			<boxGeometry args={[50, 5, 5]} />
			<meshStandardMaterial color='red' />
		</mesh> */}
		{/* <mesh ref={refPaddle2} position={[paddles.paddle2.x, paddles.paddle2.y, paddles.paddle2.z]}>
			<boxGeometry args={[30, 5, 5]} />
			<meshStandardMaterial color='green' />
		</mesh> */}
		<primitive
			ref={ref}
			object={paddleobj1.scene}
			position={[paddles.paddle1.x, paddles.paddle1.y, paddles.paddle1.z]}
			rotation={[0, Math.PI / 2 ,0]}
			scale={3}
        />
		<primitive
			ref={refPaddle2}
			object={paddleobj2.scene}
			position={[paddles.paddle2.x, paddles.paddle2.y, paddles.paddle2.z]}
			rotation={[0, Math.PI / 2 ,0]}
			scale={3}
        />
		</>
	)
}
