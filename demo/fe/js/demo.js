$(function() {
    var centralContainize = function(src, dest, scale, customWidth, customHeight) {
        if ('object' === typeof src && 'object' === typeof dest) {
            var sw = customWidth || src.naturalWidth;
            var sh = customHeight || src.naturalHeight;
            var dw = dest.width;
            var dh = dest.height;
            var pos = {
                sx: 0,
                sy: 0,
                sw: src.naturalWidth,
                sh: src.naturalHeight,
                dx: 0,
                dy: 0,
                dw: dest.width,
                dh: dest.height
            };
            var r = sw * dh / sh / dw;
            var rr = 1;
            // contains:
            // cover:
            if (isNaN(r)) {
                return null;
            } else {
                if (r === 1) {
                    return pos;
                } else if (r > 1) {
                    rr = sh / sw;
                    pos.dh = dw * rr;
                } else {
                    rr = sw / sh;
                    pos.dw = dh * rr;
                }
                if (scale) {
                    pos.dh *= scale;
                    pos.dw *= scale;
                }
                pos.dy = (dh - pos.dh) >> 1;
                pos.dx = (dw - pos.dw) >> 1;
                return pos;
            }
        }
        return null;
    };
    var minScale = 0.1,
        maxScale = 3,
        scaleStep = 0.1;
    var $imgs = $('.previewable');
    var $modal = $('<div class="vmpModal"><span class="closeButton">X</span><canvas></canvas><div class="toolbar"><span class="button minusButton">-</span><input class="imgScale" type="range" value="1" min="0.1" max="3" step="0.1"><span class="button plusButton">+</span></div></div>');
    var $closeButton = $modal.find('.closeButton');
    var $canvas = $modal.find('canvas:first'),
        canvas = $canvas[0],
        context = canvas.getContext('2d');
    var $minusButton = $modal.find('.minusButton'),
        $plusButton = $modal.find('.plusButton'),
        $imgScale = $modal.find('.imgScale'),
        scaleChangeInterval,
        scaleChangeTimeout,
        currentScale = 1;
    var drawnImage;
    var currentWidth, currentHeight;
    var $body = $('body');
    $body.prepend($modal);
    var s = {
        fadeDuration: 300
    };
    var dragVector = {
            x: 0,
            y: 0
        },
        dragFlag = -1,
        originX = 0,
        originY = 0;

    function initCanvas() {
        s.dw = window.innerWidth;
        s.dh = window.innerHeight;
        canvas.width = s.dw;
        canvas.height = s.dh;
    }

    function drawOnCanvas($img) {
        currentWidth = s.sw;
        currentHeight = s.sh;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage($img, s.sx, s.sy, s.sw, s.sh, s.dx, s.dy, s.dw, s.dh);
    }

    function reDraw(scale, offset) {
        initCanvas();
        if (!offset) {
            s = $.extend(s, centralContainize(drawnImage, canvas, scale, currentWidth * scale, currentHeight * scale));
        } else {
            s.dx += offset.x;
            s.dy += offset.y;
        }
        drawOnCanvas(drawnImage);
    }

    function drag(offset) {
        reDraw(currentScale, offset);
    }


    // -----------------------------------------------Start of init canvas
    if ($canvas) {
        $canvas.on('mousedown', function(e) {
            originX = e.offsetX;
            originY = e.offsetY;
            dragFlag = 1;
        }).on('mousemove', function(e) {
            if (dragFlag === 1) {
                dragVector.x = e.offsetX - originX;
                dragVector.y = e.offsetY - originY;
                drag(dragVector);
                originX = e.offsetX;
                originY = e.offsetY;
            }
        }).on('mouseup', function(e) {
            dragFlag = 0;
        });
    }
    // -----------------------------------------------End __of init canvas


    // -----------------------------------------------Start of init img elements
    if ($imgs) {
        $imgs.on('click', function() {
            originX = 0;
            originY = 0;
            currentScale = 1;
            $imgScale.val(1);
            drawnImage = this;
            s = $.extend(s, centralContainize(drawnImage, canvas));
            drawOnCanvas(drawnImage);
            $modal.fadeIn(s.fadeDuration);
        });
    }
    // -----------------------------------------------End __of init img elements


    // -----------------------------------------------Start of $closeButton

    $closeButton.on('click', function() {
        $modal.fadeOut(s.fadeDuration);
    });
    // -----------------------------------------------End __of $closeButton


    // -----------------------------------------------Start of minusButton
    $minusButton.on('click', function() {
        currentScale = Number($imgScale.val());
        if (currentScale > minScale) {
            currentScale -= scaleStep;
            $imgScale.val(currentScale);
            reDraw(currentScale);
        }
    }).on('mousedown', function(e) {
        currentScale = Number($imgScale.val());
        if (currentScale > minScale) {
            scaleChangeTimeout = setTimeout(function() {
                e.preventDefault();
                scaleChangeInterval = setInterval(function() {
                    currentScale = Number($imgScale.val());
                    if (currentScale > minScale) {
                        $imgScale.val(currentScale - scaleStep);
                    } else {
                        clearInterval(scaleChangeInterval);
                    }
                }, 100);
            }, 1200);
        }
    }).on('mouseup', function() {
        clearTimeout(scaleChangeTimeout);
        clearInterval(scaleChangeInterval);
    });
    // -----------------------------------------------End __of minusButton


    // -----------------------------------------------Start of plusButton
    $plusButton.on('click', function() {
        currentScale = Number($imgScale.val());
        if (currentScale < maxScale) {
            currentScale += scaleStep;
            $imgScale.val(currentScale);
            reDraw(currentScale);
        }
    }).on('mousedown', function(e) {
        currentScale = Number($imgScale.val());
        if (currentScale < maxScale) {
            scaleChangeTimeout = setTimeout(function() {
                e.preventDefault();
                scaleChangeInterval = setInterval(function() {
                    currentScale = Number($imgScale.val());
                    if (currentScale < maxScale) {
                        $imgScale.val(currentScale + scaleStep);
                    } else {
                        clearInterval(scaleChangeInterval);
                    }
                }, 100);
            }, 1200);
        }
    }).on('mouseup', function() {
        clearTimeout(scaleChangeTimeout);
        clearInterval(scaleChangeInterval);
    });
    // -----------------------------------------------End __of plusButton


    // -----------------------------------------------Start of imgScale
    // <TODO> Boyung:
    $imgScale.on('input', function() {
        currentScale = Number($imgScale.val());
        reDraw(this.value);
    });
    // -----------------------------------------------End __of imgScale


    initCanvas();
    $(window).resize(function() {
        initCanvas();
        $modal.fadeOut(s.fadeDuration);
    }).on('keydown', function() {
        $modal.fadeOut(s.fadeDuration);
    });

});
