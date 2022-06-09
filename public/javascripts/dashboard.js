const displayvue = new Vue ({
    el: '#content',
    data:
    {
        noEventsOrganising: false,
        noEventsInvited: false,
        organising: [],
        invitations: []
    }
});

//function to retrieve the event that the user is hosting
function get_hosting_event() {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);
            displayvue.organising = JSON.parse(this.responseText);
            if (Object.keys(displayvue.organising).length === 0) {
                displayvue.noEventsOrganising = true;
            } else {
                displayvue.noEventsOrganising = false;
            }
        }
    };

    xhttp.open("POST", "/events/get_hosting_event", true);
    xhttp.send();
}

//function to retrieve the event that the user is attending
function get_attending_event() {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            displayvue.invitations = JSON.parse(this.responseText);
            if (Object.keys(displayvue.invitations).length === 0) {
                displayvue.noEventsInvited = true;
            } else {
                displayvue.noEventsInvited = false;
            }
        }
    };

    xhttp.open("POST", "/events/get_attending_event", true);
    xhttp.send();
}