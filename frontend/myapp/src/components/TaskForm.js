import React, { useState } from 'react';
import axios from 'axios';
import './TaskForm.css';

const TaskForm = ({ fetchTasks }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    dueDate: ''
  });
  const [error, setError] = useState('');

  const { title, description, category, priority, dueDate } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/tasks', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'Medium',
        dueDate: ''
      });
      fetchTasks();
    } catch(err) {
      setError('Error creating task');
    }
  };

  return (
    <div className="task-form">
      <h3>Create New Task</h3>
      {error && <p className="error">{error}</p>}
      <form onSubmit={onSubmit}>
        <input type="text" name="title" value={title} onChange={onChange} placeholder="Title" required />
        <textarea name="description" value={description} onChange={onChange} placeholder="Description"></textarea>
        <input type="text" name="category" value={category} onChange={onChange} placeholder="Category/Tag" />
        <select style={{width: "10%"}} name="priority" value={priority} onChange={onChange}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input style={{width: "10%"}} type="date" name="dueDate" value={dueDate} onChange={onChange} />
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default TaskForm;
