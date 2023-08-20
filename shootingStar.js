var spawnInterval = 100;
var trailDuration = 14;
var maxShootingStars = 1;
var shootingStarsSpawnChance = 1 / 15; // Between 0 and 1
var shootingStarSpeed = 2.9;

window.requestAnimFrame = function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (a) {
            window.setTimeout(a, 1000 / 60);
        }
    );
}();

document.onselectstart = function () {
    return false;
};

// Function to clamp a value between a range
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

var intervalId = null;

var c = document.getElementById("c");
var trailC = document.createElement("canvas");
var transparentTrailC = document.createElement("canvas");

var ctx = c.getContext("2d");
var trailCtx = trailC.getContext("2d");
var transparentTrailCtx = transparentTrailC.getContext("2d");

var dpr = window.devicePixelRatio;
var cw = window.innerWidth;
var ch = window.innerHeight;

c.width = cw * dpr;
c.height = ch * dpr;

trailC.width = cw * dpr;
trailC.height = ch * dpr;

transparentTrailC.width = cw * dpr;
transparentTrailC.height = ch * dpr;

ctx.scale(dpr, dpr);
trailCtx.scale(dpr, dpr);
transparentTrailCtx.scale(dpr, dpr);

var rand = function (rMi, rMa) {
    return ~~(Math.random() * (rMa - rMi + 1)) + rMi;
};

ctx.lineCap = "square";
var stars = [];
var shootingStars = [];
var starTrail = [];

var trail = true;
var gradient = ctx.createRadialGradient(cw / 2, ch, 0, cw / 2, ch, Math.sqrt(cw * cw + ch * ch));

// Add color stops to the gradient  
gradient.addColorStop(0, "rgba(28, 40, 52, 1)");
gradient.addColorStop(0.65, "rgba(9, 10, 15, 1)");

function createStar(mx, my) {
    var dx = cw / 2 - mx;
    var dy = ch / 2 - my;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var sizeRandom = Math.random();
    var starSize;
    if (sizeRandom < 0.55) {
        starSize = 1; // 50% chance for size 1
    } else if (sizeRandom < 0.9) {
        starSize = 2; // 40% chance for size 2
    } else {
        starSize = 3; // 10% chance for size 3
    }
    stars.push({
        x: mx,
        y: my,
        lastX: mx,
        lastY: my,
        hue: 0,
        colorAngle: mx / 15 + 250,
        angle: Math.PI,
        size: starSize,
        centerX: cw / 2,
        centerY: ch / 2,
        radius: dist,
        speed: (starSize / 14) * (dist / 1100) + 0.04,
        alpha: 1 - Math.abs(dist) / cw,
        draw: function () {
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.fillRect(Math.floor(this.x - this.size / 2), Math.floor(this.y - this.size / 2), this.size, this.size);
        },
        update: function () {
            this.lastX = this.x;
            this.lastY = this.y;
            this.x = this.x;
            this.y = this.y - 2 * this.speed;
        },
    });
}

function createShootingStar() {
    var starAngle = Math.random() * Math.PI * 2;
    mx = 2 * cw * Math.cos(starAngle);
    my = 2 * ch * Math.sin(starAngle);
    var dx = cw / 2 - mx;
    var dy = ch / 2 - my;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var sizeRandom = Math.random();
    if (sizeRandom < 0.55) {
        starSize = 7; // 50% chance for size 1
    } else if (sizeRandom < 0.9) {
        starSize = 9; // 40% chance for size 2
    } else {
        starSize = 5; // 10% chance for size 3
    }
    shootingStars.push({
        x: mx,
        y: my,
        lastX: mx,
        lastY: my,
        hue: 0,
        opacity: 1,
        angle: starAngle,
        size: starSize,
        speed: Math.min(((starSize / 16) * rand(0.9, 1) + 0.04) * shootingStarSpeed, 2.5),
        alpha: 1 - Math.abs(dist) / cw,
        //draw: function () {
            //ctx.fillStyle = "hsla(" + (this.x + Math.sqrt(this.x * this.y)) + ", 100%, 50%, " + this.opacity + ")";
            //ctx.fillRect(Math.floor(this.x - this.size / 2), Math.floor(this.y - this.size / 2), this.size, this.size);
        //    var _ = _;
        //},
        update: function() {
            this.lastX = this.x;
            this.lastY = this.y;
            
            this.x -= 2 * this.speed * Math.cos(this.angle);
            this.y -= 2 * this.speed * Math.sin(this.angle);

            createStarTrail(this.x, this.y, this.size);
        },        
    });
}

function createStarTrail(mx, my, starSize) {
    var dx = cw / 2 - mx;
    var dy = ch / 2 - my;
    var dist = Math.sqrt(dx * dx + dy * dy);
    starTrail.push({
        x: mx,
        y: my,
        hue: 0,
        opacity: 1,
        size: starSize,
        alpha: 1 - Math.abs(dist) / cw,
        draw: function () {
            ctx.beginPath(); // Start a new path
            ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2); // Create a circular path
            ctx.fillStyle = "hsla(" + ((this.x + this.y) / 3) + ", 88%, 29%, " + this.opacity + ")";
            ctx.fill(); // Fill the path with the color
            ctx.closePath(); // Close the path
        },
        update: function() {
            this.size -= 1 / trailDuration;
            this.opacity -= 0.8 / trailDuration;

            if (this.opacity < 0 || this.size < 0) {
                starTrail.splice(starTrail.indexOf(this), 1);
            }
        },
    });
}

function clear() {
    stars = [];
}

var loop = function () {
    window.requestAnimFrame(loop);
    if (trail) {
        ctx.clearRect(0, 0, cw, ch);
    } else {
        ctx.clearRect(0, 0, cw, ch);
    }

    var i = stars.length;
    while (i--) {
        var star = stars[i];
        var updateCount = 3;
        while (updateCount--) {
            star.update();
            star.draw(ctx);
        }
        if (star.y < -20) {
            stars.splice(i, 1);
        }
    }

    var i = starTrail.length;
    while (i--) {
        var trail = starTrail[i];
        trail.draw(ctx);
        trail.update();
    }

    var i = shootingStars.length;
    while (i--) {
        var shootingStar = shootingStars[i];
        var updateCount = 3;
        while (updateCount--) {
            shootingStar.update();
            //shootingStar.draw(ctx);
        }
        if (shootingStar.y < -2000 || shootingStar.y > ch + 2000 || shootingStar.x < -2000 || shootingStar.x > cw + 2000) {
            shootingStars.splice(i, 1);
            createShootingStar();
        }
    }
};

function createRandomStarAtBottom() {
    if (Math.random() < shootingStarsSpawnChance && shootingStars.length < maxShootingStars){
        createShootingStar();
    }
    var mx = rand(0, cw);
    var my = ch + 15;
    createStar(mx, my);
}

for (var i = 0; i < (ch / 3); i++){
    var mx = rand(0, cw);
    var my = rand(0, ch);
    createStar(mx, my);
}

document.addEventListener("DOMContentLoaded", () => {
    const spawnIntervalInput = document.getElementById("spawnInterval");
    const trailDurationInput = document.getElementById("trailDuration");
    const maxShootingStarsInput = document.getElementById("maxShootingStars");
    const shootingStarSpeedInput = document.getElementById("shootingStarSpeed");

    spawnIntervalInput.addEventListener("input", () => {
        spawnInterval = parseInt(spawnIntervalInput.value);
        if (intervalId){
            clearInterval(intervalId);
            intervalId = setInterval(createRandomStarAtBottom, spawnInterval);
        }
        // Update spawnInterval value in your logic
    });

    trailDurationInput.addEventListener("input", () => {
        trailDuration = parseInt(trailDurationInput.value);
        // Update trailDuration value in your logic
    });

    maxShootingStarsInput.addEventListener("input", () => {
        maxShootingStars = parseInt(maxShootingStarsInput.value);
        shootingStars = [];
        // Update maxShootingStars value in your logic
    });

    shootingStarSpeedInput.addEventListener("input", () => {
        shootingStarSpeed = parseFloat(shootingStarSpeedInput.value);
        // Update shootingStarSpeed value in your logic
    });

    intervalId = setInterval(createRandomStarAtBottom, spawnInterval);
    loop();
});