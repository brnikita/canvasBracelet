// canvas stuff
var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    centerX = canvas.width / 2,
    centerY = canvas.height / 2,
    radius = 100,
    img = new Image();

img.src = "http://s25.postimg.org/bploq7onf/gem_agate_002.png";

/**
 *
 * Constructor of Decoration class
 *
 * @constructor
 * @param {string} src Url of target image
 * @param {number} width Decoration width
 * @param {number} height Decoration height
 * @returns {undefined}
 */
var Decoration = function(src, width, height){
    this.src = src;
};

/**
 * Method returns width of decoration image
 *
 * @method
 * @name Decoration#setCenter
 * @returns {number}
 */
Decoration.prototype.getWidth = function(){

};

/**
 * Method returns height of decoration image
 *
 * @method
 * @name Decoration#setCenter
 * @returns {number}
 */
Decoration.prototype.getHeight = function(){

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
Decoration.prototype.setCenter = function(x, y){

};

/**
 * Method sets next decoration on the circle line
 *
 * @method
 * @name Decoration#setNext
 * @param {Decoration} nextDecoration
 * @returns {undefined}
 */
Decoration.prototype.setNext = function(nextDecoration){

};

/**
 * Method sets previous decoration on the circle line
 *
 * @method
 * @name Decoration#setNext
 * @param {Decoration} previousDecoration
 * @returns {undefined}
 */
Decoration.prototype.setNext = function(previousDecoration){

};