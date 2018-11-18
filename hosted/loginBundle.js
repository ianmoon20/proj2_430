"use strict";

var handleLogin = function handleLogin(e) {
    e.preventDefault();

    if ($("#user").val() == '' || $("#pass").val == '') {
        handleError("RAWR! Username or password is empty");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

var handleSignup = function handleSignup(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val == '' || $("pass2").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    if ($("#pass").val == $("pass2").val()) {
        handleError("RAWR! Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

var LoginWindow = function LoginWindow(props) {
    return React.createElement(
        "form",
        { id: "loginForm", name: "loginForm", onSubmit: handleLogin, action: "/login", method: "POST", className: "mainForm" },
        React.createElement(
            "label",
            { className: "sr-only", "for": "username" },
            "Username:"
        ),
        React.createElement("input", { className: "input", type: "text", name: "username", placeholder: "username", required: true }),
        React.createElement(
            "label",
            { className: "sr-only", "for": "pass" },
            "Password:"
        ),
        React.createElement("input", { className: "input", type: "password", name: "pass", placeholder: "password", autocomplete: "current-password", required: true }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Log In" })
    );
};

var createLoginWindow = function createLoginWindow(csrf) {
    ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf) {
    ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

var SignupWindow = function SignupWindow(props) {
    return React.createElement(
        "form",
        { id: "signupForm", name: "signupForm", onSubmit: handleSignup, action: "/signup", method: "POST", className: "mainForm" },
        React.createElement(
            "label",
            { className: "sr-only", "for": "username" },
            "Username:"
        ),
        React.createElement("input", { className: "input", type: "text", name: "username", placeholder: "username", required: true }),
        React.createElement(
            "label",
            { className: "sr-only", "for": "pass" },
            "Password:"
        ),
        React.createElement("input", { className: "input", type: "password", name: "pass", placeholder: "password", autocomplete: "current-password", required: true }),
        React.createElement(
            "label",
            { className: "sr-only", "for": "pass2" },
            "Confirm Password:"
        ),
        React.createElement("input", { className: "input", type: "password", name: "pass2", placeholder: "retype password", required: true }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign Up" })
    );
};

var setup = function setup(csrf) {
    var loginButton = document.querySelector("#loginButton");
    var signupButton = document.querySelector("#signupButton");

    signupButton.addEventListener("click", function (e) {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", function (e) {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    createLoginWindow(csrf);
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
