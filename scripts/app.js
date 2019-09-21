let keyStorageUserRestaurants = 'chow_town_user_restaurants';
let keyStorageTrips = 'chow_town_trips';
let keyStorageTripsCurrentIndex = 'chow_town_trips_current_index';


// load function when window is ready
window.onload = function () {


    $('#fullpage').fullpage({
        //options here
        autoScrolling: true,
        scrollHorizontally: true,
    });

    //methods
    $.fn.fullpage.setAllowScrolling(true);

    // left and right keydown change color of arrow
    $(document).keydown(function (e) {
        if (e.which == 37) {
            $(".arrowLBlack").removeClass("d-none");
        }

        if (e.which == 39) {
            $(".arrowRBlack").removeClass("d-none");
            return false;
        }
    });

    // left and right keyup change color back
    $(document).keyup(function (e) {
        if (e.which == 37) {
            $(".arrowLBlack").addClass("d-none");
        }

        if (e.which == 39) {
            $(".arrowRBlack").addClass("d-none");
        }
    });
}













































let arrSearchResults = [{
    restaurant_id: 'restaurant_x',
    image_url: './scripts/chicken.png',
    name: 'restaurant X',
    location: 'Sydney',
    price: '$',
    categories: 'Alcohol',
    rating: 4.4,
    url: 'https://www.yelp.com.au/biz/belles-hot-chicken-barangaroo?osq=chicken'
},
{
    restaurant_id: 'restaurant_y',
    image_url: './scripts/chicken.png',
    name: 'restaurant Y',
    location: 'Sydney',
    price: '$$',
    categories: 'Cheese',
    rating: 4.5,
    url: 'https://www.yelp.com.au/biz/belles-hot-chicken-barangaroo?osq=chicken'
},
{
    restaurant_id: 'restaurant_z',
    image_url: './scripts/chicken.png',
    name: 'restaurant Z',
    location: 'Sydney',
    price: '$$$',
    categories: 'Vegetarian',
    rating: 4.6,
    url: 'https://www.yelp.com.au/biz/belles-hot-chicken-barangaroo?osq=chicken'
}
];

let arrUserRestaurants = [];
let arrTrips = [];
let tripCurrentIndex = 0;

function pushToDB(key, arr) {
    localStorage.setItem(key, JSON.stringify(arr));
}

function getFromDB() {
    let dbContentUserRestaurants = undefined;
    dbContentUserRestaurants = localStorage.getItem(keyStorageUserRestaurants);
    if (dbContentUserRestaurants === null) {
        // console.log('USER BITES: no content');
    } else {
        arrUserRestaurants = JSON.parse(localStorage.getItem(keyStorageUserRestaurants));
        // console.log('USER BITES: content exists');
    }

    let dbContentTrips = undefined;
    dbContentTrips = localStorage.getItem(keyStorageTrips);
    if (dbContentTrips === null) {
        // console.log('TRIPS: no content');
    } else {
        arrTrips = JSON.parse(localStorage.getItem(keyStorageTrips));
        // console.log('TRIPS: content exists');
    }

    let dbtripCurrentIndex = undefined;
    dbtripCurrentIndex = localStorage.getItem(keyStorageTripsCurrentIndex);
    if (dbtripCurrentIndex === null) {
        // console.log('TRIPSCURRENTINDEX: no content');
    } else {
        tripCurrentIndex = JSON.parse(localStorage.getItem(keyStorageTripsCurrentIndex));
        // console.log('TRIPSCURRENTINDEX:', tripCurrentIndex);
    }
}
getFromDB();











let inViewTripDetails = undefined;
let inViewEditID = undefined;








let arrListSearch = arrCategoriesRestaurants;
renderListSearch();
function renderListSearch() {
    for (let i = 0; i < arrListSearch.length; i++) {
        $('#listSearch').append('<option value="' + arrListSearch[i].title + '" data-index="' + i + '"></option>');
    }
}

let arrListLocation = [];
arrListLocation.push({ name: 'Adelaide, Australia', lat: -34.906101, lon: 138.593903 });
arrListLocation.push({ name: 'Brisbane, Australia', lat: -27.470125, lon: 153.021072 });
arrListLocation.push({ name: 'Canberra, Australia', lat: -35.343784, lon: 149.082977 });
arrListLocation.push({ name: 'Darwin, Australia', lat: -12.462827, lon: 130.841782 });
arrListLocation.push({ name: 'Hobart, Australia', lat: -42.87936, lon: 147.32941 });
arrListLocation.push({ name: 'Los Angeles, United States', lat: 34.052235, lon: -118.243683 });
arrListLocation.push({ name: 'Perth, Australia', lat: -31.953512, lon: 115.857048 });
arrListLocation.push({ name: 'Sydney, Australia', lat: -33.865143, lon: 151.209900 });
renderListLocation();
function renderListLocation() {
    for (let i = 0; i < arrListLocation.length; i++) {
        $('#listLocation').append('<option value="' + arrListLocation[i].name + '"></option>');
    }
}
























$('#clearList').on('click', function () {
    arrSearchResults = [];
    $('#clearList').addClass('d-none');
    $('#userInput').val('');
    $('#userInputLocation').val('');
    $('#searchForm2').find('p').text('');
    $('#addResult').empty();
    $('#addResult').append('<tr><td colspan="1000"><p class="m-0 p-0 text-center"><i>Search for something.</i></p></td></tr>');
});


$('#searchForm1').on('submit', runFoodAndLocationSearch);
$('#searchForm2').on('submit', runFoodAndLocationSearch);
function runFoodAndLocationSearch(e) {
    e.preventDefault();
    $('#userInput').blur();
    $('#userInputLocation').blur();

    let searchTermString = $('#userInput').val().trim();
    let locationTermString = $('#userInputLocation').val().trim();

    let lat = 0;
    let lon = 0;

    if (searchTermString.length == 0) {
        $('#searchForm1').find('span').find('p').text('Required');
    } else {
        $('#addResult').empty();
        $('#addResult').append('<tr><td class="text-center" colspan="1000"><img class="loading" src="src/loading.gif"></td></tr>');

        for (let i = 0; i < arrListSearch.length; i++) {
            if (searchTermString == arrListSearch[i].title.toLowerCase()) {
                searchTermString = arrListSearch[i].alias;
            }
        }

        if (locationTermString.length == 0) {
            lat = -33.865143;
            lon = 151.209900;
            $('#userInputLocation').val('Sydney, Australia');
            $('#searchForm2').find('p').text('Sydney NSW, Australia');
            ajaxCallYelp(searchTermString, lat, lon);
        } else {
            ajaxCallGoogleGeocoding(locationTermString, searchTermString);
        }
    }
}
$('#userInput').on('focusin', function () { $('#searchForm1').find('span').find('p').text(''); });


function ajaxCallGoogleGeocoding(locationTerm, searchTerm) {
    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + locationTerm + '&key=AIzaSyDztmGphx7y_JZlodad0K8Bjxwmr4hLiZc',
        method: 'GET'
    })
        .then((response) => {
            console.log(response);
            let lat = response.results[0].geometry.location.lat;
            let lon = response.results[0].geometry.location.lng;
            $('#searchForm2').find('p').text(response.results[0].formatted_address);
            ajaxCallYelp(searchTerm, lat, lon);
        })
        .catch((error) => {
            $('#addResult').empty();
            $('#addResult').append('<tr><td colspan="1000"><p class="m-0 p-0 text-center"><i>Location could not be found. Try again.</i></p></td></tr>');
            $('#clearList').removeClass('d-none');
        });
}
function ajaxCallYelp(searchTerm, lat, lon) {
    $.ajax({
        url: 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?limit=20&latitude=' + lat + '&longitude=' + lon + '&radius=3000&sort_by=best_match&term=' + searchTerm,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer YD2lcCavl5yda52nTX1wKG-uHD-BRa_9izM0BLTdtg0nvbPe5j81Y9WNLsFEhnCZtOGUH2kbC4f06c7Cdw5UwR4-HJvPJtMf0izr-79DSXBaDzHpWQ3ljZJs9RiAXXYx'
        }
    }).then(function (response) {
        console.log(response);
        let arr = response.businesses;
        arrSearchResults = [];
        for (let i = 0; i < arr.length; i++) {
            let categoriesArr = arr[i].categories;
            let categoriesString = '';
            for (let j = 0; j < categoriesArr.length; j++) {
                categoriesString += categoriesArr[j].title.trim();
                if (j != categoriesArr.length - 1) {
                    categoriesString += ', ';
                }

            }
            let locationArr = arr[i].location.display_address;
            let locationString = '';
            for (let j = 0; j < locationArr.length; j++) {
                if (j != 0) {
                    locationString += '<br>';
                }
                locationString += locationArr[j].trim();
            }
            let priceOriginal = (typeof arr[i].price == 'undefined' ? '$' : arr[i].price);
            let priceNew = '';
            for (let j = 0; j < priceOriginal.length; j++) {
                priceNew += '$';
            }
            arrSearchResults.push({
                restaurant_id: arr[i].id,
                categories: categoriesString,
                image_url: arr[i].image_url,
                location: locationString,
                name: arr[i].name,
                price: priceNew,
                rating: arr[i].rating,
                url: arr[i].url
            });
        }

        if (arrSearchResults.length != 0) {
            renderSearchResults(arrSearchResults);
        } else {
            $('#addResult').empty();
            $('#addResult').append('<tr><td colspan="1000"><p class="m-0 p-0 text-center"><i>No results found. Try again.</i></p></td></tr>');
        }
        $('#clearList').removeClass('d-none');
    })
        .catch((err) => {
            $('#addResult').empty();
            $('#addResult').append('<tr><td colspan="1000"><p class="m-0 p-0 text-center"><i>Something went wrong. Try again.</i></p></td></tr>');

            $('#clearList').removeClass('d-none');
        });
}

// activate this to allow default contents
// renderSearchResults(arrSearchResults);
function renderSearchResults(arr) {
    $('#addResult').empty();
    for (let i = 0; i < arr.length; i++) {
        appendSearchResult(arr[i]);
    }
}

function appendSearchResult(data) {
    // vars to create elements
    var tr = $("<tr>");

    // prepend to relevant table rows
    $("#addResult").prepend(tr);

    // add table contents
    tr.append("<td class='bubbleFont mobile'>" + data.price);
    tr.append("<td class='bubbleFont'>" + data.name);
    tr.append("<td class='mobile'>" + data.location);
    // tr.append("<td class='d-none d-md-block'>" + data.categories);



    var tdWebsite = $("<td class='d-none d-md-block'>");
    tr.append(tdWebsite);
    var buttonWebsite = $("<button class='btn-table'>Website</button>");
    buttonWebsite.on('click', function () {
        window.open(data.url, '_blank');
    });
    tdWebsite.append(buttonWebsite);


    var tdAddCookie = $('<td>');
    tr.append(tdAddCookie);
    var buttonAddCookie = $("<button class='btn-table'>Add Bite</button>");
    for (let i = 0; i < arrUserRestaurants.length; i++) {
        if (data.restaurant_id == arrUserRestaurants[i].restaurant_id) {
            buttonAddCookie.text('Added');
            buttonAddCookie.attr('disabled', true);
        }
    }
    buttonAddCookie.on('click', function () {
        $(this).text('Added');
        $(this).attr('disabled', true);
        addSearchToUserRestaurants(data);
    });
    tdAddCookie.append(buttonAddCookie);

}

function addSearchToUserRestaurants(data) {
    let toAddItem = true;
    for (let i = 0; i < arrUserRestaurants.length; i++) {
        if (data.restaurant_id == arrUserRestaurants[i].restaurant_id) {
            toAddItem = false;
        }
    }
    if (toAddItem) {
        arrUserRestaurants.push(data);
        ////database >>>
        pushToDB(keyStorageUserRestaurants, arrUserRestaurants);
        getFromDB();
        ////<<< database
        renderUserRestaurants();
    }
}
$('#addResultsButtonClear').on('click', function () {
    $('#addResults').empty();
});











































renderUserRestaurants();
function renderUserRestaurants() {
    // $('#regionBites').empty();
    $("#addBites").empty();
    for (let i = 0; i < arrUserRestaurants.length; i++) {
        prependUserRestaurant(arrUserRestaurants[i]);
    }
    if (arrUserRestaurants.length == 0) {
        prependBlankRestaurant();
    }
}

function prependBlankRestaurant() {
    var divCard = $("<div class='card mr-2 mb-2 bg-dark w-100'>");
    divCard.append('<p class="m-0 p-0 text-center"><i>Add some restaurants</i></p>');
    $("#addBites").prepend(divCard);
}

function prependUserRestaurant(data) {

    // vars to create elements
    var divCard = $("<div class='card mr-2 mb-2 bg-dark'>");
    var divCol = $("<div class='col-12'>");
    // buttons for card
    var removeBtn = $('<a id="removeBite" href="#"><img src="src/exit-icon.png" class="remove"></a>');
    var shareBtn = $('<a id="shareButton" href="#"><img src="src/share-link.png" class="share"></a>');
    var webBtn = $('<a id="webButton" href="' + data.url + '" target="_blank"><img src="src/web-link.png" class="web"></a>');


    // prepend relevant divs
    $("#addBites").prepend(divCard);
    divCard.prepend(divCol);
    divCol.prepend(removeBtn);
    divCol.prepend(shareBtn);
    divCol.prepend(webBtn);

    // add table contents
    divCol.append('<div class="d-flex"><h2 class="pr-3">' + data.name + '</h2><h2>' + data.price + '</h2></div>');
    divCol.append('<div class="d-flex"><p class="pr-3">' + data.categories + '</p></div>');
    divCol.append('<div class="d-flex"><p class="pr-3 pb-4">' + data.location + '</p></div>');

    // divCol.append('<div class="btn-group btn-group-toggle mr-2" data-toggle="buttons"><label class="btn btn-green"><input type="radio" name="options" id="option1" autocomplete="off" checked>Try</label><label class="btn btn-pink"><input type="radio" name="options" id="option2" autocomplete="off"><img src="src/heart-icon.png" class="heart"></label></div>');

    let divDropdown = $('<div class="dropdown dropdown-location">');
    let divDropdownButton = $('<button id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn-table dropdown-toggle">Add Cookies</button>');
    divCol.append(divDropdown);
    divDropdown.append(divDropdownButton);


    let divDropdownMenu = $('<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">');
    divDropdown.append(divDropdownMenu);


    divDropdownButton.on('click', function () {
        renderBiteTrips(divDropdownMenu, data.restaurant_id);
    });

    divCol.append(divDropdown);










    removeBtn.on('click', function () {
        // let saveScrollPosition = $('#regionBites').scrollTop();
        for (let i = 0; i < arrUserRestaurants.length; i++) {
            if (data.restaurant_id == arrUserRestaurants[i].restaurant_id) {
                arrUserRestaurants.splice(i, 1);
                ////database >>>
                pushToDB(keyStorageUserRestaurants, arrUserRestaurants);
                getFromDB();
                ////<<< database
                renderSearchResults(arrSearchResults);
            }
        }
        renderUserRestaurants();

        if (typeof inViewTripDetails != 'undefined') {
            for (let i = 0; i < arrTrips.length; i++) {
                if (inViewTripDetails == arrTrips[i].trip_id) {
                    arrTrips[i].restaurant_ids.splice(arrTrips[i].restaurant_ids.indexOf(data.restaurant_id), 1);
                    ////database >>>
                    pushToDB(keyStorageTrips, arrTrips);
                    getFromDB();
                    ////<<< database

                    renderTripRestaurants(arrTrips[i].restaurant_ids);
                }
            }
        }
        for (let i = 0; i < arrTrips.length; i++) {
            for (let j = 0; j < arrTrips[i].restaurant_ids.length; j++) {
                let indexOfRemovedRestaurant = arrTrips[i].restaurant_ids.indexOf(data.restaurant_id);
                if (indexOfRemovedRestaurant > -1) {
                    arrTrips[i].restaurant_ids.splice(indexOfRemovedRestaurant, 1);
                    ////database >>>
                    pushToDB(keyStorageTrips, arrTrips);
                    getFromDB();
                    ////<<< database
                }
            }
        }
    });

}


function renderBiteTrips(menuElement, restaurantID) {
    menuElement.empty();
    for (let i = 0; i < arrTrips.length; i++) {
        prependBiteTrip(menuElement, arrTrips[i], restaurantID);
    }
    if (arrTrips.length == 0) {
        menuElement.append('<p class="m-0 p-0 text-center"><i>Create a trip first</i></p>');
    }
}

function prependBiteTrip(menuElement, tripData, restaurantID) {
    let anchor = $('<a class="dropdown-item">' + tripData.trip_name + '</a>');
    anchor.on('click', function () {
        let toAddItem = true;
        for (let i = 0; i < tripData.restaurant_ids.length; i++) {
            if (restaurantID == tripData.restaurant_ids[i]) {
                toAddItem = false;
            }
        }
        if (toAddItem) {
            tripData.restaurant_ids.push(restaurantID);
            ////database >>>
            pushToDB(keyStorageTrips, arrTrips);
            getFromDB();
            ////<<< database

            // if (typeof inViewTripDetails != 'undefined') {
            //     if (inViewTripDetails == tripData.trip_id) {
            //         renderTripRestaurants(tripData.restaurant_ids);
            //     }
            // }
            if (inViewTripDetails == tripData.trip_id) {
                renderTripRestaurants(tripData.restaurant_ids);
            }
        }
    });
    menuElement.prepend(anchor);
}














































$('#tripCreateCancel').on('click', function () {
    $('#tripCreateInput').val('');
});


$('#tripCreateSave').on('click', function () {
    let name = $('#tripCreateInput').val().trim().toUpperCase();

    let toSaveTrip = true;
    for (let i = 0; i < arrTrips.length; i++) {
        if (name.toUpperCase() == arrTrips[i].trip_name) {
            toSaveTrip = false;
        }
    }

    if (toSaveTrip) {
        $('#tripCreateInput').val('');

        if (name.length == 0) {
            name = 'TRIP-' + tripCurrentIndex;
        }

        arrTrips.push({
            trip_id: 'TRIP' + tripCurrentIndex,
            trip_name: name,
            restaurant_ids: []
        });
        tripCurrentIndex++;
        ////database >>>
        pushToDB(keyStorageTrips, arrTrips);
        pushToDB(keyStorageTripsCurrentIndex, tripCurrentIndex);
        getFromDB();
        ////<<< database
        renderTrips();


        $('#tripModal').modal('hide');
    } else {
        $('#tripCreateError').text('This name has already been taken');
    }
    $('#tripModal').on('hide.bs.modal', function () { $('#tripCreateError').text(''); });
});


$('#tripRenameSave').on('click', function () {
    let tripNameString = $('#tripRenameInput').val().trim().toUpperCase();


    let toSaveTrip = true;
    for (let i = 0; i < arrTrips.length; i++) {
        if (tripNameString.toUpperCase() == arrTrips[i].trip_name.toUpperCase() && inViewEditID == arrTrips[i].trip_id) {
            toSaveTrip = true;
            break;
        }
        else if (tripNameString.toUpperCase() == arrTrips[i].trip_name.toUpperCase()) {
            toSaveTrip = false;
        }
    }

    if (toSaveTrip) {
        if (tripNameString.length != 0 && typeof inViewEditID != 'undefined') {
            for (let i = 0; i < arrTrips.length; i++) {
                if (inViewEditID == arrTrips[i].trip_id) {
                    arrTrips[i].trip_name = tripNameString;
                    pushToDB(keyStorageTrips, arrTrips);
                    getFromDB();
                    renderTrips();

                    if (inViewEditID == inViewTripDetails) {
                        renderTripRestaurants(arrTrips[i].restaurant_ids);
                    }
                }
            }

            $('#tripModalRename').modal('hide');
        } else {
            $('#tripRenameError').text('A name is required');
        }
    } else {
        $('#tripRenameError').text('This name has already been taken');
    }

    $('#tripModalRename').on('hide.bs.modal', function () {
        inViewEditID = undefined;
        $('#tripRenameError').text('');
    });
});



renderTrips();
function renderTrips() {
    $('#cardContain').empty();

    for (let i = 0; i < arrTrips.length; i++) {
        prependTrip(arrTrips[i]);
    }


    let cardCookies = $('<div class="cardCookies justify-content-center mr-2 bg-pink d-flex align-items-center p-0" style="flex: 0 0 25%;">');
    let createTripButton = $('<button id="tripButton" class="text-white w-100 h-100" href="#" data-toggle="modal"data-target="#tripModal">');
    createTripButton.append('<h2>+ Add</h2>');
    cardCookies.append(createTripButton);
    $('#cardContain').prepend(cardCookies);
}
function prependTrip(data) {
    let editTripAnchor = $('<a id="edit" href="#" data-toggle="modal" data-target="#tripModalRename">');
    editTripAnchor.append('<img src="src/edit-icon.png" class="edit">');
    editTripAnchor.on('click', () => {
        inViewEditID = data.trip_id;
        $('#tripRenameInput').val(data.trip_name);
    });





    let removeTripAnchor = $('<a id="removeBite"><img src="src/exit-icon.png" class="remove2">');
    removeTripAnchor.on('click', function () {
        //if the in view trip is the same as the deleted one, 
        if (data.trip_id == inViewTripDetails) {
            inViewTripDetails = undefined;
            renderTripRestaurants([]);
        }

        for (let i = 0; i < arrTrips.length; i++) {
            if (data.trip_id == arrTrips[i].trip_id) {
                arrTrips.splice(i, 1);
                ////database >>>
                pushToDB(keyStorageTrips, arrTrips);
                getFromDB();
                ////<<< database
            }
        }
        renderTrips();
    });







    let viewTripButton = $('<button id="tripRenameButton" class="text-white w-100 h-100 no-btn">');
    viewTripButton.append('<h2>' + data.trip_name + '</h2>');
    if (inViewTripDetails == data.trip_id) {
        viewTripButton.addClass('activeBtn');
    }
    viewTripButton.on('click', function () {
        $('#addTripDetails').empty();
        $(this).parent().parent().find('button').removeClass('activeBtn');
        $(this).addClass('activeBtn');

        inViewTripDetails = data.trip_id;
        for (let i = 0; i < arrTrips.length; i++) {
            if (inViewTripDetails == arrTrips[i].trip_id) {
                renderTripRestaurants(arrTrips[i].restaurant_ids);
                $('#addTripDetails').scrollTop(0);
            }
        }
    });



    let cardCookies = $('<div class="cardCookies justify-content-center mr-2 bg-dark d-flex align-items-center p-0" style="flex: 0 0 25%;">');
    cardCookies.append(editTripAnchor);

    cardCookies.append(removeTripAnchor);

    cardCookies.append(viewTripButton);
    $('#cardContain').prepend(cardCookies);
}
//pass in the array that represents the list of restaurants that belong to the trip
function renderTripRestaurants(arr) {
    $('#addTripDetails').empty();

    let title = '';
    for (let i = 0; i < arrTrips.length; i++) {
        if (inViewTripDetails == arrTrips[i].trip_id) {
            title = arrTrips[i].trip_name;
        }
    }
    if (arr.length == 0 && typeof inViewTripDetails != "undefined") {
        $('#addTripDetails').append('<tr><td colspan="1000"><p class="m-0 p-0 text-center"><b><u>' + title + '</u></b><i> currently has no restaurants</i></p></td></tr>');
    } else if (arr.length == 0 && typeof inViewTripDetails == "undefined") {
        $('#addTripDetails').append('<tr><td colspan="1000"><p class="m-0 p-0 text-center"><i>Select a trip to view details.<i></p></td></tr>');
    } else {
        $('#addTripDetails').append('<tr><td colspan="1000"><p class="m-0 p-0 text-center"><b><u>' + title + '</u></b></p></td></tr>');
    }

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arrUserRestaurants.length; j++) {
            if (arr[i] == arrUserRestaurants[j].restaurant_id) {
                appendTripRestaurant(arrUserRestaurants[j]);
            }
        }
    }
}

function appendTripRestaurant(data) {
    // vars to create elements
    var tr = $("<tr>");

    // prepend to relevant table rows
    $("#addTripDetails").append(tr);

    // add table contents
    tr.append("<td class='bubbleFont'>" + data.price);
    tr.append("<td class='bubbleFont'>" + "<img src='src/burger-icon.png' class='mr-3 rounded food-icon'>" + data.name);
    tr.append("<td class='mobile'>" + data.location);
    tr.append("<td class='mobile'>" + data.categories);




    var tdWebsite = $("<td class='mobile'>");
    tr.append(tdWebsite);
    var buttonWebsite = $("<button class='btn-table'>Website</button>");
    buttonWebsite.on('click', function () {
        window.open(data.url, '_blank');
    });
    tdWebsite.append(buttonWebsite);


    var tdRemoveCookie = $('<td>');
    tr.append(tdRemoveCookie);
    var buttonRemoveCookie = $("<button class='btn-table'>Remove</button>");
    buttonRemoveCookie.on('click', function () {
        for (let i = 0; i < arrTrips.length; i++) {
            if (inViewTripDetails == arrTrips[i].trip_id) {
                // //remove the restaurant from the array.
                arrTrips[i].restaurant_ids.splice(arrTrips[i].restaurant_ids.indexOf(data.restaurant_id), 1);
                ////database >>>
                pushToDB(keyStorageTrips, arrTrips);
                getFromDB();
                ////<<< database
                renderTripRestaurants(arrTrips[i].restaurant_ids);
            }
        }
    });
    tdRemoveCookie.append(buttonRemoveCookie);

}