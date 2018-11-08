const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let DeckModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DeckSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  deck: {
    type: Object,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

DeckSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  deck: doc.deck,
});

DeckSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return DeckModel.find(search).select('name age level').exec(callback);
};

DeckModel = mongoose.model('Deck', DeckSchema);

module.exports.DeckModel = DeckModel;
module.exports.DeckSchema = DeckSchema;
