import express from 'express';
import dotenv from 'dotenv';
import router from "./Routes/Routes.mjs";

const app = express();
dotenv.config();


app.use(express.json());

app.listen(process.env.SERVER_PORT, () => console.log(`Listening on port ${process.env.SERVER_PORT}`));

app.use('/auth', router);
app.use('/lobbies', router)
