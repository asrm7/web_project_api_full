const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const HttpStatus = require("./utils/httpStatus"); // Importa os códigos de status
const GenericResponses = require("./utils/responses"); // Importa as respostas genéricas
const bodyParser = require("body-parser");
const cors = require("cors");
const { requestLogger, errorLogger } = require("./middleware/logger");

dotenv.config();
const port = process.env.PORT || 3000;
//app.use(bodyParser.json());
 const app = express();
 app.use(express.json());
 app.use(cors({
  origin: "*",  // Ou substitua com um domínio específico para maior segurança
  methods: "GET,POST,PATCH,PUT,DELETE", //  métodos utilizados
  allowedHeaders: "Content-Type,Authorization", //  cabeçalhos necessários
}));




// Conexão com o MongoDB
mongoose
  .connect(process.env.CONNECTION)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Rota de teste de erro
app.use(requestLogger);


// Roteadores
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);


// Middleware para tratar rotas inexistentes
app.use((req, res) => {
  res
    .status(HttpStatus.NOT_FOUND)
    .json({ message: GenericResponses.NOT_FOUND });
});
app.use(errorLogger);
// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error("Erro no servidor:", err.stack);
  res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ message: GenericResponses.SERVER_ERROR });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
