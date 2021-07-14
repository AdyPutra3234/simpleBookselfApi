const { nanoid } = require('nanoid');
const books = require('./books');

module.exports = {
  addBook: (request, h) => {
    const {
      name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    const id = nanoid(15);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };

    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id);
    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }

    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  },

  getAllBooks: (request, h) => {
    const {
      name, reading, finished,
    } = request.query;

    const filterBooks = (callback) => books.filter(callback);

    const setBooks = (books) => books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    const setResponse = (books) => {
      const response = h.response({
        status: 'success',
        data: {
          books,
        },
      });
      response.code(200);
      return response;
    };

    if (name !== undefined) {
      const filteredBooksByname = filterBooks(
        (book) => book.name.toUpperCase().includes(name.toUpperCase()),
      );
      return setResponse(setBooks(filteredBooksByname));
    }

    if (reading !== undefined) {
      const filteredBooksByReading = filterBooks((book) => book.reading == reading);
      return setResponse(setBooks(filteredBooksByReading));
    }

    if (finished !== undefined) {
      const filteredBooksByFinished = filterBooks((book) => book.finished == finished);
      return setResponse(setBooks(filteredBooksByFinished));
    }

    return setResponse(setBooks(books));
  },

  getDetailBookById: (request, h) => {
    const { bookId } = request.params;

    const filteredBook = books.filter((book) => book.id === bookId)[0];
    if (filteredBook !== undefined) {
      return {
        status: 'success',
        data: {
          book: filteredBook,
        },
      };
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  },

  updateBookById: (request, h) => {
    const { id } = request.params;

    const {
      name,
      year,
      author,
      summary,
      publisher,
      readPage,
      pageCount,
      reading,
    } = request.payload;

    const updatedAt = new Date().toISOString();

    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    const index = books.findIndex((book) => book.id === id);

    if (index === -1) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      });
      response.code(404);
      return response;
    }

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    return {
      status: 'success',
      message: 'Buku berhasil diperbarui',
    };
  },

  deleteBookById: (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);
    if (index === -1) {
      const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      });
      response.code(404);
      return response;
    }

    books.splice(index, 1);

    return {
      status: 'success',
      message: 'Buku berhasil dihapus',
    };
  },
};
