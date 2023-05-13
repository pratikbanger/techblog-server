const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
// Use mongoDB Atlast
const mongoURI = "mongodb+srv://proplayer:GodofHacker@cluster0.tgawyy6.mongodb.net/Ai_Blog?retryWrites=true&w=majority"

const connectToMongo = () => {
    mongoose.connect(mongoURI)
        .then(() => {
            console.log("Connected to Ai_Blog DB");
        })
}

module.exports = connectToMongo;