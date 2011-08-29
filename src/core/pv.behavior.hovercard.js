
/**
 *
 * @class provides an anchor div for a target object this is "in scope" or using the mouse cursor.
 *  The anchor div's location is used to instantiate a vq.Hovercard object that
 *  provides self_hover, moveable, pin-able and tools
 *
 *
 * The configuration object has the following options:
 *
 * <pre>
 *
 * {
 *  timeout : {Number} - number of milliseconds (ms) before the box is shown. Default is 1000,
 *  close_timeout : {Number} - number of milliseconds (ms) the box continues to appear after 'mouseout' - Default is 0,
 *  param_data : {Boolean} -  If true, the object explicitly passed into the function at event (mouseover) time is used as the
 *          data.  If false, the data point underlying the event source (panel, dot, etc) is used.  Default is false.
 *  on_mark : {Boolean} - If true, the box is placed in respect to the event source mark.  If false, the box is placed in
 *          respect to the cursor/mouse position.  Defaults to false.
 *
 * include_header : {Boolean} - Place Label/Value headers at top of box.  Defaults to true.
 * include_footer : {Boolean} - Place "Close" footer at bottom of box.  Defaults to false.
 * self_hover : {Boolean} - If true, the box will remain visible when the cursor is above it.  Creates the "hovercard" effect.
 *          The footer must be rendered to allow the user to close the box.  Defaults to false.
 * data_config : {Object} - Important!  This configures the content of the hovering box.  This object is identical to the
 *          "tooltip_items" configuration in Circvis.  Ex. { Chr : 'chr', Start : 'start', End : 'end'}.  Defaults to null
 * }
 *
 * </pre>
 *
 * @param opts {JSON Object} - Configuration object defined above.
 */


pv.Behavior.hovercard = function(opts) {

    var hovercard, anchor_div,target,relative_div;
    var hovercard_div_id =  'vq_hover';

    //list all hovercards that are visible, yet have not been persisted/pinned to the screen.
    function recoverHovercard() {
        var nodes =  document.body.childNodes;
        var body_length = nodes.length;
        var node_arr = [];
        for (var i =0; i< body_length; i++) {
            if (nodes.item(i).id && nodes.item(i).id.slice(0,'hovercard_'.length) == 'hovercard_' &&
                nodes.item(i).className != "" ) {
                node_arr.push(nodes.item(i));
            }
        }
        return node_arr;
    }

    return function(d) {
        var info = opts.param_data ? d : (this instanceof pv.Mark ? (this.data() ||  this.title()) : d);
        var hovercard_arr = recoverHovercard();
        // quit if there is already a temprorary hovercard on the window
        if (hovercard_arr.length > 0) {return;}

        var t= pv.Transform.identity, p = this.parent;
        do {
            t=t.translate(p.left(),p.top()).times(p.transform());
        } while( p=p.parent);

        var c = this.root.canvas();
        if (!document.getElementById(c.id+'_rel')) {
            relative_div = vq.utils.VisUtils.createDiv(c.id+'_rel');
            c.insertBefore(relative_div,c.firstChild);
            relative_div.style.position = "relative";
            relative_div.style.top = "0px";
            relative_div.style.zIndex=-1;
        }
        else {
            relative_div = document.getElementById(c.id+'_rel');
        }

        if (!document.getElementById(hovercard_div_id)) {
            anchor_div = vq.utils.VisUtils.createDiv(hovercard_div_id);
            relative_div.appendChild(anchor_div);
            anchor_div.style.position = "absolute";
            anchor_div.style.zIndex = -1;
        }
        else {
            anchor_div = document.getElementById(hovercard_div_id);
            if (anchor_div.parentNode.id != relative_div.id) {
                relative_div.appendChild(anchor_div);
            }
        }
        target = pv.event.target;
        opts.self_hover = true;
        opts.include_frame = true;
        opts.include_footer = true;
        opts.target = target;


        if(this.properties.width) {
            anchor_div.style.width =  opts.on_mark ? Math.ceil(this.width() * t.k) + 1 : 1;
            anchor_div.style.height =  opts.on_mark ? Math.ceil(this.height() * t.k) + 1 : 1;
        }
        else if (this.properties.radius) {
            var r = this.radius();
            t.x -= r;
            t.y -= r;
            anchor_div.style.height = anchor_div.style.width = Math.ceil(2 * r * t.k);
        }
        anchor_div.style.left = opts.on_mark ? Math.floor(this.left() * t.k + t.x) + "px" : Math.floor(this.parent.mouse().x  * t.k+ t.x)  + "px";
        anchor_div.style.top = opts.on_mark ? Math.floor(this.top() * t.k + t.y) + "px" : Math.floor(this.parent.mouse().y * t.k + t.y) + "px";
        opts.transform = t;

        hovercard = new vq.Hovercard(opts);
        hovercard.show(anchor_div,info);
    };
};

