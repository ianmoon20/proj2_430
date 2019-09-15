//Deck currently opened
let openDeck = "";

//When a deck is selected, we need to apply the proper stylings to the listing
const handleDeck = (e) => {
    //Displaying the new deck and applying styling to its listing when we select a new deck
    if(openDeck != e._id) {
        if(openDeck != "") {
            document.getElementById(openDeck).style.backgroundColor = "#FFEEF2";
        }
        
        ReactDOM.render(
            <CardList cards={[e.cards]} />, document.querySelector("#deckResults")
        );
        
        ReactDOM.render(
            <DeckInfo cards={[e.cards]} />, document.querySelector("#deckInfo")
        );
        
        openDeck = e._id;
        
        //E5FFDE D0E3CC
        document.getElementById(openDeck).style.backgroundColor = "#D4D2D5";
        return true;
    }
    
    //If we aren't selecting a new deck, we're selecting the same one and need to deselect it
    ReactDOM.render(
        <CardList cards={[]} />, document.querySelector("#deckResults")
    );
    
    ReactDOM.render(
        <DeckInfo cards={[]} />, document.querySelector("#deckInfo")
    );
    
    document.getElementById(openDeck).style.backgroundColor = "#FFEEF2";
    openDeck = "";
    return true;
};

//Deleting a deck from the server
const deleteDeck = (e) => {
    sendAjax('GET', '/getToken', null, (result) => {
        sendAjax('DELETE', "/deleteDeck", "_csrf="+result.csrfToken+"&deck="+e._id, () => {
            //Loading the new decklist
            loadDecksFromServer();
        });
    });
};

//Displaying the amount of cards in the deck
const DeckInfo = function(cardList) {
    if(cardList.cards.length != 0) {
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
    }
    return (
        <div className="deckInfo">
            <p className="info-number"></p>
        </div>
    );
};

//Getting a list of the cards in the deck
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

//Displaying the deck list
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
            <div key={deck._id} id={deck._id} className="deck row flex-row" align="center">
                <a href="#" className="deckName h3 col-xs-11 col-sm-11" onClick={() => handleDeck(deck)}>{deck.name}</a>
                <button type="button" className="btn btn-danger col-xs-1 col-sm-1" onClick={() => deleteDeck(deck)}>Delete</button>
            </div>
        );
    });
    
    return (
        <div className="deckList">
            {deckNodes}
        </div>
    );
};

//Create Deck Button
const ButtonForm = (props) => {
    return (
        <form id="buttonForm" name="buttonForm" action="/create" method="GET" className="buttonForm">
            <input className="createDeckSubmit formSubmit" type="submit" value="New Deck" />
        </form>
    );
};


//Gets a list of decks from the server and decides what to do with the list depending on size
const loadDecksFromServer = () => {
    sendAjax('GET', '/getDecks', null, (data) => {
        ReactDOM.render(
            <DeckList decks={data.decks} />, document.querySelector("#deck")
        );
        
        if(data.decks.length > 0) {
            //If there are decks loaded, we handle the deck info for the first one.
            
            //Resetting the open deck whenever we load from the server to ensure that the first entry always has proper stylings
            openDeck = "";
            handleDeck(data.decks[0]);
        } else if(data.decks.length === 0) {
            ReactDOM.render(
                <CardList cards={[]} />, document.querySelector("#deckResults")
            );

            ReactDOM.render(
                <DeckInfo cards={[]} />, document.querySelector("#deckInfo")
            );
            openDeck = "";
        }
    });
};

//Setting up the page
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

//Getting csrf
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});