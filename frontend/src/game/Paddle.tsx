import React, { useRef, forwardRef, useImperativeHandle } from 'react';

function Paddle(props, ref) {
	const mesh = useRef()

	useImperativeHandle(ref, () => ({
		getPosition() {
		return mesh.current.position;
		},
		setYPosition(y) {
		mesh.current.position.y = y;
		}
	}));

	return (
		<mesh
		{...props}
		ref={mesh}
		scale={[props.size.width, props.size.height, props.size.depth]}>
		<boxBufferGeometry args={[1, 1, 1]} />
		<meshToonMaterial color={'#5CFF8A'} />
		</mesh>
	)
}

export default forwardRef(Paddle);