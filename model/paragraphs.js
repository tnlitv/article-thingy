'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ParagraphsSchema = new Schema({
    originalText: String,
    suggestions: [{
        text: String,
        is_approved: { type: Boolean, default: false }
    }]
});

module.exports = mongoose.model('Paragraph', ParagraphsSchema);
