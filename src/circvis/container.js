Ext.ns('org.systemsbiology.visquick.circvis');

console.log('org.systemsbiology.visquick.circvis! available at:' + org.systemsbiology.visquick.circvis);

var CircvisContainer = Ext.extend(Object, {
    currentState: {},
    
    logo: {
       url: "https://visquick.googlecode.com/hg/src/images/logo.png", 
       label: "Circvis",
    },
    
    constructor: function(container) {
        console.log("org.systemsbiology.visquick.circvis.CircvisContainer(" + container + ")");
        Ext.apply(this, {contentEl:container});
    },

    draw: function(data, options) {
        console.log("org.systemsbiology.visquick.circvis.Container.draw(" + data + "," + options + ")");
        Ext.getDom(this.contentEl).innerHTML = "circvis.draw=>" + Ext.util.JSON.encode(data);
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