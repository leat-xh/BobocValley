import objectsData from "./data/objects.json"
import imageRegistry from "./data/imageRegistry"
import Player from './GameComponents/Player'
import Object from './GameComponents/Object'
import bgImg from './GameComponents/assets/background.png'
import { isColliding, isNear} from "./GameComponents/utils/collision";

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router";

export default function Game() {
    const navigate = useNavigate();

    const [player, setPlayer] = useState( () => {
        const savedPos = localStorage.getItem("playerPos");
        return {
            pos: savedPos ? JSON.parse(savedPos) : 
                { x: 200, y: 400 },
            scale: 3,
            width: 40,
            height: 40,
            size: 40
        }
    });
    const [isIdle, setIsIdle] = useState(true);
    const [direction, setDirection] = useState("right");

    const keys = useRef(new Set());

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();
            keys.current.add(key);
            if (key === "arrowleft") setDirection("left");
            if (key === "arrowright") setDirection("right");

            if (key === " " && !e.repeat) {
                const nearbyObject = objectsData.find(obj =>
                    obj.interactable && isNear(player, obj, 30)
                );

                if (nearbyObject) {
                    if (nearbyObject.path)
                        navigate(nearbyObject.path);
                }
            }
        };

        const handleKeyUp = (e) => {
            keys.current.delete(e.key.toLowerCase());
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [player]);

    useEffect(() => {
        let animationId;

        function update() {
            const speed = 2;
            let dx = 0;
            let dy = 0;

            const pressed = keys.current;

            if (pressed.has("arrowup")) dy -= 1;
            if (pressed.has("arrowdown")) dy += 1;
            if (pressed.has("arrowleft")) dx -= 1;
            if (pressed.has("arrowright")) dx += 1;

            setIsIdle(dx === 0 && dy === 0);

            // Normalize diagonal movement
            const length = Math.hypot(dx, dy);

            if (length > 0) {
                dx /= length;
                dy /= length;
            }
            setPlayer(prev => {
                const next = {
                    ...prev,
                    pos: {
                        x: prev.pos.x + dx * speed,
                        y: prev.pos.y + dy * speed
                    }
                }

                const blocked = objectsData.some(obj => 
                    obj.solid && isColliding(next, obj)
                );
                return blocked ? prev : next;
            })

            animationId = requestAnimationFrame(update);
        }


        animationId = requestAnimationFrame(update);

        return () => cancelAnimationFrame(animationId);
    }, []);

    useEffect(() => {
        localStorage.setItem("playerPos", JSON.stringify(player.pos));
    }, [player.pos]);

    return (
    <div
    style={{
        backgroundImage: `url(${bgImg})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top left',
        backgroundSize: 'auto',
        width: '100vw',
        height: '100vh',
    }}>
    
      <Player 
        size={player.size} 
        scale={player.scale} 
        pos={player.pos} 
        isIdle={isIdle} 
        direction={direction}
      />

      {objectsData.map((obj, i) => {
        const playerIsInFront = (player.pos.y > obj.pos.y + obj.height);
        if (!obj.animation) {
            return (
            <Object
                key={i}
                {...obj}
                imgSrc={imageRegistry[obj.type]}
                zIndex={playerIsInFront ? 0 : 2}
            />
            )
        }
        else {
            <Sprite 
                key={i}
                size={size}
                row={isIdle ? 0 : 1} 
                col={0} 
                scaleNumber={scale} 
                imgSrc={chickenImg} 
                animationFrames={isIdle ? 8 : 4} 
                flipHorizontal={direction === "right"}
            />

        }
    })}
    </div>)
}