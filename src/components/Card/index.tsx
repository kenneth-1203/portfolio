import React, { FC, useRef, useEffect } from "react";
import { useSpring, animated, to } from "@react-spring/web";
import { useGesture, useDrag } from "react-use-gesture";
import { Container, CardWrapper } from "./styledComponents";

const calcX = (y: number, ly: number) =>
  -(y - ly - window.innerHeight / 2) / 20;
const calcY = (x: number, lx: number) => (x - lx - window.innerWidth / 2) / 20;

export const Card: FC<any> = ({ children }) => {
  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", preventDefault);
    document.addEventListener("gesturechange", preventDefault);

    return () => {
      document.removeEventListener("gesturestart", preventDefault);
      document.removeEventListener("gesturechange", preventDefault);
    };
  }, []);

//   const bind = useDrag((state) => {

//   })

  const domTarget = useRef(null);
  const [{ x, y, rotateX, rotateY, rotateZ, zoom, scale }, api] = useSpring(
    () => ({
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
      zoom: 0,
      x: 0,
      y: 0,
      config: { mass: 1, tension: 100, friction: 50 },
    })
  );

  useGesture(
    {
      onDrag: ({ active, offset: [x, y] }: any) =>
        api({ x, y, rotateX: 0, rotateY: 0, scale: active ? 1 : 1.05 }),
      onPinch: ({ offset: [d, a] }: any) => api({ zoom: d / 200, rotateZ: a }),
      onMove: ({ xy: [px, py], dragging }: any) =>
        !dragging &&
        api({
          rotateX: calcX(py, y.get()),
          rotateY: calcY(px, x.get()),
          scale: 1,
        }),
      onHover: ({ hovering }: any) =>
        !hovering && api({ rotateX: 0, rotateY: 0, scale: 1 }),
    },
    { domTarget, eventOptions: { passive: false } }
  );
  return (
        <animated.div
          ref={domTarget}
          style={{
            transform: "perspective(200rem)",
            x,
            y,
            scale: to([scale, zoom], (s, z) => s + z),
            rotateX,
            rotateY,
            rotateZ,
          }}
        >
          {children}
        </animated.div>
  );
};
