import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import logger from "morgan";
import Cryptr from "cryptr";
import accountRouter from "./routes/accountRouter";
import AccountModel from "./model/accountModel";
import dataAccount from "./data/account.json";

const app = express();

mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500, // Reconnect every 500ms
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, "Erro de conexão."))
db.once('open', function() {
    console.log('MongoDB connection opened!');
});
db.on('reconnected', function() {
    console.log('MongoDB reconnected!');
});

let securePass = new Cryptr("aes256");
let password = securePass.encrypt(dataAccount.password);
dataAccount.password = password;

let account = new AccountModel(dataAccount);

account.save(err => {
    if (err) {
        console.error("Erro: " + err);
    } else {
        console.log("Conta test@test.com criada com sucesso!");
    }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.use('/accounts', accountRouter);

export default app;
