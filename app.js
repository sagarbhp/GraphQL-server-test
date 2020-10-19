//npm install graphql
//npm install express-graphql  (allows express to understand graphQl )

const express = require ("express")
const mongoose = require("mongoose")
const {graphqlHTTP} = require("express-graphql")
const schema = require("./schema/schema")

const cors = require('cors');

const app = express()
app.use(cors())

mongoose.connect(
  "mongodb+srv://sagar-123:challange123@cluster0.uczx1.mongodb.net/gql?retryWrites=true&w=majority",
   {useNewUrlParser: true, useUnifiedTopology: true})

   //checking if successfully connected to DB or handling error
   const db = mongoose.connection
   db.on("error", (err)=>{
       console.log("Couldn't connect to Atlas", err)
   })
   db.on("connected", ()=>{
       console.log("Successfully connected to Atlas")
   })


// One supercharged end point to rule them all - the power of graph ql.
//express doesn't really know how to process graphql request so it
//will pass everything to the middleware graphqlHTTP which is a function
//graphqlHTTP takes in some parameters in the form of an object.
app.use("/graphql", graphqlHTTP({
  schema
}))



app.get("/", (req, res)=>{
  res.send("All good bro!")
})

app.listen(3000, ()=>{
  console.log("server is hot!")
})
