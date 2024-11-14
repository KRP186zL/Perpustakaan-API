const formatUserDetailsPayload = (payload) => {
  let {
    nim,
    prodiId,
    fakultasId,
  } = payload;

  nim = nim ? parseInt(nim, 10) : 0;
  prodiId = parseInt(prodiId, 10);
  fakultasId = parseInt(fakultasId, 10);

  return {
    ...payload,
    nim,
    prodiId,
    fakultasId,
  };
};

module.exports = {
  formatUserDetailsPayload,
};
