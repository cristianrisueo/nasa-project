function getPagination(query) {
  const page = Math.abs(query.page) || 1;
  const limit = Math.abs(query.limit) || 0; // 0 as limit returns all documents

  const skip = (page - 1) * limit;

  return { skip, limit };
}

module.exports = getPagination;
