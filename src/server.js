// Hapi JS
const Hapi = require('@hapi/hapi');

// Eksternal Plugin
const Jwt = require('@hapi/jwt');

// Variable Environment
const Config = require('../utils/config');

// Error
const ClientError = require('./error/ClientError');

// Users Plugin
const usersPlugin = require('./plugin/users');
const UsersService = require('./service/UsersService');
const ValidatorUsers = require('./validator/users');

// Authentication Plugin
const authenticationPlugin = require('./plugin/authentication');
const AuthenticationService = require('./service/AuthenticationService');
const ValidatorAuthentication = require('./validator/authentication');

// Token Manager
const TokenManager = require('./token/TokenManager');

(async () => {
  const usersService = new UsersService();
  const authenticationService = new AuthenticationService();

  const server = Hapi.server({
    port: Config.app.port,
    host: Config.app.host,
    routes: {
      cors: true,
    },
  });

  // eksternal plugin
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('perpustakaan_jwt', 'jwt', {
    keys: Config.jwt.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: Config.jwt.accessTokenAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        ...artifacts.decoded.payload,
      },
    }),
  });

  // internal plugin
  await server.register([
    {
      plugin: usersPlugin,
      options: {
        service: usersService,
        validator: ValidatorUsers,
      },
    },
    {
      plugin: authenticationPlugin,
      options: {
        authenticationService,
        usersService,
        tokenManager: TokenManager,
        validator: ValidatorAuthentication,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    console.log('\n\n\n', response.stack);

    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }

      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
})();
