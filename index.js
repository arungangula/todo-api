const express = require('express');
const app = express();
const PORT = 3001;

const todoRoutes = require('./routes/todoRoutes');

app.use(express.json());
app.use('/todos', todoRoutes);

app.listen(PORT, () => {
    console.log(`To-Do API running on http://localhost:${PORT}/todos/`);
});