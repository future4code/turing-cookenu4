import { Request, Response} from 'express';
import { BaseDatabase } from '../data/BaseDatabase';
import { UserDatabase } from '../data/UserDatabase';
import { Authenticator } from '../services/Authenticator';
import moment from 'moment';

export const GetRecipe = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization as string;
        const id = req.params.id;
        const authenticator = new Authenticator();
        const authenticatorData = authenticator.getData(token);
        const userDb = new UserDatabase();
        const user = await userDb.getUserById(authenticatorData.id);
        if(!user){
            throw new Error ('Usuário não existe')
        }
        const recipeDb = new UserDatabase();
        const recipe = await recipeDb.getRecipeById(id);
        res.status(200).send({
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            createdAt: moment(recipe.data, 'YYYY-MM-DD').format('DD/MM/YYYY')
        })
    } catch (error) {
        res.status(400).send({message: error.message})
    } finally {
        await BaseDatabase.destroyConnection()
    }
}