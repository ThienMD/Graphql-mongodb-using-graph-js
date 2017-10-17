'use strict';

var _Schema = require('../graphql/schema/Schema');

var _Schema2 = _interopRequireDefault(_Schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();
var ToDo = require('../mongoose/todo');

var graphqlHTTP = require('express-graphql');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/quotes', function (req, res) {
  // Insert into TodoList Collection
  var todoItem = new ToDo({
    itemId: 1,
    item: req.body.item,
    completed: false
  });
  todoItem.save(function (err, result) {
    if (err) {
      console.log("---TodoItem save failed " + err);
    }
    console.log("+++TodoItem saved successfully " + todoItem.item);
  });
});

router.use('/graphql', graphqlHTTP(function (req) {
  return {
    schema: _Schema2.default,
    graphiql: true
  };
}));

module.exports = router;