const handleDeck = (e) => {
    ReactDOM.render(
        <CardList cards={[e.cards]} />, document.querySelector("#deckResults")
    );
};

const CardList = function(cardList) {
    console.log(cardList);
    if(Object.keys(cardList['cards']).length === 0) {
        return (
            <div className="container-fluid pt-3 rounded">
                <div className="cardList row flex-row" align="center">
                    <h3 className="emptyCard">Select a deck by clicking on it's tab. If you have no decks, make one by pressing the New Deck button!</h3>
                </div>
            </div>
        );
    }
    
    const cardNodes = [];
    let keys = Object.keys(cardList['cards'][0]).length;
    
    for(let i = 0; i < keys; i++) {
        cardNodes[i] = (<div key={i} className="card col-xs-2" align="center">
                <img className="card-img-top" src={cardList['cards'][0][i].imageUrl} alt={cardList['cards'][0][i].name}/>
            </div>)
    }
    
    return (
        <div className="container-fluid pt-3 rounded">
            <div className="cardList row flex-row" align="center">
                {cardNodes}
            </div>
        </div>
    );
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
                <a href="#" className="deckName h3" onClick={() => handleDeck(deck)}>{deck.name}</a>
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
    ReactDOM.render(
        <CardList cards={[]} />, document.querySelector("#deckResults")
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