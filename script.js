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
     * @param {string} decorationSrc
     * @param {number} angle
     * @returns {undefined}
     */
    function addOneToDecorationList(decorationSrc, angle) {
        var circleLength = 2 * Math.PI * circleRadius,
            decorationsLength = 0,
            newsDecoration = new Decoration(context, decorationSrc, angle);

        decorationsLength += 2 * newsDecoration.getRadius();
        $.each(decorationsList, function (index, decoration) {
            decorationsLength += 2 * decoration.getRadius();
        });

        if (decorationsLength > circleLength) {
            alert('Is too much decorations!');
            return;
        }

        $.each(decorationsList, function (index, decoration) {
            if (decoration.angle === angle) {
                decoration.setAngle(angle);
            }
        });

        decorationsList.push(newsDecoration);
    }

    /**
     * Function returns correct angle inside 2Pi
     *
     * @function
     * @name Decoration#getCorrectAngle
     * @returns {number}
     */
    function getCorrectAngle(angle) {
        angle = angle % (2 * Math.PI);

        if (angle >= 0) {
            return angle;
        }

        return 2 * Math.PI + angle;
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
        this.setAngle(angle);
        this.setDraggable(false);
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
     * Method returns true if angle is inside decoration sector
     *
     * @method
     * @name Decoration#isDecorationsIntersect
     * @param {Decoration} decoration1
     * @param {Decoration} decoration2
     * @returns {boolean}
     */
    Decoration.prototype.isDecorationsIntersect = function (decoration1, decoration2) {
        var angleSector1 = decoration1.getSectorAngle(),
            angleSector2 = decoration2.getSectorAngle(),
            x1 = decoration1.getCenterX(),
            x2 = decoration2.getCenterX(),
            y1 = decoration1.getCenterY(),
            y2 = decoration2.getCenterY(),
            centersDestination = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2)),
            minDestination = Math.sin(angleSector1 / 2) * circleRadius + Math.sin(angleSector2 / 2) * circleRadius;

        return Math.round(centersDestination) < Math.round(minDestination);
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
     * Method returns angle of first point of decoration on the circle
     *
     * @method
     * @name Decoration#getStartAngle
     * @returns {number}
     */
    Decoration.prototype.getStartAngle = function () {
        var angle = this.angle,
            decorationRadius = this.getRadius(),
            startAngle = angle - 2 * Math.atan2(decorationRadius / 2, circleRadius);

        return getCorrectAngle(startAngle);
    };

    /**
     * Method returns angle of last point of decoration on the circle
     *
     * @method
     * @name Decoration#getEndAngle
     * @returns {number}
     */
    Decoration.prototype.getEndAngle = function () {
        var angle = this.angle,
            decorationRadius = this.getRadius(),
            endAngle = angle + 2 * Math.atan2(decorationRadius / 2, circleRadius);

        return getCorrectAngle(endAngle);
    };

    /**
     * Method returns angle of sector of decoration
     *
     * @method
     * @name Decoration#getSectorAngle
     * @returns {number}
     */
    Decoration.prototype.getSectorAngle = function () {
        var startAngle = this.getStartAngle(),
            endAngle = this.getEndAngle();

        return this.getAnglesDiffByClockWise(startAngle, endAngle);
    };

    /**
     * Method returns diff between 2 angles by clockwise
     *
     * @method
     * @name Decoration#getAnglesDiffByClockWise
     * @param {number} previousAngle
     * @param {number} nextAngle
     * @returns {number}
     */
    Decoration.prototype.getAnglesDiffByClockWise = function (previousAngle, nextAngle) {
        previousAngle = getCorrectAngle(previousAngle);
        nextAngle = getCorrectAngle(nextAngle);

        return getCorrectAngle(nextAngle - previousAngle);
    };

    /**
     * Method returns diff between 2 angles by сounterclockwise
     *
     * @method
     * @name Decoration#getAnglesDiffByCounterclockwise
     * @param {number} previousAngle
     * @param {number} nextAngle
     * @returns {number}
     */
    Decoration.prototype.getAnglesDiffByCounterclockwise = function (previousAngle, nextAngle) {
        previousAngle = getCorrectAngle(previousAngle);
        nextAngle = getCorrectAngle(nextAngle);

        return getCorrectAngle(previousAngle - nextAngle);
    };

    /**
     * Method returns previous decoration on the circle line
     *
     * @method
     * @name Decoration#getPrevious
     * @param {boolean} [revertAngles] true if we need to find nextDecoration
     * @returns {Decoration | null}
     */
    Decoration.prototype.getPrevious = function (revertAngles) {
        var that = this,
            currentAngle = this.angle,
            minAnglesDiff = 2 * Math.PI,
            getAnglesDiffByClockWise = this.getAnglesDiffByClockWise,
            previousDecoration = null;

        $.each(decorationsList, function (index, decoration) {
            var angle,
                anglesDiff;

            if (decoration === that) {
                return;
            }

            angle = decoration.angle;
            anglesDiff = revertAngles ? getAnglesDiffByClockWise(currentAngle, angle) : getAnglesDiffByClockWise(angle, currentAngle);

            if (anglesDiff < minAnglesDiff) {
                minAnglesDiff = anglesDiff;
                previousDecoration = decoration;
            }
        });

        return previousDecoration;
    };

    /**
     * Method returns next decoration on the circle line
     *
     * @method
     * @name Decoration#getNext
     * @returns {Decoration | null}
     */
    Decoration.prototype.getNext = function () {
        return this.getPrevious(true);
    };

    /**
     * Method returns true if motion is going by clockwise
     *
     * @method
     * @param {number} previousAngle
     * @param {number} nextAngle
     * @returns {boolean}
     */
    Decoration.prototype.isByClockwise = function (previousAngle, nextAngle) {
        return this.getAnglesDiffByClockWise(previousAngle, nextAngle) < this.getAnglesDiffByClockWise(nextAngle, previousAngle);
    };

    /**
     * Method sets angle of decoration
     *
     * @method
     * @name Decoration#setAngle
     * @param angle
     * @returns {undefined}
     */
    Decoration.prototype.setAngle = function (angle) {
        angle = getCorrectAngle(angle);

        var oldAngle = this.angle || 0,
            angleIncrease = 0.1,
            isByClockwise = this.isByClockwise(oldAngle, angle),
            anglesDiff;

        if(isByClockwise){
            anglesDiff = this.getAnglesDiffByClockWise(oldAngle, angle);
        } else {
            anglesDiff = this.getAnglesDiffByCounterclockwise(oldAngle, angle);
        }

        if (anglesDiff > angleIncrease) {
            if (isByClockwise) {
                this._setAngle(oldAngle + angleIncrease);
            } else {
                this._setAngle(oldAngle - angleIncrease);
            }
            this.setAngle(angle);
        } else {
            this._setAngle(angle);
        }
    };

    /**
     * Method sets angle of decoration
     *
     * @private
     * @method
     * @name Decoration#_setAngle
     * @param {number} angle
     * @returns {undefined}
     */
    Decoration.prototype._setAngle = function (angle) {
        var moveAngle,
            previousDecoration,
            nextDecoration,
            nextDecorationStartAngle,
            previousDecorationEndAngle,
            startAngle,
            oldAngle = this.angle || 0,
            endAngle;

        this.angle = getCorrectAngle(angle);
        previousDecoration = this.getPrevious();
        nextDecoration = this.getNext();

        if (!(previousDecoration && nextDecoration)) {
            return;
        }

        previousDecorationEndAngle = previousDecoration.getEndAngle();
        nextDecorationStartAngle = nextDecoration.getStartAngle();
        startAngle = this.getStartAngle();
        endAngle = this.getEndAngle();

        if (this.isByClockwise(oldAngle, angle)) {
            if (this.isDecorationsIntersect(nextDecoration, this)) {
                moveAngle = this.getAnglesDiffByClockWise(nextDecorationStartAngle, endAngle);
                nextDecoration.setAngle(nextDecoration.angle + moveAngle);
            }
        } else {
            if (this.isDecorationsIntersect(previousDecoration, this)) {
                moveAngle = this.getAnglesDiffByClockWise(startAngle, previousDecorationEndAngle);
                previousDecoration.setAngle(previousDecoration.angle - moveAngle);
            }
        }
    };


    $('.js-decoration').on('click', function () {
        var $this = $(this),
            decorationSrc = $this.attr('src');

        addOneToDecorationList(decorationSrc, 0);
        drawBracelet();
    });

    $('#canvas').on('click',function (event) {
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
                    decoration.setAngle(angle);
                    drawBracelet();
                    return false;
                }
            });
        });

    drawBracelet();
})
;