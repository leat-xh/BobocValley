import chickenImg from './assets/BlockyChickenSpriteSheet.png'

import Sprite from './Sprite.jsx'

function Player({pos, isIdle, direction, size, scale}) {
    
    return (
        <div style={{
            position: "absolute",
            left: pos.x,
            top: pos.y,
            zIndex: 1
        }}>
            <Sprite 
                size={size}
                row={isIdle ? 0 : 1} 
                col={0} 
                scale={scale} 
                imgSrc={chickenImg} 
                animationFrames={isIdle ? 8 : 4} 
                flipHorizontal={direction === "right"}
            />
        </div>
    )
}

export default Player