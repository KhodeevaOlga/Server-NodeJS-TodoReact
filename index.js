const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const Todo = require('./models/Todo')
const cors = require('cors')
const todoRoutes = express.Router();




const app = express()
const port = 3003
app.use(cors());
app.use(todoRoutes)
app.use(bodyParser.json());


// Подключение БД
async function start() {
  try {
    await mongoose.connect(
      'mongodb+srv://Olga:141512Olya@cluster0.itzdv.mongodb.net/todo-list?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      }
    )
    app.listen(port, () => {
      console.log(`server has been started on port ${port}`);
    })
  } catch (e) {
    console.log(e);
  }
}

// Запуск
start()

function success(res, payload) {
  return res.status(200).json(payload)
}
function error(res, error) {
  return res.status(error.status).json(error)
}

app.get("/todo", async (req, res) => {

  // Try для отлавливания ошибок в кс
  try {
    const todos = await Todo.find({})
    return success(res, todos)
  } catch (err) {
    return error(res, { status: 400, message: "failed to create todo" })
  }
})

app.post("/todo/create", async (req, res) => {
  try {
    const todo = await Todo.create(req.body)
    return success(res, todo)
  } catch (err) {
    return error(res, { status: 400, message: "failed to create todo" })
  }
})

// Чек ван

app.patch("/check/:id", async (request, response) => {
  console.log( request.body );
  try{
    const { checked } = request.body;
    const allTodo = await Todo.updateOne({_id : request.params.id}, {done: checked})
    return success(response, allTodo)
  } catch (err) {
    return error( response, { status: 400, message: "failed to update status all todo" })
  }
})

// Чек олл:

app.patch("/check", async (request, response) => {
  console.log( request.body );
  try{
    const { ids, checked } = request.body;
    const allTodo = await Todo.updateMany({_id : ids}, {done: checked})
    return success(response, allTodo)
  } catch (err) {
    return error( response, { status: 400, message: "failed to update status all todo" })
  }
})

// Принимаю объект с помощью реквест. Здесь же его разворачиваю, предварительно прописав путь, откуда он пришел.
/*app.post("/hi", async (request, response) => {
  const helloServer = request.body;
  console.log(helloServer);
})*/

// Удаление

// Req - запрос от клиента (фронта), а респонс - ответ с бэка

app.delete("/todo/:id", async (req, res) => {
  try {

    // Идет в БД
   await Todo.deleteOne({_id : req.params.id})
          return success(res, "todo deleted!")
  } catch (err) {
    return error(res, { status: 400, message: "failed to delete todo" })
  }
})

// Кнопка делит олл комплит

app.delete("/deleteCompleted", async (req, res) => {
  try {
    await Todo.deleteMany({done: true})
    return success(res, "deleted")
  } catch (err) {
    return error(res, {status: 400, message: "failed to delete"})

  }
})
  app.put("/changes", async (req, res) => {
    try{
    const { id, value } = req.body;

    const allTodo = await Todo.updateOne({_id : id}, {title: value})
    return success(res, allTodo)
  } catch (err) {
    return error( res, { status: 400, message: "failed to update status all todo" })
  }

})
