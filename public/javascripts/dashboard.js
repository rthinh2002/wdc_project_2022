const displayvue = new Vue ({
    el: '#content',
    data:
    {
        organising: [],
        invitations: []
    },
    computed: {
        noEventsOrganising: function() {
            if (this.organising.length === 0) {
                return true;
            } else {
                return false;
            }
        },
        noEventsInvited: function() {
            if (this.invitations.length === 0) {
                return true;
            } else {
                return false;
            }
        },
    }
});

//function to retrieve the event that the user is hosting
function get_hosting_event() {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);
            displayvue.organising = JSON.parse(this.responseText);
        }
    };

    xhttp.open("POST", "/get_hosting_event", true);
    xhttp.send();
}

//function to retrieve the event that the user is attending
function get_attending_event() {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            displayvue.invitations = JSON.parse(this.responseText);
        }
    };

    xhttp.open("POST", "/get_attending_event", true);
    xhttp.send();
}