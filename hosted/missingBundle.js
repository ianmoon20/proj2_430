"use strict";

var MissingMessage = function MissingMessage() {
    return React.createElement(
        "div",
        { className: "jumbotron" },
        React.createElement(
            "h1",
            { className: "header" },
            "Page Not Found"
        ),
        React.createElement(
            "p",
            null,
            "The page you are looking for may have been removed, had its name changed, or be temporarily unavailable."
        ),
        React.createElement(
            "ul",
            { className: "link-list list-inline" },
            React.createElement(
                "li",
                { className: "list-inline-item" },
                React.createElement(
                    "a",
                    { href: "/maker" },
                    "Back to Safety"
                )
            )
        )
    );
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(MissingMessage, null), document.querySelector("#content"));
};

$(document).ready(function () {
    setup();
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
