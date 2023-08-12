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

const moveSpeed = 300; // pixels per second
const timeInterval = 16; // milliseconds
var velocityX = 0;
var velocityY = 0;

function move(child) {
    const { clientWidth, clientHeight } = document.documentElement;
    const randomX = Math.random() * clientWidth;
    const randomY = Math.random() * clientHeight;

    let currentX = child.offsetLeft;
    let currentY = child.offsetTop;

    const deltaX = randomX - currentX;
    const deltaY = randomY - currentY;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    const velocityX = (deltaX / distance) * moveSpeed;
    const velocityY = (deltaY / distance) * moveSpeed;

    function updatePosition() {
        currentX += velocityX * (timeInterval / 1000);
        currentY += velocityY * (timeInterval / 1000);

        child.style.left = `${currentX}px`;
        child.style.top = `${currentY}px`;

        const remainingDistance = Math.sqrt((randomX - currentX) ** 2 + (randomY - currentY) ** 2);

        if (remainingDistance > ) {
            requestAnimationFrame(updatePosition);
        } else {
            moveToRandomPoint(child);
        }
    }

    updatePosition();
}

document.addEventListener("DOMContentLoaded", () => {
    const nebulaSpace = document.getElementById("nebula-space");
    const children = nebulaSpace.children;

    for (const child of children) {
        move(child);
    }
});
