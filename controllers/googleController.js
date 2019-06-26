module.exports = {
    findAll: (req, res) => {
        const { query: params } = req;
        axios.get("https://www.googleapis.com/books/v1/volumes", {
            params
          }).then(data => {
              data.data.items.filter(
                 innerData => 
                 innerData.volumeInfo.title &&
                 innerData.volumeInfo.infoLink &&
                 innerData.volumeInfo.authors &&
                 innerData.volumeInfo.description &&
                 innerData.volumeInfo.imageLinks &&
                 innerData.volumeInfo.imageLinks.thumbnail 
              )
          }).then(apiBooks =>
            db.Book.find().then(dbBooks =>
              apiBooks.filter(apiBook =>
                dbBooks.every(dbBook => dbBook.googleId.toString() !== apiBook.id)
              )
            )
          )
          .then(books => res.json(books))
          .catch(err => res.status(422).json(err));
    }
}