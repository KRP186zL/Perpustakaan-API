const formatUserDetailsPayload = (payload) => {
  let {
    nim,
    prodiId,
    fakultasId,
  } = payload;

  nim = nim ? parseInt(nim, 10) : 0;
  prodiId = prodiId ? parseInt(prodiId, 10) : 0;
  fakultasId = fakultasId ? parseInt(fakultasId, 10) : 0;

  return {
    ...payload,
    nim,
    prodiId,
    fakultasId,
  };
};

const formatBooksPayload = (payload) => {
  let { halaman } = payload;

  halaman = halaman ? parseInt(halaman, 10) : 0;

  return {
    ...payload,
    halaman,
  };
};

module.exports = {
  formatUserDetailsPayload,
  formatBooksPayload,
};
