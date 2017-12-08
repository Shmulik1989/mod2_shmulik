function DataHandler() { //Single source of truth where all of our data is stored //
    this.chamber = "";
    this.jsonURL = "";
    this.members = [];
    this.statistics = {

        'membersRep': 0,
        'membersDem': 0,
        'membersIn': 0,
        'averageRep': 0,
        'averageDem': 0,
        'averageIn': 0,
        'bottomTenVotes': 0,
        'topTenVotes': 0,
        'topTenMissed': 0,
        'bottomTenMissed': 0
    }
    this.init = function() {
        console.log('initilizing')
        //1.find on which page we are
        this.chamber = $("body").data("congress");
        this.jsonURL = "data/congress-113-" + this.chamber + ".json";

        console.log(this.jsonURL + " defined");
        this.loadMembers();
    }
    // 2. Depending on the Page, we load data into var
    this.loadMembers = function() {
        var that = this;
        $.getJSON(this.jsonURL, function(response) {
            that.members = response.results[0].members;
            that.collectStats();
            that.tenPrecent('missed_votes_pct', 'bottomTenMissed', 'topTenMissed');
            that.tenPrecent('votes_with_party_pct', 'bottomTenVotes', 'topTenVotes');
            that.addToTable();
        });
    }
    // 3. collects the number of party members in each party and add them to the statistics object,collects the average precentege of republicans and democrats who votes with their parties.
    this.collectStats = function() {
        var that = this;
        $.each(this.members, function(index, element) {
            if (element.party == 'R') {
                that.statistics.membersRep++
                    that.statistics.averageRep += element.votes_with_party_pct
            } else if (element.party == 'D') {
                that.statistics.membersDem++
                    that.statistics.averageDem += element.votes_with_party_pct
            } else if (element.party = 'I') {
                that.statistics.membersIn++
                that.statistics.averageIn += element.votes_with_party_pct
            }
        });

        this.statistics.averageRep = this.statistics.averageRep / this.statistics.membersRep;
        this.statistics.averageDem = this.statistics.averageDem / this.statistics.membersDem;
        this.statistics.averageIn = this.statistics.averageIn / this.statistics.membersIn;
    }
    // 4. sorts the members votes & missed votes from bottom to top,calculates 10% from the total members.length(using Math.round to round the outcoming number) and adds the info to the statistics object. 
    this.tenPrecent = function(key, data1, data2) {
        var that = this;
        this.members.sort(function(a, b) {
            return a[key] - b[key];
        })

        var tenPrecentMembers = Math.round(this.members.length / 100) * 10;
        var bottomTen = this.members.slice(0, tenPrecentMembers);
        var topTen = this.members.slice(-tenPrecentMembers);

        this.statistics[data1] = bottomTen;
        this.statistics[data2] = topTen;

    }

    // 5.adds the gathered statistics(and rounds when needed using Math.round) to the HTML tables using id's.	

    this.addToTable = function() {
    	var that = this;
    	$('#repCount').text(this.statistics.membersRep)
    	$('#demCount').text(this.statistics.membersDem)
    	$('#inCount').text(this.statistics.membersIn)
    	$('#votedWithRep').text(Math.round(this.statistics.averageRep) + '%' ,this.statistics.averageRep)
    	$('#votedWithDem').text(Math.round(this.statistics.averageDem) + '%' ,this.statistics.averageDem)
    	$('#votedWithIn').text(Math.round(this.statistics.averageIn) + '%' ,this.statistics.averageIn)

    	$.each(this.statistics, function(index, val) {
    		 
    	});



    }

};
var dataInstance = new DataHandler();
$(function() {
dataInstance.init();
})