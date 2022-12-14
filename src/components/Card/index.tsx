import { FC, ReactElement, useEffect, MouseEventHandler } from "react";
import { useSpring, a, to } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { calcX, calcY } from "../../assets/css/utilities/functions";

interface PropTypes {
  children: ReactElement | string;
  parallax?: boolean;
  draggable?: boolean;
  layer?: number;
  onClick?: MouseEventHandler;
}

export const Card: FC<PropTypes> = ({
  children,
  parallax = false,
  draggable = false,
  layer = 1,
  onClick,
}) => {
  const scaleIndex: number = layer / 50 + 0.95;
  const perspectiveIndex: number = layer * 300 * 1.05;

  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", preventDefault);
    document.addEventListener("gesturechange", preventDefault);

    return () => {
      document.removeEventListener("gesturestart", preventDefault);
      document.removeEventListener("gesturechange", preventDefault);
    };
  }, []);

  const [{ x, y, rotateX, rotateY, rotateZ, zoom, scale }, api] = useSpring(
    () =>
      ({
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        scale: 1,
        zoom: 0,
        x: 0,
        y: 0,
        config: { mass: 1, tension: 100, friction: 30 },
      } as any)
  );

  const bind = useGesture({
    onDrag: ({ active, offset: [x, y] }: any) =>
      draggable
        ? api({
            x,
            y,
            rotateX: 0,
            rotateY: 0,
            scale: 1.05,
          })
        : api({
            scale: 1,
          }),
    onPinch: ({ offset: [d, a] }: any) => api({ zoom: d / 200, rotateZ: a }),
    onMove: ({ xy: [px, py], dragging }: any) =>
      !dragging &&
      api({
        rotateX: calcX(py, y.get()),
        rotateY: calcY(px, x.get()),
        scale: scaleIndex,
      }),
    onHover: ({ hovering }: any) =>
      !hovering && api({ rotateX: 0, rotateY: 0, scale: 1 }),
  });

  return (
    <a.div
      onClick={onClick}
      {...bind()}
      style={
        parallax
          ? {
              transform: `perspective(${perspectiveIndex / 2}rem)`,
              x,
              y,
              scale: to([scale, zoom], (s, z) => s + z),
              rotateX,
              rotateY,
              rotateZ,
            }
          : {}
      }
    >
      {children}
    </a.div>
  );
};
