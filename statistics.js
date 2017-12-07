function DataHandler() { 

    this.chamber = "";
    this.jsonURL = "";
    this.members = [];

};
this.init = function() {

        console.log('initilizing')
        //1.find on which page we are
        this.chamber = $("body").data("congress");
        this.jsonURL = "data/congress-113-" + this.chamber + ".json";

        console.log(this.jsonURL + " loaded");
        this.loadMembers();
    }
    // 2. Depending on the Page, we load data into var
    this.loadMembers = function() {
        var that = this;
        $.getJSON(that.jsonURL, function(response) {
            that.members = results[0].members;
        });
    }

var dataHandler = new DataHandler();

$(function() {
    dataHandler.init();
})