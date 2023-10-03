exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        const {status, msg} = err
        res.status(status).send({msg: msg})
    } else next(err)
}
exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid input' });
    } else next(err);
}
exports.handleServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  };
