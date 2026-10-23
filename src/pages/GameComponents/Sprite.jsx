import { useEffect, useState } from "react";

function Sprite({size=0, width, height, row, col, imgSrc, scale, animationFrames, flipHorizontal=true, animationOnRow=false, style, transparancy=false}) {

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
    }, [animationFrames, row, animationOnRow]);

  return (
    <div
      style={{
        width: (size ? size : width),
        height: (size ? size : height),
        scale: scale,
        opacity: (transparancy ? 0.6 : 1),
        transform: `scaleX(${flipHorizontal? 1 : -1})`,
        backgroundImage: `url(${imgSrc})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: `${-(col + (animationOnRow ? 0 : frame)) * (size ? size : width)}px ${-(row + (animationOnRow ? frame : 0)) * (size ? size : height)}px`,
        imageRendering: "pixelated",
        ...style
      }}
    />
  );
}
export default Sprite;