'use strict';

var db = require('../db');

exports.showAll = function (params) {
  return db.collection('lists').find();
}
