// Constants
const moveSpeed = 0.05;
const pushForce = 600;
const friction = 0.98;
// Constants
const starSpeed = 4;
const starDuration = 1500;
const trailDuration = 20;
const trailSmoothing = 10;
const frameDuration = 6;
const totalStars = 3;

let doPause = false;

// Get the client dimensions
const { clientWidth, clientHeight } = document.documentElement;

function addElementsToNebulaSpace() {
    const nebulaSpace = document.getElementById("nebula-space");

    // Create div elements with different classes
    const pinkDiv = document.createElement("div");
    pinkDiv.classList.add("pink");

    const darkDiv = document.createElement("div");
    darkDiv.classList.add("dark");

    const purpleDiv = document.createElement("div");
    purpleDiv.classList.add("purple");

    const brightDiv = document.createElement("div");
    brightDiv.classList.add("bright");

    // Append the div elements to the nebulaSpace
    nebulaSpace.appendChild(pinkDiv);
    nebulaSpace.appendChild(darkDiv);
    nebulaSpace.appendChild(purpleDiv);
    nebulaSpace.appendChild(brightDiv);
}

const numIterations = Math.floor(clientWidth / 600); // Calculate number of iterations

for (let i = 0; i < numIterations; i++) {
    addElementsToNebulaSpace();
}

// Function to clamp a value between a range
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Update position of a child element
function updatePosition(child, randomX, randomY, children) {    
    const currentX = child.offsetLeft;
    const currentY = child.offsetTop;

    // Calculate the distance between the current and random positions
    const deltaX = randomX - currentX;
    const deltaY = randomY - currentY;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    child.velocityX += (deltaX / distance) * moveSpeed;
    child.velocityY += (deltaY / distance) * moveSpeed;

    // Apply forces from other children
    for (const otherChild of children) {
        if (otherChild !== child) {
            const otherX = otherChild.offsetLeft;
            const otherY = otherChild.offsetTop;
            const deltaOtherX = otherX - currentX;
            const deltaOtherY = otherY - currentY;
            const otherDistance = Math.sqrt(deltaOtherX ** 2 + deltaOtherY ** 2);

            // Apply push force inversely proportional to distance
            child.velocityX += (deltaOtherX / otherDistance ** 1.75) * -pushForce * (1 / otherDistance);
            child.velocityY += (deltaOtherY / otherDistance ** 1.75) * -pushForce * (1 / otherDistance);
        }
    }

    // Apply friction
    child.velocityX *= friction;
    child.velocityY *= friction;

    // Animate the child's movement
    child.style.left = `${currentX + child.velocityX}px`;
    child.style.top = `${currentY + child.velocityY}px`;

    // Calculate remaining distance
    const remainingDistance = Math.sqrt((randomX - currentX) ** 2 + (randomY - currentY) ** 2);

    // Request animation frame if remaining distance is greater than a threshold
    if (remainingDistance > 80) {
        requestAnimationFrame(() => {
            updatePosition(child, randomX, randomY, children);
        });
    } else {
        move(child, children);
    }
}

// Move the child element
function move(child, children) {
    const randomX = (Math.random() * 1.2 - 0.1) * clientWidth;
    const randomY = (Math.random() * 1.2 - 0.1) * clientHeight;

    updatePosition(child, randomX, randomY, children);
}

const shootingStarSpace = document.getElementById("shooting-star-space");
const shootingStarTrail = document.getElementById("shooting-star-trail");

function getRandomStarDirection() {
    const randomAngle = Math.random() * Math.PI * 2; // Generate a random angle in radians
    const x = Math.cos(randomAngle); // Calculate the X component based on the angle
    const y = Math.sin(randomAngle); // Calculate the Y component based on the angle
    return { x, y }; // Return an object with the calculated components
}

function newStar() {
    // Create div elements with different classes
    const shootingStar = document.createElement("div");
    shootingStar.duration = starDuration;
    shootingStarSpace.appendChild(shootingStar);

    var starDirection = getRandomStarDirection();

    const randomX = (Math.random() * 0.8 + 0.1) * clientWidth;
    const randomY = (Math.random() * 0.8 + 0.1) * clientHeight;
    const newPosX = randomX - (clientWidth * starDirection.x);
    const newPosY = randomY - (clientHeight * starDirection.y);
    shootingStar.style.left = `${newPosX}px`;
    shootingStar.style.top = `${newPosY}px`;
    shootingStar.starDirection = starDirection;
    shootingStar.duration = starDuration;
    shootingStar.posX = newPosX;
    shootingStar.posY = newPosY;
}

const interval = setInterval(() => {//Set up loop for multiple stars <------------------------------------
    const shootingStars = shootingStarSpace.children;
    for (const shootingStar of shootingStars) {
        if (shootingStar.duration >= 0) {
            const currentX = shootingStar.offsetLeft;
            const currentY = shootingStar.offsetTop;

            const newTrail = document.createElement("div");
            newTrail.style.left = `${currentX}px`;
            newTrail.style.top = `${currentY}px`;
            newTrail.duration = trailDuration;
            shootingStarTrail.appendChild(newTrail);

            shootingStar.posX += (starSpeed * shootingStar.starDirection.x);
            shootingStar.posY += (starSpeed * shootingStar.starDirection.y);
            shootingStar.style.left = `${shootingStar.posX}px`;
            shootingStar.style.top = `${shootingStar.posY}px`;
            shootingStar.duration -= 1;
        } else {
            shootingStar.remove();
            newStar();
        }
    }

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

    if (doPause) {
        clearInterval(interval); // Call this to end the loop
    }
}, frameDuration);


// Run when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const nebulaSpace = document.getElementById("nebula-space");
    const children = nebulaSpace.children;

    // Initialize child elements
    for (const child of children) {
        const randomX = (Math.random() * 1.2 - 0.1) * clientWidth;
        const randomY = (Math.random() * 1.2 - 0.1) * clientHeight;

        // Set initial position animation
        child.style.left = `${randomX}px`;
        child.style.top = `${randomY}px`;
        
        // Initialize velocities
        child.velocityX = 0;
        child.velocityY = 0;

        // Start movement
        move(child, Array.from(children));
    }

    for (var i = 0; i < totalStars; i++) {
        newStar();
    }
});
