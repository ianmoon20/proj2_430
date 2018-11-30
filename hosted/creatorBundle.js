"use strict";

var cardsList = {};
var cardCount = 0;

var timeout = null;

var addCard = function addCard(card) {
    var isCardAdded = true;
    for (var i = 0; i < cardCount; i++) {
        if (cardsList[i].imageUrl === card.imageUrl) {
            cardsList[i].count++;
            isCardAdded = false;
        }
    }
    if (isCardAdded === true) {
        cardsList[cardCount] = {
            imageUrl: card.imageUrl,
            name: card.name,
            count: 1
        };
        cardCount++;
    };

    ReactDOM.render(React.createElement(DeckList, { cards: [cardsList] }), document.querySelector("#deckList"));
};

var removeCard = function removeCard(e) {
    cardsList[e].count--;

    if (cardsList[e].count < 1) {
        delete cardsList[e];
        cardCount--;
    };

    ReactDOM.render(React.createElement(DeckList, { cards: [cardsList] }), document.querySelector("#deckList"));
};

var handleDeck = function handleDeck(e) {
    e.preventDefault();

    var name = $("#deckName").val();

    if (name.trim() == '' || Object.keys(cardsList).length === 0) {
        return false;
    }

    var list = encodeURIComponent(JSON.stringify(cardsList));
    sendAjax('POST', $("#deckForm").attr("action"), $("#deckForm").serialize() + '&cards=' + list, redirect, false);

    return false;
};

var handleSearch = function handleSearch(e) {
    e.preventDefault();

    if ($("#cardName").val().trim() === '') {
        return false;
    }

    //Clearing the timeout
    clearTimeout(timeout);

    //Only querying the server every 500 ms
    timeout = setTimeout(function () {
        return loadCardsFromServer($("#cardName").val());
    }, 500);
};

var DeckForm = function DeckForm(props) {
    return React.createElement(
        "form",
        { id: "deckForm", onSubmit: handleDeck, name: "deckForm", action: "/create", method: "POST", className: "deckForm" },
        React.createElement("input", { className: "form-control", id: "deckName", type: "text", name: "name", placeholder: "Enter a deck name...", pattern: "[a-zA-Z0-9 ]+", title: "Alphanumeric characters only (a-z, A-Z, and 0-9)", required: true }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Submit Deck" })
    );
};
var SearchForm = function SearchForm(props) {
    return React.createElement(
        "form",
        { id: "searchForm", onSubmit: handleSearch, name: "searchForm", action: "/getCards", method: "GET", className: "searchForm" },
        React.createElement("input", { className: "form-control", id: "cardName", type: "text", onChange: handleSearch, name: "name", placeholder: "Type to search for a card...", required: true })
    );
};

var CardList = function CardList(props) {
    if (props.cards.length === 0) {
        return React.createElement(
            "div",
            { className: "container-fluid pt-3" },
            React.createElement(
                "div",
                { className: "cardList row flex-row", align: "center" },
                React.createElement(
                    "h3",
                    { className: "emptyCard" },
                    "No cards match search"
                )
            )
        );
    }

    var cardNodes = props.cards[0].map(function (card) {
        return React.createElement(
            "div",
            { key: card.id, className: "card col-xs-2", align: "center" },
            React.createElement("img", { className: "card-img-top", src: card.imageUrl, alt: card.name, onClick: function onClick() {
                    return addCard(card);
                } })
        );
    });

    return React.createElement(
        "div",
        { className: "container-fluid pt-3" },
        React.createElement(
            "div",
            { className: "cardList row flex-row", align: "center" },
            cardNodes
        )
    );
};

var DeckList = function DeckList(cardList) {
    if (Object.keys(cardsList).length === 0) {
        return React.createElement(
            "div",
            { className: "container-fluid pt-3 rounded" },
            React.createElement(
                "div",
                { className: "cardList row flex-row", align: "center" },
                React.createElement(
                    "h3",
                    { className: "emptyCard" },
                    "No cards in Deck"
                )
            )
        );
    }

    var cardNodes = [];
    var keys = Object.keys(cardsList);

    var _loop = function _loop(i) {
        cardNodes[i] = React.createElement(
            "div",
            { key: i, className: "card col-xs-2", align: "center" },
            React.createElement("img", { className: "card-img-top", src: cardsList[keys[i]].imageUrl, alt: cardsList[keys[i]].name, onClick: function onClick(e) {
                    return removeCard(keys[i]);
                } }),
            React.createElement(
                "p",
                { className: "card-img-number" },
                cardsList[keys[i]].count
            )
        );
    };

    for (var i = 0; i < cardCount; i++) {
        _loop(i);
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

var loadCardsFromServer = function loadCardsFromServer(cardName) {
    sendAjax('GET', '/getCards', { name: cardName }, function (data) {
        //Making sure we only display cards with an image
        var cards = [];
        for (var i = 0; i < data.cards.length; i++) {
            if (data.cards[i].imageUrl) {
                cards.push(data.cards[i]);
            }
        }
        ReactDOM.render(React.createElement(CardList, { cards: [cards] }), document.querySelector("#searchResults"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(DeckForm, { csrf: csrf }), document.querySelector("#deck"));
    ReactDOM.render(React.createElement(SearchForm, { csrf: csrf }), document.querySelector("#search"));

    ReactDOM.render(React.createElement(CardList, { cards: [] }), document.querySelector("#searchResults"));

    ReactDOM.render(React.createElement(DeckList, { cards: [] }), document.querySelector("#deckList"));

    loadCardsFromServer("");
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
