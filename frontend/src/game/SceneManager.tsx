import { Canvas, extend, useThree } from "@react-three/fiber";
import MainLayout from "../components/nav/MainLayout";
import { useLocation, useParams } from "react-router-dom";
import { PerspectiveCamera } from '@react-three/drei';
import { HemisphereLight, ColorRepresentation } from "three";
extend({ HemisphereLight });
import { useContext, useEffect, useState } from "react";
import { Physics} from "@react-three/cannon";
import { WebSocketContext } from "../socket/socket";
import axios from "../axios/api";
import { Game } from "../../../backend/src/game/game.class.ts"
import PaddlePos from "./Paddle.tsx";
import BallObj from "./Ball.tsx";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Winner from "../components/popin/Victory.tsx";
import Defeat from "../components/popin/Defeat.tsx";

interface CustomHemisphereLightProps {
	skyColor?: ColorRepresentation;
	groundColor?: ColorRepresentation;
	intensity?: number;
}

interface Users {
	username: string;
	avatar: string;
	id: number;
	status: string;
}


const CustomHemisphereLight: React.FC<CustomHemisphereLightProps> = (props) => {
	const { gl, scene } = useThree();

		const light = new HemisphereLight(props.skyColor, props.groundColor, props.intensity);
	
		scene.add(light);
	
		useThree(({ clock }) => {
		light.position.x = Math.sin(clock.getElapsedTime()) * 10;
		});
	
		return null;
	}

const Map = async () => {
	const loader = new GLTFLoader();
	const loadedData = await loader.loadAsync('/src/map.glb');
	return (loadedData);   
}


export default function Experience() {	
	const { gameSocket } = useParams();
	const socket = useContext(WebSocketContext);
	const [game, setGame] = useState<Game | null>();
	const [score, setScore] = useState<number[]>([0,0]);
	const [userData, setUserData] = useState<Users>();
	const [start, setStart] = useState(false);
	const [popinLooser, setTogglePopinLooser] = useState(false);
	const [popinWinner, setTogglePopinWinner] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
		try {
			const userDataResponse = await axios.get('/users/me');
			setUserData(userDataResponse.data);
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
		};
		fetchData();
	}, []);

	useEffect(() => {
		try {
			socket.emit("findGame", {gameSocket: gameSocket})
			socket.on("findGame", (game) => {
				console.log(game)
				setGame(game);
			});
			socket.on("gamescore", (score) => {
				setScore(score);
			});
			
			socket.on('finish', (boolean: boolean) => {
				if (boolean) {
					setTogglePopinWinner(true);
				} else {
					setTogglePopinLooser(true);
				}
			});

			if (!start)
			{
				socket.emit('launchBall');
				setStart(true);
			}

		} catch (error) {
			console.error('Erreur lors de la récupération des données:', error);
		}
	}, [socket, gameSocket]);

	return (
		<>
			{game && 
			<div className="h-[80vh] p-2">
				<p className="text-center font-kanit font-bold font-outline-1 text-lilac text-3xl">{score.join(' : ')}</p>
				<Canvas>
					<color attach="background" args={[0x160030]} />
					{game.mode === 1 && (
					userData && userData.id == game.player1.playerProfile?.id && (
					<PerspectiveCamera 
						makeDefault
						position={[game.camera[0].x, game.camera[0].y, game.camera[0].z]}
						fov={60}
						aspect={window.innerWidth / window.innerHeight}
						near={0.1}
						far={1000}
						rotation = {[-0.4, 0, 0]}
					/>))}
					{game.mode === 1 && (
					userData && userData.id == game.player2.playerProfile?.id && (
					<PerspectiveCamera 
						makeDefault
						position={[game.camera[1].x, game.camera[1].y, game.camera[1].z]}
						fov={60}
						aspect={window.innerWidth / window.innerHeight}
						near={0.1}
						far={1000}
						rotation={[0.4, Math.PI, 0]}
						/>
					))}
					{game.mode === 2 && (
					<PerspectiveCamera 
						makeDefault
						position={[0, 200, 0]}
						fov={60}
						aspect={window.innerWidth / window.innerHeight}
						near={0.1}
						far={1000}
						rotation={[-1.57, 0, 0]}
					/>
					)}

					<ambientLight intensity={0.5} />
					<CustomHemisphereLight skyColor={0xFFFFFF} groundColor={0x003300} intensity={1} />
					<BallObj/>
					<Physics>
					<PaddlePos/>
					</Physics>
					<mesh position={[0, 0, 0]}>
						<boxGeometry args={[120, 2, 170]} />
						<meshLambertMaterial color={0x460994} />
					</mesh>
				</Canvas>
				{popinWinner && game && <Winner game={game}/>}
				{popinLooser && game && <Defeat game={game}/>}
			</div>
			}
		</>
	);
}

// (function (window, document, THREE)	{
// 	var container = document.getElementById('gameCanvas'),
// 	WIDTH = container.offsetWidth,
// 	HEIGHT = container.offsetHeight,
// 	VIEW_ANGLE = 45,
// 	ASPECT = WIDTH / HEIGHT,
// 	NEAR = 0.1,
// 	FAR = 10000,
// 	FIELD_WIDTH = 1200,
// 	FIELD_LENGHT = 3000,
// 	BALL_RADIUS = 20,
// 	PADDLE_WIDTH = 200,
// 	PADDLE_HEIGHT = 30,
// 	multiplier = 1,
// 	render, camera, mainLight,
// 	scene, ball, paddle1, paddle2, field, running,
// 	score = {player1 : 0, player2 : 0};

// 	console.log(WIDTH);
// 	console.log(HEIGHT);

// 	function startRender()	{
// 		running = true;
// 		render();
// 	}

// 	// Test CPU
// 	function processCpuPaddle() {
// 		var ballPos = ball.position,
// 			cpuPos = paddle2.position;
		
// 		if(cpuPos.x - 100 > ballPos.x) {
// 			cpuPos.x -= Math.min(cpuPos.x - ballPos.x, 6);
// 		}else if(cpuPos.x - 100 < ballPos.x) {
// 			cpuPos.x += Math.min(ballPos.x - cpuPos.x, 6);
// 		}
// 	}

// 	function render()	{
// 		if (running)	{
// 			requestAnimationFrame(render);

// 			ballProcessMovement();
// 			paddleProcessMove();
// 			processCpuPaddle();

// 			renderer.render(scene, camera);
// 		}
// 	}

// 	function startBallMovement()	{
// 		var direction = Math.random() > 0.5 ? -1 : 1;
// 		ball.$velocity = {
// 			x : 0,
// 			z : direction * 20
// 		};
// 		ball.$stopped = false;
// 	}

// 	function ballProcessMovement()	{
// 		if (!ball.$velocity)	{
// 			startBallMovement();
// 		}

// 		if (ball.$stopped)	{
// 			return;
// 		}

// 		updateBallPosition();

// 		if (sideColl())	{
// 			ball.$velocityx *= -1;
// 		}

// 		if (isPaddle1Coll())	{
// 			hitBallBack(paddle1);
// 		}

// 		if (isPaddle2Coll())	{
// 			hitBallBack(paddle2);
// 		}

// 		if (isPastPaddle1())	{
// 			scored('player2');
// 		}

// 		if (isPastPaddle2())	{
// 			scored('player1');
// 		}

// 		console.log(paddle1.position.x);
// 	}

// 	function paddleProcessMove()	{
// 		document.onkeydown = function(e)	{
// 			console.log(e);
// 			switch (e.code)	{
// 				case "ArrowLeft":
// 					camera.position.x = paddle1.position.x -= 5 * multiplier;
// 					multiplier++;
// 					break;
// 				case "ArrowRight":
// 					camera.position.x = paddle1.position.x += 5 * multiplier;
// 					multiplier++;
// 					break;
// 			}
// 		}
// 		document.onkeyup = function(e)	{
// 			console.log(e);
// 			switch (e.code)	{
// 				case "ArrowLeft":
// 					multiplier = 1;
// 					break;
// 				case "ArrowRight":
// 					multiplier = 1;
// 					break;
// 			}
// 		}
// 	}

// 	function isPastPaddle1()	{
// 		return ball.position.z > paddle1.position.z + 100;
// 	}

// 	function isPastPaddle2()	{
// 		return ball.position.z < paddle2.position.z - 100;
// 	}

// 	function updateBallPosition()	{
// 		var ballPos = ball.position;

// 		ballPos.x += ball.$velocity.x;
// 		ballPos.z += ball.$velocity.z;
// 	}

// 	function sideColl()	{
// 		var ballX = ball.position.x,
// 			halfFieldW = FIELD_WIDTH / 2;
// 		return ballX - BALL_RADIUS < -halfFieldW || ballX + BALL_RADIUS > halfFieldW;
// 	}

// 	function hitBallBack()	{
// 		ball.$velocity.x = (ball.position.x - paddle.position.x) / 5;
// 		ball.$velocity.z *= -1;
// 	}

// 	function isPaddle2Coll()	{
// 		return ball.position.z - BALL_RADIUS <= paddle2.position.z && isBallAligned(paddle2);
// 	}

// 	function isPaddle1Coll()	{
// 		return ball.position.z + BALL_RADIUS >= paddle1.position.z && isBallAligned(paddle1);
// 	}

// 	function isBallAligned(paddle)	{
// 		var halfPaddleW = PADDLE_WIDTH / 2,
// 			paddleX = paddle.position.x,
// 			ballX = ball.position.x;
// 		return ballX > paddleX - halfPaddleW && ballX < paddleX + halfPaddleW;
// 	}

// 	function scored(playerName)	{
// 		addPoint(playerName);
// 		stopBall();
// 		setTimeout(reset, 2000);
// 	}

// 	function stopBall()	{
// 		ball.$stopped = true;
// 	}

// 	function addPoint(playerName)	{
// 		score[playerName]++;
// 		console.log(score);
// 	}

// 	function reset()	{
// 		ball.position.set(0, 0, 0);
// 		ball.$velocity = null;
// 	}

// 	function init()	{
// 		// container = document.getElementById('gameCanvas');

// 		renderer = new THREE.WebGLRenderer();
// 		console.log(renderer);
// 		renderer.setSize(WIDTH, HEIGHT);
// 		renderer.setClearColor(0x9999BB, 1);
// 		container.appendChild(renderer.domElement);

// 		camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
// 		camera.position.set(0, 100, FIELD_LENGHT / 2 + 500);

// 		scene = new THREE.Scene();

// 		scene.add(camera);

// 		var fieldGeometry = new THREE.CubeGeometry(FIELD_WIDTH, 5, FIELD_LENGHT, 1, 1, 1),
// 			fieldMaterial = new THREE.MeshLambertMaterial({color : 0x003300});
// 			field = new THREE.Mesh(fieldGeometry, fieldMaterial);
// 		field.position.set(0, -50, 0);

// 		scene.add(field);
// 		paddle1 = addPaddle();
// 		paddle1.position.z = FIELD_LENGHT / 2;
// 		paddle2 = addPaddle();
// 		paddle2.position.z = -FIELD_LENGHT / 2;

// 		var ballGeometry = new THREE.SphereGeometry(BALL_RADIUS, 16, 16),
// 			ballMaterial = new THREE.MeshLambertMaterial({color : 0xCC0000});
// 			ball = new THREE.Mesh(ballGeometry, ballMaterial);
// 		scene.add(ball);

// 		camera.lookAt(ball.position);

// 		mainLight = new THREE.HemisphereLight(0xFFFFFF, 0x003300);
// 		scene.add(mainLight);
		
// 		camera.lookAt(ball.position);

// 		startRender();
// 	}

// 	function addPaddle()	{
// 		var paddleGeometry = new THREE.CubeGeometry(PADDLE_WIDTH, PADDLE_HEIGHT, 10, 1, 1, 1),
// 			paddleMaterial = new THREE.MeshLambertMaterial({color : 0xCCCCCC});
// 			paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
// 		scene.add(paddle);
// 		return paddle;
// 	}

// 	function setupKeyLogger() {
// 		document.onkeydown = function(e) {
// 			console.log(e);
// 		}
// 	}

// 	init();
// })(window, window.document, window.THREE);