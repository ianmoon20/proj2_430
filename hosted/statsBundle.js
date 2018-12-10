"use strict";

var handlePassword = function handlePassword(e) {
    e.preventDefault();

    sendAjax('PUT', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), redirect);

    return false;
};

var PasswordForm = function PasswordForm(props) {
    return React.createElement(
        "form",
        { id: "passwordForm", onSubmit: handlePassword, name: "passwordForm", action: "/change", method: "PUT", className: "passwordForm" },
        React.createElement(
            "label",
            { className: "h3 deckName" },
            "Change Password"
        ),
        React.createElement(
            "div",
            { className: "input-group" },
            React.createElement(
                "label",
                { className: "sr-only", htmlFor: "password2" },
                "Password: "
            ),
            React.createElement("input", { className: "form-control", type: "password", name: "password2", autoComplete: "new-password", placeholder: "Type a new password", required: true }),
            React.createElement(
                "label",
                { className: "sr-only", htmlFor: "password3" },
                "Password: "
            ),
            React.createElement("input", { className: "form-control", type: "password", autoComplete: "new-password", name: "password3", placeholder: "Confirm your new password", required: true }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement(
                "button",
                { className: "btn btn-primary", type: "submit", value: "Change Password" },
                "Submit"
            )
        )
    );
};

var StatsList = function StatsList(props) {
    var createdDate = new Date(props.stats.createdDate);
    console.log(createdDate);

    //Have to use a modulus on getMonth because for some reason that's the only one that returns a 0 based array. (January = 0, December = 11)
    return React.createElement(
        "div",
        { className: "statList" },
        React.createElement(
            "div",
            { key: props.stats._id, className: "stat" },
            React.createElement(
                "h3",
                { className: "stat deckName" },
                "Username: ",
                props.stats.username,
                " "
            ),
            React.createElement(
                "h3",
                { className: "stat deckName" },
                " Member Since: ",
                (createdDate.getMonth() + 1) % 13,
                "/",
                createdDate.getDate(),
                "/",
                createdDate.getFullYear()
            )
        )
    );
};

var loadStatsFromServer = function loadStatsFromServer() {
    sendAjax('GET', '/getStats', null, function (data) {
        ReactDOM.render(React.createElement(StatsList, { stats: data.stats }), document.querySelector("#stats"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(StatsList, { stats: [] }), document.querySelector("#stats"));

    ReactDOM.render(React.createElement(PasswordForm, { csrf: [csrf] }), document.querySelector("#password"));

    loadStatsFromServer();
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
