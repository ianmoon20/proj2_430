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
            { className: "sr-only", htmlFor: "password2" },
            "Password: "
        ),
        React.createElement("input", { id: "passwordBox", type: "text", name: "password2", placeholder: "Type a new password", required: true }),
        React.createElement(
            "label",
            { className: "sr-only", htmlFor: "password3" },
            "Password: "
        ),
        React.createElement("input", { id: "passwordBox", type: "text", name: "password3", placeholder: "Confirm your new password", required: true }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDeckSubmit", type: "submit", value: "Change Password" })
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
                { className: "statName" },
                "Username: ",
                props.stats.username,
                " "
            ),
            React.createElement(
                "h3",
                { className: "statAge" },
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
