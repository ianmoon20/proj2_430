const handleError = (message) => {
    $("#errorMessage").fadeIn().delay(2500).fadeOut();
    $("#errorMessage").text(message);
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
        processData: true,
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};