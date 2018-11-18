"use strict";

var handleDeck = function handleDeck(e) {
    console.log(e.cards);
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
                "h3",
                { className: "deckName", onClick: function onClick() {
                        return handleDeck(deck);
                    } },
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

var ButtonForm = function ButtonForm(props) {
    return React.createElement(
        "form",
        { id: "buttonForm", name: "buttonForm", action: "/create", method: "GET", className: "buttonForm" },
        React.createElement("input", { className: "createDeckSubmit formSubmit", type: "submit", value: "New Deck" })
    );
};

var loadDecksFromServer = function loadDecksFromServer() {
    sendAjax('GET', '/getDecks', null, function (data) {
        console.log(data);
        ReactDOM.render(React.createElement(DeckList, { decks: data.decks }), document.querySelector("#deck"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(ButtonForm, { csrf: csrf }), document.querySelector("#createButton"));

    ReactDOM.render(React.createElement(DeckList, { decks: [] }), document.querySelector("#deck"));

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

var sendAjax = function sendAjax(type, action, data, success, process) {
    var processInfo = true;
    if (process) {
        processInfo = process;
    }
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        processData: processInfo,
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
