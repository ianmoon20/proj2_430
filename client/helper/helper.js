const handleError = (message) => {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({width:'toggle'}, 350);
};

const redirect = (response) => {
    $("#domoMessage").animate({width:'hide'}, 350);
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success, process) => {
    let processInfo = true;
    if(process) {
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
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};