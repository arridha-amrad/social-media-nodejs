exports.createPostValidator = (req, res, next) => {
  // validate title
  req.check('title', "Write a title").not().isEmpty();
  req.check('title', "Title must be between 4 to 150 characters").isLength({ min:4, max:150 });
  //validate body
  req.check('body', "Write a body").not().isEmpty();
  req.check('body', "Body must be between 4 to 2000 characters").isLength({ min:4, max:2000 });
  //check for errors
  const errors = req.validationErrors();
  // if error show the first one as they happen
  if(errors) {
    // hanya menampilkan error yg pertama kali ditemukan
    const firstError = errors.map((error) => error.msg)[0]
    return res.status(400).json({ error: firstError });
  }
  // jika tidak ada error
  // lanjutkan ke middleware selanjutnya
  next();
};