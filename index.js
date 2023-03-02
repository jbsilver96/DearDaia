const express = require("express");
// configure dotenv
require("dotenv").config();

// import modules from OpenAI library
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);

const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;

app.post("/ask", async (req, res) => {
    // getting prompt question from request
    const prompt = req.body.prompt;
  
    try {
        if (prompt == null) {
          throw new Error("Uh oh, no prompt was provided");
        }
        // trigger OpenAI completion
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt,
            temperature: 0.85,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
    });

    
    console.log('Generated questions:', completion);
    const completion = response.data.choices[0].text;
    return res.status(200).json({
        success: true,
        message: completion,
      });
      
      } catch (error) {
        console.log(error.message);
      }
  });

  app.listen(port, () => console.log(`Server is running on port ${port}!!`));