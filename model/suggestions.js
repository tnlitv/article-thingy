'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SuggestionsSchema = new Schema({
    text: String,
    is_approved: {type: Boolean, default: false}
});

module.exports = mongoose.model('Suggestion', SuggestionsSchema);
