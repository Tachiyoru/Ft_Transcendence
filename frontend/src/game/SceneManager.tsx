import { Canvas, extend, useThree } from "@react-three/fiber";
import { useNavigate, useParams } from "react-router-dom";
import { PerspectiveCamera } from '@react-three/drei';
import { HemisphereLight, ColorRepresentation } from "three";
extend({ HemisphereLight });
import { useContext, useEffect, useState } from "react";
import { Physics } from "@react-three/cannon";
import { WebSocketContext } from "../socket/socket";
import axios from "../axios/api";
import { Game } from "../../../backend/src/game/game.class.ts";
import PaddlePos from "./Paddle.tsx";
import BallObj from "./Ball.tsx";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
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

  const light = new HemisphereLight(
    props.skyColor,
    props.groundColor,
    props.intensity
  );

  scene.add(light);

  useThree(({ clock }) => {
    light.position.x = Math.sin(clock.getElapsedTime()) * 10;
  });

  return null;
};

const Map = async () => {
  const loader = new GLTFLoader();
  const loadedData = await loader.loadAsync("/src/map.glb");
  return loadedData;
};

export default function Experience() {
  const { gameSocket } = useParams();
  const socket = useContext(WebSocketContext);
  const [game, setGame] = useState<Game | null>();
  const [score, setScore] = useState<number[]>([0, 0]);
  const [userData, setUserData] = useState<Users>();
  const [start, setStart] = useState(false);
  const [popinLooser, setTogglePopinLooser] = useState(false);
  const [popinWinner, setTogglePopinWinner] = useState(false);
  const [gameOption1, setGameOption1] = useState(true);
  const [gameOption2, setGameOption2] = useState(false);
  const [gameOptionSelected, setGameOptionSelected] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataResponse = await axios.get("/users/me");
        setUserData(userDataResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    try {
      socket.emit("findGame", { gameSocket: gameSocket });
      socket.on("findGame", (game) => {
        setGame(game);
      });
      socket.on("gamescore", (score) => {
        setScore(score);
      });
      socket.on("finish", (boolean: boolean) => {
        if (boolean) {
          setTogglePopinWinner(true);
        } else {
          setTogglePopinLooser(true);
        }
      });

      socket.on("reconnect", (usersocket) => {
        navigate("/");
      });

      if (!start) {
        socket.emit("launchBall");
        setStart(true);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  }, [socket, gameSocket]);

  const handleGameOption1Change = () => {
    setGameOption1(true);
    setGameOption2(false);
    setGameOptionSelected(1);
  };

  const handleGameOption2Change = () => {
    setGameOption1(false);
    setGameOption2(true);
    setGameOptionSelected(2);
  };

  return (
    <>
      {game && (
        <div className="h-[80vh] p-2">
          <p className="text-center font-kanit font-bold font-outline-1 text-lilac text-3xl">
            {score.join(" : ")}
          </p>
          <Canvas>
            <color attach="background" args={[0x160030]} />
            {gameOptionSelected === 1 &&
              userData &&
              userData.id == game.player1.playerProfile?.id && (
                <PerspectiveCamera
                  makeDefault
                  position={[
                    game.camera[0].x,
                    game.camera[0].y,
                    game.camera[0].z,
                  ]}
                  fov={60}
                  aspect={window.innerWidth / window.innerHeight}
                  near={0.1}
                  far={1000}
                  rotation={[-0.4, 0, 0]}
                />
              )}
            {gameOptionSelected === 1 &&
              userData &&
              userData.id == game.player2.playerProfile?.id && (
                <PerspectiveCamera
                  makeDefault
                  position={[
                    game.camera[1].x,
                    game.camera[1].y,
                    game.camera[1].z,
                  ]}
                  fov={60}
                  aspect={window.innerWidth / window.innerHeight}
                  near={0.1}
                  far={1000}
                  rotation={[0.4, Math.PI, 0]}
                />
              )}
            {gameOptionSelected === 2 &&
              userData &&
              userData.id == game.player1.playerProfile?.id && (
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
            {gameOptionSelected === 2 &&
              userData &&
              userData.id == game.player2.playerProfile?.id && (
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
            <CustomHemisphereLight
              skyColor={0xffffff}
              groundColor={0x003300}
              intensity={1}
            />
            <BallObj />
            <Physics>
              <PaddlePos />
            </Physics>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[120, 2, 170]} />
              <meshLambertMaterial color={0x460994} />
            </mesh>
          </Canvas>
          {popinWinner && game && <Winner game={game} />}
          {popinLooser && game && <Defeat game={game} />}
          <p className="text-center font-kanit font-bold text-lilac">
            Change theme
          </p>
          <div className="block text-center">
            <div className="mt-2">
              <label className="inline-flex items-center space-x-2 text-lilac">
                <label>1</label>
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded-full checkbox checkbox-secondary text-dark-violet bg-transparent border-lilac border-2 focus:ring-transparent focus:ring-opacity-0"
                  checked={gameOption1}
                  onChange={handleGameOption1Change}
                />
                <label>2</label>
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded-full checkbox checkbox-secondary text-dark-violet bg-transparent border-lilac border-2 focus:ring-transparent focus:ring-opacity-0"
                  checked={gameOption2}
                  onChange={handleGameOption2Change}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
}