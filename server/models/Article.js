'use strict';
var mongoose = require('mongoose');
var request = require('request-promise-native');
var cheerio = require('cheerio');
var Paragraph = require('./Paragraph');

var Schema = mongoose.Schema;

var ArticlesSchema = new Schema({
    url: String,
    title: String,
    paragraphs: [
        { type: Schema.Types.ObjectId, ref: 'Paragraph' }
    ]
});

ArticlesSchema.statics.getOrCreate = function (articleUrl) {
    var Article = this;

    return Article
        .findOne({ url: articleUrl })
        .populate('paragraphs')
        .exec()
        .then(article => {
            if (article) { return article; }

            return Article.parsePage(articleUrl).then((parsedPage) => {
                return Paragraph
                    .insertMany(parsedPage.paragraphs)
                    .then(function (paragraphs) {
                        let article = new Article();
                        article.title = parsedPage.title;
                        article.url = parsedPage.articleUrl;
                        article.paragraphs = paragraphs.map(e => e._id);

                        return article.save().then(() => {
                            article.paragraphs = paragraphs;
                            return article;
                        })
                    })
            });
        });
}


ArticlesSchema.statics.parsePage = function (articleUrl) {
    console.log(222)
    return request({
        uri: articleUrl,
        transform: body => { return cheerio.load(body); }
    }).then(function ($) {
        console.log(1.5)

        var title = $('h2.headline').text()
        var paragraphs = $('.lab-bodytext-content > p')
            .map((i, paragraph) => {
                return { originalText: $(paragraph).text().toString() }
            })
            .toArray();

        return {
            title: title,
            articleUrl: articleUrl,
            paragraphs: paragraphs
        }
    });
}


module.exports = mongoose.model('Article', ArticlesSchema);
