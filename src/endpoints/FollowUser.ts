import { Request, Response} from 'express';
import { UserDatabase } from '../data/UserDatabase';
import {IdGenerator} from '../services/IdGenerator';
import { Authenticator } from '../services/Authenticator';
import { BaseDatabase } from '../data/BaseDatabase';

export const FollowUser = async (req: Request, res: Response) => {
    try {
        const followData = {
            userToFollowId: req.body.userToFollowId
        }

        if(!followData.userToFollowId) {
            throw new Error("Informe um id que deseja seguir")
        }

        const token = req.headers.authorization as string;
        const authenticator = new Authenticator();
        const userDb = authenticator.getData(token)
        if (!userDb) {
            throw new Error("Você não tem autorização")
        }

        const userDatabase = new UserDatabase();
        const user = await userDatabase.getUserById(userDb.id)

        await userDatabase.userFollow(
            user.id,
            followData.userToFollowId
        );

        res.status(200).send({
            message: 'Você começou a seguir esse usuário'
        })

    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    } finally {
        await BaseDatabase.destroyConnection();
    }
}