$(function () {
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        circleCenterX = canvas.width / 2,
        circleCenterY = canvas.height / 2,
        circleRadius = 100,
        decorationsList = [];

    /**
     * Function returns angle of point of circle
     *
     * @function
     * @param {number} pointX
     * @param {number} pointY
     * @returns {number}
     */
    function getAngleOfPoint(pointX, pointY) {
        return Math.atan2(circleCenterY - pointY, circleCenterX - pointX) - Math.PI;
    }

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
        drawCircle();

        $.each(decorationsList, function (index, decoration) {
            decoration.draw();
        });
    }

    /**
     * Constructor of Decoration class
     *
     * @constructor
     * @param {Object} context Canvas context
     * @param {string} src Url of target image
     * @param {number} rotateAngle
     * @returns {undefined}
     */
    var Decoration = function (context, src, rotateAngle) {
        this.image = new Image();
        this.context = context;
        this.image.src = src;
        this.rotateAngle = rotateAngle;
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
            angle = this.angle;

        context.drawImage(image, centerX, centerY, width, height);
        context.translate(circleCenterX, circleCenterY);
        context.rotate(-angle);
        context.translate(-circleCenterX, -circleCenterY);
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
            centerX = this.centerX,
            centerY = this.centerY;

        return Math.sqrt(Math.pow((centerX - x), 2) + Math.pow((centerY - y), 2)) < radius;
    };

    /**
     * Method returns approximate radius of decoration
     *
     * @method
     * @name Decoration#getRadius
     * @returns {number}
     */
    Decoration.prototype.getRadius = function () {
        var width = this.getWidth(),
            height = this.getHeight();

        return (width + height) / 2;
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
    Decoration.prototype.getCenterX = function(){
        var width = this.getWidth();
        return circleCenterX + circleRadius - width / 2;
    };

    /**
     * Method returns x coordinate of decoration center;
     *
     * @method
     * @name Decoration#getCenterY
     * @returns {number}
     */
    Decoration.prototype.getCenterY = function(){
        var height = this.getHeight();
        return circleCenterY - height / 2;
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

        decorationsList.push(decoration);
        drawCanvas();
    });

    drawCanvas();
});