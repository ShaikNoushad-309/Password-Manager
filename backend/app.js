import express from "express";
import cors from 'cors';
import mongoose, { Schema, model } from "mongoose";

const port = 3000;
const app = express();

const pswdSchema = new Schema({
    url: String,
    username: String,
    password: String,
    // id: String
})
const passwords = model('passwords', pswdSchema);
const connection = mongoose.connect("mongodb://localhost:27017/newblog");
// console.log("Current active DB: ",mongoose.connection.db.databaseName)
app.use(cors());
app.use(express.json())

app.use('/', (res, req, next) => {
    console.log("I am the Middleware of home page")
    next();
})

app.get('/', (req, res) => {
    console.log("Get request at home page");
    async function sendReponse() {
        let result = await passwords.find({});
        if(result){
            res.send(JSON.stringify(result));
        }
    }
    sendReponse();
})

app.post('/', async (req, res) =>  {
    console.log("Post request at home page");
    console.log("Data from front-end: ", req.body)
    let currentRecord = req.body  // save data to DB when pswd saved
        async function findAndInsertRecord(record) {
        try {
            const result = await passwords.findOne({
                url: record.url,
                username: record.username,
                password: record.password
            });

            console.log(`Record to check in DB: ${result}`);

            if (!result) {
                console.log("Record not found in DB");
                const newRecord = passwords(record); // Note: changed currentRecord to record
                await newRecord.save();
                return true;
            } else {
                console.log("Record found in DB, no need to duplicate");
                return false;
            }
        } catch (err) {
            console.log("Got error while finding record", err);
            throw err; // Re-throw the error to handle it in the calling function
        }
    }

    try {
        const shouldInsert = await findAndInsertRecord(currentRecord);
        res.send(shouldInsert);
    } catch (error) {
        res.status(500).send("Error processing record",error);
    }
    // res.send("Backend of Password Manager of MongoDB version, got a post request");
})

app.delete('/', async (req, res) => {
      console.log("Delete request at home page");
      console.log("Record to delete: ",req.body);
      let currentRecord = req.body;
      try{
          let deleteResult = await passwords.findOneAndDelete({url:currentRecord.url,username:currentRecord.username,password:currentRecord.password});
          console.log("Result of delete operation: ",deleteResult);
          res.status(200).json({message:"Record deleted successfully",deletedItem:deleteResult});
      }catch(err){
          console.log("Got error while deleting record",err);
          res.status(505).json({message:"Server error while deleting record"})
      }
      // res.send("Backend of Password Manager of MongoDB version, got a delete request");
})

app.listen(port, () => {
    console.log(`App listening to port ${port}`);
})