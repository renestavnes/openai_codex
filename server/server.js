import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openAIApi = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    res.status(200).send({message: "Hello Codex!"});
}); 

app.post("/", async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await openAIApi.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            maxTokens: 3000,
            temperature: 0,
            topP: 1,
            presencePenalty: 0,
            frequencyPenalty: 0.5,
        });
        res.status(200).send({bot: response.data.choices[0].text});
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Something went wrong"});
    }
    
});

app.listen(5000, () => {
    console.log("Server is running on port http://localhost:5000");
});
