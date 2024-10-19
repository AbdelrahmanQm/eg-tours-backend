class APIFeatures {
  constructor(queryString, query) {
    this.queryString = queryString;
    this.query = query;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedQueries = ['page', 'sort', 'limit', 'filter'];
    excludedQueries.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|lte|lt|lte)\b/g,
      (match) => `$${match}`,
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  filterFields() {
    if (this.queryString.filter) {
      const queryFilter = this.queryString.filter.split(',').join(' ');
      this.query = this.query.select(queryFilter);
    } else {
      this.query = this.query.select('-createdAt');
    }
    return this;
  }

  paginate() {
    const limit = this.queryString.limit * 1 || 10;
    const page = this.queryString.page * 1 || 1;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
