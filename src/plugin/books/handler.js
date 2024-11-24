const autoBind = require('auto-bind');
const utils = require('../../utils');

class BooksHandler {
  #booksService;

  #usersService;

  #validator;

  constructor(booksService, usersService, validator) {
    this.#booksService = booksService;
    this.#usersService = usersService;
    this.#validator = validator;

    autoBind(this);
  }

  async postBookHandler(request, h) {
    const credential = request.auth.credentials;

    const formattedPayload = utils.formatBooksPayload(request.payload);
    const validatedPayload = this.#validator.validatePostBookPayload(formattedPayload);

    await this.#usersService.authorizeUserAction(credential);

    const book = await this.#booksService.postBook(validatedPayload);

    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(201);

    return response;
  }

  async getBooksHandler(_request, h) {
    const books = await this.#booksService.getBooks();

    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    response.code(200);

    return response;
  }

  async getBookByIdHandler(request, h) {
    const { id: bukuId } = request.params;

    const book = await this.#booksService.getBookById(bukuId);

    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);

    return response;
  }

  async putBookByIdHandler(request, h) {
    const { id: bukuId } = request.params;
    const credential = request.auth.credentials;

    const formattedPayload = utils.formatBooksPayload(request.payload);
    const validatedPayload = this.#validator.validatePutBookPayload(formattedPayload);

    await this.#usersService.authorizeUserAction(credential);

    const buku = await this.#booksService.putBookById(bukuId, validatedPayload);

    const response = h.response({
      status: 'success',
      // message: 'Berhasil update buku',
      data: {
        buku,
      },
    });
    response.code(200);

    return response;
  }

  async deleteBookByIdHandler(request, h) {
    const { id: bukuId } = request.params;
    const credential = request.auth.credentials;

    await this.#usersService.authorizeUserAction(credential);

    await this.#booksService.deleteBookById(bukuId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menghapus buku',
    });
    response.code(200);

    return response;
  }
}

module.exports = BooksHandler;
