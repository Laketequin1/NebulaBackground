// Constants
const moveSpeed = 2;
const starDuration = 500;
const trailDuration = 50;
const trailSmoothing = 10;
const frameDuration = 16;

// Get the client dimensions
const { clientWidth, clientHeight } = document.documentElement;

const shootingStarSpace = document.getElementById("shooting-star-space");
const shootingStarTrail = document.getElementById("shooting-star-trail");

// Create div elements with different classes
const shootingStar = document.createElement("div");
shootingStar.duration = starDuration;
shootingStarSpace.appendChild(shootingStar);

function getRandomStarDirection() {
    const randomAngle = Math.random() * Math.PI * 2; // Generate a random angle in radians
    const x = Math.cos(randomAngle); // Calculate the X component based on the angle
    const y = Math.sin(randomAngle); // Calculate the Y component based on the angle
    return { x, y }; // Return an object with the calculated components
}

var starDirection = getRandomStarDirection();

const interval = setInterval(() => {//Set up loop for multiple stars <------------------------------------
    const currentX = shootingStar.offsetLeft;
    const currentY = shootingStar.offsetTop;

    const newTrail = document.createElement("div");
    newTrail.style.left = `${currentX}px`;
    newTrail.style.top = `${currentY}px`;
    newTrail.duration = trailDuration;
    shootingStarTrail.appendChild(newTrail);

    const newPosX = currentX + (moveSpeed * starDirection.x);
    const newPosY = currentY + (moveSpeed * starDirection.y);

    shootingStar.style.left = `${newPosX}px`;
    shootingStar.style.top = `${newPosY}px`;

    const children = shootingStarTrail.children;
    for (const child of children) {
        if (child.duration >= 0) {
            child.style.opacity = child.duration/trailDuration;
            child.style.transform = `translate(-50%, -50%) scale(${(child.duration + trailSmoothing)/(trailDuration + trailSmoothing)})`;
            child.duration -= 1;
        } else {
            child.remove();
        }
    }
}, frameDuration);
