'use strict'

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const cheerio = require('cheerio');
var request = require('request');

//can i rewrite this with {} ? 
var Comment = require('./model/comments');
var Article = require('./model/articles');
var Paragraph = require('./model/paragraphs');
var Suggestion = require('./model/suggestions');

var app = express();
var cors = require('cors');
var router = express.Router();


var port = process.env.API_PORT || 3001;
mongoose.connect('mongodb://localhost/test');


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.use(function(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

router.get('/all', function(req, res) {
    Article.find(function(err, articles) {
        if (err) res.send(err);
        console.log(articles)
        res.json(articles)
    })
});

router.route('/articles').get(function(req, res) {
    const articleUrl = req.query.articleUrl;
    console.log(req.query);
    if (!articleUrl) {
        res.status(500).send('Please specify article url')
        return;
    }
    Article.findOne({ url: articleUrl }).populate('paragraphs').exec(function(err, article) {
        if (err) res.send(err);

        if (article) {
            res.json(article);
            return;
        }
        request(articleUrl, function(err, resp, body) {
            var $ = cheerio.load(body);
            var title = $('h2.headline').text()
            var paragraphs = $('.lab-bodytext-content > p').map(function(i, paragraph) {
                return {
                    originalText: $(paragraph).text().toString()
                }
            }).toArray();

            Paragraph.insertMany(paragraphs).then(function(paragraphs) {
                article = new Article();
                article.title = title;
                article.url = articleUrl;
                article.paragraphs = paragraphs.map(e => e._id);
                article.save(function(err) {
                    if (err) res.send(err);
                    article.paragraphs = paragraphs;
                    res.json(article);
                })
            })
        });
    });
});

router.route('/paragraphs/:paragraph_id')
    .delete(function(req, res) {
        Paragraph.remove({ _id: req.params.paragraph_id }, function(err, comment) {
            if (err) res.send(err);
            res.json({ message: 'Paragraph has been deleted' })
        })
    })

router.route('/paragraphs/:paragraph_id/suggestions')
    .post(function(req, res) {
        Paragraph
            .findById(req.params.paragraph_id, function(err, paragraph) {
                if (err) res.send(err);

                let foundSuggestion = paragraph.suggestions.find(function(suggestion) {
                    return suggestion.text === req.body.text
                });
                if (foundSuggestion) {
                    res.status(200).json({
                        id: foundSuggestion._id
                    });
                    return;
                }

                paragraph.suggestions.forEach(function(element, index) {
                    paragraph.suggestions[index].is_approved = false
                }, this);

                paragraph.suggestions.push({
                    text: req.body.text,
                    is_approved: req.body.is_approved
                });

                console.log(paragraph.suggestions.map(e => e.is_approved))
                paragraph.save(function(err, obj) {
                    if (err) res.send(err);
                    res.status(200).json({
                        id: paragraph.suggestions.find(function(suggestion) {
                            return suggestion.text === req.body.text
                        })._id
                    });
                })
            })
    })
    .put(function(req, res) {
        Paragraph.findById(req.params.paragraph_id, function(err, paragraph) {
            if (err) res.send(err);

            paragraph.suggestions.forEach(function(element, index) {
                paragraph.suggestions[index].is_approved = element._id == req.body.id
            }, this);
            paragraph.save(function(err) {
                if (err) res.send(err);
                res.status(200).send();
            })
        })
    });

router.route('/suggestions')
    .get(function(req, res) {
        let query;
        if (req.query.showApproved === 'true') {
            query = { 'suggestions.is_approved': true }
        }
        else {
            //not sure if this works :(
            query = { 'suggestions.is_approved': { $all: [false] } }
        }
        console.log(query);
        Paragraph
            .find(query)
            .exec(function(err, paragraphs) {
                if (err) res.send(err);

                res.json(paragraphs)
            })
    })

app.use('/api', router);

app.listen(port, function() {
    console.log(`api running on port ${port}`);
});