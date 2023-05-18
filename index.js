
require("dotenv").config();
const cors = require('cors');

const bodyParser = require('body-parser')
const path = require('path')
const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000


app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());



app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html',))
})

const serverVariable = [{ variable: 'Hello from server' }];


app.post('/variable', async (req, res) => {
  console.log(req , 'Hello');
  const input = req.body.variable
  console.log(input);
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: input }],
  });
  console.log(completion.data.choices[0].message.content);

  serverVariable.push({ variable: completion.data.choices[0].message.content })
  res.send('POST');
});

app.get('/variable', (req, res) => {


  res.json(serverVariable);
});



app.on('clientError', (err, socket) => {
  console.error(err);
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})

