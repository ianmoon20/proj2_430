const handleLogin = (e) => {
    e.preventDefault();
    
    if($("#user").val() == '' || $("#pass").val == '') {
        handleError("RAWR! Username or password is empty");
        return false;
    }
    
    console.log($("input[name=_csrf]").val());
    
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
    
    return false;
};

const handleSignup = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'}, 350);
    
    if($("#user").val() == '' || $("#pass").val == '' || $("pass2").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }
    
    if($("#pass").val == $("pass2").val()) {
        handleError("RAWR! Passwords do not match");
        return false;
    }
    
    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
    
    return false;
};

const LoginWindow = (props) => {
    return (
        <form id="loginForm" name="loginForm" onSubmit={handleLogin} action="/login" method="POST" className="mainForm">
        <label className="sr-only" for="username">Username:</label>
        <input className="input" type="text" name="username" placeholder="username" required/>
        <label className="sr-only" for="pass">Password:</label>
        <input className="input" type="password" name="pass" placeholder="password" autocomplete="current-password" required/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit" type="submit" value="Log In" />
        </form>
    );
};

const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const SignupWindow = (props) => {
    return (
        <form id="signupForm" name="signupForm" onSubmit={handleSignup} action="/signup" method="POST" className="mainForm">
        <label className="sr-only" for="username">Username:</label>
        <input className="input" type="text" name="username" placeholder="username" required/>
        <label className="sr-only" for="pass">Password:</label>
        <input className="input" type="password" name="pass" placeholder="password" autocomplete="current-password" required/>
        <label className="sr-only" for="pass2">Confirm Password:</label>
        <input className="input" type="password" name="pass2" placeholder="retype password" required />
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit" type="submit" value="Sign Up" />
        </form>
    );
};

const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");
    
    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });
    
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });
    
    createLoginWindow(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
       setup(result.csrfToken); 
    });
};

$(document).ready(function() {
    getToken();
});