import dotenv from 'dotenv';
import express from 'express';
import { AddressInfo } from 'net';
import { CreateRecipe } from './endpoints/CreateRecipe';
import { FollowUser } from './endpoints/FollowUser';
import { GetAnotherProfile } from './endpoints/GetAnotherProfile';
import { GetProfile } from './endpoints/GetProfile';
import { GetRecipe } from './endpoints/GetRecipe';
import { Login } from './endpoints/Login';
import { SignUp } from './endpoints/SignUp';
import { UnfollowUser } from './endpoints/UnfollowUser';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/user/signup', SignUp);
app.post('/user/login', Login);
app.get('/user/profile', GetProfile);
app.get('/user/:id', GetAnotherProfile);
app.post('/recipe', CreateRecipe);
app.get('/recipe/:id', GetRecipe);
app.post('/user/follow', FollowUser);
app.post('/user/unfollow', UnfollowUser)

const server = app.listen(process.env.PORT || 3000, () => {
  if(server) {
    const address = server.address() as AddressInfo;
    console.log(`Server is running in http://localhost: ${address.port}`)
  } else {
    console.error('Failure upon starting server')
  }
});