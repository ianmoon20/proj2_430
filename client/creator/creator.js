let cardsList = {};
let cardCount = 0;
let numCards = 0;

let timeout = null;

const addCard = (card) => {
    let isCardAdded = true;
    for(let i = 0; i < cardCount; i++) {
        if(cardsList[i].imageUrl === card.imageUrl) {
            if(cardsList[i].count + 1 < 999) {
                cardsList[i].count++;
                numCards++;
            }
            
            isCardAdded = false;
        }
    }
    if(isCardAdded === true) {
        cardsList[cardCount] = {
            imageUrl: card.imageUrl,
            name: card.name,
            count: 1
        };
        cardCount++;
        numCards++;
    };
    
    ReactDOM.render(
        <DeckInfo number={numCards} />, document.querySelector("#deckInfo")
    );
    
    ReactDOM.render(
        <DeckList cards={[cardsList]} />, document.querySelector("#deckList")
    );
};

const removeCard = (e) => {
    cardsList[e].count--;
    
    if(cardsList[e].count < 1) {
        delete cardsList[e];
        cardCount--;
    };
    
    numCards--;
    
    ReactDOM.render(
        <DeckInfo number={numCards} />, document.querySelector("#deckInfo")
    );
    
    ReactDOM.render(
        <DeckList cards={[cardsList]} />, document.querySelector("#deckList")
    );
};

const handleDeck = (e) => {
    e.preventDefault();
    
    const name = $("#deckName").val();
    
    if(name.trim() == '' || Object.keys(cardsList).length === 0) {
        return false;
    }
    
    let list = encodeURIComponent(JSON.stringify(cardsList));
    sendAjax('POST', $("#deckForm").attr("action"), $("#deckForm").serialize() + '&cards=' + list, redirect, false);
    
    return false;
};

const handleSearch = (e) => {
    e.preventDefault();
    
    //Clearing the timeout
    clearTimeout(timeout);
    
    //Only querying the server every 500 ms
    timeout = setTimeout(() => {
        return loadCardsFromServer($("#cardName").val());
    }, 500);
};

const DeckForm = (props) => {
    return (
        <form id="deckForm" onSubmit={handleDeck} name="deckForm" action="/create" method="POST" className="deckForm">
            <input className="form-control" id="deckName" type="text" name="name" placeholder="Enter a deck name..." pattern="[a-zA-Z0-9 ]+" title="Alphanumeric characters only (a-z, A-Z, and 0-9)" required/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Submit Deck" />
        </form>
    );
};
const SearchForm = (props) => {
    return (
        <form id="searchForm" onSubmit={handleSearch} name="searchForm" action="/getCards" method="GET" className="searchForm">
            <input className="form-control" id="cardName" type="text" onChange={handleSearch} name="name" placeholder="Type to search for a card..." required />
        </form>
    );
};

const CardList = function(props) {
    if(!props.cards[0] || props.cards[0].length === 0) {
        return (
            <div className="container-fluid pt-3">
                <div className="cardList row flex-row" align="center">
                    <h3 className="emptyCard">No cards match search</h3>
                </div>
            </div>
        );
    }
    
    const cardNodes = props.cards[0].map((card) => {
        return (
            <div key={card.id} className="card col-xs-2" align="center">
                <img className="card-img-top" src={card.imageUrl} alt={card.name} onClick={() => addCard(card)}/>
            </div>
        );
    });
    
    return (
        <div className="container-fluid pt-3">
            <div className="cardList row flex-row" align="center">
                {cardNodes}
            </div>
        </div>
    );
};

const DeckInfo = function(number) {
    return (
        <div className="deckInfo">
            <p className="info-number">{number['number']}</p>
        </div>
    );
};

const DeckList = function(cardList) {
    if(Object.keys(cardsList).length === 0) {
        return (
            <div className="container-fluid pt-3 rounded">
                <div className="cardList row flex-row" align="center">
                    <h3 className="emptyCard">No cards in Deck</h3>
                </div>
            </div>
        );
    }
    
    const cardNodes = [];
    const keys = Object.keys(cardsList);
    
    for(let i = 0; i < cardCount; i++) {
        cardNodes[i] = (<div key={i} className="card col-xs-2" align="center">
                <img className="card-img-top" src={cardsList[keys[i]].imageUrl} alt={cardsList[keys[i]].name} onClick={(e) => removeCard(keys[i])}/>
                <p className="card-img-number">{cardsList[keys[i]].count}</p>
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

const loadCardsFromServer = (cardName) => {
    sendAjax('GET', '/getCards', {name: cardName}, (data) => {
        //Making sure we only display cards with an image
        let cards = [];
        for(let i = 0; i < data.cards.length; i++) {
            if(data.cards[i].imageUrl) {
                cards.push(data.cards[i]);
            }
        }
        ReactDOM.render(
            <CardList cards={[cards]} />, document.querySelector("#searchResults")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <DeckForm csrf={csrf} />, document.querySelector("#deck")
    );
    ReactDOM.render(
        <SearchForm csrf={csrf} />, document.querySelector("#search")
    );
    
    ReactDOM.render(
        <CardList cards={[]} />, document.querySelector("#searchResults")
    );
    
    ReactDOM.render(
        <DeckInfo number={numCards} />, document.querySelector("#deckInfo")
    );
    
    ReactDOM.render(
        <DeckList cards={[]} />, document.querySelector("#deckList")
    );
    
    loadCardsFromServer("");
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});