const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Task = require('../models/Task');

// POST /api/tasks
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, category, priority, dueDate } = req.body;
  try {
    const task = new Task({
      user: req.user.id,
      title,
      description,
      category,
      priority,
      dueDate
    });
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// GET /api/tasks
router.get('/', authMiddleware, async (req, res) => {
  const { category, completed, search } = req.query;
  let filter = { user: req.user.id };
  if (category) filter.category = category;
  if (completed) filter.completed = completed === 'true';
  if (search) filter.title = { $regex: search, $options: 'i' };

  try {
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// PUT /api/tasks/:id
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, category, completed, priority, dueDate } = req.body;
  const taskFields = { title, description, category, completed, priority, dueDate };

  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    task = await Task.findByIdAndUpdate(req.params.id, { $set: taskFields }, { new: true });
    res.json(task);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).send('Server error');
  }
});



module.exports = router;
