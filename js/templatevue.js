const vueinst = new Vue({
    el: '#app',
    data :
    {
        loggedin : false,
        baselink : "/wdc_project_2022/",
        desktop : true,
        Username : "User",
        changed : false,
        given : "",
        family : "",
        email : "",
        dob : "",
        admin : false,
        event : [ { date:'dd/mm/yyyy', place:'some place', details:'some details', admin:false, organiser:'Emily Weissman', title:'some name' },
                  { date:'dd/mm/yyyy', place:'that place', details:'this details', admin:false, organiser:'Jogn Smith', title:'this name' },
                  { date:'dd/mm/yyyy', place:'this place', details:'that details', admin:false, organiser:'Jane Doe', title:'the other name' } ],
        users : [ { firstname:'Emily', lastname:'Weissman', admin:true},
                  { firstname:'John', lastname:'Smith', admin:false},
                  { firstname:'Jane', lastname:'Doe', admin:true } ],
    },
});

function toTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function togglePword() {
    var items = document.querySelectorAll(".pw");

    for (var i = 0; i < items.length; i++) {
        if (items[i].type === "password") {
            items[i].type = "text";
        } else {
            items[i].type = "password";
        }
    }
}

