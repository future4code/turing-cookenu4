import { Request, Response } from 'express';
import { BaseDatabase } from '../data/BaseDatabase';
import { UserDatabase } from '../data/UserDatabase';
import { Authenticator } from '../services/Authenticator';
import { HashManager } from '../services/HashManager';

export const Login = async (req: Request, res: Response) => {

    try {
        const userData = {
            email: req.body.email,
            password: req.body.password
        }

        if (!userData.email || !userData.password) {
            throw new Error("Insira todas as informações")
        }

        const userDatabase = new UserDatabase();
        const user = await userDatabase.getUserByEmail(userData.email);

        const hashManager = new HashManager();
        const isPasswordCorrect = await hashManager.compare(userData.password, user.password);

        if(!isPasswordCorrect){
            throw new Error("Email ou senha incorretos")
        }

        const authenticator = new Authenticator();
        const token = authenticator.generateToken({id: user.id})

        res.status(200).send({
            message: "Usuário logado com sucesso",
            token
        })
    } catch(error) {
        res.status(400).send({
            message:error.message
        })
    } finally {
        BaseDatabase.destroyConnection();
    }
}