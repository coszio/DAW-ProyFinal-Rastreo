var mongoose = require("mongoose");

var connection = "mongodb://localhost:27017/drgatas";

mongoose.connect(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).catch(err => console.log(err));

var db = mongoose.connection;

db.once("open", function () {
    console.log("Database connect to: " + connection)
})

db.on("error", function(error){
    console.log(error);
})