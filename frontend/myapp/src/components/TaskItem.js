import React, { useState } from 'react';
import axios from 'axios';
import './TaskItem.css';

const TaskItem = ({ task, fetchTasks }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ ...task });

  const token = localStorage.getItem('token');

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleComplete = async () => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, { ...formData, completed: !task.completed }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch(err) {
      console.error('Error toggling task', err);
    }
  };

  const saveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditing(false);
      fetchTasks();
    } catch(err) {
      console.error('Error updating task', err);
    }
  };

  const deleteTask = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${task._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch(err) {
      console.error('Error deleting task', err);
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      {editing ? (
        <>
          <input type="text" name="title" value={formData.title} onChange={onChange} />
          <textarea name="description" value={formData.description} onChange={onChange} />
          <input type="text" name="category" value={formData.category} onChange={onChange} />
          <select name="priority" value={formData.priority} onChange={onChange}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input type="date" name="dueDate" value={formData.dueDate ? formData.dueDate.split("T")[0] : ''} onChange={onChange} />
          <button onClick={saveEdit}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <p>Category: {task.category}</p>
          <p>Priority: {task.priority}</p>
          <p>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
          <p>Status: {task.completed ? 'Completed' : 'Pending'}</p>
          <div className="actions">
            <button onClick={toggleComplete}>
              {task.completed ? 'Pending' : 'Completed'}
            </button>
            <button onClick={() => setEditing(true)}>Edit</button>
            <button onClick={deleteTask}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;
