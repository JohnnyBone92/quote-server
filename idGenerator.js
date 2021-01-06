let currentId = 0;

const idGenerator = quoteObject => {
    quoteObject.id = currentId
    currentId++
}

module.exports = {idGenerator}