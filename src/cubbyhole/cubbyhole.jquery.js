!function($) {
    $.fn.cubbyhole = function(options) {
        return this.each(function() {
            var $this = $(this);
            var vis = $(this).data("visquick.cubbyhole");
            if (!vis) {
                options.CONTENTS.PLOT.container = $this.get(0);
                $this.data("visquick.cubbyhole", (vis = new vq.CubbyHole()));
                vis.draw(options);
            }
        });
    };
}(window.jQuery);
