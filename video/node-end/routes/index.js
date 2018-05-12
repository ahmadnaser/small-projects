var express = require('express');
var request = require('request');
var router = express.Router();
var utils = require('./../utils/index.js');
var Model = require('./../models/model');
var config = require('./../config/index.js');
var services = require('./../services/index');

router.get('/', function(req, res, next) {
  res.json({ author: 'suvllian'})
})


// 获取首页信息
router.get('/get_index_info', function(req, res, next) {
  const { pageType } = req.query

  new Model('query_videos').operate().then(result => {
    return utils.successRes(res, {
      data: result
    })
  }).catch(error => {
    console.log(error)
    return utils.failRes(res, {
      msg: '获取视频列表失败'
    })
  })
})


// 登录
router.post('/login', function(req, res, next) {
  const { username, password } = req.body

  new Model('query_user_password').operate([username]).then(result => {
    return result && result.length > 0 ? utils.successRes(res, {
      csrf_token: encodeURI(username)
    }) : utils.failRes(res, {
      msg: '用户不存在'
    })
  }).catch(error => {
    console.log(error)
    return utils.failRes(res, {
      msg: '登录失败',
      data: req.body
    })
  })
})

// 注册
router.post('/register', function(req, res, next) {
  const { username, password } = req.body

  new Model('insert_new_user').operate([username, password]).then(result => {
    console.log(result)

    return result && result.length > 0 ? utils.successRes(res, {
      csrf_token: encodeURI(username)
    }) : utils.failRes(res, {
      msg: '注册失败'
    })
  }).catch(error => {
    console.log(error)
    return utils.failRes(res, {
      msg: '注册失败',
      data: req.body
    })
  })
})


module.exports = router;
