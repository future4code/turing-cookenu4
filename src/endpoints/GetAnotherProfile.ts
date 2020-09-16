import { Request, Response} from 'express';
import { BaseDatabase } from '../data/BaseDatabase';
import { UserDatabase } from '../data/UserDatabase';
import { Authenticator } from '../services/Authenticator';

export const GetAnotherProfile = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization as string;
        const authenticator = new Authenticator();
        const anotherUser = authenticator.getData(token);
        if (!anotherUser) {
            throw new Error ("User dont have authorization")
        }
        const id = req.params.id;
        const userDb = new UserDatabase();
        const user = await userDb.getUserById(id);
        res.status(200).send({
            id: user.id,
            name: user.name,
            email: user.email
        })
    } catch (error) {
        res.status(400).send({message: error.message})
    } finally {
        await BaseDatabase.destroyConnection()
    }
}