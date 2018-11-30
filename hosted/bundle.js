"use strict";

var openDeck = "";

var handleDeck = function handleDeck(e) {
    console.log(e);
    if (openDeck != e._id) {
        ReactDOM.render(React.createElement(CardList, { cards: [e.cards] }), document.querySelector("#deckResults"));
        openDeck = e._id;
        return true;
    }

    ReactDOM.render(React.createElement(CardList, { cards: [] }), document.querySelector("#deckResults"));
    openDeck = "";
    return true;
};

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
            { key: deck._id, className: "card col-xs-2", align: "center" },
            React.createElement(
                "a",
                { href: "#", className: "deckName h3", onClick: function onClick() {
                        return handleDeck(deck);
                    } },
                deck.name
            )
        );
    });

    return React.createElement(
        "div",
        { className: "deckList" },
        deckNodes
    );
};

var ButtonForm = function ButtonForm(props) {
    return React.createElement(
        "form",
        { id: "buttonForm", name: "buttonForm", action: "/create", method: "GET", className: "buttonForm" },
        React.createElement("input", { className: "createDeckSubmit formSubmit", type: "submit", value: "New Deck" })
    );
};

var loadDecksFromServer = function loadDecksFromServer() {
    sendAjax('GET', '/getDecks', null, function (data) {
        ReactDOM.render(React.createElement(DeckList, { decks: data.decks }), document.querySelector("#deck"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(ButtonForm, { csrf: csrf }), document.querySelector("#createButton"));

    ReactDOM.render(React.createElement(DeckList, { decks: [] }), document.querySelector("#deck"));
    ReactDOM.render(React.createElement(CardList, { cards: [] }), document.querySelector("#deckResults"));

    loadDecksFromServer();
};

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
