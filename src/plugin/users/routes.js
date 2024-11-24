const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },

  {
    method: 'GET',
    path: '/users',
    handler: handler.getUsersHandler,
    options: {
      auth: 'perpustakaan_jwt',
    },
  },

  {
    method: 'GET',
    path: '/users/{id}',
    handler: (request, h) => {
      const { id: userId } = request.params;

      return h.redirect(`/users/${userId}/details`).code(301);
    },
  },

  {
    method: 'PUT',
    path: '/users/{id}',
    handler: handler.putUserByIdHandler,
    options: {
      auth: 'perpustakaan_jwt',
    },
  },

  {
    method: 'DELETE',
    path: '/users/{id}',
    handler: handler.deleteUserByIdHandler,
    options: {
      auth: 'perpustakaan_jwt',
    },
  },

  // User Details
  {
    method: 'POST',
    path: '/users/{id}/details',
    handler: handler.postUserDetailsHandler,
    options: {
      auth: 'perpustakaan_jwt',
    },
  },

  {
    method: 'GET',
    path: '/users/{id}/details',
    handler: handler.getUserDetailsByIdHandler,
    options: {
      auth: 'perpustakaan_jwt',
    },
  },

  {
    method: 'PUT',
    path: '/users/{id}/details',
    handler: handler.putUserDetailsByIdHandler,
    options: {
      auth: 'perpustakaan_jwt',
    },
  },
];

module.exports = routes;
