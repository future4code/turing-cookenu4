import { Request, Response} from 'express';
import { UserDatabase } from '../data/UserDatabase';
import { Authenticator } from '../services/Authenticator';
import { BaseDatabase } from '../data/BaseDatabase';

export const UnfollowUser = async (req: Request, res: Response) => {
    try {
        const unfollowData = {
            userToUnfollowId: req.body.userToUnfollowId
        }

        if(!unfollowData.userToUnfollowId) {
            throw new Error("Informe um id que deseja deixar de seguir")
        }

        const token = req.headers. authorization as string;
        const authenticator = new Authenticator();
        const userDb = authenticator.getData(token)
        if (!userDb) {
            throw new Error("Você não tem autorização")
        }

        const userDatabase = new UserDatabase();
        const user = await userDatabase.getUserById(userDb.id);

        await userDatabase.userUnfollow(
            user.id,
            unfollowData.userToUnfollowId
        )

        res.status(200).send({
            message:'Você deixou de seguir esse usuário'
        })

    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    } finally {
        await BaseDatabase.destroyConnection()
    }
}