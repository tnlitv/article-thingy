'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticlesSchema = new Schema({
    url: String,
    title: String,
    paragraphs: [
        {type: Schema.Types.ObjectId, ref: 'Paragraph'}
    ]
});

module.exports = mongoose.model('Article', ArticlesSchema);
