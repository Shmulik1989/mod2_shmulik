function DataHandler() {

    this.chamber = "";
    this.jsonURL = "";
    this.rawData = "";
    this.members = [];
    this.filterStatus = {
        "D": true,
        "I": true,
        "R": true,
        "state": ""
    };

    // 1. Find out on which page we are and store into vars
    this.init = function() {

        console.log('initilizing')

        this.chamber = $("body").data("congress");
        this.jsonURL = "data/congress-113-" + this.chamber + ".json";

        console.log(this.jsonURL + " loaded");
        this.loadStates();
        this.loadMembers();
        this.changeListener();

    }
    // 2. Depending on the Page, we load data into var & call createTable
    this.loadMembers = function() {
        var that = this;
        $.getJSON(that.jsonURL, function(response) {
            that.rawData = response;
            that.members = that.rawData.results[0].members;
            that.createTable();
        });
    }
    this.loadStates = function() {
        var that = this;
        $.getJSON('data/states.json', function(response) {
            var optionsArr = [];
            for (var i = 0; i < response.length; i++) {
                response[i]
                var option = $('<option>').attr('value', response[i].code).text(response[i].name);
                optionsArr.push(option);
            }
            $('#statesFilter').append(optionsArr);
        })
    };
    // 2.a. Converting data (Party)
    this.convertParty = function(party) {
        if (party == "R") {
            return "Republicans";
        } else if (party == "D") {
            return "Democrats";
        } else {
            return "Indipendent";
        }
    }
    // 3. Write var-data into table
    this.createTable = function() {
        var rowArray = [];
        var displayedMembers = this.filterMembers(this.members)
        console.log(displayedMembers)

        for (var i = 0; i < displayedMembers.length; i++) {

            var row = $("<tr>");
            var fullname = [displayedMembers[i].first_name, displayedMembers[i].middle_name, displayedMembers[i].last_name].join(" ").replace("  ", " ");
            var link = $("<a>").text(fullname).attr("href", displayedMembers[i].url);

            $("<td>").append(link).appendTo(row);
            $("<td>").text(this.convertParty(displayedMembers[i].party)).appendTo(row);
            $("<td>").text(displayedMembers[i].state).appendTo(row);
            $("<td>").addClass("text-left").text(displayedMembers[i].seniority).appendTo(row)
            $("<td>").addClass("text-left").text(displayedMembers[i].votes_with_party_pct + " \%").appendTo(row);
            rowArray.push(row);
        }
        $("table tbody").html("").append(rowArray);
    }
    // 4. Filter data with checkboxes (Parties)
    this.filterMembers = function(members) {
        console.log('filtering')
        var that = this;
        return members.filter(function(member) {
            //filter member by party
            if (that.filterStatus[member.party] == false) return false;
            //filter members by state
            if (that.filterStatus.state && member.state != that.filterStatus.state) return false;
            return true;

        })

    }

    this.changeListener = function() {
        var that = this;
        $("input, select").on('change', function() {
            // .. update the SSOT, 
            that.filterStatus.I = $("#I").is(':checked');
            that.filterStatus.R = $("#R").is(':checked');
            that.filterStatus.D = $("#D").is(':checked');
            that.filterStatus.state = $('#statesFilter').val();
            // .. call createTable
            that.createTable();

        })
    }
};

var dataHandler = new DataHandler();

$(function() {
    dataHandler.init();
})