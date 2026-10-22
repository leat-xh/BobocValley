import { useEffect, useState } from "react";

function Sprite({size, row, col, imgSrc, scaleNumber, animationFrames, flipHorizontal=true}) {

  const [frame, setFrame] = useState(0);

  useEffect(() => {
        setFrame(0);

        if (animationFrames <= 1) return;

        let animationId;
        let lastTime = 0;
        const frameDuration = 150;

        function animate(time) {
            if (time - lastTime >= frameDuration) {
                setFrame(prev => (prev + 1) % animationFrames);
                lastTime = time;
            }

            animationId = requestAnimationFrame(animate);
        }

        animationId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationId);
    }, [animationFrames, row]);

  return (
    <div
      style={{
        width: size,
        height: size,
        scale: scaleNumber,
        transform: `scaleX(${flipHorizontal? 1 : -1})`,
        backgroundImage: `url(${imgSrc})`,
        backgroundPosition: `${-(col + frame) * size}px ${-row * size}px`,
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated"
      }}
    />
  );
}
export default Sprite;