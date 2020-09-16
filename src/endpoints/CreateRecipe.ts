import { Request, Response} from 'express';
import { UserDatabase } from '../data/UserDatabase';
import {IdGenerator} from '../services/IdGenerator';
import { Authenticator } from '../services/Authenticator';
import { BaseDatabase } from '../data/BaseDatabase';
import moment, { Moment } from 'moment';

export const CreateRecipe = async (req: Request, res: Response) => {
    try {
        const recipeData = {
            title: req.body.title,
            description: req.body.description
        }

        if(!recipeData.title || !recipeData.description) {
            throw new Error('Preencha todos os campos')
        }      

        const token = req.headers.authorization as string;
        const authenticator = new Authenticator();
        const userDb = authenticator.getData(token);
        if (!userDb) {
            throw new Error ("User dont have authorization")
        }

        const idGenerator = new IdGenerator();
        const id = idGenerator.generate();

        const data: string = moment().format("YYYY-MM-DD");

        const userDatabase = new UserDatabase();
        const user = await userDatabase.getUserById(userDb.id);

        await userDatabase.createRecipe(
            id,
            recipeData.title,
            recipeData.description,
            data,
            user.id
        );
        
        res.status(200).send({
            message: 'Receita criada com sucesso!'
        })
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    } finally {
        await BaseDatabase.destroyConnection();
    }
}