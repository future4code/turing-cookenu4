import { Request, Response} from 'express';
import { UserDatabase } from '../data/UserDatabase';
import { Authenticator } from '../services/Authenticator';
import { BaseDatabase } from '../data/BaseDatabase';
import moment from 'moment';

export const GetRecipeFeed = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization as string;
        const authenticator = new Authenticator();
        const userDb = authenticator.getData(token);
        if (!userDb) {
            throw new Error ("Você não tem acesso.")
        }

        const userDatabase = new UserDatabase();
        const result = await userDatabase.getFeedUser(userDb.id)
        const recipes = result.map((recipe: any) => {
            return ({
                id: recipe.id,
                title: recipe.title,
                description: recipe.description,
                createAt: moment(recipe.data, "YYYY-MM-DD").format("DD/MM/YYYY"),
                userId: recipe.userId,
                userName: recipe.name
            }
            );
          })

        res.status(200).send({
            recipes
        })
    } catch (error) {
        res.status(400).send({message: error.message})
    } finally {
        await BaseDatabase.destroyConnection();
    }
}