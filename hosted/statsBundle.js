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
            { className: "h3" },
            "Change Password"
        ),
        React.createElement(
            "label",
            { className: "sr-only", htmlFor: "password2" },
            "Password: "
        ),
        React.createElement("input", { className: "form-control", type: "password", name: "password2", placeholder: "Type a new password", required: true }),
        React.createElement(
            "label",
            { className: "sr-only", htmlFor: "password3" },
            "Password: "
        ),
        React.createElement("input", { className: "form-control", type: "password", name: "password3", placeholder: "Confirm your new password", required: true }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDeckSubmit formSubmit", type: "submit", value: "Change Password" })
    );
};

var StatsList = function StatsList(props) {
    var createdDate = new Date(props.stats.createdDate);
    return React.createElement(
        "div",
        { className: "statList" },
        React.createElement(
            "div",
            { key: props.stats._id, className: "stat" },
            React.createElement(
                "h3",
                { className: "stat" },
                "Username: ",
                props.stats.username,
                " "
            ),
            React.createElement(
                "h3",
                { className: "stat" },
                " Member Since: ",
                createdDate.getMonth(),
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
        processData: true,
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
