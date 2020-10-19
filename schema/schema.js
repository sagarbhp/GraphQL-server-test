// In this file we describe our graphql Schema

const graphql = require ("graphql")
const _ = require("lodash")
const Book = require ("../models/book")
const Author = require ("../models/author")

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
} = graphql;

// const books = [
//   {name:"Gone with the wind", genre: "historic", id:"1", authorId: "1"},
//   {name:"The monk who stole a ferrari", genre: "fantasy", id:"2", authorId: "1"}
// ]
//
// const authors =[
//   {name:"Sagar", age: 25, id:"1"},
//   {name:"Saka", age: 21, id:"2"},
// ]


const BookType = new GraphQLObjectType ({
  name: "Book",
  fields: ()=>({
    name:{type:GraphQLString},
    genre:{type:GraphQLString},
    id:{type:GraphQLID},
    author:{
      type:AuthorType,
      resolve(parent, args){
        // return _.find(authors, {id:parent.authorId})
        console.log(parent)
        return Author.findById(parent.authorId)
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name:"Author",
  fields:()=>({
    name:{type:GraphQLString},
    age:{type:GraphQLInt},
    books:{
      type:new GraphQLList(BookType),
      resolve(parent, args){
        // return _.filter(books, {authorId:parent.id})
        return Book.find({authorId:parent.id})
      }
    }
  })
})

// Root Queries

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields:{
    book:{
      type:BookType,
      args:{id:{type: GraphQLID}},
      resolve(parent, args){
        // code to get data
        // return _.find(books, {id:args.id})
        return Book.findById(args.id)
      }
    },

    author:{
      type: AuthorType,
      args: {id:{type: GraphQLID}},
      resolve(parent, args){
        // return _.find(authors, {id:args.id})
        return Author.findById(args.id)
      }
    },

    books:{
      type: new GraphQLList(BookType),
      resolve(){
        console.log("Hi")
        return Book.find({})
      }
    },

    authors:{
      type:new GraphQLList(AuthorType),
      resolve(){
        return Author.find({})
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name:"Mutation",
  fields:{
    addAuthor:{
      type:AuthorType,
      args:{
        name: {type:GraphQLString},
        age:{type:GraphQLInt},
      },
      resolve(parent, args){
        let author = new Author({
          name:args.name,
          age:args.age,
        })
        return author.save()
      }
    },

    deleteAuthor:{
      type:AuthorType,
      args:{name:{type:GraphQLString}},
      resolve(parent, args){
        let comment = Author.deleteOne({name:args.name}, function(err){
          return "Delete failed"
        })
        return comment
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query:RootQuery,
  mutation:Mutation
})
