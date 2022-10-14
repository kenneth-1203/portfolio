import React, { useEffect } from "react";
import { useSpring, a, to } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";

interface PropTypes {
  children: React.ReactElement | string;
  parallax?: boolean;
  layer?: number;
  onClick?: React.MouseEventHandler;
}

export const Card: React.FC<PropTypes> = ({
  children,
  parallax = false,
  layer = 1,
  onClick,
}) => {
  const scaleIndex: number = layer / 50 + 0.95;

  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", preventDefault);
    document.addEventListener("gesturechange", preventDefault);

    return () => {
      document.removeEventListener("gesturestart", preventDefault);
      document.removeEventListener("gesturechange", preventDefault);
    };
  }, []);

  const [{ zoom, scale }, api] = useSpring(() => ({
    scale: 1,
    zoom: 0,
  }));

  const bind = useGesture({
    onMove: ({ xy: [px, py], dragging }: any) =>
      !dragging &&
      api({
        scale: scaleIndex,
      }),
    onHover: ({ hovering }: any) => !hovering && api({ scale: 1 }),
  });

  return (
    <a.div
      onClick={onClick}
      {...bind()}
      style={
        parallax
          ? {
              scale: to([scale, zoom], (s, z) => s + z),
            }
          : {}
      }
    >
      {children}
    </a.div>
  );
};
