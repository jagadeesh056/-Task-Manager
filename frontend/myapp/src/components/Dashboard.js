import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import './Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ category:'', completed:'', search:'' });

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      setTasks(res.data);
    } catch(err) {
      console.error('Error fetching tasks', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  return (
    <div className="dashboard">
      <TaskForm fetchTasks={fetchTasks} />
      <div className="filters">
        <input 
          type="text" 
          placeholder="Search by title" 
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
        />
        <input 
          type="text" 
          placeholder="Filter by category" 
          value={filters.category}
          onChange={e => setFilters({ ...filters, category: e.target.value })}
        />
        <select 
          value={filters.completed}
          onChange={e => setFilters({ ...filters, completed: e.target.value })}
        >
          <option value="">All</option>
          <option value="true">Completed</option>
          <option value="false">Pending</option>
        </select>
      </div>
      <TaskList tasks={tasks} fetchTasks={fetchTasks} />
    </div>
  );
};

export default Dashboard;
