module.exports = req => Object.keys(req.body).every(item => req.body[item]);
