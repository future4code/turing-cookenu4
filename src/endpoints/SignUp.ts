import { Request, Response} from 'express';
import { UserDatabase } from '../data/UserDatabase';
import {IdGenerator} from '../services/IdGenerator';
import { Authenticator } from '../services/Authenticator';
import { HashManager } from '../services/HashManager';
import { BaseDatabase } from '../data/BaseDatabase';

export const SignUp = async (req: Request, res: Response) => {
    try {
        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }

        if(!userData.name || !userData.email || !userData.password){
            throw new Error("Os dados estão incompletos")
        }

        if(userData.email.indexOf('@') === -1) {
            throw new Error('Email inválido')
        }

        if(userData.password.length < 6) {
            throw new Error('Senha precisar ter no mínimo 6 caracteres.')
        }

        const idGenerator = new IdGenerator();
        const id = idGenerator.generate();

        const hashManage = new HashManager();
        const hashPassword = await hashManage.hash(userData.password);

        const userDatabase = new UserDatabase();
        await userDatabase.createUser(
            id,
            userData.name,
            userData.email,
            hashPassword
        );

        const authenticator = new Authenticator();
        const token = authenticator.generateToken({id});

        res.status(200).send({
            message: "Usuário criado com sucesso",
            token
        })

    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
    await BaseDatabase.destroyConnection();
}