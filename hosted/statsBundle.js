"use strict";

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
                "User: ",
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
        console.log(data);
        ReactDOM.render(React.createElement(StatsList, { stats: data.stats }), document.querySelector("#stats"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(StatsList, { stats: [] }), document.querySelector("#stats"));

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
