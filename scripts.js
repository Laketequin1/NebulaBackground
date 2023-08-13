/*
document.body.onpointermove = event => {
    const { clientX, clientY } = event;

    const nebulaSpace = document.getElementById("nebula-space");
    const children = nebulaSpace.children;

    for (const child of children) {
        child.animate(
            [
                { left: child.style.left, top: child.style.top },
                { left: `${clientX}px`, top: `${clientY}px` }
            ],
            { duration: 2000, fill: "forwards" }
        );
    }

    console.log(clientX, clientY);
};
*/

const moveSpeed = 0.1; // pixels per second
const pushForce = -8;
const friction = 0.995;
const timeInterval = 200; // milliseconds;

function updatePosition(child, randomX, randomY, children) {
    const currentX = child.offsetLeft;
    const currentY = child.offsetTop;

    const deltaX = randomX - currentX;
    const deltaY = randomY - currentY;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    child.velocityX += (deltaX / distance) * moveSpeed;
    child.velocityY += (deltaY / distance) * moveSpeed;

    for (const otherChild of children) {
        if (otherChild !== child) {
            const currentX = child.offsetLeft;
            const currentY = child.offsetTop;

            const deltaX = otherChild.offsetLeft - currentX;
            const deltaY = otherChild.offsetTop - currentY;
            const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

            child.velocityX += (deltaX / distance) * pushForce * (1 / distance);
            child.velocityY += (deltaY / distance) * pushForce * (1 / distance);
        }
    }

    child.velocityX *= friction;
    child.velocityY *= friction;

    child.animate(
        [
            { left: child.style.left, top: child.style.top },
            { left: `${currentX + child.velocityX}px`, top: `${currentY + child.velocityY}px` }
        ],
        { duration: timeInterval, fill: "forwards" }
    );

    const remainingDistance = Math.sqrt((randomX - currentX) ** 2 + (randomY - currentY) ** 2);

    if (remainingDistance > 80) {
        requestAnimationFrame(() => {
            updatePosition(child, randomX, randomY, children);
        });
    } else {
        move(child, children);
    }
}

function move(child, children) {
    const { clientWidth, clientHeight } = document.documentElement;
    const randomX = Math.random() * (clientWidth);
    const randomY = Math.random() * (clientHeight);

    setTimeout(() => {
        updatePosition(child, randomX, randomY, children);
    }, timeInterval);
}

document.addEventListener("DOMContentLoaded", () => {
    const nebulaSpace = document.getElementById("nebula-space");
    const children = nebulaSpace.children;
    const { clientWidth, clientHeight } = document.documentElement;

    for (const child of children) {
        const randomX = Math.random() * (clientWidth);
        const randomY = Math.random() * (clientHeight);

        child.animate(
            [
                { left: child.style.left, top: child.style.top },
                { left: `${randomX}px`, top: `${randomY}px` }
            ],
            { duration: 0, fill: "forwards" }
        );
        
        child.velocityX = 0;
        child.velocityY = 0;

        move(child, Array.from(children));
    }
});
