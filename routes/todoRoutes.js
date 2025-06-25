const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();

let todos = [];
let idCounter = 1;

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next();
};

// GET all to-dos
router.get('/', (req, res) => {
    res.json(todos);
});

// POST a new to-do
router.post('/', 
    [
        body('title')
        .isString().withMessage('Title must be a string')
        .notEmpty().withMessage('Title is required')
        .trim(),
        handleValidation
    ],
    (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({message: 'Title is required!'});
    }

    const newTodo = {
        id: idCounter++,
        title,
        completed: false
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// PUT (update) to-do
router.put('/:id', 
    [
        param('id').isInt().withMessage('ID must be an integer'),
        body('title').optional()
        .isString().withMessage('Title must be a string')
        .notEmpty().withMessage('Title cannot be empty')
        .trim(),
        body('completed').optional()
        .custom(value => {
            if (typeof value !== 'boolean') {
                throw new Error('Completed must be a boolean');
            }
            return true;
        }),
        handleValidation
    ],
    (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    const todo = todos.find(t => t.id === parseInt(id));

    if (!todo) {
        return res.status(404).json({message: 'To-do not found'});
    }

    if (title !== undefined) {
        todo.title = title;
    }
    if (completed !== undefined) {
        todo.completed = completed;
    }
    return res.json(todo);
});

// DELETE to-do
router.delete("/:id", 
    [
        param('id').isInt().withMessage('ID must be an integer'),
        handleValidation
    ],
    (req, res) => {
    const { id } = req.params;
    const index = todos.findIndex(t => t.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({message: "To-do not found"});
    }

    const deleted = todos.splice(index, 1);
    res.json({message: 'To-do deleted', deleted});
});

module.exports = router;