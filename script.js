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
     * @returns {undefined}
     */
    function addOneToDecorationList(decorationSrc) {
        var decoration;

        $.each(decorationsList, function (index, decoration) {
            if (decoration.angle === 0) {
                decoration.setAngle(0.1);
            }
        });

        decoration = new Decoration(context, decorationSrc, 0);
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

        if (startAngle > 0) {
            return startAngle;
        }

        return 2 * Math.PI - startAngle;
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

        if (endAngle > 0) {
            return endAngle;
        }

        return 2 * Math.PI - endAngle;
    };

    /**
     * Method returns diff between 2 angles by clockwise
     *
     * @method
     * @name Decoration#getAnglesDiff
     * @param {number} previousAngle
     * @param {number} nextAngle
     * @returns {number}
     */
    Decoration.prototype.getAnglesDiff = function (previousAngle, nextAngle) {
        if (previousAngle > nextAngle) {
            return nextAngle + 2 * Math.PI - previousAngle;
        }

        return nextAngle - previousAngle;
    };

    /**
     * Method returns previous decoration on the circle line
     *
     * @method
     * @name Decoration#getPrevious
     * @returns {Decoration | null}
     */
    Decoration.prototype.getPrevious = function () {
        var that = this,
            currentAngle = this.angle,
            previousDecoration,
            maxAngleDecoration;

        if (decorationsList.length === 0) {
            return null;
        }

        if (decorationsList.length === 1) {
            if (this === decorationsList[0]) {
                return null;
            }
        }

        maxAngleDecoration = decorationsList[0];
        $.each(decorationsList, function (index, decoration) {
            var previousAngle,
                maxAngle = maxAngleDecoration.angle,
                angle = decoration.angle;

            if (decoration === that) {
                return;
            }

            if (angle < currentAngle) {
                if (previousDecoration) {
                    previousAngle = previousDecoration.angle;
                    if (previousAngle > angle) {
                        previousDecoration = decoration;
                    }
                } else {
                    previousDecoration = decoration;
                }
            }

            if (angle > maxAngle) {
                maxAngleDecoration = decoration;
            }
        });

        return previousDecoration || maxAngleDecoration;
    };

    /**
     * Method returns next decoration on the circle line
     *
     * @method
     * @name Decoration#getNext
     * @returns {Decoration | null}
     */
    Decoration.prototype.getNext = function () {
        var that = this,
            currentAngle = this.angle,
            nextDecoration,
            minAngleDecoration;

        if (decorationsList.length === 0) {
            return null;
        }

        if (decorationsList.length === 1) {
            if (this === decorationsList[0]) {
                return null;
            }
        }

        minAngleDecoration = decorationsList[0];
        $.each(decorationsList, function (index, decoration) {
            var nextAngle,
                minAngle = minAngleDecoration.angle,
                angle = decoration.angle;

            if (decoration === that) {
                return;
            }

            if (angle > currentAngle) {
                if (nextDecoration) {
                    nextAngle = nextDecoration.angle;
                    if (nextAngle < angle) {
                        nextDecoration = decoration;
                    }
                } else {
                    nextDecoration = decoration;
                }
            }

            if (angle < minAngle) {
                minAngleDecoration = decoration;
            }
        });

        return nextDecoration || minAngleDecoration;
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
        var previousDecoration,
            nextDecoration,
            nextDecorationStartAngle,
            previousDecorationEndAngle,
            startAngle,
            endAngle;

        this.angle = angle < 2 * Math.PI ? angle : 2 * Math.PI - angle;
        previousDecoration = this.getPrevious();
        nextDecoration = this.getNext();
        if (previousDecoration && nextDecoration) {
            previousDecorationEndAngle = previousDecoration.getEndAngle();
            nextDecorationStartAngle = nextDecoration.getStartAngle();
            startAngle = this.getStartAngle();
            endAngle = this.getEndAngle();
        }
    };


    $('.js-decoration').on('click', function () {
        var $this = $(this),
            decorationSrc = $this.attr('src');

        addOneToDecorationList(decorationSrc);
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
});