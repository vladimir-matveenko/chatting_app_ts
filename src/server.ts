import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

// test code
app.get('/', (_, res) => {
    res.send('Hello TypeScript!');
});

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});