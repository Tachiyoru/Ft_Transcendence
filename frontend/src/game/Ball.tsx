import { useContext, useEffect, useRef, useState } from "react";
import { WebSocketContext } from "../socket/socket";


const BallObj = () => {
	const [ball, setBall] = useState({ x: 0, y: -17, z: -146 });
	const socket = useContext(WebSocketContext);
	const ref = useRef();

	useEffect(() => {
		socket.on("findposball", findBallPos => {
			if (ref.current && ref.current.position) {
				ref.current.position.x = findBallPos.x;
				ref.current.position.y = findBallPos.y;
				ref.current.position.z = findBallPos.z;
			}
		})
			
	}, [socket]);

	
	return (
	<mesh ref={ref} position={[ball.x, ball.y, ball.z]}>
		<sphereGeometry args={[2, 10, 10]} />
		<meshStandardMaterial color={'white'}/>
	</mesh>
	)
}

export default BallObj