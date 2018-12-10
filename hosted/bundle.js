"use strict";

//Deck currently opened
var openDeck = "";

//When a deck is selected, we need to apply the proper stylings to the listing
var handleDeck = function handleDeck(e) {
    //Displaying the new deck and applying styling to its listing when we select a new deck
    if (openDeck != e._id) {
        if (openDeck != "") {
            document.getElementById(openDeck).style.backgroundColor = "#EDF0DA";
        }

        ReactDOM.render(React.createElement(CardList, { cards: [e.cards] }), document.querySelector("#deckResults"));

        ReactDOM.render(React.createElement(DeckInfo, { cards: [e.cards] }), document.querySelector("#deckInfo"));

        openDeck = e._id;

        //E5FFDE D0E3CC
        document.getElementById(openDeck).style.backgroundColor = "#D0E3CC";
        return true;
    }

    //If we aren't selecting a new deck, we're selecting the same one and need to deselect it
    ReactDOM.render(React.createElement(CardList, { cards: [] }), document.querySelector("#deckResults"));

    ReactDOM.render(React.createElement(DeckInfo, { cards: [] }), document.querySelector("#deckInfo"));

    document.getElementById(openDeck).style.backgroundColor = "#EDF0DA";
    openDeck = "";
    return true;
};

//Deleting a deck from the server
var deleteDeck = function deleteDeck(e) {
    sendAjax('GET', '/getToken', null, function (result) {
        sendAjax('DELETE', "/deleteDeck", "_csrf=" + result.csrfToken + "&deck=" + e._id, function () {
            //Loading the new decklist
            loadDecksFromServer();
        });
    });
};

//Displaying the amount of cards in the deck
var DeckInfo = function DeckInfo(cardList) {
    if (cardList.cards.length != 0) {
        var keys = Object.values(cardList['cards'][0]);
        var numCards = 0;
        for (var i = 0; i < keys.length; i++) {
            numCards += keys[i].count;
        }
        return React.createElement(
            "div",
            { className: "deckInfo" },
            React.createElement(
                "p",
                { className: "info-number" },
                numCards
            )
        );
    }
    return React.createElement(
        "div",
        { className: "deckInfo" },
        React.createElement("p", { className: "info-number" })
    );
};

//Getting a list of the cards in the deck
var CardList = function CardList(cardList) {
    if (Object.keys(cardList['cards']).length === 0) {
        return React.createElement(
            "div",
            { className: "container-fluid pt-3 rounded" },
            React.createElement(
                "div",
                { className: "cardList row flex-row", align: "center" },
                React.createElement(
                    "h3",
                    { className: "emptyCard" },
                    "Select a deck by clicking on it's tab or make one by pressing the New Deck button!"
                )
            )
        );
    }

    var cardNodes = [];
    var keys = Object.values(cardList['cards'][0]);
    for (var i = 0; i < keys.length; i++) {
        cardNodes[i] = React.createElement(
            "div",
            { key: i, className: "card col-xs-2", align: "center" },
            React.createElement("img", { className: "card-img-top", src: keys[i].imageUrl, alt: keys[i].name }),
            React.createElement(
                "p",
                { className: "card-img-number" },
                keys[i].count
            )
        );
    }

    return React.createElement(
        "div",
        { className: "container-fluid pt-3 rounded" },
        React.createElement(
            "div",
            { className: "cardList row flex-row", align: "center" },
            cardNodes
        )
    );
};

//Displaying the deck list
var DeckList = function DeckList(props) {
    if (props.decks.length === 0) {
        return React.createElement(
            "div",
            { className: "container-fluid pt-3 rounded" },
            React.createElement(
                "div",
                { className: "deckList row flex-row" },
                React.createElement(
                    "h3",
                    { className: "emptyDeck" },
                    "No decks made!"
                )
            )
        );
    }

    var deckNodes = props.decks.map(function (deck) {
        return React.createElement(
            "div",
            { key: deck._id, id: deck._id, className: "deck row flex-row", align: "center" },
            React.createElement(
                "a",
                { href: "#", className: "deckName h3 col-xs-11 col-sm-11", onClick: function onClick() {
                        return handleDeck(deck);
                    } },
                deck.name
            ),
            React.createElement(
                "button",
                { type: "button", className: "btn btn-danger col-xs-1 col-sm-1", onClick: function onClick() {
                        return deleteDeck(deck);
                    } },
                "Delete"
            )
        );
    });

    return React.createElement(
        "div",
        { className: "deckList" },
        deckNodes
    );
};

//Create Deck Button
var ButtonForm = function ButtonForm(props) {
    return React.createElement(
        "form",
        { id: "buttonForm", name: "buttonForm", action: "/create", method: "GET", className: "buttonForm" },
        React.createElement("input", { className: "createDeckSubmit formSubmit", type: "submit", value: "New Deck" })
    );
};

//Gets a list of decks from the server and decides what to do with the list depending on size
var loadDecksFromServer = function loadDecksFromServer() {
    sendAjax('GET', '/getDecks', null, function (data) {
        ReactDOM.render(React.createElement(DeckList, { decks: data.decks }), document.querySelector("#deck"));

        if (data.decks.length > 0) {
            //If there are decks loaded, we handle the deck info for the first one.

            //Resetting the open deck whenever we load from the server to ensure that the first entry always has proper stylings
            openDeck = "";
            handleDeck(data.decks[0]);
        } else if (data.decks.length === 0) {
            ReactDOM.render(React.createElement(CardList, { cards: [] }), document.querySelector("#deckResults"));

            ReactDOM.render(React.createElement(DeckInfo, { cards: [] }), document.querySelector("#deckInfo"));
            openDeck = "";
        }
    });
};

//Setting up the page
var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(ButtonForm, { csrf: csrf }), document.querySelector("#createButton"));

    ReactDOM.render(React.createElement(DeckList, { decks: [] }), document.querySelector("#deck"));
    ReactDOM.render(React.createElement(CardList, { cards: [] }), document.querySelector("#deckResults"));

    loadDecksFromServer();
};

//Getting csrf
var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").fadeIn().delay(2500).fadeOut();
    $("#errorMessage").text(message);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
