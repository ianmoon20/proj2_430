"use strict";

var cards = {};

var handleDeck = function handleDeck(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#deckName").val() == '') {
        handleError("RAWR! Deck name is required");
        return false;
    }

    if (Object.keys(cards).length === 0) {
        handleError("RAWR! Deck needs cards");
        return false;
    }

    sendAjax('POST', $("#deckForm").attr("action"), $("#deckForm").serialize(), function () {
        loadDecksFromServer();
    });

    return false;
};

var DeckForm = function DeckForm(props) {
    return React.createElement(
        "form",
        { id: "deckForm", onSubmit: handleDeck, name: "deckForm", action: "/maker", method: "POST", className: "deckForm" },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "deckName", type: "text", name: "name", placeholder: "Deck Name" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDeckSubmit", type: "submit", value: "Submit Deck" })
    );
};

var CardSearchBar = function CardSearchBar(props) {
    return React.createElement(
        "div",
        { className: "searchContainer" },
        React.createElement("input", { type: "text", id: "searchBar", onInput: findCards, name: "search", placeholder: "Type here to search for cards" })
    );
};

var addCard = function addCard(cardImage) {};

var findCards = function findCards() {
    var searchBar = document.querySelector("#searchBar");

    loadCardsFromServer({ name: searchBar.value });
};

var CardList = function CardList(props) {
    if (props.cards.length === 0) {
        return React.createElement(
            "div",
            { className: "cardList" },
            React.createElement(
                "h3",
                { className: "emptyCards" },
                "No Cards Found"
            )
        );
    }

    var cardNodes = props.cards.map(function (card) {
        return React.createElement(
            "div",
            { className: "card", onClick: addCard(card.imageURL) },
            React.createElement("img", { src: card.imageURL, alt: card.name })
        );
    });

    return React.createElement(
        "div",
        { className: "cardList" },
        cardNodes
    );
};

var DeckList = function DeckList(props) {
    if (props.decks.length === 0) {
        return React.createElement(
            "div",
            { className: "deckList" },
            React.createElement(
                "h3",
                { className: "emptyDeck" },
                "No Decks Yet"
            )
        );
    }

    var deckNodes = props.decks.map(function (deck) {
        return React.createElement(
            "div",
            { key: deck._id, className: "deck", onclick: displayDeck("cards", deck.cards) },
            React.createElement(
                "h3",
                { className: "deckName" },
                "Name: ",
                deck.name,
                " "
            )
        );
    });

    return React.createElement(
        "div",
        { className: "deckList" },
        deckNodes
    );
};

var loadDecksFromServer = function loadDecksFromServer() {
    sendAjax('GET', '/getDecks', null, function (data) {
        ReactDOM.render(React.createElement(DeckList, { decks: data.decks }), document.querySelector("#decks"));
    });
};

var loadCardsFromServer = function loadCardsFromServer(cardName) {
    sendAjax('GET', '/getCards', { name: cardName }, function (data) {
        console.log(data);
        ReactDOM.render(React.createElement(CardList, { cards: [data.cards] }), document.querySelector("#searchCards"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(DeckForm, { csrf: csrf }), document.querySelector("#makeDeck"));

    //This search bar has a REACT error.
    /*ReactDOM.render(
        <CardSearchBar />, document.querySelector("#cardSearchBar")
    );*/

    ReactDOM.render(React.createElement(CardList, { cards: [] }), document.querySelector("#searchCards"));

    ReactDOM.render(React.createElement(DeckList, { decks: [] }), document.querySelector("#decks"));

    //Test card
    loadCardsFromServer("One");

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
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
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
