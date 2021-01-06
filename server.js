const express = require('express');
const app = express();

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');
const { idGenerator } = require('./idGenerator');
quotes.forEach(quoteObject => {idGenerator(quoteObject)})

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));
app.listen(PORT)

app.get('/api/quotes/random', (req, res, next) => {
    res.send({quote: getRandomElement(quotes)})
})

app.get('/api/quotes', (req, res, next) => {
    if (req.query.person) {
        const quotesFormPerson = quotes.filter(quoteObject => quoteObject.person === req.query.person)
        res.send({quotes: quotesFormPerson})
    } else {
        res.send({quotes: quotes})
    }
})

app.post('/api/quotes', (req, res, next) => {
    if (req.query.quote && req.query.person) {
        const newQuote = {
            quote: req.query.quote, 
            person: req.query.person,
        }
        idGenerator(newQuote)
        quotes.push(newQuote)
        res.status(201).send({quote: newQuote})
    } else {
        res.status(400).send()
    }
})

app.put('/api/quotes', (req, res, next) => {
    if (req.query.quote && req.query.person) {
        quotes.forEach(quote => {
            if (quote.id == req.query.id) {
                quote.quote = req.query.quote
                quote.person = req.query.person
                res.status(201).send({quote: quote})
            }
        })
    } else {
        res.status(400).send()
    }
})

app.delete('/api/quotes', (req, res, next) => {
    let quoteIndex = null;
    quotes.forEach((quote, index) => {
        if (quote.id == req.query.id) quoteIndex = index
    })
    if (quoteIndex == null) {
        res.status(404).send()
    } else {
        quotes.splice(quoteIndex, 1)
        res.status(204).send()
    }
})