const handleDeck = (e) => {
    console.log(e.cards);
};

const DeckList = function(props) {
    if(props.decks.length === 0) {
        return (
            <div className="container-fluid pt-3 rounded">
                <div className="deckList row flex-row">
                    <h3 className="emptyDeck">No decks made!</h3>
                </div>
            </div>
        );
    }
    
    const deckNodes = props.decks.map(function(deck) {
        return (
            <div key={deck._id} className="card col-xs-2" align="center">
                <h3 className="deckName" onClick={() => handleDeck(deck)}>Name: {deck.name} </h3>
            </div>
        );
    });
    
    return (
        <div className="deckList">
            {deckNodes}
        </div>
    );
};

const ButtonForm = (props) => {
    return (
        <form id="buttonForm" name="buttonForm" action="/create" method="GET" className="buttonForm">
            <input className="createDeckSubmit formSubmit" type="submit" value="New Deck" />
        </form>
    );
};

const loadDecksFromServer = () => {
    sendAjax('GET', '/getDecks', null, (data) => {
        console.log(data);
        ReactDOM.render(
            <DeckList decks={data.decks} />, document.querySelector("#deck")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <ButtonForm csrf={csrf} />, document.querySelector("#createButton")
    );
    
    ReactDOM.render(
        <DeckList decks={[]} />, document.querySelector("#deck")
    );
    
    loadDecksFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});