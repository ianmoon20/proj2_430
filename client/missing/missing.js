const MissingMessage = function () {
    return (
        <div className="jumbotron">
            <h1 className="header">Page Not Found</h1>
            <p>The page you are looking for may have been removed, had its name changed, or be temporarily unavailable.</p>
            <ul className="link-list list-inline">
                <li className="list-inline-item"><a href="/login">Login</a></li>
                <li className="list-inline-item"><a href="/maker">Deck List</a></li>
                <li className="list-inline-item"><a href="/stats">Stats</a></li>
            </ul>
        </div>
    )
}

const setup = function(csrf) {
    ReactDOM.render(
        <MissingMessage />, document.querySelector("#content")
    );
};

$(document).ready(function() {
    setup();
});