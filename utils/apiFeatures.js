//@@ Refactoring API Features
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //@@ Making the API Better: Filtering
    //* BUILD QUERY
    //* 1A. Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(req.query, queryObj);

    //@@ Making the API Better: Advanced Filtering
    //* 1B. Advanced filtering
    //! { difficulty: 'easy', duration: { $gte: 5 } }
    //! { difficulty: 'easy', duration: { gte: '5' } }
    //! gte, gt, lte, lt

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));
    //* 3.
    // let query = Tour.find(JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
    //* 1
    // const query = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy',
    // });
    //* 2
    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');
  }

  sort() {
    //@@ Making the API Better: Sorting
    //* 2. Sorting
    //! sort('price ratingsAverage')
    if (this.queryString.sort) {
      // console.log(this.queryString.sort);
      const sortBy = this.queryString.sort.split(',').join(' ');
      // console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    //@@ Making the API Better: Limiting Fields
    //* 3. Fields limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    //@@ Making the API Better: Pagination
    //* Pagination
    //! page=2&limit=10, 1-10 -> page 1, 11-20 -> page 2, 21-30 -> page 3,
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    // if (this.queryString.params) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) {
    //     throw new Error('This page does not exit');
    //   }
    // }

    return this;
  }
}
module.exports = APIFeatures;
