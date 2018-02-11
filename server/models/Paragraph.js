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

ParagraphsSchema.statics.addSuggestion = function (_id, suggestion) {
    let Paragraph = this;

    return Paragraph.findById(_id)
        .then(function (paragraph) {

            let foundSuggestion = paragraph.suggestions.find(function (element) {
                return element.text === suggestion.text
            });

            if (foundSuggestion) { return foundSuggestion._id }

            // if suggestion is approved, unapprove all other suggestions
            if (suggestion.is_approved) {
                //maybe move approval to separate function? 
                paragraph.suggestions.forEach(function (element, index) {
                    paragraph.suggestions[index].is_approved = false
                });
            }

            paragraph.suggestions.push({
                text: suggestion.text,
                is_approved: suggestion.is_approved
            });

            return paragraph
                .save()
                .then(paragraph => {
                    return paragraph.suggestions.find(element => {
                        return element.text === suggestion.text
                    });
                });
        })
};

ParagraphsSchema.query.approved = function(showApproved){
    if( showApproved){
        return this.find({ 'suggestions.is_approved': true })
    }
    return this.find({ suggestions: { $gt: [] }, 'suggestions.is_approved': { $ne: true } })
}

module.exports = mongoose.model('Paragraph', ParagraphsSchema);
