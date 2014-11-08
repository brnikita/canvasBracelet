$(function () {
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        circleCenterX = canvas.width / 2,
        circleCenterY = 250,
        circleRadius = 100,
        isSelecting = false,
        draggingElement,
        decorationsList = [],
        initDecorationStartX = 20,
        initDecorationMargin = 10,
        initDecorationLineY = 50,
        initDecorationsList = [],
    //Decoration class
        Decoration,
    //Init decoration class
        InitDecoration;


    /**
     * Function fills initial decorations list
     *
     * @function
     * @name preLoadDecorations
     * @param {Array} decorationsList
     * @returns {$.Deferred}
     */
    function preLoadDecorations(decorationsList) {
        var loadedDecorations = 0,
            deferred = $.Deferred();

        $.each(decorationsList, function (index, decorationSrc) {
            var image = new Image();

            image.src = decorationSrc;
            image.onload = function () {
                loadedDecorations++;

                if (loadedDecorations === decorationsList.length) {
                    deferred.resolve();
                }
            }
        });

        return deferred;
    }

    /**
     * Function fills initial decorations list
     *
     * @function
     * @name fillInitDecorationList
     * @param {Array} decorationsList
     * @returns {undefined}
     */
    function fillInitDecorationList(decorationsList) {
        $.each(decorationsList, function (index, decorationSrc) {
            var image = new Image(),
                newInitialDecoration;

            image.src = decorationSrc;
            newInitialDecoration = new InitDecoration(decorationSrc, index);
            initDecorationsList.push(newInitialDecoration);
        });
    }

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

        $.each(initDecorationsList, function (index, decoration) {
            decoration.draw();
        });

        $.each(decorationsList, function (index, decoration) {
            decoration.draw();
        });

        if (draggingElement) {
            draggingElement.draw();
        }
    }

    /**
     * Function adds one decoration to decorations list
     *
     * @function
     * @name addOneToDecorationList
     * @param {string} decorationSrc
     * @param {number} angle
     * @param {boolean} [isDragging]
     * @param {number} [centerX] if decoration is dragging
     * @param {number} [centerY] if decoration is dragging
     * @returns {undefined}
     */
    function addOneToDecorationList(decorationSrc, angle, isDragging, centerX, centerY) {
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

        if (isDragging) {
            newsDecoration.setSelecting(true);
            newsDecoration.setDragging(true);
            newsDecoration.setDraggingPosition(centerX, centerY);
            draggingElement = newsDecoration;
            return;
        }

        decorationsList.push(newsDecoration);
    }

    /**
     * Function returns angle by x,y coordinates
     *
     * @function
     * @name getCircleAngle
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    function getCircleAngle(x, y) {
        return Math.atan2(circleCenterY - y, circleCenterX - x) + Math.PI;
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
     * Constructor of initial decoration
     *
     * Initial decorations appear on the top of canvas
     *
     * @constructor
     * @param {string} decorationSrc
     * @param {number} index Decoration order index
     * @returns {undefined}
     */
    InitDecoration = function (decorationSrc, index) {
        this.image = new Image();
        this.context = context;
        this.image.src = decorationSrc;
        this.index = index;
    };

    /**
     * Method returns true if point belongs to decoration
     *
     * @method
     * @name InitDecoration#isPointInside
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    InitDecoration.prototype.isPointInside = function (x, y) {
        var radius = this.getRadius(),
            centerX = this.getCenterX(),
            centerY = this.getCenterY();

        return Math.sqrt(Math.pow((centerX - x), 2) + Math.pow((centerY - y), 2)) < radius;
    };

    /**
     * Method returns radius of decoration
     *
     * @method
     * @name InitDecoration#getRadius
     * @returns {number}
     */
    InitDecoration.prototype.getRadius = function () {
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
     * @name InitDecoration#setCenter
     * @returns {number}
     */
    InitDecoration.prototype.getWidth = function () {
        return this.image.width;
    };

    /**
     * Method returns height of decoration image
     *
     * @method
     * @name InitDecoration#setCenter
     * @returns {number}
     */
    InitDecoration.prototype.getHeight = function () {
        return this.image.height;
    };

    /**
     * Method returns x coordinate of decoration center;
     *
     * @method
     * @name InitDecoration#getCenterX
     * @returns {number}
     */
    InitDecoration.prototype.getCenterX = function () {
        var prevDecoration,
            prevDecorationWidth,
            prevDecorationX,
            currentWidth = this.getWidth();

        if (this.index === 0) {
            return initDecorationStartX + currentWidth / 2;
        }

        prevDecoration = this.getPrevious();
        prevDecorationWidth = prevDecoration.getWidth();
        prevDecorationX = prevDecoration.getCenterX();

        return prevDecorationX + prevDecorationWidth / 2 + initDecorationMargin + currentWidth / 2;
    };

    /**
     * Method returns x coordinate of decoration center;
     *
     * @method
     * @name InitDecoration#getCenterY
     * @returns {number}
     */
    InitDecoration.prototype.getCenterY = function () {
        return initDecorationLineY;
    };

    /**
     * Method returns previous decoration
     *
     * @method
     * @name InitDecoration#getPrevious
     * @returns {InitDecoration | null}
     */
    InitDecoration.prototype.getPrevious = function () {
        var index = this.index;

        if (index === 0) {
            return null;
        }

        return initDecorationsList[index - 1];
    };

    /**
     * Method draws initial decoration
     *
     * @method
     * @name InitDecoration#draw
     * @returns {undefined}
     */
    InitDecoration.prototype.draw = function () {
        var context = this.context,
            image = this.image,
            width = this.getWidth(),
            height = this.getHeight(),
            centerX = this.getCenterX(),
            centerY = this.getCenterY();

        context.drawImage(image, centerX - width / 2, centerY - height / 2, width, height);
    };

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
        this.setSelecting(false);
    };

    /**
     * Method changes decoration behavior
     *
     * @method
     * @name Decoration#setDragging
     * @param {boolean} dragging
     * @returns {undefined}
     */
    Decoration.prototype.setDragging = function (dragging) {
        var that = this,
            angle,
            newsDecoration,
            newDecorationsList = [];

        if (dragging) {
            draggingElement = this;
            $.each(decorationsList, function (index, decoration) {
                if (decoration !== that) {
                    newDecorationsList.push(decoration);
                }
            });
            decorationsList = newDecorationsList;
            return;
        }

        angle = getCircleAngle(draggingElement.getCenterX(), draggingElement.getCenterY());
        newsDecoration = new Decoration(context, draggingElement.image.src, angle);
        newsDecoration.setSelecting(true);
        decorationsList.push(newsDecoration);
        draggingElement = null;
    };

    /**
     * Method sets dragging position
     *
     * @method
     * @name Decoration#setDraggingPosition
     * @param {number} x
     * @param {number} y
     * @returns {undefined}
     */
    Decoration.prototype.setDraggingPosition = function (x, y) {
        this.draggingX = x;
        this.draggingY = y;
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

        if (this.selecting) {
            context.strokeStyle = '#000';
            context.strokeRect(centerX - width / 2, centerY - height / 2, width, height);
        }
        context.translate(centerX, centerY);
        context.rotate(-rotateAngle);
        context.translate(-centerX, -centerY);
    };

    /**
     * Method makes decoration selecting or not
     *
     * @method
     * @name Decoration#setSelecting
     * @param {boolean} selecting True if decoration should be selecting
     * @returns {undefined}
     */
    Decoration.prototype.setSelecting = function (selecting) {
        if (this.selecting === selecting) {
            return;
        }
        this.selecting = selecting;
        isSelecting = selecting;
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
        if (this.draggingX) {
            return this.draggingX;
        }
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
        if (this.draggingY) {
            return this.draggingY;
        }
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
        var oldAngle = this.angle,
            angleIncrease = 0.1,
            isByClockwise,
            anglesDiff;

        angle = getCorrectAngle(angle);

        if ($.type(oldAngle) === 'undefined') {
            oldAngle = angle;
        }

        isByClockwise = this.isByClockwise(oldAngle, angle);

        if (isByClockwise) {
            anglesDiff = this.getAnglesDiffByClockWise(oldAngle, angle);
        } else {
            anglesDiff = this.getAnglesDiffByCounterclockwise(oldAngle, angle);
        }

        if (anglesDiff > angleIncrease) {
            if (isByClockwise) {
                this.moveDecoration(oldAngle + angleIncrease);
            } else {
                this.moveDecoration(oldAngle - angleIncrease);
            }
            this.setAngle(angle);
        } else {
            this.moveDecoration(angle);
        }
    };

    /**
     * Method moves next decoration
     *
     * @method
     * @name Decoration#moveDecoration
     * @returns {undefined}
     */
    Decoration.prototype.moveNext = function () {
        var moveAngle,
            nextDecoration = this.getNext(),
            nextDecorationStartAngle,
            endAngle;

        if (this.isDecorationsIntersect(nextDecoration, this)) {
            nextDecorationStartAngle = nextDecoration.getStartAngle();
            endAngle = this.getEndAngle();
            moveAngle = this.getAnglesDiffByClockWise(nextDecorationStartAngle, endAngle);
            nextDecoration.setAngle(nextDecoration.angle + moveAngle);
        }
    };

    /**
     * Method moves previous decoration
     *
     * @method
     * @name Decoration#movePrevious
     * @returns {undefined}
     */
    Decoration.prototype.movePrevious = function () {
        var moveAngle,
            previousDecoration = this.getPrevious(),
            previousDecorationEndAngle,
            startAngle;

        if (this.isDecorationsIntersect(previousDecoration, this)) {
            previousDecorationEndAngle = previousDecoration.getEndAngle();
            startAngle = this.getStartAngle();
            moveAngle = this.getAnglesDiffByCounterclockwise(previousDecorationEndAngle, startAngle);
            previousDecoration.setAngle(previousDecoration.angle - moveAngle);
        }
    };

    /**
     * Method sets angle of decoration
     *
     * @method
     * @name Decoration#moveDecoration
     * @param {number} angle
     * @returns {undefined}
     */
    Decoration.prototype.moveDecoration = function (angle) {
        var previousDecoration,
            nextDecoration,
            oldAngle = this.angle;

        if ($.type(oldAngle) === 'undefined') {
            oldAngle = angle;
        }

        this.angle = getCorrectAngle(angle);
        previousDecoration = this.getPrevious();
        nextDecoration = this.getNext();

        if (!(previousDecoration && nextDecoration)) {
            return;
        }

        if (this.isByClockwise(oldAngle, angle)) {
            this.moveNext();
            this.movePrevious();
        } else {
            this.movePrevious();
            this.moveNext();
        }

    };

    $('#canvas').on('dblclick', function (event) {
        var newDecorationsList = [],
            position = getMousePosition(canvas, event),
            mouseX = parseInt(position.x),
            mouseY = parseInt(position.y);

        $.each(decorationsList, function (index, decoration) {
            if (decoration.isPointInside(mouseX, mouseY)) {
                decoration.setSelecting(false);
                return;
            }
            newDecorationsList.push(decoration);
        });

        decorationsList = newDecorationsList;
        drawBracelet();
    }).on('mousemove', function (event) {
        var angle,
            position = getMousePosition(canvas, event),
            mouseX = parseInt(position.x),
            mouseY = parseInt(position.y);

        if (draggingElement) {
            draggingElement.setDraggingPosition(mouseX, mouseY);
            drawBracelet();
            return;
        }

        if (isSelecting) {
            $.each(decorationsList, function (index, decoration) {
                if (decoration.selecting) {
                    angle = Math.atan2(circleCenterY - mouseY, circleCenterX - mouseX) + Math.PI;
                    decoration.setAngle(angle);
                    return false;
                }
                return true;
            });

            drawBracelet();
        }
    }).on('mousedown', function (event) {
        var position = getMousePosition(canvas, event),
            mouseX = parseInt(position.x),
            mouseY = parseInt(position.y);

        $.each(initDecorationsList, function (index, decoration) {
            if (isSelecting) {
                return;
            }

            if (decoration.isPointInside(mouseX, mouseY)) {
                addOneToDecorationList(decoration.image.src, 0, true, mouseX, mouseY);
            }
        });

        $.each(decorationsList, function (index, decoration) {
            if (decoration.selecting) {
                decoration.setSelecting(false);
                return;
            }

            if (decoration.isPointInside(mouseX, mouseY)) {
                decoration.setDragging(true);
                decoration.setSelecting(true);
            }
        });

        drawBracelet();
    }).on('mouseup', function () {
        if (draggingElement) {
            draggingElement.setDragging(false);
        }

        drawBracelet();
    });

    preLoadDecorations(window.decorations).done(function () {
        fillInitDecorationList(window.decorations);
        drawBracelet();
    });
});