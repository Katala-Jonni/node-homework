const express = require('express');
const router = express.Router();
const mainCtrl = require('../controllers/main');
const loginCtrl = require('../controllers/login');
const adminCtrl = require('../controllers/admin');

router.get('/', mainCtrl.getIndex);
router.post('/', mainCtrl.postIndex);
router.get('/login', loginCtrl.isLogin, loginCtrl.getLogin);
router.post('/login', loginCtrl.postLogin);
router.get('/admin', adminCtrl.isAdmin, adminCtrl.getAdmin);
router.post('/admin/:info', adminCtrl.isAdmin, adminCtrl.postAdmin);

module.exports = router;
