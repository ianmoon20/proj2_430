const MissingMessage = function () {
    return (
            <div className="jumbotron">
                <h1 className="header">Page Not Found</h1>
                <p>The page you are looking for may have been removed, had its name changed, or be temporarily unavailable.</p>
                <ul className="link-list list-inline">
                    <li className="list-inline-item"><a href="/maker">Back to Safety</a></li>
                </ul>
            </div>
    )
};

const setup = function(csrf) {
    ReactDOM.render(
        <MissingMessage />, document.querySelector("#content")
    );
};

$(document).ready(function() {
    setup();
});