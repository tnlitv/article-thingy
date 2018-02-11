const express = require('express');

const Article = require('../../models/Article');
const Paragraph = require('../../models/Paragraph');

module.exports = (app) => {
    var router = express.Router();

    router.get('/all', function (req, res) {
        Article.find()
            .then(articles => res.json(articles))
            .catch(err => res.status(500).send(err))
    });

    router.route('/articles')
        .get(function (req, res) {
            const articleUrl = req.query.articleUrl;
            if (!articleUrl) {
                res.status(500).send('Please specify article url')
                return;
            }

            Article
                .getOrCreate(articleUrl)
                .then(article => { res.json(article) })
                .catch(err => { res.status(500).send(err) })
        });

    router.route('/paragraphs/:paragraph_id')
        .delete(function (req, res) {
            Paragraph
                .remove({ _id: req.params.paragraph_id })
                .then(comment => { res.json({ message: 'Paragraph has been deleted' }) })
                .catch(err => { res.status(500).send(err) })
        })

    router.route('/paragraphs/:paragraph_id/suggestions')
        .post(function (req, res) {
            let suggestion = {
                text: req.body.text,
                is_approved: req.body.is_approved
            }

            Paragraph.addSuggestion(req.params.paragraph_id, suggestion)
                .then(suggestion => res.json(suggestion))
                .catch(err => { res.status(500).send(err) })
        })
        .put(function (req, res) {
            Paragraph
                .findById(req.params.paragraph_id)
                .then(function (paragraph) {
                    //maybe move approval to separate function? 
                    paragraph.suggestions.forEach(function (element, index) {
                        paragraph.suggestions[index].is_approved = element._id == req.body.id
                    }, this);

                    return paragraph.save()
                })
                .then(paragraph => res.json(paragraph))
        });

    router.route('/suggestions')
        .get(function (req, res) {
            const showApproved = req.query.showApproved === 'true';

            Paragraph
                .find()
                .approved(showApproved)
                .exec()
                .then(paragraphs => { res.json(paragraphs) })
                .catch(err => { res.status(500).send(err) })

        })
    app.use('/api', router)

};
