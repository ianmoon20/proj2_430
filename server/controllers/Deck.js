const models = require('../models');

const Deck = models.Deck;
const mtg = require('mtgsdk');

const makerPage = (req, res) => {
  Deck.DeckModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), deck: docs });
  });
};

const makeDeck = (req, res) => {
  if (req.body.decklist.length === 0 || !req.body.name) {
    return res.status(400).json({ error: 'RAWR! Deck Name and cards are required' });
  }

  const deckData = {
    name: req.body.name,
    cards: req.body.cards,
    owner: req.session.account._id,
  };

  const newDeck = new Deck.DeckModel(deckData);

  const deckPromise = newDeck.save();

  deckPromise.then(() => res.json({ redirect: '/maker' }));

  deckPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Deck already exists' });
    }
    return res.status(400).json({ error: 'An error occured' });
  });

  return deckPromise;
};

const getDecks = (request, response) => {
  const req = request;
  const res = response;

  return Deck.DeckModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ decks: docs });
  });
};

const getCards = (request, response) => {
  const req = request;
  const res = response;
    // For some reason this doesn't want to work as decribed here https://github.com/MagicTheGathering/mtg-sdk-javascript
    // Also tried looking at the API here https://docs.magicthegathering.io/#advancedcards_get_by_name

    // This should give all the cards that include the name but is instead returning nothing
  mtg.card.where({ name: `${req.body.name}` })
  .then(cards => {
    console.log(cards);
    res.json({ cards });
  });
};

module.exports.makerPage = makerPage;
module.exports.getDecks = getDecks;
module.exports.getCards = getCards;
module.exports.make = makeDeck;
