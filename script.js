/* =====================================================
   TRACKMYBUS FINAL JAVASCRIPT
===================================================== */


/* =====================================================
   DATABASE
===================================================== */

const DB = {

    students: "trackmybus_students",

    drivers: "trackmybus_drivers",

    buses: "trackmybus_buses",

    payments: "trackmybus_payments",

    notices: "trackmybus_notices",

    currentUser: "trackmybus_current_user"

};



/* =====================================================
   DEFAULT DATABASE
===================================================== */

function initializeDatabase() {


    if (!localStorage.getItem(DB.students)) {

        localStorage.setItem(

            DB.students,

            JSON.stringify([

                {

                    id: "student01",

                    password: "1234",

                    name: "Awadhesh Kumar",

                    mobile: "9876543210",

                    email: "student@example.com",

                    course: "Computer Science",

                    bus: "UP32 BT 4589",

                    route: "Lucknow - College",

                    photo: ""

                }

            ])

        );

    }



    if (!localStorage.getItem(DB.drivers)) {

        localStorage.setItem(

            DB.drivers,

            JSON.stringify([

                {

                    id: "driver01",

                    password: "1234",

                    name: "Ramesh Yadav",

                    mobile: "9876543211",

                    email: "driver@example.com",

                    bus: "UP32 BT 4589",

                    experience: "8 Years",

                    photo: ""

                }

            ])

        );

    }



    if (!localStorage.getItem(DB.buses)) {

        localStorage.setItem(

            DB.buses,

            JSON.stringify([

                {

                    number: "UP32 BT 4589",

                    route: "Lucknow - College",

                    driver: "Ramesh Yadav",

                    status: "Running",

                    students: 42

                },

                {

                    number: "UP32 CT 7865",

                    route: "Sitapur Road - College",

                    driver: "Suresh Kumar",

                    status: "Running",

                    students: 35

                },

                {

                    number: "UP32 DT 1245",

                    route: "BKT - College",

                    driver: "Mohan Singh",

                    status: "Running",

                    students: 39

                },

                {

                    number: "UP32 ET 5621",

                    route: "Alambagh - College",

                    driver: "Raj Kumar",

                    status: "Running",

                    students: 31

                }

            ])

        );

    }



    if (!localStorage.getItem(DB.payments)) {

        localStorage.setItem(

            DB.payments,

            JSON.stringify([])

        );

    }



    if (!localStorage.getItem(DB.notices)) {

        localStorage.setItem(

            DB.notices,

            JSON.stringify([

                {

                    title:
                        "Bus 2 KM Away",

                    message:
                        "Your college bus is approximately 2 KM away.",

                    date:
                        "Today",

                    type:
                        "Transport"

                },

                {

                    title:
                        "Transport Update",

                    message:
                        "All buses are running normally.",

                    date:
                        "Today",

                    type:
                        "Transport"

                }

            ])

        );

    }

}



/* =====================================================
   STORAGE
===================================================== */

function getData(key) {

    try {

        return JSON.parse(
            localStorage.getItem(key)
        ) || [];

    }

    catch {

        return [];

    }

}


function saveData(key,data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}



/* =====================================================
   GLOBAL
===================================================== */

let currentUser = null;

let selectedRole = "student";

let publicMap = null;

let dashboardMap = null;

let gpsWatchId = null;



/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        initializeDatabase();

        loadSavedUser();

        initializePublicMap();

    }
);



/* =====================================================
   PUBLIC MAP
===================================================== */

function initializePublicMap() {


    const element =
        document.getElementById(
            "publicMap"
        );


    if (!element) return;

    if (typeof L === "undefined") return;


    publicMap =
        L.map("publicMap")
        .setView(
            [26.8467,80.9462],
            12
        );


    L.tileLayer(

        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",

        {

            maxZoom: 19,

            attribution:
                "© Esri"

        }

    ).addTo(publicMap);



    const buses = [

        [26.8467,80.9462],

        [26.8585,80.9325],

        [26.8295,80.9655],

        [26.8235,80.9185]

    ];


    buses.forEach(
        function(position) {

            const icon =
                L.divIcon({

                    className: "",

                    html:
                        `<div style="
                            width:42px;
                            height:42px;
                            border-radius:50%;
                            background:white;
                            border:3px solid #2563eb;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            font-size:23px;
                            box-shadow:0 5px 15px rgba(37,99,235,.35);
                        ">
                            🚌
                        </div>`,

                    iconSize:
                        [42,42],

                    iconAnchor:
                        [21,21]

                });


            L.marker(
                position,
                {icon:icon}
            )
            .addTo(publicMap);

        }
    );


    setTimeout(
        () =>
            publicMap.invalidateSize(),
        500
    );

}



/* =====================================================
   LOGIN
===================================================== */

function openLogin() {

    document
        .getElementById("authScreen")
        .classList.remove("hidden");

}


function closeLogin() {

    document
        .getElementById("authScreen")
        .classList.add("hidden");

}


function selectRole(role) {

    selectedRole = role;


    document
        .querySelectorAll(".role-tab")
        .forEach(
            btn => {

                btn.classList.toggle(
                    "active",
                    btn.dataset.role === role
                );

            }
        );

}



/* =====================================================
   LOGIN PROCESS
===================================================== */

function handleLogin(event) {

    event.preventDefault();


    const id =
        document
            .getElementById("loginId")
            .value
            .trim();


    const password =
        document
            .getElementById("loginPassword")
            .value
            .trim();


    let user = null;



    if (
        selectedRole ===
        "student"
    ) {

        user =
            getData(DB.students)
            .find(
                u =>
                    u.id === id &&
                    u.password === password
            );

    }



    if (
        selectedRole ===
        "driver"
    ) {

        user =
            getData(DB.drivers)
            .find(
                u =>
                    u.id === id &&
                    u.password === password
            );

    }



    if (
        selectedRole ===
        "admin"
    ) {

        if (
            id === "admin" &&
            password === "admin123"
        ) {

            user = {

                id: "admin",

                password: "admin123",

                name:
                    "System Administrator",

                role:
                    "admin",

                mobile:
                    "9876543210",

                email:
                    "admin@trackmybus.com",

                photo: ""

            };

        }

    }



    if (!user) {

        showToast(
            "Invalid ID or Password",
            "error"
        );

        return;

    }



    user.role =
        selectedRole;


    currentUser =
        user;


    localStorage.setItem(

        DB.currentUser,

        JSON.stringify(user)

    );


    document
        .getElementById("authScreen")
        .classList.add("hidden");


    document
        .getElementById("publicApp")
        .classList.add("hidden");


    document
        .getElementById("dashboardApp")
        .classList.remove("hidden");


    setupDashboard();


    showToast(
        "Login successful",
        "success"
    );

}



/* =====================================================
   SAVED LOGIN
===================================================== */

function loadSavedUser() {

    const saved =
        localStorage.getItem(
            DB.currentUser
        );


    if (!saved) return;


    try {

        currentUser =
            JSON.parse(saved);


        document
            .getElementById("publicApp")
            .classList.add("hidden");


        document
            .getElementById("dashboardApp")
            .classList.remove("hidden");


        setupDashboard();

    }

    catch {

        localStorage.removeItem(
            DB.currentUser
        );

    }

}



/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    localStorage.removeItem(
        DB.currentUser
    );


    currentUser = null;


    document
        .getElementById("dashboardApp")
        .classList.add("hidden");


    document
        .getElementById("publicApp")
        .classList.remove("hidden");


    showToast(
        "Logged out successfully",
        "success"
    );

}



/* =====================================================
   DASHBOARD SETUP
===================================================== */

function setupDashboard() {

    updateUserInfo();

    createSidebar();

    showPage("dashboard");

}



/* =====================================================
   USER INFO
===================================================== */

function updateUserInfo() {

    const name =
        currentUser.name ||
        "User";


    const role =
        capitalize(
            currentUser.role ||
            "User"
        );


    document
        .getElementById(
            "sidebarUserName"
        )
        .textContent =
        name;


    document
        .getElementById(
            "sidebarUserRole"
        )
        .textContent =
        role;


    document
        .getElementById(
            "topbarUserName"
        )
        .textContent =
        name;


    document
        .getElementById(
            "topbarUserRole"
        )
        .textContent =
        role;


    updateAvatar(
        "sidebarAvatar",
        currentUser.photo
    );


    updateAvatar(
        "topbarAvatar",
        currentUser.photo
    );

}


function updateAvatar(
    id,
    photo
) {

    const element =
        document.getElementById(id);


    if (!element) return;


    if (photo) {

        element.innerHTML =
            `<img src="${photo}">`;

    }

    else {

        element.innerHTML =
            "👤";

    }

}



/* =====================================================
   SIDEBAR
===================================================== */

function createSidebar() {

    const nav =
        document.getElementById(
            "sidebarNav"
        );


    let items = [];


    if (
        currentUser.role ===
        "student"
    ) {

        items = [

            ["dashboard","🏠","Dashboard"],

            ["map","📍","Live Bus Map"],

            ["payment","💳","Fee Payment"],

            ["history","📜","Payment History"],

            ["notifications","🔔","Notifications"],

            ["profile","👤","My Profile"]

        ];

    }


    else if (
        currentUser.role ===
        "driver"
    ) {

        items = [

            ["dashboard","🏠","Dashboard"],

            ["trip","🚌","Trip Control"],

            ["map","📍","Live Location"],

            ["notifications","🔔","Notifications"],

            ["profile","👤","My Profile"]

        ];

    }


    else {

        items = [

            ["dashboard","🏠","Dashboard"],

            ["students","🎓","Students"],

            ["drivers","👨‍✈️","Drivers"],

            ["buses","🚌","Buses"],

            ["fees","💳","Fees"],

            ["notifications","🔔","Notifications"],

            ["reports","📊","Reports"],

            ["profile","👤","Profile"]

        ];

    }



    nav.innerHTML =
        items
        .map(
            item => `

                <button
                    class="nav-item"
                    data-page="${item[0]}"
                    onclick="showPage('${item[0]}')"
                >

                    <span>
                        ${item[1]}
                    </span>

                    <span>
                        ${item[2]}
                    </span>

                </button>

            `
        )
        .join("");

}



/* =====================================================
   SHOW PAGE
===================================================== */

function showPage(page) {

    const content =
        document.getElementById(
            "pageContent"
        );


    document
        .querySelectorAll(".nav-item")
        .forEach(
            item => {

                item.classList.toggle(
                    "active",
                    item.dataset.page === page
                );

            }
        );


    const titles = {

        dashboard:
            [
                "Dashboard",
                "Transport overview"
            ],

        map:
            [
                "Live Bus Map",
                "Track buses live"
            ],

        payment:
            [
                "Fee Payment",
                "Transport fee"
            ],

        history:
            [
                "Payment History",
                "Previous transactions"
            ],

        notifications:
            [
                "Notifications",
                "Latest updates"
            ],

        profile:
            [
                "My Profile",
                "Account settings"
            ],

        trip:
            [
                "Trip Control",
                "Driver controls"
            ],

        students:
            [
                "Students",
                "Student management"
            ],

        drivers:
            [
                "Drivers",
                "Driver management"
            ],

        buses:
            [
                "Buses",
                "Bus management"
            ],

        fees:
            [
                "Fees",
                "Fee management"
            ],

        reports:
            [
                "Reports",
                "System reports"
            ]

    };


    document
        .getElementById(
            "pageTitle"
        )
        .textContent =
        titles[page]?.[0] ||
        "Dashboard";


    document
        .getElementById(
            "pageSubtitle"
        )
        .textContent =
        titles[page]?.[1] ||
        "";


    switch(page) {

        case "dashboard":

            content.innerHTML =
                dashboardPage();

            break;


        case "map":

            content.innerHTML =
                mapPage();

            setTimeout(
                initializeDashboardMap,
                300
            );

            break;


        case "payment":

            content.innerHTML =
                paymentPage();

            break;


        case "history":

            content.innerHTML =
                historyPage();

            break;


        case "notifications":

            content.innerHTML =
                notificationsPage();

            break;


        case "profile":

            content.innerHTML =
                profilePage();

            break;


        case "trip":

            content.innerHTML =
                tripPage();

            break;


        case "students":

            content.innerHTML =
                studentsPage();

            break;


        case "drivers":

            content.innerHTML =
                driversPage();

            break;


        case "buses":

            content.innerHTML =
                busesPage();

            break;


        case "fees":

            content.innerHTML =
                feesPage();

            break;


        case "reports":

            content.innerHTML =
                reportsPage();

            break;

    }

}



/* =====================================================
   STUDENT DASHBOARD
===================================================== */

function studentDashboard() {


    setTimeout(
        () => {

            showStudentBusAlert();

        },
        500
    );


    return `

        <div class="page-header">

            <h2>
                Hello,
                ${esc(currentUser.name)}
                👋
            </h2>

            <p>
                अपनी College Bus की Live Location देखें।
            </p>

        </div>



        <div class="stats-grid">


            <div class="stat-card">

                <div class="stat-card-top">

                    <span>
                        Bus Status
                    </span>

                    <div class="stat-icon">
                        🚌
                    </div>

                </div>

                <h3 style="color:#16a34a">
                    LIVE
                </h3>

                <p>
                    UP32 BT 4589
                </p>

            </div>



            <div class="stat-card">

                <div class="stat-card-top">

                    <span>
                        Distance
                    </span>

                    <div class="stat-icon">
                        📏
                    </div>

                </div>

                <h3>
                    2 KM
                </h3>

                <p>
                    Bus distance
                </p>

            </div>



            <div class="stat-card">

                <div class="stat-card-top">

                    <span>
                        ETA
                    </span>

                    <div class="stat-icon">
                        ⏱️
                    </div>

                </div>

                <h3>
                    5 Min
                </h3>

                <p>
                    Estimated arrival
                </p>

            </div>



            <div class="stat-card">

                <div class="stat-card-top">

                    <span>
                        Route
                    </span>

                    <div class="stat-icon">
                        🛣️
                    </div>

                </div>

                <h3>
                    Route 01
                </h3>

                <p>
                    College Route
                </p>

            </div>


        </div>



        <!-- LIVE BUS -->

        <div class="panel">


            <div class="panel-header">

                <h3>
                    🚌 Live Bus
                </h3>

                <span>
                    Updated now
                </span>

            </div>


            <div
                id="studentLiveMap"
                class="dashboard-map"
            >
            </div>


        </div>



        <!-- INFO -->

        <div class="dashboard-grid">


            <div class="panel">

                <div class="panel-header">

                    <h3>
                        🚌 Bus Information
                    </h3>

                </div>


                <p>
                    <b>Bus:</b>
                    UP32 BT 4589
                </p>


                <p>
                    <b>Driver:</b>
                    Ramesh Yadav
                </p>


                <p>
                    <b>Distance:</b>
                    2 KM
                </p>


                <p>
                    <b>Status:</b>

                    <span
                        class="badge badge-success"
                    >
                        Running
                    </span>

                </p>


            </div>



            <div class="panel">

                <div class="panel-header">

                    <h3>
                        🔔 Latest Notice
                    </h3>

                </div>


                <div class="notice-item">

                    <div class="notice-icon">
                        🚌
                    </div>


                    <div>

                        <h4>
                            Bus 2 KM Away
                        </h4>

                        <p>
                            आपकी Bus लगभग
                            2 KM दूर है।
                        </p>

                    </div>

                </div>

            </div>


        </div>

    `;

}



/* =====================================================
   DASHBOARD PAGE
===================================================== */

function dashboardPage() {

    if (
        currentUser.role ===
        "student"
    ) {

        return studentDashboard();

    }


    if (
        currentUser.role ===
        "driver"
    ) {

        return driverDashboard();

    }


    return adminDashboard();

}



/* =====================================================
   DRIVER DASHBOARD
===================================================== */

function driverDashboard() {

    return `

        <div class="page-header">

            <h2>
                Welcome,
                ${esc(currentUser.name)}
                🚗
            </h2>

            <p>
                Manage your trip and GPS.
            </p>

        </div>


        <div class="stats-grid">


            <div class="stat-card">

                <span>
                    Bus
                </span>

                <h3>
                    ${esc(
                        currentUser.bus ||
                        "UP32 BT 4589"
                    )}
                </h3>

                <p>
                    Assigned bus
                </p>

            </div>


            <div class="stat-card">

                <span>
                    Trip
                </span>

                <h3 id="tripStatus">
                    STOPPED
                </h3>

                <p>
                    Trip status
                </p>

            </div>


            <div class="stat-card">

                <span>
                    GPS
                </span>

                <h3 id="gpsStatus">
                    OFF
                </h3>

                <p>
                    GPS sharing
                </p>

            </div>


            <div class="stat-card">

                <span>
                    Students
                </span>

                <h3>
                    42
                </h3>

                <p>
                    Students
                </p>

            </div>


        </div>


        <div class="panel">


            <div class="panel-header">

                <h3>
                    Driver Controls
                </h3>

            </div>


            <button
                class="btn btn-primary"
                onclick="startTrip()"
            >
                ▶ Start Trip
            </button>


            <button
                class="btn btn-outline"
                onclick="startGPS()"
            >
                📡 Share GPS
            </button>


            <button
                class="btn"
                style="
                    background:#fee2e2;
                    color:#b91c1c;
                "
                onclick="stopTrip()"
            >
                ■ Stop Trip
            </button>


        </div>

    `;

}



/* =====================================================
   ADMIN DASHBOARD
===================================================== */

function adminDashboard() {

    const students =
        getData(DB.students);

    const drivers =
        getData(DB.drivers);

    const buses =
        getData(DB.buses);

    const payments =
        getData(DB.payments);


    return `

        <div class="page-header">

            <h2>
                Admin Dashboard 🛡️
            </h2>

            <p>
                Complete transport system overview.
            </p>

        </div>


        <div class="stats-grid">


            <div class="stat-card">

                <span>
                    Students
                </span>

                <h3>
                    ${students.length}
                </h3>

            </div>


            <div class="stat-card">

                <span>
                    Drivers
                </span>

                <h3>
                    ${drivers.length}
                </h3>

            </div>


            <div class="stat-card">

                <span>
                    Buses
                </span>

                <h3>
                    ${buses.length}
                </h3>

            </div>


            <div class="stat-card">

                <span>
                    Payments
                </span>

                <h3>
                    ${payments.length}
                </h3>

            </div>


        </div>



        <div class="panel">

            <div class="panel-header">

                <h3>
                    🚌 Bus Status
                </h3>

            </div>


            <div class="table-wrapper">

                <table class="data-table">

                    <thead>

                        <tr>

                            <th>
                                Bus
                            </th>

                            <th>
                                Route
                            </th>

                            <th>
                                Driver
                            </th>

                            <th>
                                Status
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${

                            buses.map(
                                bus => `

                                <tr>

                                    <td>
                                        ${esc(bus.number)}
                                    </td>

                                    <td>
                                        ${esc(bus.route)}
                                    </td>

                                    <td>
                                        ${esc(bus.driver)}
                                    </td>

                                    <td>

                                        <span
                                            class="badge badge-success"
                                        >
                                            ${esc(bus.status)}
                                        </span>

                                    </td>

                                </tr>

                                `
                            ).join("")

                        }

                    </tbody>

                </table>

            </div>

        </div>

    `;

}



/* =====================================================
   STUDENT LIVE MAP
===================================================== */

let studentLiveMap = null;

let studentBusMarkers = [];



function initializeStudentLiveMap() {


    const element =
        document.getElementById(
            "studentLiveMap"
        );


    if (!element) return;

    if (typeof L === "undefined") return;


    if (studentLiveMap) {

        studentLiveMap.remove();

    }


    studentBusMarkers = [];


    studentLiveMap =
        L.map("studentLiveMap")
        .setView(
            [26.8467,80.9462],
            12
        );


    L.tileLayer(

        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",

        {

            maxZoom: 19,

            attribution:
                "© Esri"

        }

    ).addTo(studentLiveMap);



    const buses = [

        {
            number:
                "UP32 BT 4589",

            lat:
                26.8467,

            lng:
                80.9462

        },

        {
            number:
                "UP32 CT 7865",

            lat:
                26.8585,

            lng:
                80.9325

        },

        {
            number:
                "UP32 DT 1245",

            lat:
                26.8295,

            lng:
                80.9655

        },

        {
            number:
                "UP32 ET 5621",

            lat:
                26.8235,

            lng:
                80.9185

        },

        {
            number:
                "UP32 FT 3390",

            lat:
                26.8725,

            lng:
                80.9555

        }

    ];



    buses.forEach(
        bus => {


            const icon =
                L.divIcon({

                    className:
                        "student-bus-icon",

                    html:
                        `<div style="
                            width:44px;
                            height:44px;
                            border-radius:50%;
                            background:white;
                            border:3px solid #2563eb;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            font-size:24px;
                            box-shadow:0 6px 18px rgba(37,99,235,.35);
                        ">
                            🚌
                        </div>`,

                    iconSize:
                        [44,44],

                    iconAnchor:
                        [22,22]

                });


            const marker =
                L.marker(

                    [
                        bus.lat,
                        bus.lng
                    ],

                    {
                        icon:
                            icon
                    }

                )
                .addTo(studentLiveMap);



            marker.bindTooltip(
                bus.number,
                {
                    direction:
                        "top",

                    offset:
                        [0,-20]
                }
            );


            studentBusMarkers.push({

                marker:
                    marker,

                lat:
                    bus.lat,

                lng:
                    bus.lng

            });

        }
    );



    const points =
        buses.map(
            bus => [
                bus.lat,
                bus.lng
            ]
        );


    const bounds =
        L.latLngBounds(points);


    studentLiveMap.fitBounds(
        bounds,
        {
            padding:
                [30,30]
        }
    );


    setTimeout(
        () =>
            studentLiveMap.invalidateSize(),
        500
    );


    startStudentBusMovement();

}



/* =====================================================
   STUDENT BUS MOVEMENT
===================================================== */

function startStudentBusMovement() {


    setInterval(
        function() {


            studentBusMarkers
                .forEach(
                    function(item) {


                        item.lat +=
                            (
                                Math.random()
                                - .5
                            ) * .001;


                        item.lng +=
                            (
                                Math.random()
                                - .5
                            ) * .001;


                        item.marker
                            .setLatLng(

                                [
                                    item.lat,
                                    item.lng
                                ]

                            );

                    }
                );


        },
        3000
    );

}



/* =====================================================
   STUDENT BUS ALERT
===================================================== */

function showStudentBusAlert() {


    const old =
        document.querySelector(
            ".bus-alert"
        );


    if (old) {

        old.remove();

    }


    const alert =
        document.createElement(
            "div"
        );


    alert.className =
        "bus-alert";


    alert.innerHTML = `

        <button
            onclick="
                this.parentElement.remove()
            "
        >
            ×
        </button>


        <div>

            <strong>
                🚌 Bus Alert
            </strong>

            <p>
                आपकी College Bus
                लगभग <b>2 KM</b> दूर है।
            </p>

            <small>
                कृपया Bus Stop पर तैयार रहें।
            </small>

        </div>

    `;


    document.body.appendChild(
        alert
    );


    setTimeout(
        () => {

            if (alert) {

                alert.remove();

            }

        },
        8000
    );

}



/* =====================================================
   MAP PAGE
===================================================== */

function mapPage() {

    return `

        <div class="page-header">

            <h2>
                All Buses Live Map
            </h2>

            <p>
                सभी college buses की live location.
            </p>

        </div>


        <div class="panel">

            <div
                id="mainDashboardMap"
                class="dashboard-map"
            >
            </div>

        </div>

    `;

}



function initializeDashboardMap() {


    const element =
        document.getElementById(
            "mainDashboardMap"
        );


    if (!element) return;


    if (dashboardMap) {

        dashboardMap.remove();

    }


    dashboardMap =
        L.map(
            "mainDashboardMap"
        )
        .setView(
            [26.8467,80.9462],
            12
        );


    L.tileLayer(

        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",

        {

            maxZoom:
                19,

            attribution:
                "© Esri"

        }

    ).addTo(
        dashboardMap
    );


    const locations = [

        [26.8467,80.9462],

        [26.8585,80.9325],

        [26.8295,80.9655],

        [26.8235,80.9185]

    ];


    locations.forEach(
        location => {

            L.marker(
                location,
                {

                    icon:
                        L.divIcon({

                            className:
                                "",

                            html:
                                `
                                <div style="
                                    width:44px;
                                    height:44px;
                                    background:white;
                                    border:3px solid #2563eb;
                                    border-radius:50%;
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                    font-size:24px;
                                ">
                                    🚌
                                </div>
                                `,

                            iconSize:
                                [44,44],

                            iconAnchor:
                                [22,22]

                        })

                }
            )
            .addTo(
                dashboardMap
            );

        }
    );


    setTimeout(
        () =>
            dashboardMap.invalidateSize(),
        400
    );

}



/* =====================================================
   PAYMENT
===================================================== */

function paymentPage() {

    return `

        <div class="page-header">

            <h2>
                Transport Fee Payment
            </h2>

            <p>
                Pay your college transport fee.
            </p>

        </div>


        <div class="panel">


            <div class="stats-grid">

                <div class="stat-card">

                    <span>
                        Total Fee
                    </span>

                    <h3>
                        ₹2,500
                    </h3>

                </div>


                <div class="stat-card">

                    <span>
                        Due
                    </span>

                    <h3>
                        ₹2,500
                    </h3>

                </div>

            </div>


            <div class="form-group">

                <label>
                    Amount
                </label>

                <input
                    id="paymentAmount"
                    type="number"
                    value="2500"
                >

            </div>


            <button
                class="btn btn-primary btn-full"
                onclick="makePayment()"
            >

                💳 Pay ₹2,500

            </button>


        </div>

    `;

}



function makePayment() {


    const amount =
        Number(
            document.getElementById(
                "paymentAmount"
            ).value
        );


    if (
        !amount ||
        amount <= 0
    ) {

        showToast(
            "Enter valid amount",
            "error"
        );

        return;

    }


    const payment = {

        id:
            "PAY" +
            Date.now(),

        studentId:
            currentUser.id,

        amount:
            amount,

        method:
            "UPI",

        date:
            new Date()
            .toLocaleDateString(
                "en-IN"
            ),

        status:
            "Success"

    };


    const payments =
        getData(DB.payments);


    payments.unshift(
        payment
    );


    saveData(
        DB.payments,
        payments
    );


    showToast(
        "Payment successful",
        "success"
    );

}



/* =====================================================
   PAYMENT HISTORY
===================================================== */

function historyPage() {


    const payments =
        getData(DB.payments)
        .filter(
            p =>
                p.studentId ===
                currentUser.id
        );


    return `

        <div class="page-header">

            <h2>
                Payment History
            </h2>

            <p>
                Your previous payments.
            </p>

        </div>


        <div class="panel">


            <div class="table-wrapper">

                <table class="data-table">


                    <thead>

                        <tr>

                            <th>
                                Receipt
                            </th>

                            <th>
                                Amount
                            </th>

                            <th>
                                Date
                            </th>

                            <th>
                                Status
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            payments.length

                            ?

                            payments
                            .map(
                                p => `

                                <tr>

                                    <td>
                                        ${p.id}
                                    </td>

                                    <td>
                                        ₹${p.amount}
                                    </td>

                                    <td>
                                        ${p.date}
                                    </td>

                                    <td>

                                        <span
                                            class="badge badge-success"
                                        >
                                            ${p.status}
                                        </span>

                                    </td>

                                </tr>

                                `
                            )
                            .join("")

                            :

                            `
                            <tr>
                                <td colspan="4">
                                    No payments found.
                                </td>
                            </tr>
                            `

                        }

                    </tbody>


                </table>

            </div>


        </div>

    `;

}



/* =====================================================
   NOTIFICATIONS
===================================================== */

function notificationsPage() {


    const notices =
        getData(DB.notices);


    return `

        <div class="page-header">

            <h2>
                Notifications
            </h2>

            <p>
                Latest transport notifications.
            </p>

        </div>


        <div class="panel">

            <div class="notice-list">


                ${

                    notices
                    .map(
                        notice => `

                        <div class="notice-item">

                            <div class="notice-icon">
                                🔔
                            </div>

                            <div>

                                <h4>
                                    ${esc(
                                        notice.title
                                    )}
                                </h4>

                                <p>
                                    ${esc(
                                        notice.message
                                    )}
                                </p>

                                <small>
                                    ${esc(
                                        notice.date
                                    )}
                                </small>

                            </div>

                        </div>

                        `
                    )
                    .join("")

                }


            </div>

        </div>

    `;

}



/* =====================================================
   PROFILE
===================================================== */

function profilePage() {


    return `

        <div class="page-header">

            <h2>
                My Profile
            </h2>

            <p>
                Manage your profile information.
            </p>

        </div>


        <div class="profile-grid">


            <div class="profile-card">


                <div
                    id="profilePhotoPreview"
                    class="profile-photo"
                >

                    ${
                        currentUser.photo

                        ?

                        `<img
                            src="${currentUser.photo}"
                        >`

                        :

                        `👤`
                    }

                </div>


                <h3>
                    ${esc(
                        currentUser.name
                    )}
                </h3>


                <p>
                    ${capitalize(
                        currentUser.role
                    )}
                </p>


                <div class="photo-buttons">


                    <label
                        class="small-btn"
                    >

                        📷 Upload Photo

                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onchange="uploadPhoto(event)"
                        >

                    </label>


                    <button
                        class="small-btn"
                        onclick="removePhoto()"
                    >

                        Remove

                    </button>


                </div>


            </div>



            <div class="panel">


                <h3>
                    Personal Information
                </h3>


                <br>


                <div class="form-row">


                    <div class="form-group">

                        <label>
                            Name
                        </label>

                        <input
                            id="profileName"
                            value="${esc(
                                currentUser.name
                            )}"
                        >

                    </div>


                    <div class="form-group">

                        <label>
                            Mobile
                        </label>

                        <input
                            id="profileMobile"
                            value="${esc(
                                currentUser.mobile
                            )}"
                        >

                    </div>


                </div>



                <div class="form-group">

                    <label>
                        Email
                    </label>

                    <input
                        id="profileEmail"
                        value="${esc(
                            currentUser.email
                        )}"
                    >

                </div>



                <button
                    class="btn btn-primary"
                    onclick="saveProfile()"
                >

                    💾 Save Changes

                </button>


                <button
                    class="btn btn-outline"
                    onclick="changePassword()"
                >

                    🔒 Change Password

                </button>


            </div>


        </div>

    `;

}



/* =====================================================
   PHOTO UPLOAD
===================================================== */

function uploadPhoto(event) {


    const file =
        event.target.files[0];


    if (!file) return;


    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        showToast(
            "Please select an image",
            "error"
        );

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function(e) {


            currentUser.photo =
                e.target.result;


            saveCurrentUser();


            updateAvatar(
                "sidebarAvatar",
                currentUser.photo
            );


            updateAvatar(
                "topbarAvatar",
                currentUser.photo
            );


            showPage(
                "profile"
            );


            showToast(
                "Photo uploaded successfully",
                "success"
            );

        };


    reader.readAsDataURL(
        file
    );

}



function removePhoto() {

    currentUser.photo = "";


    saveCurrentUser();


    updateAvatar(
        "sidebarAvatar",
        ""
    );


    updateAvatar(
        "topbarAvatar",
        ""
    );


    showPage(
        "profile"
    );


    showToast(
        "Photo removed",
        "success"
    );

}



/* =====================================================
   SAVE PROFILE
===================================================== */

function saveProfile() {


    currentUser.name =
        document
            .getElementById(
                "profileName"
            )
            .value
            .trim();


    currentUser.mobile =
        document
            .getElementById(
                "profileMobile"
            )
            .value
            .trim();


    currentUser.email =
        document
            .getElementById(
                "profileEmail"
            )
            .value
            .trim();


    saveCurrentUser();


    updateUserInfo();


    showToast(
        "Profile updated",
        "success"
    );

}



function saveCurrentUser() {


    localStorage.setItem(

        DB.currentUser,

        JSON.stringify(
            currentUser
        )

    );


    if (
        currentUser.role ===
        "student"
    ) {

        const students =
            getData(DB.students);


        const index =
            students.findIndex(
                s =>
                    s.id ===
                    currentUser.id
            );


        if (index >= 0) {

            students[index] =
                {
                    ...students[index],
                    ...currentUser
                };


            saveData(
                DB.students,
                students
            );

        }

    }



    if (
        currentUser.role ===
        "driver"
    ) {

        const drivers =
            getData(DB.drivers);


        const index =
            drivers.findIndex(
                d =>
                    d.id ===
                    currentUser.id
            );


        if (index >= 0) {

            drivers[index] =
                {
                    ...drivers[index],
                    ...currentUser
                };


            saveData(
                DB.drivers,
                drivers
            );

        }

    }

}



/* =====================================================
   PASSWORD
===================================================== */

function changePassword() {


    const oldPassword =
        prompt(
            "Enter current password:"
        );


    if (
        oldPassword !==
        currentUser.password
    ) {

        showToast(
            "Wrong current password",
            "error"
        );

        return;

    }


    const newPassword =
        prompt(
            "Enter new password:"
        );


    if (!newPassword) return;


    currentUser.password =
        newPassword;


    saveCurrentUser();


    showToast(
        "Password changed",
        "success"
    );

}



/* =====================================================
   DRIVER TRIP
===================================================== */

function tripPage() {

    return `

        <div class="page-header">

            <h2>
                Trip Control
            </h2>

            <p>
                Start or stop your bus trip.
            </p>

        </div>


        <div class="panel">


            <button
                class="btn btn-primary"
                onclick="startTrip()"
            >
                ▶ Start Trip
            </button>


            <button
                class="btn btn-outline"
                onclick="startGPS()"
            >
                📡 Start GPS
            </button>


            <button
                class="btn"
                style="
                    background:#fee2e2;
                    color:#b91c1c;
                "
                onclick="stopTrip()"
            >
                ■ Stop Trip
            </button>


        </div>

    `;

}



function startTrip() {


    document
        .querySelectorAll(
            "#tripStatus"
        )
        .forEach(
            e =>
                e.textContent =
                "RUNNING"
        );


    showToast(
        "Trip started",
        "success"
    );

}



function stopTrip() {


    if (
        gpsWatchId !==
        null
    ) {

        navigator
            .geolocation
            .clearWatch(
                gpsWatchId
            );

        gpsWatchId = null;

    }


    document
        .querySelectorAll(
            "#tripStatus"
        )
        .forEach(
            e =>
                e.textContent =
                "STOPPED"
        );


    document
        .querySelectorAll(
            "#gpsStatus"
        )
        .forEach(
            e =>
                e.textContent =
                "OFF"
        );


    showToast(
        "Trip stopped",
        "info"
    );

}



/* =====================================================
   GPS
===================================================== */

function startGPS() {


    if (
        !navigator.geolocation
    ) {

        showToast(
            "GPS not supported",
            "error"
        );

        return;

    }


    gpsWatchId =
        navigator
        .geolocation
        .watchPosition(

            function(position) {


                document
                    .querySelectorAll(
                        "#gpsStatus"
                    )
                    .forEach(
                        e =>
                            e.textContent =
                            "ON"
                    );


                const lat =
                    position.coords.latitude;


                const lng =
                    position.coords.longitude;


                if (
                    dashboardMap
                ) {

                    if (
                        !window.driverMarker
                    ) {

                        window.driverMarker =
                            L.marker([
                                lat,
                                lng
                            ])
                            .addTo(
                                dashboardMap
                            );

                    }

                    else {

                        window.driverMarker
                            .setLatLng([
                                lat,
                                lng
                            ]);

                    }

                }


            },


            function() {

                showToast(
                    "GPS permission unavailable",
                    "error"
                );

            },


            {
                enableHighAccuracy:
                    true,

                maximumAge:
                    5000,

                timeout:
                    10000
            }

        );

}



/* =====================================================
   ADMIN STUDENTS
===================================================== */

function studentsPage() {


    const students =
        getData(
            DB.students
        );


    return `

        <div class="page-header">

            <h2>
                Students
            </h2>

            <p>
                Registered students.
            </p>

        </div>


        <div class="panel">


            <div class="table-wrapper">

                <table class="data-table">

                    <thead>

                        <tr>

                            <th>
                                ID
                            </th>

                            <th>
                                Name
                            </th>

                            <th>
                                Mobile
                            </th>

                            <th>
                                Course
                            </th>

                            <th>
                                Bus
                            </th>

                        </tr>

                    </thead>


                    <tbody>


                        ${
                            students
                            .map(
                                s => `

                                <tr>

                                    <td>
                                        ${esc(s.id)}
                                    </td>

                                    <td>
                                        ${esc(s.name)}
                                    </td>

                                    <td>
                                        ${esc(s.mobile)}
                                    </td>

                                    <td>
                                        ${esc(s.course)}
                                    </td>

                                    <td>
                                        ${esc(s.bus)}
                                    </td>

                                </tr>

                                `
                            )
                            .join("")

                        }


                    </tbody>

                </table>

            </div>

        </div>

    `;

}



/* =====================================================
   ADMIN DRIVERS
===================================================== */

function driversPage() {


    const drivers =
        getData(
            DB.drivers
        );


    return `

        <div class="page-header">

            <h2>
                Drivers
            </h2>

            <p>
                Registered drivers.
            </p>

        </div>


        <div class="panel">


            <div class="table-wrapper">

                <table class="data-table">

                    <thead>

                        <tr>

                            <th>
                                ID
                            </th>

                            <th>
                                Name
                            </th>

                            <th>
                                Mobile
                            </th>

                            <th>
                                Bus
                            </th>

                            <th>
                                Experience
                            </th>

                        </tr>

                    </thead>


                    <tbody>


                        ${
                            drivers
                            .map(
                                d => `

                                <tr>

                                    <td>
                                        ${esc(d.id)}
                                    </td>

                                    <td>
                                        ${esc(d.name)}
                                    </td>

                                    <td>
                                        ${esc(d.mobile)}
                                    </td>

                                    <td>
                                        ${esc(d.bus)}
                                    </td>

                                    <td>
                                        ${esc(
                                            d.experience
                                        )}
                                    </td>

                                </tr>

                                `
                            )
                            .join("")

                        }


                    </tbody>

                </table>

            </div>

        </div>

    `;

}



/* =====================================================
   BUSES
===================================================== */

function busesPage() {


    const buses =
        getData(
            DB.buses
        );


    return `

        <div class="page-header">

            <h2>
                Buses
            </h2>

            <p>
                All college buses.
            </p>

        </div>


        <div class="panel">


            <div class="table-wrapper">

                <table class="data-table">

                    <thead>

                        <tr>

                            <th>
                                Bus
                            </th>

                            <th>
                                Route
                            </th>

                            <th>
                                Driver
                            </th>

                            <th>
                                Status
                            </th>

                        </tr>

                    </thead>


                    <tbody>


                        ${
                            buses
                            .map(
                                b => `

                                <tr>

                                    <td>
                                        ${esc(b.number)}
                                    </td>

                                    <td>
                                        ${esc(b.route)}
                                    </td>

                                    <td>
                                        ${esc(b.driver)}
                                    </td>

                                    <td>

                                        <span
                                            class="badge badge-success"
                                        >
                                            ${esc(b.status)}
                                        </span>

                                    </td>

                                </tr>

                                `
                            )
                            .join("")

                        }


                    </tbody>

                </table>

            </div>

        </div>

    `;

}



/* =====================================================
   FEES
===================================================== */

function feesPage() {


    const payments =
        getData(
            DB.payments
        );


    const total =
        payments.reduce(
            (
                sum,
                p
            ) =>
                sum +
                Number(p.amount),
            0
        );


    return `

        <div class="page-header">

            <h2>
                Fee Management
            </h2>

        </div>


        <div class="stats-grid">


            <div class="stat-card">

                <span>
                    Transactions
                </span>

                <h3>
                    ${payments.length}
                </h3>

            </div>


            <div class="stat-card">

                <span>
                    Collection
                </span>

                <h3>
                    ₹${total}
                </h3>

            </div>


        </div>


        <div class="panel">

            <div class="table-wrapper">

                <table class="data-table">

                    <thead>

                        <tr>

                            <th>
                                Receipt
                            </th>

                            <th>
                                Student
                            </th>

                            <th>
                                Amount
                            </th>

                            <th>
                                Status
                            </th>

                        </tr>

                    </thead>


                    <tbody>


                        ${
                            payments
                            .map(
                                p => `

                                <tr>

                                    <td>
                                        ${p.id}
                                    </td>

                                    <td>
                                        ${p.studentId}
                                    </td>

                                    <td>
                                        ₹${p.amount}
                                    </td>

                                    <td>

                                        <span
                                            class="badge badge-success"
                                        >
                                            ${p.status}
                                        </span>

                                    </td>

                                </tr>

                                `
                            )
                            .join("")

                        }


                    </tbody>

                </table>

            </div>

        </div>

    `;

}



/* =====================================================
   REPORTS
===================================================== */

function reportsPage() {


    const students =
        getData(DB.students);

    const drivers =
        getData(DB.drivers);

    const buses =
        getData(DB.buses);

    const payments =
        getData(DB.payments);


    const revenue =
        payments.reduce(
            (
                sum,
                p
            ) =>
                sum +
                Number(p.amount),
            0
        );


    return `

        <div class="page-header">

            <h2>
                Reports
            </h2>

            <p>
                Transport system overview.
            </p>

        </div>


        <div class="stats-grid">


            <div class="stat-card">

                <span>
                    Students
                </span>

                <h3>
                    ${students.length}
                </h3>

            </div>


            <div class="stat-card">

                <span>
                    Drivers
                </span>

                <h3>
                    ${drivers.length}
                </h3>

            </div>


            <div class="stat-card">

                <span>
                    Buses
                </span>

                <h3>
                    ${buses.length}
                </h3>

            </div>


            <div class="stat-card">

                <span>
                    Revenue
                </span>

                <h3>
                    ₹${revenue}
                </h3>

            </div>


        </div>

    `;

}



/* =====================================================
   REGISTER
===================================================== */

function showRegister() {

    document
        .getElementById(
            "registerModal"
        )
        .classList.remove(
            "hidden"
        );

}



function handleRegister(event) {

    event.preventDefault();


    const name =
        document
            .getElementById(
                "registerName"
            )
            .value
            .trim();


    const mobile =
        document
            .getElementById(
                "registerMobile"
            )
            .value
            .trim();


    const email =
        document
            .getElementById(
                "registerEmail"
            )
            .value
            .trim();


    const role =
        document
            .getElementById(
                "registerRole"
            )
            .value;


    const password =
        document
            .getElementById(
                "registerPassword"
            )
            .value;


    const key =
        role === "student"
        ? DB.students
        : DB.drivers;


    const users =
        getData(key);


    const prefix =
        role === "student"
        ? "STU"
        : "DRV";


    const id =
        prefix +
        String(
            users.length + 1
        )
        .padStart(
            3,
            "0"
        );


    const user = {

        id:
            id,

        password:
            password,

        name:
            name,

        mobile:
            mobile,

        email:
            email,

        role:
            role,

        photo:
            ""

    };


    if (
        role === "student"
    ) {

        user.course =
            "Computer Science";

        user.bus =
            "UP32 BT 4589";

        user.route =
            "Lucknow - College";

    }


    if (
        role === "driver"
    ) {

        user.bus =
            "UP32 BT 4589";

        user.experience =
            "New Driver";

    }


    users.push(
        user
    );


    saveData(
        key,
        users
    );


    closeModal(
        "registerModal"
    );


    document
        .getElementById(
            "loginId"
        )
        .value =
        id;


    selectRole(
        role
    );


    showToast(
        "Account created. ID: " + id,
        "success"
    );

}



/* =====================================================
   FORGOT PASSWORD
===================================================== */

function forgotPassword() {


    const id =
        prompt(
            "Enter User ID:"
        );


    if (!id) return;


    let user =
        getData(
            DB.students
        )
        .find(
            u =>
                u.id === id
        );


    if (!user) {

        user =
            getData(
                DB.drivers
            )
            .find(
                u =>
                    u.id === id
            );

    }


    if (!user) {

        showToast(
            "User ID not found",
            "error"
        );

        return;

    }


    alert(
        "Demo Password: " +
        user.password
    );

}



/* =====================================================
   EMERGENCY
===================================================== */

function openEmergency() {


    document
        .getElementById(
            "commonModalContent"
        )
        .innerHTML = `

            <div style="
                text-align:center;
            ">

                <div style="
                    font-size:55px;
                ">
                    🚨
                </div>


                <h2>
                    Emergency Support
                </h2>


                <p>
                    Emergency assistance
                </p>


                <br>


                <a
                    href="tel:112"
                    class="btn btn-primary btn-full"
                >
                    📞 Call 112
                </a>


            </div>

        `;


    document
        .getElementById(
            "commonModal"
        )
        .classList.remove(
            "hidden"
        );

}



/* =====================================================
   MODAL
===================================================== */

function closeModal(id) {

    document
        .getElementById(id)
        .classList.add(
            "hidden"
        );

}



/* =====================================================
   PASSWORD SHOW/HIDE
===================================================== */

function togglePassword(id) {


    const input =
        document.getElementById(
            id
        );


    input.type =
        input.type === "password"
        ? "text"
        : "password";

}



/* =====================================================
   MOBILE SIDEBAR
===================================================== */

function toggleSidebar() {

    document
        .getElementById(
            "sidebar"
        )
        .classList.toggle(
            "open"
        );

}


function toggleMobileMenu() {

    const nav =
        document.querySelector(
            ".main-nav"
        );


    if (
        nav.style.display ===
        "flex"
    ) {

        nav.style.display =
            "";

    }

    else {

        nav.style.display =
            "flex";

        nav.style.flexDirection =
            "column";

        nav.style.position =
            "absolute";

        nav.style.top =
            "76px";

        nav.style.right =
            "20px";

        nav.style.background =
            "white";

        nav.style.padding =
            "20px";

        nav.style.borderRadius =
            "15px";

    }

}



/* =====================================================
   TOAST
===================================================== */

function showToast(
    message,
    type = "info"
) {


    const container =
        document.getElementById(
            "toastContainer"
        );


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "toast " +
        type;


    toast.textContent =
        message;


    container.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.remove();

        },
        3500
    );

}



/* =====================================================
   ESCAPE HTML
===================================================== */

function esc(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}



/* =====================================================
   CAPITALIZE
===================================================== */

function capitalize(text) {

    if (!text) return "";

    return (
        text.charAt(0)
        .toUpperCase() +
        text.slice(1)
    );

}



/* =====================================================
   IMPORTANT:
   START STUDENT MAP AFTER DASHBOARD LOAD
===================================================== */

const originalShowPage =
    showPage;


showPage =
    function(page) {


        originalShowPage(page);


        if (
            page ===
            "dashboard" &&

            currentUser &&

            currentUser.role ===
            "student"
        ) {

            setTimeout(
                initializeStudentLiveMap,
                400
            );

        }

    };



/* =====================================================
   END
===================================================== */