$(function () {
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        circleCenterX = canvas.width / 2,
        circleCenterY = canvas.height / 2,
        circleRadius = 100,
        isDragging = false,
        decorationsList = [],
    //Decoration class
        Decoration;

    /**
     * Function draws circle in canvas field
     *
     * @function
     * @name drawCircle
     * @returns {undefined}
     */
    function drawCircle() {
        context.beginPath();
        context.arc(circleCenterX, circleCenterY, circleRadius, 0, 2 * Math.PI, false);
        context.stroke();
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
     * Function returns mouse position
     *
     * @function
     * @name getMousePosition
     * @param {HTMLElement} canvas
     * @param {jQuery.Event} event
     * @returns {{x: number, y: number}}
     */
    function getMousePosition(canvas, event) {
        var position = canvas.getBoundingClientRect();
        return {
            x: event.clientX - position.left,
            y: event.clientY - position.top
        };
    }

    /**
     * Function draws bracelet
     *
     * @function
     * @name drawBracelet
     * @returns {undefined}
     */
    function drawBracelet() {
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
     * @name addOneToDecorationList
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
        this.dragging = false;
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
            width = this.getWidth(),
            height = this.getHeight(),
            centerX = this.getCenterX(),
            centerY = this.getCenterY(),
            rotateAngle = this.getRotateAngle();

        context.translate(centerX, centerY);
        context.rotate(rotateAngle);
        context.translate(-centerX, -centerY);
        context.drawImage(image, centerX - width / 2, centerY - height / 2, width, height);
        if (this.dragging) {
            context.strokeStyle = '#000';
            context.strokeRect(centerX - width / 2, centerY - height / 2, width, height);
        }
        context.translate(centerX, centerY);
        context.rotate(-rotateAngle);
        context.translate(-centerX, -centerY);
    };

    /**
     * Method makes decoration draggable or not
     *
     * @method
     * @name Decoration#setDraggable
     * @param {boolean} dragging True if decoration should be draggable
     * @returns {undefined}
     */
    Decoration.prototype.setDraggable = function (dragging) {
        this.dragging = dragging;
        isDragging = dragging;
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
        return circleCenterX + (Math.cos(this.angle) * circleRadius);
    };

    /**
     * Method returns x coordinate of decoration center;
     *
     * @method
     * @name Decoration#getCenterY
     * @returns {number}
     */
    Decoration.prototype.getCenterY = function () {
        return circleCenterY + (Math.sin(this.angle) * circleRadius);
    };

    /**
     * Method returns angle of rotation of decoration by decoration center
     *
     * @method
     * @name Decoration#getRotateAngle
     * @returns {number}
     */
    Decoration.prototype.getRotateAngle = function () {
        return this.angle - 2 * Math.PI;
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

    /**
     * Method sets angle of decoration
     *
     * @method
     * @name Decoration#setAngle
     * @param {number} angle
     * @returns {undefined}
     */
    Decoration.prototype.setAngle = function (angle) {
        this.angle = angle;
    };


    $('.js-decoration').on('click', function () {
        var $this = $(this),
            decorationSrc = $this.attr('src'),
            decoration = new Decoration(context, decorationSrc, 0);

        addOneToDecorationList(decoration);
        drawBracelet();
    });

    $('#canvas').on('click', function (event) {
        var position = getMousePosition(canvas, event),
            mouseX = parseInt(position.x),
            mouseY = parseInt(position.y);

        $.each(decorationsList, function (index, decoration) {
            if (decoration.dragging) {
                decoration.setDraggable(false);
                return;
            }

            if (decoration.isPointInside(mouseX, mouseY)) {
                decoration.setDraggable(true);
            }
        });

        drawBracelet();
    }).on('mousemove', function (event) {
        var angle,
            position,
            mouseX,
            mouseY;

        if (!isDragging) {
            return;
        }

        position = getMousePosition(canvas, event);
        mouseX = parseInt(position.x);
        mouseY = parseInt(position.y);

        $.each(decorationsList, function (index, decoration) {
            if (decoration.dragging) {
                angle = Math.atan2(circleCenterY - mouseY, circleCenterX - mouseX) + Math.PI;
                console.log(angle);
                decoration.setAngle(angle);
                drawBracelet();
                return false;
            }
        });
    });

    drawBracelet();
});