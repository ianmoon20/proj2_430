let cards = {};

const handleDeck = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'}, 350);
    
    if($("#deckName").val() == '') {
        handleError("RAWR! Deck name is required");
        return false;
    }
    
    if(Object.keys(cards).length === 0) {
        handleError("RAWR! Deck needs cards");
        return false;
    }
    
    sendAjax('POST', $("#deckForm").attr("action"), $("#deckForm").serialize(), function() {
        loadDecksFromServer();
    });
    
    return false;
};

const DeckForm = (props) => {
    return (
        <form id="deckForm" onSubmit={handleDeck} name="deckForm" action="/maker" method="POST" className="deckForm">
            <label htmlFor="name">Name: </label>
            <input id="deckName" type="text" name="name" placeholder="Deck Name" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDeckSubmit" type="submit" value="Submit Deck" />
        </form>
    );
};

const cardSearchBar = () => {
    return (
        <input type="text" id="searchBar" oninput={findCards} name="search" placeholder="Search cards here" />
    );
};

const findCards = () => {
    const searchBar = document.querySelector("#searchBar");
    
    loadCardsFromServer({name: searchBar.value});
};

const CardList = function(props) {
    if(props.cards.length === 0) {
        return (
            <div className="cardList">
                <h3 className="emptyCards">No Cards Found</h3>
            </div>
        );
    }
    
    const cardNodes = props.cards.map(function(card) {
        return (
            <div className="card" onclick={addCard(card.imageURL)}>
                <img src={card.imageURL} alt={card.name} />
            </div>
        );
    });
    
    return (
        <div className="cardList">
            {cardNodes}
        </div>
    );
};

const DeckList = function(props) {
    console.log(props);
    if(props.decks.length === 0) {
        return (
            <div className="deckList">
                <h3 className="emptyDeck">No Decks Yet</h3>
            </div>
        );
    }
    
    const deckNodes = props.decks.map(function(deck) {
        return (
            <div key={deck._id} className="deck" onclick={displayDeck("cards", deck.cards)}>
                <h3 className="deckName">Name: {deck.name} </h3>
            </div>
        );
    });
    
    return (
        <div className="deckList">
            {deckNodes}
        </div>
    );
};

const loadDecksFromServer = () => {
    sendAjax('GET', '/getDecks', null, (data) => {
        console.log(data);
        ReactDOM.render(
            <DeckList decks={data.decks} />, document.querySelector("#decks")
        );
    });
};

const loadCardsFromServer = (name) => {
    sendAjax('GET', '/getCards', name, (data) => {
        ReactDOM.render(
            <CardList cards={[data.cards]} />, document.querySelector("#searchCards")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <DeckForm csrf={csrf} />, document.querySelector("#makeDeck")
    );
    
    ReactDOM.render(
        <cardSearchBar />, document.querySelector("#searchCardsBar")
    );
    
    ReactDOM.render(
        <CardList cards={[]} />, document.querySelector("#searchCards")
    );
    
    ReactDOM.render(
        <DeckList decks={[]} />, document.querySelector("#decks")
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