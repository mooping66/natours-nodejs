const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

//@@Building Handler Factory Functions: Delete
//@@ Handling DELETE Requests
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({ status: 'success', data: null });
  });

//@@ Factory Functions: Update and Create
//@@ Handling PATCH Requests
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //@@ Updating Documents
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({ status: 'success', data: { data: doc } });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //   console.log(req.body);
    //   const newId = tours[tours.length - 1].id + 1;
    //   const newTour = Object.assign({ id: newId }, req.body);
    //
    //   tours.push(newTour);
    //
    //   fs.writeFile(
    //     `${__dirname}/dev-data/data/tours-simple.json`,
    //     JSON.stringify(tours),
    //     (err) => {
    //       res.status(201).json({ status: 'success', data: { tour: newTour } });
    //     }
    //   );

    //@@ Another Way of Creating Documents
    // const newTour = new Tour({});
    // newTour.save();
    const doc = await Model.create(req.body);

    res.status(201).json({ status: 'success', data: { data: doc } });
  });

//@@ Factory Functions: Reading
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    //   console.log(req.params);
    //
    //   const id = req.params.id * 1;
    //   const tour = tours.find((el) => el.id === id);

    //* Tour.findOne({ _id:req.param.id })
    //@@ Populating Tour Guides
    //* Tour.findOne({_id:req.params.id})
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    //@@ Adding 404 Not Found Errors
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({ status: 'success', data: { data: doc } });
  });

//@@ Refactoring Our Routes
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //@@ Adding a Nested GET Endpoint
    //* To allow for nested Get reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) {
      filter = { tour: req.params.tourId };
    }
    //@@ Reading Documents
    //* EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    //@@ Improving Read Performance with Indexes
    //! query.sort().select().skip().limit()
    // const doc = await features.query.explain();
    const doc = await features.query;
    // console.log(req.requestTime);

    //* SEND RESPONSE
    res.status(200).json({
      status: 'success',
      // requestedAt: req.requestTime,
      results: doc.length,
      data: { data: doc },
    });
  });
