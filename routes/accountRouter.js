import express from 'express';
import AccountModel from '../model/accountModel';
import Cryptr from 'cryptr';
import jwt from 'jsonwebtoken';
const accountRouter = express.Router();
let securePass = new Cryptr('aes256');

accountRouter.route("/").get((req, resp) => {
    try {
        let token = req.headers['token'];
        if (token) {
            jwt.verify(token, process.env.SECRET, function (err, decoded) {
                if (err) {
                    resp.statusMessage = "Unauthorized";
                    resp.status(401).json({
                        'codigo': '2',
                        'mensagem': 'Token invalido, inexistente ou expirado'
                    })
                } else if (decoded) {
                    AccountModel.find({}, {
                        firstName: 1,
                        lastName: 1,
                        email: 1,
                        phoneNumber: 1,
                        dateBirth: 1,
                        gender: 1
                    }, (err, account) => {
                        if (err) {
                            resp.statusMessage = "Bad request";
                            resp.status(400).json({
                                'codigo': '3',
                                'mensagem': 'Dados request enviados incorretos'
                            })
                        } else {
                            resp.statusMessage = "OK";
                            resp.status(200).json(account);
                        }
                    })
                }
            })
        } else {
            resp.statusMessage = "Unauthorized";
            resp.status(401).json({
                'codigo': '2',
                'mensagem': 'Token invalido, inexistente ou expirado'
            })
        }
    } catch (error) {
        console.error(error);
        resp.statusMessage = "Internal error";
        resp.status(500).json({
            'codigo': '1',
            'mensagem': 'Erro no servidor'
        })
    }
}).post((req, resp) => {
    try {
        let token = req.headers['token'];
        if (token) {
            jwt.verify(token, process.env.SECRET, function (err, decoded) {
                if (err) {
                    resp.statusMessage = "Unauthorized";
                    resp.status(401).json({
                        'codigo': '2',
                        'mensagem': 'Token invalido, inexistente ou expirado'
                    })
                } else if (decoded) {
                    let password = securePass.encrypt(req.body.password);
                    req.body.password = password;
                    let account = new AccountModel(req.body);
                    account.save(
                        err => {
                            if (err) {
                                console.error(err);
                                resp.statusMessage = "Bad request";
                                resp.status(400).json({
                                    'codigo': '3',
                                    'mensagem': 'Dados request enviados incorretos'
                                })
                            } else {
                                resp.statusMessage = "Criado";
                                let accountAux = account.toObject();
                                delete accountAux["password"];
                                resp.status(201).json(accountAux);
                            }
                        });
                }
            })
        } else {
            resp.statusMessage = "Unauthorized";
            resp.status(401).json({
                'codigo': '2',
                'mensagem': 'Token invalido, inexistente ou expirado'
            })
        }
    } catch (error) {
        console.error(error);
        resp.statusMessage = "Internal error";
        resp.status(500).json({
            'codigo': '1',
            'mensagem': 'Erro no servidor'
        })
    }
})

accountRouter.use("/:id", (req, resp, next) => {
    try {
        let token = req.headers['token'];
        if (token) {
            jwt.verify(token, process.env.SECRET, function (err, decoded) {
                if (err) {
                    resp.statusMessage = "Unauthorized";
                    resp.status(401).json({
                        'codigo': '2',
                        'mensagem': 'Token invalido, inexistente ou expirado'
                    })
                } else if (decoded) {
                    AccountModel.findById(req.params.id, (err, account) => {
                        if (err) {
                            console.error(err)
                            resp.statusMessage = "Bad request";
                            resp.status(400).json({
                                'codigo': '3',
                                'mensagem': 'Dados request enviados incorretos'
                            })
                        } else if (!account) {
                            resp.statusMessage = "Not found";
                            resp.status(404).json({
                                'codigo': '4',
                                'mensagem': `Recurso ${req.params.id} não encontrado`
                            })
                        } else {
                            req.account = account;
                            next();
                        }
                    })
                }
            })
        } else {
            resp.statusMessage = "Unauthorized";
            resp.status(401).json({
                'codigo': '2',
                'mensagem': 'Token invalido, inexistente ou expirado'
            })
        }
    } catch (error) {
        console.error(error);
        resp.statusMessage = "Internal error";
        resp.status(500).json({
            'codigo': '1',
            'mensagem': 'Erro no servidor'
        })
    }
})
accountRouter.route("/:id").get((req, resp) => {
    resp.statusMessage = "OK";
    let accountAux = req.account.toObject();
    delete accountAux["password"];
    resp.status(200).json(accountAux);
}).put((req, resp) => {
    let password = securePass.encrypt(req.body.password);
    req.account.password = password;
    req.account.firstName = req.body.firstName;
    req.account.lastName = req.body.lastName;
    req.account.email = req.body.email;
    req.account.dateBirth = req.body.dateBirth;
    req.account.phoneNumber = req.body.phoneNumber;
    req.account.gender = req.body.gender;
    req.account.save(
        err => {
            if (err) {
                console.error(err);
                resp.statusMessage = "Bad request";
                resp.status(400).json({
                    'codigo': '3',
                    'mensagem': 'Dados request enviados incorretos'
                })
            } else {
                resp.statusMessage = "Aceito";
                resp.status(202).send("");
            }
        });

}).delete((req, resp) => {
    req.account.remove(err => {
        if (err) {
            console.error(err);
            resp.statusMessage = "Bad request";
            resp.status(400).json({
                'codigo': '3',
                'mensagem': 'Dados request enviados incorretos'
            })
        } else {
            resp.statusMessage = "Sem conteúdo";
            resp.status(204).send("");
        }
    });
})
export default accountRouter;