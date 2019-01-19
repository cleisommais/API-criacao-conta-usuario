import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import logger from "morgan";
import Cryptr from "cryptr";
import accountRouter from "./routes/accountRouter";
import AccountModel from "./model/accountModel";
import dataAccount from "./data/account.json";

const app = express();
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, "Erro de conexão."))

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