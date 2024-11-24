const routes = require('./routes');
const BooksHandler = require('./handler');

module.exports = {
  name: 'books',
  version: '1.0.0',
  register: async (server, {
    booksService,
    usersService,
    validator,
  }) => {
    const booksHandler = new BooksHandler(booksService, usersService, validator);

    await server.route(routes(booksHandler));
  },
};
