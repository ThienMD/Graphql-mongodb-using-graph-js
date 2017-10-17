var express = require('express');
var router = express.Router();
var ToDo = require('../mongoose/todo');
import schema from '../graphql/schema/Schema'
const graphqlHTTP = require('express-graphql');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/quotes', (req, res) => {
  // Insert into TodoList Collection
  var todoItem = new ToDo({
    itemId: 1,
    item: req.body.item,
    completed: false
  })
  todoItem.save((err, result) => {
    if (err) { console.log("---TodoItem save failed " + err) }
    console.log("+++TodoItem saved successfully " + todoItem.item)
  })
})

router.use('/graphql', graphqlHTTP (req => ({
  schema
  ,graphiql:true
 })))

module.exports = router;
