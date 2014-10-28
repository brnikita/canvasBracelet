$(function () {
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        circleCenterX = canvas.width / 2,
        circleCenterY = canvas.height / 2,
        circleRadius = 100,
        decorationsList = [],
    //Decoration class
        Decoration;

    /**
     * Function draws circle in canvas field
     *
     * @function
     * @returns {undefined}
     */
    function drawCircle() {
        context.beginPath();
        context.arc(circleCenterX, circleCenterY, circleRadius, 0, 2 * Math.PI, false);
        context.stroke();
    }

    /**
     * Function returns mouse position
     *
     * @function
     * @param {HTMLElement} canvas
     * @param {jQuery.Event} event
     * @returns {{x: number, y: number}}
     */
    function getMousePos(canvas, event) {
        var position = canvas.getBoundingClientRect();
        return {
            x: event.clientX - position.left,
            y: event.clientY - position.top
        };
    }

    /**
     * Function clears canvas field
     *
     * @function
     * @returns {undefined}
     */
    function clearAll() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    /**
     * Function draws canvas field
     *
     * @function
     * @returns {undefined}
     */
    function drawCanvas() {
        clearAll();
        drawCircle();

        $.each(decorationsList, function (index, decoration) {
            decoration.draw();
        });
    }

    /**
     * Function adds one decoration to decorations list
     *
     * @function
     * @param {Decoration} decoration
     * @returns {undefined}
     */
    function addOneToDecorationList(decoration) {
        decorationsList.push(decoration);
    }

    /**
     * Constructor of Decoration class
     *
     * @constructor
     * @param {Object} context Canvas context
     * @param {string} src Url of target image
     * @param {number} angle
     * @returns {undefined}
     */
    Decoration = function (context, src, angle) {
        this.image = new Image();
        this.context = context;
        this.image.src = src;
        this.angle = angle;
    };

    /**
     * Method draws decoration on the circle
     *
     * @method
     * @name Decoration#draw
     * @returns {undefined}
     */
    Decoration.prototype.draw = function () {
        var context = this.context,
            image = this.image,
            centerX = this.getCenterX(),
            centerY = this.getCenterY(),
            width = this.getWidth(),
            height = this.getHeight(),
            rotateAngle = this.getRotateAngle();

        context.drawImage(image, centerX, centerY, width, height);
        context.translate(circleCenterX, circleCenterY);
        context.rotate(-rotateAngle);
        context.translate(-circleCenterX, -circleCenterY);
    };

    /**
     * Method makes decoration draggable or not
     *
     * @method
     * @name Decoration#setDraggable
     * @param {boolean} draggable True if decoration should be draggable
     * @returns {undefined}
     */
    Decoration.prototype.setDraggable = function(draggable){
        this.draggable = draggable;
    };

    /**
     * Method returns true if point belongs to decoration
     *
     * @method
     * @name Decoration#isPointInside
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    Decoration.prototype.isPointInside = function (x, y) {
        var radius = this.getRadius(),
            centerX = this.getCenterX(),
            centerY = this.getCenterY();

        return Math.sqrt(Math.pow((centerX - x), 2) + Math.pow((centerY - y), 2)) < radius;
    };

    /**
     * Method returns radius of decoration
     *
     * @method
     * @name Decoration#getRadius
     * @returns {number}
     */
    Decoration.prototype.getRadius = function () {
        var width = this.getWidth(),
            height = this.getHeight();

        if (height > width) {
            return height / 2;
        }

        return width / 2;
    };

    /**
     * Method returns width of decoration image
     *
     * @method
     * @name Decoration#setCenter
     * @returns {number}
     */
    Decoration.prototype.getWidth = function () {
        return this.image.width;
    };

    /**
     * Method returns height of decoration image
     *
     * @method
     * @name Decoration#setCenter
     * @returns {number}
     */
    Decoration.prototype.getHeight = function () {
        return this.image.height;
    };

    /**
     * Method returns x coordinate of decoration center;
     *
     * @method
     * @name Decoration#getCenterX
     * @returns {number}
     */
    Decoration.prototype.getCenterX = function () {
        var angle = this.angle,
            decorationRadius = this.getRadius(),
            circleX = circleCenterX + (Math.cos(angle) * circleRadius);

        return circleX - decorationRadius;
    };

    /**
     * Method returns x coordinate of decoration center;
     *
     * @method
     * @name Decoration#getCenterY
     * @returns {number}
     */
    Decoration.prototype.getCenterY = function () {
        var angle = this.angle,
            decorationRadius = this.getRadius(),
            circleY = circleCenterY + (Math.sin(angle) * circleRadius);

        return circleY - decorationRadius;
    };

    /**
     * Method returns angle of rotation of decoration by decoration center
     *
     * @method
     * @name Decoration#getRotateAngle
     * @returns {number}
     */
    Decoration.prototype.getRotateAngle = function () {
        return 0;
    };

    /**
     * Method sets center of decoration
     *
     * @method
     * @name Decoration#setCenter
     * @param {number} x Position x of center
     * @param {number} y Position y of center
     * @returns {undefined}
     */
    Decoration.prototype.setCenter = function (x, y) {

    };

    /**
     * Method sets next decoration on the circle line
     *
     * @method
     * @name Decoration#setNext
     * @param {Decoration} nextDecoration
     * @returns {undefined}
     */
    Decoration.prototype.setNext = function (nextDecoration) {

    };

    /**
     * Method sets previous decoration on the circle line
     *
     * @method
     * @name Decoration#setNext
     * @param {Decoration} previousDecoration
     * @returns {undefined}
     */
    Decoration.prototype.setNext = function (previousDecoration) {

    };


    $('.js-decoration').on('click', function () {
        var $this = $(this),
            decorationSrc = $this.attr('src'),
            decoration = new Decoration(context, decorationSrc, 0);

        addOneToDecorationList(decoration);
        drawCanvas();
    });

    $('#canvas').on('click', function(event){
        e.stopPropagation();
        var pos = getMousePos(canvas, event);
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
    });

    drawCanvas();
});