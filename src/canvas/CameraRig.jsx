import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useSnapshot } from "valtio";

import state from "../store";

const CameraRig = ({ children }) => {
  const group = useRef();
  const snap = useSnapshot(state);

  useFrame(({ camera }, delta) => {
    const isBreakpoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;

    // Set the initial position of the model
    let targetPosition = [-0.3, 0.2, 2.2];
    if (snap.intro) {
      targetPosition = isBreakpoint
        ? [0, 0, 2]
        : isMobile
        ? [0, 0.2, 2.5]
        : targetPosition;
    } else {
      targetPosition = isMobile ? [0, 0, 2.5] : [-0.1, 0.2, 2.2];
    }

    // Set model camera position
    easing.damp3(camera.position, targetPosition, 0.25, delta);

    // Set the model rotation smoothly
    const rotationThreshold = Math.PI / 2; // Adjust the threshold as needed
    const targetRotation = [-Math.PI / 10, 0, 0];

    group.current.rotation.x = Math.min(
      group.current.rotation.x,
      rotationThreshold
    );
    if (group.current.rotation.x < rotationThreshold) {
      easing.dampE(group.current.rotation, targetRotation, 0.25, delta);
    }
  });

  return <group ref={group}>{children}</group>;
};

export default CameraRig;
