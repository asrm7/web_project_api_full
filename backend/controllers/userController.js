const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const HttpStatus = require("../utils/httpStatus");
const GenericResponses = require("../utils/responses");
const dotenv = require("dotenv");

// Função para lidar com erros e personalizar mensagens
function handleUserError(err, res) {
  if (err instanceof mongoose.Error.CastError) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: "O ID do usuário fornecido é inválido." });
  }

  if (err.name === "DocumentNotFoundError") {
    return res.status(HttpStatus.NOT_FOUND).json({ message: "Usuário não encontrado com o ID fornecido." });
  }

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: GenericResponses.SERVER_ERROR });
}

// Controladores
const userController = {
  // Listar todos os usuários
  async getAllUsers(req, res) {
    const { email, password, ...data } = req.body;
    try {
      const users = await User.find({});
      res.status(HttpStatus.OK).send(users);
    } catch (err) {
      handleUserError(err, res);
    }
  },



  // Criar um novo usuário
  async createUser(req, res) {
    try {
      const { email, password, name, about, avatar } = req.body;
      if (!email || !password) {
        const error = new Error('Dados Inválidos');
        error.statusCode = 400;
        throw error;
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await User.create({ email, password: hashedPassword, name, about, avatar });
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      res.status(HttpStatus.CREATED).send(userWithoutPassword);
    } catch (err) {
      handleUserError(err, res);
    }
  },

  // Obter o usuário atual (por ID req.params.userId)
  async getUserById(req, res) {
    try {
      const user = await User.findById(req.user._id).orFail();
      res.status(HttpStatus.OK).send(user);
    } catch (err) {
      handleUserError(err, res);
    }
  },

  // Atualizar o perfil do usuário
  async updateUserProfile(req, res) {
    const { name, about } = req.body;

    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, about },
        { new: true, runValidators: true }
      ).orFail();

      res.status(HttpStatus.OK).send(user);
    } catch (err) {
      handleUserError(err, res);
    }
  },

  // Atualizar o avatar do usuário
  async updateUserAvatar(req, res) {
    const { avatar } = req.body;

    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { avatar },
        { new: true, runValidators: true }
      ).orFail();

      res.status(HttpStatus.OK).send(user);
    } catch (err) {
      handleUserError(err, res);
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
      }

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ message: "Credenciais inválidas." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Credenciais inválidas." });
      }

      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Responde com o token
      res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  },
};

module.exports = userController;
