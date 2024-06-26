import { useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  RenderTexture,
  OrbitControls,
  PerspectiveCamera,
  Text,
  ContactShadows,
  useTexture,
} from "@react-three/drei";
import { suspend } from "suspend-react";
import { TextureLoader } from "three/src/loaders/TextureLoader";

const inter = import("../fonts/Prompt-Black.ttf");

import "./App.css";

function Box(props) {
  const colorMap = useLoader(TextureLoader, "./fluke.jpg");

  const cmap = useTexture({
    map: "fluke.jpg",
    // displacementMap: "fluke.jpg",
    // normalMap: "fluke.jpg",
    // roughnessMap: "fluke.jpg",
    aoMap: "fluke.jpg",
  });

  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef();
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += delta));
  // Return the view, these are regular Threejs elements expressed in JSX

  const textRef = useRef();

  console.log(props);
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 2.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        // color={hovered ? "hotpink" : "orange"}
        {...cmap}
      >
        <RenderTexture attach="map" anisotropy={16}>
          <PerspectiveCamera
            makeDefault
            manual
            aspect={1 / 1}
            position={[0, 0, 5]}
          />
          <color attach="background" args={["white"]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 5, 5]} />
          <Text
            font={suspend(inter).default}
            ref={textRef}
            fontSize={0.5}
            color="#555"
          >
            {props.text || ""}
          </Text>
        </RenderTexture>
      </meshStandardMaterial>
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box position={[-1.5, 0, 0]} text={"Motion"} />
      <Box position={[1.5, 0, 0]} text={"Study"} />
      <OrbitControls />
    </Canvas>
  );
}
