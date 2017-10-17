import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLID
  } from 'graphql/type';
  
  import TODO from '../../mongoose/todo'
  
  /**
   * generate projection object for mongoose
   * @param  {Object} fieldASTs
   * @return {Project}
   */
  export function getProjection (fieldASTs) {
    return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) => {
      projections[selection.name.value] = true;
      return projections;
    }, {});
  }
  
  var todoType = new GraphQLObjectType({  
    name: 'todo',
    fields: function () {
      return {
        id: {
          type: GraphQLID
        },
        title: {
          type: GraphQLString
        },
        completed: {
          type: GraphQLBoolean
        }
      }
    }
  });

  var TODOs = [  
    {
      "id": 1446,
      "title": "Read emails",
      "completed": false
    },
    {
      "id": 1444,
      "title": "Buy orange",
      "completed": true
    }
  ];
  
  var QueryType = new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
        todo: {
          type: new GraphQLList(todoType),
          args: {
            id: {
              name: 'id',
              type: GraphQLInt
            }
          },
          resolve: (root, {itemId}, source, fieldASTs) => {
           
  
            return TODOs
          }
        }
      }
    })
    


  //mutation
  var MutationAdd = {
    type: todoType,
    description: 'Add a Todo',
    args: {
      title: {
        name: 'Todo title',
        type: new GraphQLNonNull(GraphQLString)
      },
      completed: {
        type: new GraphQLNonNull(GraphQLBoolean)
      }
    },
    resolve: (root, args) => {
      var newTodo = new TODO({
        title: args.title,
        completed: args.completed
      })
      newTodo.id = newTodo._id
      
      return new Promise((resolve, reject) => {
        newTodo.save(function (err) {
          if (err) reject(err)
          else resolve(newTodo)
        })
      })
    }
  }

  // destroy
  var MutationDestroy = {
    type: todoType,
    description: 'Destroy the todo',
    args: {
      id: {
        name: 'Todo Id',
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: (root, args) => {
      return new Promise((resolve, reject) => {
        TODO.findById(args.id, (err, todo) => {
          if (err) {
            reject(err)
          } else if (!todo) {
            reject('Todo NOT found')
          } else {
            todo.remove((err) => {
              if (err) reject(err)
              else resolve(todo)
            })
          }
        })
      })
    }
  }

  //toggle
  var MutationUpdate = {
    type: todoType,
    description: 'Update model',
    args: {
      id: {
        name: 'Todo Id',
        type: new GraphQLNonNull(GraphQLString)
      },
      title: {
          type:GraphQLString
      },
      completed: {
        type: new GraphQLNonNull(GraphQLBoolean)
      }
    },
    resolve: (root, args) => {
      return new Promise((resolve, reject) => {
        TODO.findById(args.id, (err, todo) => {
          if (err) {
            reject(err)
            return
          }
  
          if (!todo) {
            reject('Todo NOT found')
            return
          } else {
            todo.completed = args.completed
            todo.title = args.title
            todo.save((err) => {
              if (err) reject(err)
              else resolve(todo)
            })
          }
        })
      })
    }
  }
  
  var MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      add: MutationAdd,
      destroy: MutationDestroy,
      update:MutationUpdate
      
    }
  })
  
  module.exports = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
  })