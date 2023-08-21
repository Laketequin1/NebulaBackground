// Constants
const moveSpeed = 0.11;
const pushForce = 950;
const friction = 0.984;
const tickDuration = 120;

// Get the client dimensions
const { clientWidth, clientHeight } = document.documentElement;
const numIterations = Math.floor(clientWidth / 600); // Calculate number of iterations

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

for (let i = 0; i < numIterations; i++) {
    addElementsToNebulaSpace();
}

// Function to clamp a value between a range
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Update position of a child element
function updatePosition(child, randomX, randomY, children, currentTime) {
    if (currentTime - child.lastRunTime > tickDuration) {
        child.lastRunTime = currentTime;
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
            requestAnimationFrame((currentTime) => {
                updatePosition(child, randomX, randomY, children, currentTime);
            });
        } else {
            move(child, children);
        }
    } else {
        requestAnimationFrame((currentTime) => {
            updatePosition(child, randomX, randomY, children, currentTime);
        });
    }
}

// Move the child element
function move(child, children) {
    const randomX = (Math.random() * 1.2 - 0.1) * clientWidth;
    const randomY = (Math.random() * 1.2 - 0.1) * clientHeight;

    updatePosition(child, randomX, randomY, children, performance.now());
}

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

        child.lastRunTime = 0;

        // Start movement
        move(child, Array.from(children));
    }
});
