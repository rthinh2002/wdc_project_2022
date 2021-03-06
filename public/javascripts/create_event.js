var createEvent = new Vue({
    el: '#createEvent',
    data: {
        eventWhat: '',
        eventWhere: '',
        dateCount: '0',
        guestCount: '0',
        dates: [ { date: '', dateID: 0 } ],
        guests: [ { name: '', email: '', guestID: 0 } ],
        rsvp: null,
        details: null,
        event_id: null
    },
    computed: {
        validEmail: function() {
            for (guest in this.guests) {
                var regex = /^[^\s@]+@([^\s@.]+\.)+[^\s@.]+$/;
                var currentEmail = this.guests[guest].email;
                if ( !(regex.test(currentEmail)) && currentEmail !== '' ) {
                    return false;
                }
            }
            return true;
        }
    },
    methods: {
        removeDate: function(dateIDtoRemove) {
            if (this.dates.length > 1) {
                for (item in this.dates) {
                    if (this.dates[item].dateID === dateIDtoRemove) {
                        this.dates.splice(item, 1);
                        return;
                    }
                }
            }
        },
        addDate: function() {
            this.dateCount++;
            var date = '';
            var newID = this.dateCount;
            this.dates.push( { date, newID } );
        },
        removeGuest: function(guestIDtoRemove) {
            if (this.guests.length > 1) {
                for (item in this.guests) {
                    if (this.guests[item].guestID === guestIDtoRemove) {
                        this.guests.splice(item, 1);
                        return;
                    }
                }
            }
        },
        addGuest: function() {
            this.guestCount++;
            var newID = this.guestCount;
            var name = '';
            var email = '';
            this.guests.push( { name, email, newID } );
        }
    }
});


function createNewEvent() {

    let newEvent = {
        eventName: createEvent.eventWhat,
        eventLocation: createEvent.eventWhere,
        eventDates: createEvent.dates.map(({ date }) => date),
        eventGuests: createEvent.guests.map(({name, email}) => ({name, email})),
        rsvp: createEvent.rsvp,
        details: createEvent.details
    };

    let errors = false;

    for (guest in newEvent.guests) {
        var regex = /^[^\s@]+@([^\s@.]+\.)+[^\s@.]+$/;
        var currentName = newEvent.guests[guest].name;
        var currentEmail = newEvent.guests[guest].email;
        if ( !regex.test(currentEmail) || currentName === '' ) {
            errors = false;
            // console.log('Incomplete guest detail');
            break;
        }
    }

    if (newEvent.eventName.length === 0 || newEvent.eventLocation.length === 0) {
        // console.log('Must provide event name and location');
        errors = true;
    }


    if (errors) {
        alert("Form incomplete");
        return;
    }

    checkGuests(newEvent);
}


function emailInvitations() {
    //var password = Math.random().toString(36).slice(-32);
    //console.log(password);

    for (guest in createEvent.guests) {

        let guestToEmail = {
            guest_id: createEvent.guests[guest].guestID,
            guest_name: createEvent.guests[guest].name,
            guest_email: createEvent.guests[guest].email,
            event_id: createEvent.event_id
        };

        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/comms/email_new_event");
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(guestToEmail));
    }
}


var currentDateGuest = 0;
var currentGuest = 0;

function addEventGuest(newEvent) {

    let event_guest = {
        email: newEvent.eventGuests[currentGuest].email,
        date: newEvent.eventDates[currentDateGuest],
        event_id: createEvent.event_id
    };

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(this.responseText);
            if (currentGuest !== createEvent.guests.length-1) {
                if (currentDateGuest === createEvent.dates.length-1) {
                    currentDateGuest = 0;
                    currentGuest++;
                } else {
                    currentDateGuest++;
                }
                addEventGuest(newEvent);
            } else if (currentGuest === createEvent.guests.length-1) {
                if (currentDateGuest === createEvent.dates.length-1) {
                    emailInvitations();
                    window.location="/app/dashboard.html";
                    //console.log("done!");
                } else {
                    currentDateGuest++;
                    addEventGuest(newEvent);
                }
            }
        } else if (this.readyState == 4 && this.status >= 400) {
            // console.log("Guest add failed");
        }
    };

    xhttp.open("POST", "/events/add_event_attendee");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(event_guest));
}

var currentDate = 0;

function addEventDate(newEvent) {

    let event_date = {
        event_id: createEvent.event_id,
        date: newEvent.eventDates[currentDate]
    };

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(this.responseText);
            if (currentDate === createEvent.dates.length-1) {
                addEventGuest(newEvent);
            } else {
                currentDate++;
                addEventDate(newEvent);
            }
        } else if (this.readyState == 4 && this.status >= 400) {
            // console.log("Date add failed");
        }
    };

    xhttp.open("POST", "/events/add_event_date");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(event_date));

}


function addEvent(newEvent) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // console.log("Event created successfully");
            createEvent.event_id = JSON.parse(this.responseText);
            addEventDate(newEvent);
        } else if (this.readyState == 4 && this.status >= 400) {
            // console.log("Event creation failed");
        }
    };

    xhttp.open("POST", "/events/create_new_event");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newEvent));
}

var currentGuest1 = 0;

function checkGuests(newEvent) {

    // console.log(newEvent.eventGuests[currentGuest1].name);
    var thisGuest = {
        name: newEvent.eventGuests[currentGuest1].name,
        email: newEvent.eventGuests[currentGuest1].email
    };

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // console.log("Guest added");
            if (currentGuest1 === createEvent.guests.length-1) {
                addEvent(newEvent);
            } else {
                currentGuest1++;
                checkGuests(newEvent);
            }
        } else if (this.readyState == 4 && this.status >= 400) {
            // console.log("Guest add failed");
        }
    };

    xhttp.open("POST", "/events/check_guest");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(thisGuest));
}
