const handlePassword = (e) => {
    e.preventDefault();
    
    sendAjax('PUT', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), redirect);
    
    return false;
};

const PasswordForm = (props) => {
    return (
        <form id="passwordForm" onSubmit={handlePassword} name="passwordForm" action="/change" method="PUT" className="passwordForm">
            <label className="h3">Change Password</label>
            <label className="sr-only" htmlFor="password2">Password: </label>
            <input className="form-control" type="password" name="password2" placeholder="Type a new password" required/>
            <label className="sr-only" htmlFor="password3">Password: </label>
            <input className="form-control" type="password" name="password3" placeholder="Confirm your new password" required/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDeckSubmit formSubmit" type="submit" value="Change Password" />
        </form>
    );
};

const StatsList = function(props) {
    const createdDate = new Date(props.stats.createdDate);
    return (
        <div className="statList">
            <div key={props.stats._id} className="stat">
                <h3 className="stat">Username: {props.stats.username} </h3>
                <h3 className="stat"> Member Since: {createdDate.getMonth()}/{createdDate.getDate()}/{createdDate.getFullYear()}</h3>
            </div>
        </div>
    );
};

const loadStatsFromServer = () => {
    sendAjax('GET', '/getStats', null, (data) => {
        ReactDOM.render(
            <StatsList stats={data.stats} />, document.querySelector("#stats")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <StatsList stats={[]} />, document.querySelector("#stats")
    );
    
    ReactDOM.render(
        <PasswordForm csrf={[csrf]} />, document.querySelector("#password")
    );
    
    loadStatsFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});