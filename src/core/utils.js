/* vq.utils.js */

/** @namespace The namespace for utility classes focused on visualization tools. **/
vq.utils = {};
/**
 *
 *
 * Used as a static class object to reserve a useful namespace.
 *
 * @class Provides a set of static functions for use in creating visualizations.
 * @namespace A set of simple functions for laying out visualizations rapidly.
 *
 */

vq.utils.VisUtils =  {};
    /**
     * Utility function for the creation of a div with specified parameters.  Useful in structuring interface for
     * multi-panel cooperating visualizations.
     *
     * @static
     * @param {String} id -  the id of the div to be created.
     * @param {String} [className] - the class of the created div
     * @param {String} [innerHTML] - text to be included in the div
     * @return divObj - a reference to the div (DOM) object
     *
     */
    vq.utils.VisUtils.createDiv = function(id, className, innerHtml) {
        var divObj;
        try {
            divObj = document.createElement('<div>');
        } catch (e) {
        }
        if (!divObj || !divObj.name) { // Not in IE, then
            divObj = document.createElement('div')
        }
        if (id) divObj.id = id;
        if (className) {
            divObj.className = className;
            divObj.setAttribute('className', className);
        }
        if (innerHtml) divObj.innerHTML = innerHtml;
        return divObj;
    };

    /**
     * Ext.ux.util.Clone Function
     * @param {Object/Array} o Object or array to clone
     * @return {Object/Array} Deep clone of an object or an array
     * @author Ing. Jozef Sak�lo?
     */
    vq.utils.VisUtils.clone = function(o) {
        if(!o || 'object' !== typeof o) {
            return o;
        }
        var c = '[object Array]' === Object.prototype.toString.call(o) ? [] : {};
        var p, v;
        for(p in o) {
            if(o.hasOwnProperty(p)) {
                v = o[p];
                if(v && 'object' === typeof v) {
                    c[p] = vq.utils.VisUtils.clone(v);
                }
                else {
                    c[p] = v;
                }
            }
        }
        return c;
    }; // eo function clone

vq.utils.VisUtils.get =  function(obj,prop) {
    var parts = prop.split('.');
    for(var i = 0; i < parts.length - 1; i++) {
        var p = parts[i];
        if(obj[p] === undefined) {
            obj[p] = {};
        }
        obj = obj[p];
    }
    p=parts[parts.length -1];
    return obj[p] === undefined ?  undefined : obj[p];
};



vq.utils.VisUtils.set = function(obj,prop,value) {
    var parts = prop.split('.');
    for(var i = 0; i < parts.length - 1; i++) {
        var p = parts[i];
        if(obj[p] === undefined) {
            obj[p] = {};
        }
        obj = obj[p];
    }
    p = parts[parts.length - 1];
    obj[p] = value || null;
    return this;
};

//sorting functions, etc

    vq.utils.VisUtils.alphanumeric = function(comp_a,comp_b) {	//sort order -> numbers -> letters
        if (isNaN(comp_a || comp_b))  { // a is definitely a non-integer
            if (isNaN( comp_b || comp_a)) {   // both are non-integers
                return [comp_a, comp_b].sort();   // sort the strings
            } else {                // just a is a non-integer
                return 1;           // b goes first
            }
        } else if (isNaN(comp_b || comp_a)) {  // only b is a non-integer
            return -1;          //a goes first
        } else {                                    // both are integers
            return Number(comp_a) - Number(comp_b);
        }
    },


//function network_node_id(node) { return node.nodeName + node.start.toFixed(4) + node.end.toFixed(4);};
    vq.utils.VisUtils.network_node_id = function(node) {
        var map = vq.utils.VisUtils.options_map(node);
        if (map != null && map['label'] != undefined)
        {return map['label'];}
        return node.nodeName + node['start'].toFixed(2) + node['end'].toFixed(2);
    };

//function network_node_id(node) { return node.nodeName + node.start.toFixed(4) + node.end.toFixed(4);};
    vq.utils.VisUtils.network_node_title = function(node) {
        var map = vq.utils.VisUtils.options_map(node);
        if (map != null && map['label'] != undefined)
        {return map['label'] + ' \n' +  'Chr: ' + node.nodeName +
                '\nStart: ' + node['start'] +
                '\nEnd: ' + node['end'];}
        return node.nodeName + ' ' +  node['start'].toFixed(2) + ' ' + node['end'].toFixed(2);
    };

//function tick_node_id(tick) { return tick.chr + tick.start.toFixed(4) + tick.end.toFixed(4);};
    vq.utils.VisUtils.tick_node_id = function(tick) { return tick.value;};

    vq.utils.VisUtils.class_type = {};

    "Boolean Number String Function Array Date RegExp Object Null".split(" ").forEach(function(name,index) {
            vq.utils.VisUtils.class_type[ "[object " + name + "]" ] = name.toLowerCase();
    });

    vq.utils.VisUtils.type = function(obj) {
                          return vq.utils.VisUtils.class_type[ Object.prototype.toString.call(obj) ] || "object";
    };

    vq.utils.VisUtils.extend = function(target,source) {
        var a, src, copy, clone, isArray, isObject;
    for (a in source) {
        src = target[a];
        copy = source[a];
         if ( target === copy ) { //prevent infinite loop
            continue;
         }

        if (source.hasOwnProperty(a)) {
            if ((isObject = (vq.utils.VisUtils.type(copy) == 'object')) ||(isArray = (vq.utils.VisUtils.type(copy) == 'array'))) {
                if (isObject) clone = (src && (vq.utils.VisUtils.type(src) == 'object')) ? src : {};
                else clone = (src && (vq.utils.VisUtils.type(src) == 'array')) ? src : [];
                target[a] = vq.utils.VisUtils.extend(clone,copy);
            } else if (copy !== undefined) {
                target[a] = copy;
            }
        }
    }
        return target;
};

    vq.utils.VisUtils.parse_pairs = function(column,assign_str,delimit_str) {
        var map = {}, pair_arr =[], pairs = [];
            pair_arr =[];
            pairs = column.split(delimit_str);
            for (var i=0;i< pairs.length; i++) {
                pair_arr = pairs[i].split(assign_str);
                if (pair_arr.length == 2) {
                    map[pair_arr[0]] = pair_arr[1];
                }
            }
        return map;
    };

    vq.utils.VisUtils.options_map = function(node) {
        var options_map = {};
        if (node.options != null) {
            options_map = vq.utils.VisUtils.parse_pairs(node.options,'=',',');
        }
        return options_map;
    };

    vq.utils.VisUtils.wrapProperty = function(property) {
        if (typeof property == 'function'){
            return property;
        } else {
            return function() {return property;}
        }
    };
vq.utils.VisUtils.pivotArray = function(array,pivot_on,group_by,value_id,aggregate_object,
                                        include_other_properties,filter_incomplete){

    var dims =  pv.uniq(array.map(function(c) { return c[pivot_on];})).sort();

    var nested_data = pv.nest(array)
            .key(function(d) { return d[group_by];})
            .map();

    var data = pv.values(nested_data).map(function(pivot_array){
        var new_object = {};
        if (include_other_properties) {
            new_object = vq.utils.VisUtils.clone(pivot_array[0]);
            delete new_object[value_id];
            delete new_object[pivot_on];}
        else {
            new_object[group_by] = pivot_array[0][group_by];
        }
        pivot_array.forEach(  function(pivot_object) {
            new_object[pivot_object[pivot_on]] = pivot_object[value_id];
        });

        if (aggregate_object) {
            switch(aggregate_object.operation) {
                case 'collect' :
                    new_object[aggregate_object.column] = pv.map(pivot_array, function(data) { return data[aggregate_object.column];});
                    break;
                case 'mean':
                    new_object[aggregate_object.column] = pv.mean(pivot_array, function(data) { return data[aggregate_object.column];});
                    break;
                case 'min':
                    new_object[aggregate_object.column] = pv.min(pivot_array, function(data) { return data[aggregate_object.column];});
                    break;
                case 'max':
                    new_object[aggregate_object.column] = pv.max(pivot_array, function(data) { return data[aggregate_object.column];});
                    break;
                case 'sum':
                default:
                    new_object[aggregate_object.column] = pv.sum(pivot_array, function(data) { return data[aggregate_object.column];});
            }
        }
        return new_object;
        //filter out any data points which are missing a year or more
    });
    if(filter_incomplete) data = data.filter(function(d) { return dims.every(function(dim) { return d[dim];} );});
    return data;

};

vq.utils.VisUtils.layoutChrTiles = function(tiles,overlap, max_level, treat_as_points) {
    var points = treat_as_points || Boolean(false);
    var new_tiles = [], chr_arr = [];
    chr_arr = pv.uniq(tiles, function(tile) { return tile.chr;});
    chr_arr.forEach(function(chr) {
        new_tiles = pv.blend([new_tiles,
                vq.utils.VisUtils.layoutTiles(tiles.filter(function(tile) { return tile.chr == chr;}),overlap,max_level,points)]);
    });
    tiles.forEach(function(tile) {
        var match = null,
        index= 0,
        props = pv.keys(tile);
        do {
             match = props.every(function(prop) { return ((tile[prop] == new_tiles[index][prop]) ||
                        (isNaN(tile[prop] && isNaN(new_tiles[index][prop])))) ? 1 : 0;});
            index++;
        }
      while (index < new_tiles.length && match != 1);
        tile.level = new_tiles[index-1].level;
    });
    return tiles;
};

vq.utils.VisUtils.layoutChrTicks = function(tiles,overlap,max_level) {
    return vq.utils.VisUtils.layoutChrTiles(tiles,overlap,max_level,true);
};

//tiles : {Array} of tiles.  tile is composed of start,end
// this returns an array with tile appended with a 'level' property representing a linear layout
// of non-overlapping Tiles

vq.utils.VisUtils.layoutTiles = function(tiles,overlap,max_level, treat_as_points){
    var points = treat_as_points || Boolean(false);
    tiles.forEach (function(b) { b.tile_length = (b.end - b.start);});  // generate a tile length property
    tiles = tiles.sort(function(a,b) { return (a.tile_length < b.tile_length) ? -1 :
            (a.tile_length > b.tile_length) ? 1 : a.start < b.start ? -1 : 1 ;}).reverse();         //sort all tiles by tile length
    if (tiles.length) {tiles[0].level = 0;}
    tiles.forEach(function(tile,index,array) {

        var levels = array.slice(0,index)
                .map(
                function(a){
                    var t1 = vq.utils.VisUtils.extend({},a);
                    var t2 = vq.utils.VisUtils.extend({},tile);
                    if(a.end == null)  t1.end = t2.start + 0.1;
                    else if(tile.end == null) t2.end = t2.start + 0.1;
                    return vq.utils.VisUtils._isOverlapping(t1,t2,overlap || 0, points) ? a.level : null;
                }
                );
        levels = levels.filter(function(a) { return a != null;}).sort(pv.naturalOrder);
        var find = 0, l_index =0;
        while (find >= levels[l_index]) {
            if (find == levels[l_index]) { find++;}
            l_index++;
        }
        if (max_level === undefined) { tile.level = find;}
        else
        {tile.level  = find <= max_level ? find : Math.floor(Math.random() * (max_level + 1));}
    });
    return tiles;
};

vq.utils.VisUtils._isOverlapping = function(tile1,tile2,overlap, treat_as_points) {
    var point = treat_as_points || Boolean(false);
    if (point) return ((tile1.start-overlap) <= tile2.start && (tile1.start + overlap) >= tile2.start);
    else
    return ((tile1.start-overlap) <= tile2.end && (tile1.end + overlap) >= tile2.start);
};

//taken from PrototypeJS


  vq.utils.VisUtils.cumulativeOffset = function (element) {
    var valueT = 0, valueL = 0;
    if (element.parentNode) {
      do {
        valueT += element.offsetTop  || 0;
        valueL += element.offsetLeft || 0;
        element = element.offsetParent;
      } while (element);
    }
    return {left : valueL, top: valueT};
  };

 vq.utils.VisUtils.viewportOffset = function(forElement) {
    var valueT = 0, valueL = 0, docBody = document.body;

    var element = forElement;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      if (element.offsetParent == docBody &&
        element.style.position == 'absolute') break;
    } while (element = element.offsetParent);

    element = forElement;
    do {
      if (element != docBody) {
        valueT -= element.scrollTop  || 0;
        valueL -= element.scrollLeft || 0;
      }
    } while (element = element.parentNode);
    return {left:valueL, top:valueT};
  };

vq.utils.VisUtils.scrollOffset = function (element) {
    var valueT = 0, valueL = 0;
      do {
        valueT += element.scrollTop  || 0;
  	    valueL += element.scrollLeft || 0;
      } while (element = element.parentNode);
    return {left : valueL, top: valueT};
  };

vq.utils.VisUtils.outerHTML = function(node){
        // if IE, Chrome take the internal method otherwise build one
        return node.outerHTML || (
                                 function(n){
                                     var div = document.createElement('div'), h;
                                     div.appendChild( n.cloneNode(true) );
                                     h = div.innerHTML;
                                     div = null;
                                     return h;
                                 })(node);
};

vq.utils.VisUtils.translateToReferenceCoord = function(coord,panel) {
    var offset = vq.utils.VisUtils.scrollOffset(panel.root.canvas());
    return {x:coord.x + offset.left,y:coord.y+offset.top};
};

/* found on stackoverflow.com
    credit to "broofa"
 */

vq.utils.VisUtils.guid = function() {
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
    });
};

vq.utils.VisUtils.openBrowserTab= function(url) {
        var new_window = window.open(url,'_blank');
        new_window.focus();
} ;

vq.utils.VisUtils.disabler = function(e) {
    if(e.preventDefault) { e.preventDefault();}
    return false;
};

vq.utils.VisUtils.disableSelect= function(el) {
       if(el.attachEvent){
        el.attachEvent("onselectstart",vq.utils.VisUtils.disabler);
    } else {
        el.addEventListener("selectstart",vq.utils.VisUtils.disabler,false);
    }
};

vq.utils.VisUtils.enableSelect = function(el){
    if(el.attachEvent){
        el.detachEvent("onselectstart",vq.utils.VisUtils.disabler);
    } else {
        el.removeEventListener("selectstart",vq.utils.VisUtils.disabler,false);
    }
};

vq.utils.VisUtils.insertGCFCode = function() {

    document.write(' \
<!--[if lt IE 9]> \
    <script type="text/javascript" \
     src="http://ajax.googleapis.com/ajax/libs/chrome-frame/1/CFInstall.min.js"></script> \
    <style> \
     .chromeFrameInstallDefaultStyle { \
       width: 100%;  \
       border: 5px solid blue; \
     } \
    </style> \
            <div id="notice"></div> \
            <div id="prompt"></div> \
    <script> \
          function displayGCFText() { \
            document.getElementById("notice").innerHTML = "Internet Explorer has been detected." + \
            "Please install the Google Chrome Frame if it is not already installed.  This will enable" + \
            "HTML5 features necessary for the web application.<p>"+ \
            "If the install panel does not appear, please enable Compatibility mode in your browser and reload this page."; \
            }; \
     window.attachEvent("onload", function() { \
       CFInstall.check({ \
         mode: "inline",  \
         node: "prompt" \
       }); \
     }); \
    </script> \
  <![endif]-->');
};

/**
 * @class Provides a set of static functions for use in converting
 * a google.visualization.DataTable object into a Protovis consumable
 * JSON array.
 *
 * Intended to be used as a static class object to reserve a useful namespace.
 *
 * For the Circvis project, the fundamental data element is <b>node</b> JSON object consisting of:
 *      {chromosome, start, end, value, options}
 *          {string} chromosome
 *          {integer} start
 *          {integer} end
 *          {string} value
 *          {string} options
 *
 *
 *
 */

vq.utils.GoogleDSUtils = {};

    /**     Converts any DataTable object into an array of JSON objects, each object consisting of a single row in the
     *      DataTable.  The property label is obtained from the getColumnLabel() function of the google.visualiztion.DataTable class.
     *
     *      Column types listed as a 'number' are passed in as numeric data.  All other data types are passed in as strings.
     *
     *      The returned JSON array conforms to the common input format of Protovis visualizations.
     *
     * @param googleDataTable - google.visualizations.DataTable object returned by a google datasource query
     * @return data_array - JSON array.
     */


    vq.utils.GoogleDSUtils.dataTableToArray = function(googleDataTable) {
        var table = googleDataTable,
        data_array=[],
        headers_array=[],
        column_type=[];
        if (table == null) { return [];}
        for (col=0; col<table.getNumberOfColumns(); col++){
            headers_array.push(table.getColumnLabel(col));
            column_type.push(table.getColumnType(col));
        }


        for (row=0; row<table.getNumberOfRows(); row++){
            var temp_hash={};
            for (col=0; col<table.getNumberOfColumns(); col++){
                if(column_type[col].toLowerCase() == 'number') {
                    temp_hash[headers_array[col]]=table.getValue(row,col);
                } else {
                    temp_hash[headers_array[col]]=table.getFormattedValue(row,col);
                }
            }
            data_array.push(temp_hash);
        }
        return data_array;
    };

    /**
     *  Converts a special DataTable object into a network object used by CircVis.
     *  For a DataTable with fields: chr1, start1, end1, value1, options1, chr2, start2, end2, value2, options2, linkValue
     *  the function returns an array of JSON objects consisting of two <b>node</b> JSON objects and a <b>linkValue</b>:
     *  {node1,node2,linkValue}
     *
     *  The JSON array can then be passed into the NETWORK.DATA.data_array parameter used to configure Circvis.
     *
     * @param googleDataTable - google.visualizations.DataTable object returned by a google datasource query
     * @returns network_json_array - a JSON array representation of a Google Visualizations DataTable object. The column label is assigned as the property label
     */

    vq.utils.GoogleDSUtils.dataTableToNetworkArray = function(googleDataTable) {
        var data_array = this.dataTableToArray(googleDataTable);
        return data_array.map(function(c) { return {node1 : {chr:c['chr1'],start:c['start1'],end:c['end1'],value:c['value1'],options:c['options1']},
        node2 : {chr:c['chr2'],start:c['start2'],end:c['end2'],value:c['value2'],options:c['options2']}, linkValue:c['linkValue']};});
    };

    /** @private */
    vq.utils.GoogleDSUtils.getColIndexByLabel = function(table,label) {
        for (col = 0; col < table.getNumberOfColumns(); col++) {
            if (label.toLowerCase() == table.getColumnLabel(col).toLowerCase()) {
                return col;
            }
        }
        return -1;
    };


/**
 * @class Constructs a utility object for use with multiple-source Ajax requests.
 * If data must be retrieved from several sources before a workflow may be started, this tool can be used to
 * check that all necessary data is available.
 *
 * @param {integer} timeout number of milliseconds between checks for valid data.  Defaults to 200ms.
 * @param {total_checks}  total number of checks to perform. Defaults to 20.
 * @param {callback}    function to call if all data is successfully found
 * @param {args}    an object containing the variables which will be assigned values by the Ajax responses.
 * @param {args}    function called if timeout reached without check object being filled.
 */

vq.utils.SyncDatasources = function(timeout,total_checks,success_callback,args,fail_callback){

        if (timeout && !isNaN(timeout)) {
            this.timeout = timeout;
        } else {
            this.timeout = 200;
        }
        if (total_checks && !isNaN(total_checks)) {
            this.num_checks_until_quit = total_checks;
        } else {
            this.num_checks_until_quit = 20;
        }
        if (args instanceof Object) {
            this.args = args;
        } else {
            console.log('Error: variable array not passed to timer initialize method.');
            return;
        }
        if (success_callback instanceof Function) {
            this.success_callback = success_callback
        } else {
            console.log('Error: callback function not passed to timer initialize method.');
            return;
        }
     if (fail_callback instanceof Function) {
            this.fail_callback = fail_callback
        }
        this.num_checks_so_far = 0;
    };

    /**
     * Initiates the data object poll.  After the maximum number of checks, a log is filed on the console and the object
     *  aborts the polling operation.
     */

    vq.utils.SyncDatasources.prototype.start_poll = function() {
        var that = this;
        setTimeout(function() { that.poll_args();},that.timeout);
    };

    /** @private */
    vq.utils.SyncDatasources.prototype.check_args = function(){
        var check = true;
        for (var arg in this.args) {
            if (this.args[arg] == null) { check = false;}
        }
        return check;
    };

    /** @private */
    vq.utils.SyncDatasources.prototype.poll_args = function(){
        var that=this;
        if (this.check_args()) { this.success_callback.apply(); return false;}
        this.num_checks_so_far++;
        if(this.num_checks_so_far >= this.num_checks_until_quit) {
            console.log('Maximum number of polling events reached.  Datasets not loaded.  Aborting.');
            if (this.fail_callback === undefined) { return false;}
            else {this.fail_callback.apply(); return false;}
        }
        setTimeout(function() { that.poll_args();},that.timeout);
    };


/**
 * @class Constructs a utility object for use with multiple-source Ajax requests.
 * If data must be retrieved from several sources before a workflow may be started, this tool can be used to
 * check that all callbacks have been made at least once.
 *
 * @param {callback}    function to call if all callbacks are made
 * @param {scope}       scope to make callback under
 * @param {optional}     pass additional arguments for callback
 */

vq.utils.SyncCallbacks = function(callback,scope){
    var success_cb;

    if (callback instanceof Function) {
        success_cb = callback;
    } else {
        console.error('Error: callback function not passed to SynchCallbacks initializer.');
        return;
    }

    var cb_hash = {};
    var args = [];
    //preserve additional arguments for later callback
    for (var i=2;i<arguments.length;i++) {
        args.push(arguments[i]);
    }

    return {
        add : function(cb,cb_scope) {
            // is it really a callback function?
            if (!(cb instanceof Function)) { return null; }
            //generate unique id for hash key for this callback function
            var id = vq.utils.VisUtils.guid();
            //initialize counter to 0 for this callback function
            cb_hash[id] = 0;
            return function() {
                //be sure to pass response into handler
                cb.apply(cb_scope,arguments);
                cb_hash[id] += 1;
                var count = 0;
                //how many callback functions is this object currently tracking?
                var total = Object.keys(cb_hash).length;
                //count how many values are 1 or greater
                Object.keys(cb_hash).forEach(function(k) { count += (cb_hash[k] > 0 ? 1 : 0);});
                //if all values are 1 or greater, hit final callback
                if (count >= total) success_cb.apply(scope,args);
            };
        }
    };
};


//Jason Davies
// https://github.com/jasondavies/science.js

// Based on org.apache.commons.math.analysis.interpolation.LoessInterpolator
// from http://commons.apache.org/math/
vq.utils.Stats = {};

vq.utils.Stats.loess = function() {    
  var bandwidth = .3,
      robustnessIters = 2,
      accuracy = 1e-12;

  function smooth(xval, yval, weights) {
    var n = xval.length,
        i;

    if (n !== yval.length) throw {error: "Mismatched array lengths"};
    if (n == 0) throw {error: "At least one point required."};

    if (arguments.length < 3) {
      weights = [];
      i = -1; while (++i < n) weights[i] = 1;
    }

    // science_stats_loessFiniteReal(xval);
    // science_stats_loessFiniteReal(yval);
    // science_stats_loessFiniteReal(weights);
    // science_stats_loessStrictlyIncreasing(xval);

    if (n == 1) return [yval[0]];
    if (n == 2) return [yval[0], yval[1]];

    var bandwidthInPoints = Math.floor(bandwidth * n);

    if (bandwidthInPoints < 2) throw {error: "Bandwidth too small."};

    var res = [],
        residuals = [],
        robustnessWeights = [];

    // Do an initial fit and 'robustnessIters' robustness iterations.
    // This is equivalent to doing 'robustnessIters+1' robustness iterations
    // starting with all robustness weights set to 1.
    i = -1; while (++i < n) {
      res[i] = 0;
      residuals[i] = 0;
      robustnessWeights[i] = 1;
    }

    var iter = -1;
    while (++iter <= robustnessIters) {
      var bandwidthInterval = [0, bandwidthInPoints - 1];
      // At each x, compute a local weighted linear regression
      var x;
      i = -1; while (++i < n) {
        x = xval[i];

        // Find out the interval of source points on which
        // a regression is to be made.
        if (i > 0) {
          science_stats_loessUpdateBandwidthInterval(xval, weights, i, bandwidthInterval);
        }

        var ileft = bandwidthInterval[0],
            iright = bandwidthInterval[1];

        // Compute the point of the bandwidth interval that is
        // farthest from x
        var edge = (xval[i] - xval[ileft]) > (xval[iright] - xval[i]) ? ileft : iright;

        // Compute a least-squares linear fit weighted by
        // the product of robustness weights and the tricube
        // weight function.
        // See http://en.wikipedia.org/wiki/Linear_regression
        // (section "Univariate linear case")
        // and http://en.wikipedia.org/wiki/Weighted_least_squares
        // (section "Weighted least squares")
        var sumWeights = 0,
            sumX = 0,
            sumXSquared = 0,
            sumY = 0,
            sumXY = 0,
            denom = Math.abs(1 / (xval[edge] - x));

        for (var k = ileft; k <= iright; ++k) {
          var xk   = xval[k],
              yk   = yval[k],
              dist = k < i ? x - xk : xk - x,
              w    = science_stats_loessTricube(dist * denom) * robustnessWeights[k] * weights[k],
              xkw  = xk * w;
          sumWeights += w;
          sumX += xkw;
          sumXSquared += xk * xkw;
          sumY += yk * w;
          sumXY += yk * xkw;
        }

        var meanX = sumX / sumWeights,
            meanY = sumY / sumWeights,
            meanXY = sumXY / sumWeights,
            meanXSquared = sumXSquared / sumWeights;

        var beta = (Math.sqrt(Math.abs(meanXSquared - meanX * meanX)) < accuracy)
            ? 0 : ((meanXY - meanX * meanY) / (meanXSquared - meanX * meanX));

        var alpha = meanY - beta * meanX;

        res[i] = beta * x + alpha;
        residuals[i] = Math.abs(yval[i] - res[i]);
      }

      // No need to recompute the robustness weights at the last
      // iteration, they won't be needed anymore
      if (iter === robustnessIters) {
        break;
      }

      // Recompute the robustness weights.

      // Find the median residual.
      var sortedResiduals = residuals.slice();
      sortedResiduals.sort(function(a,b) { return a-b;});
      var medianResidual = sortedResiduals[Math.floor(n / 2)];

      if (Math.abs(medianResidual) < accuracy)
        break;

      var arg,
          w;
      i = -1; while (++i < n) {
        arg = residuals[i] / (6 * medianResidual);
        robustnessWeights[i] = (arg >= 1) ? 0 : ((w = 1 - arg * arg) * w);
      }
    }

    return res;
  }

  smooth.bandwidth = function(x) {
    if (!arguments.length) return x;
    bandwidth = x;
    return smooth;
  };

  smooth.robustnessIterations = function(x) {
    if (!arguments.length) return x;
    robustnessIters = x;
    return smooth;
  };

  smooth.accuracy = function(x) {
    if (!arguments.length) return x;
    accuracy = x;
    return smooth;
  };

  return smooth;
};

function science_stats_loessFiniteReal(values) {
  var n = values.length,
      i = -1;

  while (++i < n) if (!isFinite(values[i])) return false;

  return true;
}

function science_stats_loessStrictlyIncreasing(xval) {
  var n = xval.length,
      i = 0;

  while (++i < n) if (xval[i - 1] >= xval[i]) return false;

  return true;
}

// Compute the tricube weight function.
// http://en.wikipedia.org/wiki/Local_regression#Weight_function
function science_stats_loessTricube(x) {
  return (x = 1 - x * x * x) * x * x;
}

// Given an index interval into xval that embraces a certain number of
// points closest to xval[i-1], update the interval so that it embraces
// the same number of points closest to xval[i], ignoring zero weights.
function science_stats_loessUpdateBandwidthInterval(
  xval, weights, i, bandwidthInterval) {

  var left = bandwidthInterval[0],
      right = bandwidthInterval[1];

  // The right edge should be adjusted if the next point to the right
  // is closer to xval[i] than the leftmost point of the current interval
  var nextRight = science_stats_loessNextNonzero(weights, right);
  if ((nextRight < xval.length) && (xval[nextRight] - xval[i]) < (xval[i] - xval[left])) {
    var nextLeft = science_stats_loessNextNonzero(weights, left);
    bandwidthInterval[0] = nextLeft;
    bandwidthInterval[1] = nextRight;
  }
}

function science_stats_loessNextNonzero(weights, i) {
  var j = i + 1;
  while (j < weights.length && weights[j] === 0) j++;
  return j;
}
