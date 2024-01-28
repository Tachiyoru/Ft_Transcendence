import { Canvas, extend, useFrame, useLoader, useThree } from "@react-three/fiber";
import MainLayout from "../components/nav/MainLayout";
import { useLocation } from "react-router-dom";
import { PerspectiveCamera } from '@react-three/drei';
import { HemisphereLight, ColorRepresentation, BoxGeometry } from "three";
extend({ HemisphereLight });
import { useEffect, useRef, useState } from "react";
import { Physics, useBox } from "@react-three/cannon";
import axios from "../axios/api";

interface CustomHemisphereLightProps {
	skyColor?: ColorRepresentation;
	groundColor?: ColorRepresentation;
	intensity?: number;
}
interface SceneManagerState {
	player1?: string;
	player2?: string;
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

function Ball() {
	return (
		<mesh position={[0, -15, -100]}>
			<sphereGeometry args={[2, 10, 10]} />
			<meshStandardMaterial color={'white'}/>
		</mesh>
	);
}


	function Paddle() {
		const [left, setLeft] = useState<number>(0);

		const handleKeyDown = (event: React.KeyboardEvent) => {
		const keyCode = event.code;

		switch (keyCode) {
			case 'ArrowLeft':
				setLeft((prevLeft: number) => prevLeft - 5);
				console.log('left')
			break;
			case 'ArrowRight':
				setLeft((prevLeft: number) => prevLeft + 5);
				console.log('right')
			break;
			default:
			break;
		}
		};
		const handleKeyUp = () => {
			console.log('release');
		};
	
		// Add keyboard event listeners
		useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => handleKeyDown(event);
		const onKeyUp = () => handleKeyUp();
	
		document.addEventListener('keydown', onKeyDown);
		document.addEventListener('keyup', onKeyUp);
	
		return () => {
			document.removeEventListener('keydown', onKeyDown);
			document.removeEventListener('keyup', onKeyUp);
		};
		}, []); 
	
		return (
		<>
			<mesh position={[0, -18, -260]}>
				<boxGeometry args={[50, 5, 5]} />
				<meshStandardMaterial color={'red'}/>
			</mesh>
			<mesh position={[0, -18, -60]}>
				<boxGeometry args={[50, 5, 5]} />
				<meshStandardMaterial color={'green'} />
			</mesh>
		</>
		);
	}

export default function Experience() {
	const location = useLocation();
	const currentPage = location.pathname;
	const { player1, player2 } = location.state as SceneManagerState;

	return (
		<MainLayout currentPage={currentPage}>
			<div className="h-[80vh]">
				<p>Player 1: {player1}</p>
				<p>Player 2: {player2}</p>
				<Canvas>
					<color attach="background" args={[0x160030]} />
					<PerspectiveCamera 
						makeDefault
						position={[0, 0, 20]}
						fov={60}
						aspect={window.innerWidth / window.innerHeight}
						near={0.1}
						far={1000}
					/>
					<ambientLight intensity={0.5} />
					<CustomHemisphereLight skyColor={0xFFFFFF} groundColor={0x003300} intensity={1} />
					<Ball/>
					<Physics>
						<Paddle userData={player1}/>
					</Physics>
					<mesh position={[0, -20, -146]}>
						<boxGeometry args={[120, 2, 170]} />
						<meshLambertMaterial color={0x460994} />
					</mesh>
				</Canvas>
			</div>
		</MainLayout>
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