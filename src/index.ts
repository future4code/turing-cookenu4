import dotenv from 'dotenv';
import express from 'express';
import { AddressInfo } from 'net';
import { GetAnotherProfile } from './endpoints/GetAnotherProfile';
import { GetProfile } from './endpoints/GetProfile';
import { Login } from './endpoints/Login';
import { SignUp } from './endpoints/SignUp';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/user/signup', SignUp);
app.post('/user/login', Login);
app.get('/user/profile', GetProfile);
app.get('/user/:id', GetAnotherProfile);


const server = app.listen(process.env.PORT || 3000, () => {
  if(server) {
    const address = server.address() as AddressInfo;
    console.log(`Server is running in http://localhost: ${address.port}`)
  } else {
    console.error('Failure upon starting server')
  }
});