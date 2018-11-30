let openDeck = "";

const handleDeck = (e) => {
    if(openDeck != e._id) {
        if(openDeck != "") {
            document.getElementById(openDeck).style.backgroundColor = "white";
        }
        
        ReactDOM.render(
            <CardList cards={[e.cards]} />, document.querySelector("#deckResults")
        );
        
        ReactDOM.render(
            <DeckInfo cards={[e.cards]} />, document.querySelector("#deckInfo")
        );
        
        openDeck = e._id;
        document.getElementById(openDeck).style.backgroundColor = "lightblue";
        return true;
    }
    
    ReactDOM.render(
        <CardList cards={[]} />, document.querySelector("#deckResults")
    );
    
    document.getElementById(openDeck).style.backgroundColor = "white";
    openDeck = "";
    return true;
};

const DeckInfo = function(cardList) {
    let keys = Object.values(cardList['cards'][0]);
    let numCards = 0;
    for(let i = 0; i < keys.length; i++) {
        numCards += keys[i].count;
    }
    return (
        <div className="deckInfo">
            <p className="info-number">{numCards}</p>
        </div>
    );
};

const CardList = function(cardList) {
    if(Object.keys(cardList['cards']).length === 0) {
        return (
            <div className="container-fluid pt-3 rounded">
                <div className="cardList row flex-row" align="center">
                    <h3 className="emptyCard">Select a deck by clicking on it's tab or make one by pressing the New Deck button!</h3>
                </div>
            </div>
        );
    }
    
    const cardNodes = [];
    let keys = Object.values(cardList['cards'][0]);
    for(let i = 0; i < keys.length; i++) {
        cardNodes[i] = (<div key={i} className="card col-xs-2" align="center">
                <img className="card-img-top" src={keys[i].imageUrl} alt={keys[i].name}/>
                <p className="card-img-number">{keys[i].count}</p>
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
            <div key={deck._id} id={deck._id} className="card col-xs-2" align="center">
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
        
        if(data.decks.length > 0) {
            handleDeck(data.decks[0]);
        }
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