import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { useKeyPress } from './use-key-press';

function SnakeBody(props: ThreeElements['mesh']) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // useFrame((state, delta) => (mesh.current.rotation.y += delta));
  return (
    <mesh
      {...props}
      ref={mesh}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

let nextId = 0;
type Direction = 'WEST' | 'SOUTH' | 'EAST' | 'NORTH';
type Vector3D = [number, number, number];
type SnakeBodyElement = {
  id: string;
  position: Vector3D;
};
type State = {
  direction: Vector3D;
  bodyElements: SnakeBodyElement[];
};

const directions: Record<Direction, Vector3D> = {
  WEST: [1, 0, 0],
  SOUTH: [0, -1, 0],
  EAST: [-1, 0, 0],
  NORTH: [0, 1, 0],
};

const addVector3DToVector3D = (
  [a, b, c]: Vector3D,
  [x, y, z]: Vector3D
): Vector3D => {
  return [a + x, b + y, c + z];
};

function App() {
  const [state, setState] = useState<State>({
    direction: directions.WEST,
    bodyElements: [
      { id: `${nextId++}`, position: [0, 0, 0] },
      { id: `${nextId++}`, position: [1, 0, 0] },
      { id: `${nextId++}`, position: [2, 0, 0] },
      { id: `${nextId++}`, position: [3, 0, 0] },
      { id: `${nextId++}`, position: [4, 0, 0] },
      { id: `${nextId++}`, position: [5, 0, 0] },
    ],
  });

  useEffect(() => {
    let timer: number;
    const timeoutFunc = () => {
      setState((prevState) => {
        const head = prevState.bodyElements[prevState.bodyElements.length - 1];
        const [tail, ...rest] = prevState.bodyElements;

        return {
          ...prevState,
          bodyElements: [
            ...rest,
            {
              id: tail.id,
              position: addVector3DToVector3D(
                head.position,
                prevState.direction
              ),
            },
          ],
        };
      });
      timer = setTimeout(timeoutFunc, 300);
    };
    timer = setTimeout(timeoutFunc, 300);
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  useKeyPress(
    () =>
      setState((prevState) => ({ ...prevState, direction: directions.WEST })),
    ['KeyD']
  );
  useKeyPress(
    () =>
      setState((prevState) => ({ ...prevState, direction: directions.SOUTH })),
    ['KeyS']
  );
  useKeyPress(
    () =>
      setState((prevState) => ({ ...prevState, direction: directions.EAST })),
    ['KeyA']
  );
  useKeyPress(
    () =>
      setState((prevState) => ({ ...prevState, direction: directions.NORTH })),
    ['KeyW']
  );

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {state.bodyElements.map((el) => (
        <SnakeBody
          key={el.id}
          position={el.position.map((p) => p * 0.2) as Vector3D}
          scale={[0.17, 0.17, 0.17]}
        />
      ))}
    </Canvas>
  );
}

export default App;
