(function($){
    if (!$) {
        console.log('jQuery is required!');
        return false;
    }
    /**
     * [Vmodalpreviewer description]
     * @param {jQuery Object} element [the element which act as a modal Previewer]
     * @param {JS Object} options optional configurations
     */
    function Vmodalpreviewer(element, options) {
    	var z = this;
    	z.$element = element;
    	z.defaults = {
    		wrapper: '.VMPwrapper',
    		previewer: '.VMPpreviewer',
    		initSize: [800, 600],
    		pos: {
    			sx: 0,
    			sy: 0,
    			sw: initSize[0],
    			sh: initSize[1],
    			dx: 0,
    			dy: 0,
    			dw: initSize[0],
    			dh: initSize[1]
    		},

    	};
    	z.settings = $.extend({}, z.defaults, options);
    	z.img = new Image();
    }

})(jQuery);