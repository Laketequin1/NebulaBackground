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

const moveDuration = 2000; // in milliseconds

function moveToRandomPoint(child) {
    const { clientWidth, clientHeight } = document.documentElement;
    const randomX = Math.random() * (clientWidth - child.offsetWidth);
    const randomY = Math.random() * (clientHeight - child.offsetHeight);

    child.style.transition = `transform ${moveDuration}ms linear`;
    child.style.transform = `translate(${randomX}px, ${randomY}px)`;

    setTimeout(() => {
        moveToRandomPoint(child);
    }, moveDuration);
}

document.addEventListener("DOMContentLoaded", () => {
    const nebulaSpace = document.getElementById("nebula-space");
    const children = nebulaSpace.children;

    for (const child of children) {
        moveToRandomPoint(child);
    }
});
