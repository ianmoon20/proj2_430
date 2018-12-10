const handlePassword = (e) => {
    e.preventDefault();
    
    sendAjax('PUT', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), redirect);
    
    return false;
};

const PasswordForm = (props) => {
    return (
        <form id="passwordForm" onSubmit={handlePassword} name="passwordForm" action="/change" method="PUT" className="passwordForm">
            <label className="h3 deckName">Change Password</label>
            <div className="input-group">
                <label className="sr-only" htmlFor="password2">Password: </label>
                <input className="form-control" type="password" name="password2" autoComplete="new-password" placeholder="Type a new password" required/>
                <label className="sr-only" htmlFor="password3">Password: </label>
                <input className="form-control" type="password" autoComplete="new-password" name="password3" placeholder="Confirm your new password" required/>
                <input type="hidden" name="_csrf" value={props.csrf} />
                <button className="btn btn-primary" type="submit" value="Change Password">Submit</button>
            </div>
        </form>
    );
};

const StatsList = function(props) {
    const createdDate = new Date(props.stats.createdDate);
    
    //Have to use a modulus on getMonth because for some reason that's the only one that returns a 0 based array. (January = 0, December = 11)
    return (
        <div className="statList">
            <div key={props.stats._id} className="stat">
                <h3 className="stat deckName">Username: {props.stats.username} </h3>
                <h3 className="stat deckName"> Member Since: {(createdDate.getMonth() + 1) % 13}/{createdDate.getDate()}/{createdDate.getFullYear()}</h3>
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