const submitButton = document.getElementById('submit-quote');
const deleteButton = document.getElementById('delete-quote')
const textArea = document.getElementById('quote-text')
const message = document.getElementById('message');
const person = document.getElementById('person');
const prevButton = document.getElementById('prev')
const nextButton = document.getElementById('next')

let quotes = []
let quoteIndex = 0;

const resetQuotes = () => {
    message.innerHTML = '';
}

const renderQuote = () => {
    resetQuotes();
    if (quotes.length === 0) {
        textArea.value = ''
        person.value = ''
        deleteButton.disabled = true
        submitButton.disabled = true
        const updatedQuote = document.createElement('div');
        updatedQuote.innerHTML = `
        <h3>There are no more quotes left.</h3>
        <p>Go to the <a href="add-quote.html">Add Quote page</a> to send new quotes.</p>
        `
        message.appendChild(updatedQuote);
    } else {
        textArea.value = quotes[quoteIndex].quote
        person.value = quotes[quoteIndex].person
    }
}

const renderError = response => {
    message.innerHTML = `<p>Your request returned an error from the server: </p>
  <p>Code: ${response.status}</p>
  <p>${response.statusText}</p>`;
}

fetch('/api/quotes')
.then(response => {
    if (response.ok) {
        return response.json();
    } else {
        renderError(response);
    }
})
.then(response => {
    quotes = response.quotes;
    renderQuote()
})

prevButton.addEventListener('click', () => {
    quoteIndex--;
    if (quoteIndex === -1) quoteIndex = quotes.length-1
    renderQuote();
})

nextButton.addEventListener('click', () => {
    quoteIndex++;
    if (quoteIndex === quotes.length) quoteIndex = 0
    renderQuote();
})

submitButton.addEventListener('click', () => {
    fetch(`/api/quotes?quote=${textArea.value}&person=${person.value}&id=${quotes[quoteIndex].id}`, {
        method: 'PUT',
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            renderError(response);
        }
    })
    .then(({quote}) => {
        quotes[quoteIndex].quote = quote.quote
        quotes[quoteIndex].person = quote.person
        renderQuote()
        const updatedQuote = document.createElement('div');
        updatedQuote.innerHTML = `
        <h3>Congrats, your quote was updated!</h3>
        <div class="quote-text">${quote.quote}</div>
        <div class="attribution">- ${quote.person}</div>
        <p>Go to the <a href="index.html">home page</a> to request and view all quotes.</p>
        `
        resetQuotes()
        message.appendChild(updatedQuote);
    });
});

deleteButton.addEventListener('click', () => {
    fetch(`/api/quotes?id=${quotes[quoteIndex].id}`, {method: 'DELETE',})
    .then(response => {
        if (response.ok) {
            return response;
        } else {
            renderError(response);
        }
    })
    .then(resp => {
        quotes.splice(quoteIndex, 1)
        if (quoteIndex === quotes.length) quoteIndex--
        renderQuote();
        const updatedQuote = document.createElement('div');
        updatedQuote.innerHTML = `
        <h3>The quote was deleted successfully!</h3>
        <p>Go to the <a href="index.html">home page</a> to request and view all quotes.</p>
        `
        resetQuotes()
        message.appendChild(updatedQuote);
    })
});