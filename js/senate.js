function convertParty(party) {
    if (party == "R") {
        return "Republicans"
    } else if (party == "D") {
        return "Democrats"

    } else {
        return "Indipendent"
    }


}

function checkMidName(middleName) {
    if (middleName === null) {
        return "";
    } else {
        return middleName;


    }


}



var data = $.getJSON("data/pro_congress_113_senate.json", function(data) {
    console.log(data);
    var members = data.results[0].members


    for (var i = 0; i < members.length; i++) {
        var table = "<tr>"
        table += "<td>" + '<a href="' + members[i].url + '">' + members[i].first_name + " " + checkMidName(members[i].middle_name) + " " + members[i].last_nameH + "</td>"
        table += "<td>" + members[i].state + "</td>"
        table += "<td>" + convertParty(members[i].party) + "</td>"
        table += "<td>" + members[i].seniority + "</td>"
        table += "<td>" + members[i].votes_with_party_pct + "%</td>";
        table += "</tr>"

        $("#member-table").append(table);
    }

})