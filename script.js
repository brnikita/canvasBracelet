// canvas stuff
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    centerX = canvas.width / 2,
    centerY = canvas.height / 2,
    radius = 100,
    contexts = [],
    points = [],
// image stuff
    states = [],
    img = new Image();

img.src = "http://s25.postimg.org/bploq7onf/gem_agate_002.png";

setUpCanvas();
setUpPoints();

function setUpCanvas() {
    contexts.push(canvas.getContext("2d"));
    // link the new canvas to its context in the contexts[] array
    canvas.contextIndex = contexts.length;
    // wire up the click handler
    canvas.onclick = function (e) {
        handleClick(e, this.contextIndex);
    };
    // wire up the mousemove handler
    canvas.onmousemove = function (e) {
        handleMousemove(e, this.contextIndex);
    };
    canvas.addEventListener('dblclick', function () {
        removeState(this.contextIndex);
    });
}

function getMousePos(canvas, evt) {
    var position = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - position.left,
        y: evt.clientY - position.top
    };
}

function setUpPoints() {
    //points that make up a circle circumference to an array
    points = [];
    for (var degree = 0; degree < 360; degree++) {
        var radians = degree * Math.PI / 180,
            xpoint = centerX + radius * Math.cos(radians),
            ypoint = centerY + radius * Math.sin(radians);

        points.push({
            x: xpoint,
            y: ypoint
        });
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x + 4, points[0].y + 4);

    //draws the thin line on the canvas
    for (var i = 1; i < points.length; i++) {
        var pt = points[i];
        ctx.lineTo(pt.x + 4, pt.y + 4);
    }
    ctx.stroke(); //end of drawing the thin line
}

function addCircle() {
    ctx.beginPath();
    ctx.moveTo(points[0].x + 4, points[0].y + 4);
    //draws the thin line on the canvas
    for (var i = 1; i < points.length; i++) {
        var pt = points[i];
        ctx.lineTo(pt.x + 4, pt.y + 4);
    }
    ctx.stroke(); //end of drawing the thin line
}

function clearAll() {
    //Clear all canvases
    for (var i = 0; i < contexts.length; i++) {
        var context = contexts[i];
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function handleClick(e, contextIndex) {
    e.stopPropagation();
    var pos = getMousePos(canvas, e);
    var mouseX = parseInt(pos.x);
    var mouseY = parseInt(pos.y);

    for (var i = 0; i < states.length; i++) {

        var state = states[i];
        if (state.dragging) {
            state.dragging = false;
            state.draw();
            continue;
        }
        if (state.contextIndex == contextIndex && mouseX > state.x && mouseX < state.x + state.width && mouseY > state.y && mouseY < state.y + state.height) {
            state.dragging = true;
            state.offsetX = mouseX - state.x;
            state.offsetY = mouseY - state.y;
            state.contextIndex = contextIndex;
            state.draw();
        }
    }
}

function getAngleOfPoint(pointX, pointY) {
    return Math.atan2(centerY - pointY, centerX - pointX) - Math.PI;
}

function handleMousemove(e, contextIndex) {
    e.stopPropagation();
    var i,
        pos = getMousePos(canvas, e),
        mouseX = parseInt(pos.x),
        mouseY = parseInt(pos.y);

    clearAll();
    addCircle();

    var minDistance = 1000;

    for (i = 0; i < states.length; i++) {

        var state = states[i];

        if (state.dragging) {
            for (i = 0; i < points.length; i++) {
                var pt = points[i];
                var dx = mouseX - pt.x;
                var dy = mouseY - pt.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < minDistance) {
                    minDistance = distance;
                    //points in relation to the constrained line (where it will be drawn to)
                    //reset state.x and state.y to closest point on the line
                    state.x = pt.x - img.width / 2;
                    state.y = pt.y - img.height / 2;
                    state.rotate = getAngleOfPoint(pt.x, pt.y);
                    state.centerX = pt.x;
                    state.centerY = pt.y;
                    state.contextIndex = contextIndex;
                }
            }
        }
        state.draw();

    }
}

function removeState() {
    console.log("called");
}

function addState(image) {
    var ptxy = points[1],
        state = {};
    state.dragging = false;
    state.contextIndex = 1;
    state.image = image;
    state.x = ptxy.x - image.width / 2;
    state.y = ptxy.y - image.height / 2;
    state.width = image.width;
    state.height = image.height;
    state.offsetX = 0;
    state.offsetY = 0;
    state.rotate = 0;
    state.draw = function () {
        var context = contexts[this.contextIndex - 1];
        if (this.dragging) {
            context.translate(this.centerX, this.centerY);
            context.rotate(state.rotate);
            context.translate(-this.centerX, -this.centerY);
            context.strokeStyle = 'black';
            context.strokeRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.translate(this.centerX, this.centerY);
            context.rotate(-state.rotate);
            context.translate(-this.centerX, -this.centerY);
        } else {
            context.translate(this.centerX, this.centerY);
            context.rotate(state.rotate);
            context.translate(-this.centerX, -this.centerY);
            context.drawImage(this.image, this.x, this.y);
            context.translate(this.centerX, this.centerY);
            context.rotate(-state.rotate);
            context.translate(-this.centerX, -this.centerY);
        }
    };

    state.draw();
    return (state);
}

$("#button1").click(function () {
    states.push(addState(img));
});
$("#button2").click(function () {
    states.push(addState(img));
});
$("#button3").click(function () {
    states.push(addState(img));
});
$("#button4").click(function () {
    states.push(addState(img));
});