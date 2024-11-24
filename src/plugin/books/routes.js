const routes = (handler) => [
  {
    method: 'POST',
    path: '/books',
    handler: handler.postBookHandler,
    options: {
      auth: 'perpustakaan_jwt',
    },
  },

  {
    method: 'GET',
    path: '/books',
    handler: handler.getBooksHandler,
    options: {
      auth: 'perpustakaan_jwt',
    },
  },

  {
    method: 'GET',
    path: '/books/{id}',
    handler: handler.getBookByIdHandler,
    options: {
      auth: 'perpustakaan_jwt',
    },
  },

  {
    method: 'PUT',
    path: '/books/{id}',
    handler: handler.putBookByIdHandler,
    options: {
      auth: 'perpustakaan_jwt',
    },
  },

  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: handler.deleteBookByIdHandler,
    options: {
      auth: 'perpustakaan_jwt',
    },
  },
];

module.exports = routes;
