function getHitbox(obj) {
    const x = obj.pos ? obj.pos.x : obj.x;
    const y = obj.pos ? obj.pos.y : obj.y;

    const scale = obj.scale ?? 1;

    return {
        x: x + (obj.collision?.offsetX ?? 0),
        y: y + (obj.collision?.offsetY ?? 0),
        width: obj.collision?.width ?? obj.width * scale,
        height: obj.collision?.height ?? obj.height * scale
    };
}

export function isColliding(a, b) {
    const A = getHitbox(a);
    const B = getHitbox(b);

    return (
        A.x < B.x + B.width &&
        A.x + A.width > B.x &&
        A.y < B.y + B.height &&
        A.y + A.height > B.y
    );
}

export function isNear(a, b, distance) {
    const A = getHitbox(a);
    const B = getHitbox(b);

    const dx = Math.max(
        B.x - (A.x + A.width),
        A.x - (B.x + B.width),
        0
    );

    const dy = Math.max(
        B.y - (A.y + A.height),
        A.y - (B.y + B.height),
        0
    );
    
    return Math.hypot(dx, dy) <= distance;
}