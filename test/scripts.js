const trailSize = 10;
const spawnInterval = 100;

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

ctx.lineCap = "round";
var stars = [];
var shootingStars = [];

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
            //ctx.lineWidth = this.size;
            //ctx.beginPath();
            //ctx.moveTo(this.lastX, this.lastY);
            //ctx.lineTo(this.x, this.y);
            //ctx.stroke();
        },
        update: function () {
            this.lastX = this.x;
            this.lastY = this.y;
            this.x = this.x;
            this.y = this.y - 2 * this.speed;
        },
    });
}

function createShootingStar(mx, my) {
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
            var starGradient = ctx.createLinearGradient(0, 0, 0, ch);
            starGradient.addColorStop(clamp(this.y / ch, 0, 1), "rgba(255, 255, 255, 1)");
            //  starGradient.addColorStop(clamp((this.y + this.size-1) / ch, 0, 1), "rgba(255, 255, 255, 1)");
            //  starGradient.addColorStop(clamp((this.y + this.size) / ch, 0, 1), "rgba(255, 255, 255, 0.2)");
            //  starGradient.addColorStop(clamp((this.y + this.size * trailSize) / ch, 0, 1), "rgba(255, 255, 255, 0)");
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.strokeStyle = "hsla(" + this.colorAngle + ",100%,50%,1)";
            ctx.fillRect(Math.floor(this.x - this.size / 2), Math.floor(this.y - this.size / 2), this.size, this.size);
            //ctx.lineWidth = this.size;
            //ctx.beginPath();
            //ctx.moveTo(this.lastX, this.lastY);
            //ctx.lineTo(this.x, this.y);
            //ctx.stroke();
        },
        update: function () {
            this.lastX = this.x;
            this.lastY = this.y;
            this.x = this.x;
            this.y = this.y - 2 * this.speed;
        },
    });
}

function clear() {
    stars = [];
}

function set_opacity(canvasC, canvasCtx, opacity) {
    origionalGlobalAlpha = canvasCtx.globalAlpha;

    transparentTrailCtx.clearRect(0, 0, cw, ch);
    transparentTrailCtx.drawImage(canvasC, 0, 0);

    canvasCtx.clearRect(0, 0, cw, ch);
    canvasCtx.globalAlpha = opacity;
    canvasCtx.globalCompositeOperation = "destination-over";
    canvasCtx.drawImage(transparentTrailC, 0, 0);
    canvasCtx.globalAlpha = origionalGlobalAlpha;
}

function remove_min_opacity(canvasC, canvasCtx) {
    transparentTrailCtx.clearRect(0, 0, cw, ch);
    transparentTrailCtx.drawImage(canvasC, 0, 0);

    canvasCtx.clearRect(0, 0, cw, ch);
    ctx.globalCompositeOperation = "destination-out";
    canvasCtx.drawImage(transparentTrailC, 0, 0);
    ctx.globalCompositeOperation = "source-over";
}

var loop = function () {
    window.requestAnimFrame(loop);
    if (trail) {
        // Set the gradient as the fill style
        //ctx.fillStyle = gradient;

        //ctx.drawImage(trailC, 0, 0);
        //set_opacity(c, ctx, 0.45);
        //remove_min_opacity(c, ctx);

        //trailCtx.clearRect(0, 0, cw, ch);
        //ctx.clearRect(0, 0, cw, ch);
        //ctx.drawImage(trailC, 0, 0);
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
};

function createRandomStarAtBottom() {
    var mx = rand(0, cw);
    var my = ch;
    createStar(mx, my);
}

for (var i = 0; i < (ch / 3); i++){
    var mx = rand(0, cw);
    var my = rand(0, ch);
    createStar(mx, my);
}

setInterval(createRandomStarAtBottom, spawnInterval);

loop();
