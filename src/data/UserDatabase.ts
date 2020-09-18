import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    private static TABLE_NAME: string = 'UserCookenu';
    private static TABLE_RECIPE: string = 'Recipe';
    private static TABLE_FOLLOW: string = 'UserFollow';

    public async createUser(id: string, name: string, email: string, password: string): Promise<void> {
        await this.getConnection()
            .insert({
                id,
                name,
                email,
                password
            }).into(UserDatabase.TABLE_NAME)
    }

    public async createRecipe(id: string, title: string, description: string, data: string, userCookenu_id: string): Promise<void> {
        await this.getConnection()
            .insert({
                id,
                title,
                description,
                data,
                userCookenu_id
            }).into(UserDatabase.TABLE_RECIPE)
    }

    public async userFollow(userFollower_id: string, userFollowed_id: string): Promise<void> {
        await this.getConnection()
            .insert({
                userFollower_id,
                userFollowed_id
            }).into(UserDatabase.TABLE_FOLLOW)
    }

    public async userUnfollow(userFollower_id: string, userFollowed_id: string): Promise<void> {
        await this.getConnection()
            .delete()
            .from(UserDatabase.TABLE_FOLLOW)
            .where({userFollower_id, userFollowed_id})
    }

    public async getFeedUser(userId: string): Promise<any> {
        const result = await this.getConnection()
            .raw(`
                SELECT Recipe.id, title, description, data, Recipe.userCookenu_id as userId, UserCookenu.name
                FROM UserCookenu
                JOIN Recipe on UserCookenu.id = Recipe.userCookenu_id
                JOIN UserFollow on Recipe.userCookenu_id = UserFollow.userFollowed_id
                WHERE userFollower_id = "${userId}"
                ORDER BY Recipe.data DESC;
            `)
        return result[0]
    }

    public async getRecipeById(id: string): Promise<any> {
        const result = await this.getConnection()
            .select('*')
            .from(UserDatabase.TABLE_RECIPE)
            .where({id})
        return result[0]
    }

    public async getUserByEmail(email: string): Promise<any> {
        const result = await this.getConnection()
            .select('*')
            .from(UserDatabase.TABLE_NAME)
            .where({ email })
        return result[0]
    }

    public async getUserById(id: string): Promise<any> {
        const result = await this.getConnection()
            .select('*')
            .from(UserDatabase.TABLE_NAME)
            .where({ id })
        return result[0]
    }

    public async deleteUser(id: string): Promise<void> {
        await this.getConnection()
            .delete()
            .from(UserDatabase.TABLE_NAME)
            .where({ id });
    }
}