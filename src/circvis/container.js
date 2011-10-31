Ext.ns('org.systemsbiology.visquick.circvis');

console.log('org.systemsbiology.visquick.circvis! available at:' + org.systemsbiology.visquick.circvis);

var CircvisContainer = Ext.extend(Object, {
    currentState: {},
    assembledData: {},

    logo: {
        url: "https://visquick.googlecode.com/hg/src/images/logo.png",
        label: "Circvis"
    },

    constructor: function(container) {
        console.log("org.systemsbiology.visquick.circvis.CircvisContainer(" + container + ")");
        Ext.apply(this, {contentEl:container});
    },

    draw: function(data, options) {
        console.log("org.systemsbiology.visquick.circvis.Container.draw(" + data + "," + options + ")");

        this.assembledData.chrom_keys = data.chrom_keys;

        Ext.Ajax.request({ url: data.main, method: "get", success: function(o) {
            this.assembledData['network'] = Ext.util.JSON.decode(o.responseText);
            this.assemble();
        }, scope: this })
    },

    assemble: function() {
        if (this.assembledData["unlocated"] == null) {
            return;
        }

        if (this.assembledData["features"] == null) {
            return;
        }

        if (this.assembledData["cytoband"] == null) {
            return;
        }

        if (this.assembledData["network"] == null) {
            return;
        }

        var width = 800;
        var height = 800;
        var ring_radius = width / 20;
        var stroke_style = getStrokeStyleAttribute();

        var karyotype_tooltip_items = {
            'Karyotype Label' : function(feature) {
                return  vq.utils.VisUtils.options_map(feature)['label'];
            },
            Location :  function(feature) {
                return 'Chr' + feature.chr + ' ' + feature.start + '-' + feature.end;
            }
        };

        var unlocated_tooltip_items = {
            Target :  function(feature) {
                return feature.sourceNode.source + ' ' + feature.sourceNode.label +
                    (feature.sourceNode.chr ? ' Chr' + feature.sourceNode.chr : '') +
                    (feature.sourceNode.start ? ' ' + feature.sourceNode.start : '') +
                    (feature.sourceNode.end ? '-' + feature.sourceNode.end : '') + ' ' +
                    feature.sourceNode.label_mod;
            },
            Predictor :  function(feature) {
                return feature.targetNode.source + ' ' + feature.targetNode.label +
                    (feature.targetNode.chr ? ' Chr' + feature.targetNode.chr : '') +
                    (feature.targetNode.start ? ' ' + feature.targetNode.start : '') +
                    (feature.targetNode.end ? '-' + feature.targetNode.end : '') + ' ' +
                    feature.targetNode.label_mod;
            }
        };

        var unlocated_map = vq.utils.VisUtils.clone(this.assembledData['unlocated']).filter(
            function(link) {
                return  link.node1.chr != '';
            }).map(
            function(link) {
                var node = vq.utils.VisUtils.extend(link.node2, { chr:link.node1.chr, start:link.node1.start,end:link.node1.end, value: 0});
                node.sourceNode = vq.utils.VisUtils.extend({}, link.node1);
                node.targetNode = vq.utils.VisUtils.extend({}, link.node2);
                return node;
            }).concat(vq.utils.VisUtils.clone(this.assembledData['unlocated']).filter(
            function(link) {
                return  link.node2.chr != '';
            }).map(function(link) {
                var node = vq.utils.VisUtils.extend(link.node1, { chr:link.node2.chr, start:link.node2.start,end:link.node2.end, value: 0});
                node.sourceNode = vq.utils.VisUtils.extend({}, link.node1);
                node.targetNode = vq.utils.VisUtils.extend({}, link.node2);
                return node;
            }));

        var loadedData = {
            GENOME: {
                DATA:{
                    key_order : this.assembledData.chrom_keys,
                    key_length : vq.utils.VisUtils.clone(chrome_length)
                },
                OPTIONS: {
                    radial_grid_line_width: 1,
                    label_layout_style : 'clock',
                    label_font_style : '18pt helvetica'
                }
            },
            TICKS : {
                DATA : {
                    data_array : vq.utils.VisUtils.clone(this.assembledData['features'])
                },
                OPTIONS :{
                    display_legend : false,
                    stroke_style :stroke_style,
                    fill_style : function(tick) {
                        return node_colors(tick.source);
                    },
                    tooltip_items : {Tick : function(node) {
                        return node.label + ' ' + node.source + ' Chr' + node.chr + ' ' + node.start +
                            '-' + node.end + ' ' + node.label_mod;
                    }}
                }
            },
            PLOT: {
                width : width,
                height :  height,
                horizontal_padding : 30,
                vertical_padding : 30,
                container : div,
                enable_pan : false,
                enable_zoom : false,
                show_legend: true,
                legend_include_genome : true,
                legend_corner : 'ne',
                legend_radius  : width / 15
            },
            WEDGE:[
                {
                    PLOT : {
                        height : ring_radius / 2,
                        type :   'karyotype'
                    },
                    DATA:{
                        data_array : this.assembledData.cytoband
                    },
                    OPTIONS: {
                        legend_label : 'Karyotype Bands' ,
                        legend_description : 'Chromosomal Karyotype',
                        outer_padding : 10,
                        tooltip_items : karyotype_tooltip_items
                    }
                },
                {
                    PLOT : {
                        height : ring_radius / 2,
                        type :   'scatterplot'
                    },
                    DATA:{
                        data_array : unlocated_map
                    },
                    OPTIONS: {
                        legend_label : 'Unmapped Feature Correlates' ,
                        legend_description : 'Feature Correlates with No Genomic Position',
                        outer_padding : 10,
                        base_value : 0,
                        min_value : -1,
                        max_value : 1,
                        radius : 4,
                        draw_axes : false,
                        shape:'dot',
                        fill_style  : function(feature) {
                            return link_sources_colors([feature.sourceNode.source,feature.targetNode.source]);
                        },
                        //stroke_style  : function(feature) {return link_sources_colors([feature.sourceNode.source,feature.targetNode.source]); },
                        stroke_style : stroke_style,
                        tooltip_items : unlocated_tooltip_items,
                        listener : initiateDetailsPopup
                    }
                }
            ],
            NETWORK:{
                DATA:{
                    data_array : this.assembledData['network']
                },
                OPTIONS: {
                    outer_padding : 15,
                    node_highlight_mode : 'isolate',
                    node_fill_style : 'ticks',
                    node_stroke_style : stroke_style,
                    link_line_width : 2,
                    node_key : function(node) {
                        return node['label'];
                    },
                    link_listener: initiateDetailsPopup,
                    link_stroke_style : function(link) {
                        return link_sources_colors([link.sourceNode.source,link.targetNode.source]);
                    },
                    constant_link_alpha : 0.7,
                    node_tooltip_items :  {
                        Node : function(node) {
                            return node.label + ' ' + node.source + ' Chr' + node.chr + ' ' + node.start + '-' + node.end + ' ' + node.label_mod;
                        }},
                    link_tooltip_items :  {
                        'Target' : function(link) {
                            return link.sourceNode.label + ' ' + link.sourceNode.source + ' Chr' + link.sourceNode.chr + ' ' + link.sourceNode.start +
                                '-' + link.sourceNode.end + ' ' + link.sourceNode.label_mod;
                        },
                        'Predictor' : function(link) {
                            return link.targetNode.label + ' ' + link.targetNode.source + ' Chr' + link.targetNode.chr + ' ' + link.targetNode.start +
                                '-' + link.targetNode.end + ' ' + link.targetNode.label_mod;
                        },
                        'Importance' : 'importance',
                        Correlation : 'correlation',
                        pvalue : 'pvalue'
                    }
                }
            }
        };

        var circle_vis = new vq.CircVis();
        circle_vis.draw({
            DATATYPE : "vq.models.CircVisData",
            CONTENTS : loadedData
        });

        return circle_vis;
    },

    GetState: function() {
        console.log("org.systemsbiology.visquick.circvis.Container.GetState(): TODO: gather state from contained visualization");
        return this.currentState;
    },

    SetState: function(state) {
        this.currentState = state;
        console.log("org.systemsbiology.visquick.circvis.Container.SetState(" + state + "): TODO: pass state on to contained visualization");
    }
});

org.systemsbiology.visquick.circvis.Container = CircvisContainer;

org.systemsbiology.pages.apis.events.MessageBus.fireEvent("publish", {
    key: "org.systemsbiology.visquick.circvis.Container",
    payload: org.systemsbiology.visquick.circvis.Container
});