const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, './config.env') });

const app = express()
app.use(express.json());
const port = 3001 ;


//DB connect
//NEEDS TO BE REFACTORED - MOVED INTO EACH OF THE API ROUTES
const dbUrl = process.env.DATABASE_URI
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
  })
  .then(() => console.log('DB connnection successful!'))
  .catch((e) => console.log(e));


//DB Schema
let toysDbSchema = new mongoose.Schema({
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
          unique: true,
        },
        phone: {
          type: Number,
          required: true
        },
        birthday: {
          type: Date
        }
});

let electronicsDbSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: Number,
    required: true
  },
  birthday: {
    type: Date
  }
})


//DB Model
let toysDb = mongoose.model('toysDb', toysDbSchema);
let electronicsDb = mongoose.model('electronicsDb', electronicsDbSchema);


app.get('/', (req, res) => {
    res.send("Yo i'm just an API microservice.")
  })


//Toys
app.get('/toys', async (req, res) => {
  try{
    const items = await toysDb.find();
    console.log("Toys Data Dumps")
    res.send(items);
  }
  catch(e){
    console.log(e);
    res.status(500).send(e);
  }
})

app.get('/toys/:id', async (req, res) => {
  try{
    const item = await toysDb.findById(req.params.id).exec();
    console.log(item);
	  res.send(item);
  }
  catch(e){
    console.log(e);
    res.status(400).send(e);
  }
  
})

app.get('/toys/:id/keys', async(req, res) => {
  try{
    const item = await toysDb.findById(req.params.id).exec();
    console.log(Object.keys(item._doc));
    res.send(Object.keys(item._doc));
  }
  catch(e){
    console.log(e);
    res.status(400).send(e);
  }
})

app.get('/toyfeature', async(req, res) => {
  try{
    const newField = req.query.newField;
    const newFieldType = req.query.newFieldType;
    const helper = {}
    helper[newField] = newFieldType ;
    toysDbSchema.add(helper);
    console.log(helper)
    const helper2 = {};
    helper2[newField] = newFieldType=="string" ? "" : 0 ;
    helper2["multi"] = 'true';
    toysDb = mongoose.model('toysDb', toysDbSchema);
    console.log(helper2)
    await toysDb.updateMany({}, { $set: 
      helper2 })
    res.send(toysDbSchema);
  }catch(e){
    console.log(e);
    res.status(500).send(e);
  }

})


app.post('/toys', async (req, res) => {
  try{
    console.log(req.body)
    const item = new toysDb(
      req.body
    )
    await item.save()
    res.status(201).send(item);
  }catch(e){
    console.log(e);
    res.status(500).send(e);
  }
})


app.delete('/toys/:id', async (req, res) => {
  try {
    await toysDb.findByIdAndDelete(req.params.id);
    res.status(204).send(`Record Deleted - ${req.params.id}`)
  } catch (err) {
    res.status(400)
  }
})


app.patch('/toys/:id', async (req, res) => {
  //try{
    await toysDb.findOneAndUpdate({ "_id": req.params.id }, req.body, {upsert: false, new:true}, function(err, doc) {
      if (err) return res.status(500).send(err);
      return res.send(doc);
  });
/*    res.status(201).send("Entry Created");
  }catch(e){
    console.log(e);
    res.status(500).send(e);
  }*/
})




//Electronics
app.get('/electronics', async (req, res) => {
  try{
    const items = await electronicsDb.find();
    console.log(electronicsDbSchema)
    res.send(items);
  }
  catch(e){
    console.log(e);
    res.status(500).send(e);
  }
})

app.get('/electronics/:id', async (req, res) => {
  try{
    const item = await electronicsDb.findById(req.params.id).exec();
    console.log(item);
	  res.send(item);
  }
  catch(e){
    console.log(e);
    res.status(400).send(e);
  }
  
})

app.get('/electronics/:id/keys', async(req, res) => {
  try{
    const item = await electronicsDb.findById(req.params.id).exec();
    console.log(Object.keys(item._doc));
    res.send(Object.keys(item._doc));
  }
  catch(e){
    console.log(e);
    res.status(400).send(e);
  }
})

app.get('/elecfeature', async(req, res) => {
  try{
    const newField = req.query.newField;
    const newFieldType = req.query.newFieldType;
    const helper3 = {}
    helper3[newField] = newFieldType ;
    electronicsDbSchema.add(helper3);
    console.log(helper3)
    const helper4 = {};
    helper4[newField] = newFieldType=="string" ? "" : 0 ;
    helper4["multi"] = 'true';
    electronicsDb = mongoose.model('electronicsDB', electronicsDbSchema);
    console.log(helper4)
    await electronicsDb.updateMany({}, { $set: 
      helper4 })
    res.send(electronicsDbSchema);
  }catch(e){
    console.log(e);
    res.status(500).send(e);
  }
})


app.post('/electronics', async (req, res) => {
  try{
    console.log(req.body)
    const item = new electronicsDb(
      req.body
    )
    await item.save()
    res.status(201).send("Entry Created");
  }catch(e){
    console.log(e);
    res.status(500).send(e);
  }
})


app.delete('/electronics/:id', async (req, res) => {
  try {
    await electronicsDb.findByIdAndDelete(req.params.id);
    res.status(204).send("Item Deleted")
  } catch (err) {
    res.status(400)
  }
})


app.patch('/electronics/:id', async (req, res) => {
  //try{
    const item = await electronicsDb.findOneAndUpdate({ "_id": req.params.id }, req.body, {upsert: false, new:true}, function(err, doc) {
      if (err) return res.status(500).send(err);
      return res.send(item);
  });
/*    res.status(201).send("Entry Created");
  }catch(e){
    console.log(e);
    res.status(500).send(e);
  }*/
})






//PORT
app.listen(port, () => {
    console.log(`API Mircroservice listening at http://localhost:${port}`)
  })

