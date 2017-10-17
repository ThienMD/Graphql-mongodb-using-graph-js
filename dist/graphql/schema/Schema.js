'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProjection = getProjection;

var _type = require('graphql/type');

var _todo = require('../../mongoose/todo');

var _todo2 = _interopRequireDefault(_todo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * generate projection object for mongoose
 * @param  {Object} fieldASTs
 * @return {Project}
 */
function getProjection(fieldASTs) {
  return fieldASTs.fieldNodes[0].selectionSet.selections.reduce(function (projections, selection) {
    projections[selection.name.value] = true;
    return projections;
  }, {});
}

var todoType = new _type.GraphQLObjectType({
  name: 'todo',
  fields: function fields() {
    return {
      id: {
        type: _type.GraphQLID
      },
      title: {
        type: _type.GraphQLString
      },
      completed: {
        type: _type.GraphQLBoolean
      }
    };
  }
});

var TODOs = [{
  "id": 1446,
  "title": "Read emails",
  "completed": false
}, {
  "id": 1444,
  "title": "Buy orange",
  "completed": true
}];

var QueryType = new _type.GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    todo: {
      type: new _type.GraphQLList(todoType),
      args: {
        id: {
          name: 'id',
          type: _type.GraphQLInt
        }
      },
      resolve: function resolve(root, _ref, source, fieldASTs) {
        var itemId = _ref.itemId;


        return TODOs;
      }
    }
  }
});

//mutation
var MutationAdd = {
  type: todoType,
  description: 'Add a Todo',
  args: {
    title: {
      name: 'Todo title',
      type: new _type.GraphQLNonNull(_type.GraphQLString)
    },
    completed: {
      type: new _type.GraphQLNonNull(_type.GraphQLBoolean)
    }
  },
  resolve: function resolve(root, args) {
    var newTodo = new _todo2.default({
      title: args.title,
      completed: args.completed
    });
    newTodo.id = newTodo._id;

    return new Promise(function (resolve, reject) {
      newTodo.save(function (err) {
        if (err) reject(err);else resolve(newTodo);
      });
    });
  }

  // destroy
};var MutationDestroy = {
  type: todoType,
  description: 'Destroy the todo',
  args: {
    id: {
      name: 'Todo Id',
      type: new _type.GraphQLNonNull(_type.GraphQLString)
    }
  },
  resolve: function resolve(root, args) {
    return new Promise(function (resolve, reject) {
      _todo2.default.findById(args.id, function (err, todo) {
        if (err) {
          reject(err);
        } else if (!todo) {
          reject('Todo NOT found');
        } else {
          todo.remove(function (err) {
            if (err) reject(err);else resolve(todo);
          });
        }
      });
    });
  }

  //toggle
};var MutationUpdate = {
  type: todoType,
  description: 'Update model',
  args: {
    id: {
      name: 'Todo Id',
      type: new _type.GraphQLNonNull(_type.GraphQLString)
    },
    title: {
      type: _type.GraphQLString
    },
    completed: {
      type: new _type.GraphQLNonNull(_type.GraphQLBoolean)
    }
  },
  resolve: function resolve(root, args) {
    return new Promise(function (resolve, reject) {
      _todo2.default.findById(args.id, function (err, todo) {
        if (err) {
          reject(err);
          return;
        }

        if (!todo) {
          reject('Todo NOT found');
          return;
        } else {
          todo.completed = args.completed;
          todo.title = args.title;
          todo.save(function (err) {
            if (err) reject(err);else resolve(todo);
          });
        }
      });
    });
  }
};

var MutationType = new _type.GraphQLObjectType({
  name: 'Mutation',
  fields: {
    add: MutationAdd,
    destroy: MutationDestroy,
    update: MutationUpdate

  }
});

module.exports = new _type.GraphQLSchema({
  query: QueryType,
  mutation: MutationType
});