import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [newTasks, setNewTasks] = useState({
    userId: localStorage.getItem("userid"),
  });
  const [createdTasks, setCreatedTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const navigate = useNavigate();

  const handleFieldChange = (field) => (event) => {
    setNewTasks((prevData) => ({
      ...prevData,
      [field]: event.target.value,
    }));
  };

  const validateFields = () => {
    const { title, description, status, duedate } = newTasks;
    if (!title || !description || !status || !duedate) {
      setErrorMessage("Please fill in all fields.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const createTask = async (taskData) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3001/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create task");
      }
  
      await response.json();
      retrieveTasks();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  
  const retrieveTasks = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3001/api/tasks", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to retrieve tasks");
      }
  
      const tasks = await response.json();
      setCreatedTasks(tasks);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  
  const editTask = async (id, task) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
  
      const updatedTask = await response.json();
      setCreatedTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === id ? updatedTask : t))
      );
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  
  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
  
      setCreatedTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setNewTasks(task);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userid");
    navigate("/");
  };

  const handleCreateOrUpdateTask = async () => {
    if (validateFields()) {
      if (editingTaskId) {
        await editTask(editingTaskId, newTasks);
        setEditingTaskId(null);
      } else {
        await createTask(newTasks);
      }
      setNewTasks({ userId: localStorage.getItem("userid") });
    }
  };

  useEffect(() => {
    retrieveTasks();
  }, []);

  const getTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - now;

    if (timeDiff <= 0) return "Due Today or Overdue";

    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return `${daysRemaining} day${daysRemaining > 1 ? "s" : ""} left`;
  };

  return (
    <div
  style={{
    fontFamily: "Montserrat",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    padding: "20px",
  }}
>
  <header
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    }}
  >
    <h1 style={{ color: "#333", margin: 0 }}>Task Management App</h1>
    <button
      onClick={handleLogout}
      style={{
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "20px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  </header>

  {errorMessage && (
    <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>
  )}

  <div style={{ display: "flex", gap: "30px" }}>
    <div style={{ flex: 1, maxWidth: "300px" }}>
      <input
        placeholder="Title"
        value={newTasks.title || ""}
        onChange={handleFieldChange("title")}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
          borderRadius: "8px",
          border: "1px solid #ced4da",
        }}
      />
      <textarea
        placeholder="Description"
        value={newTasks.description || ""}
        onChange={handleFieldChange("description")}
        style={{
          width: "100%",
          height: "100px",
          padding: "12px",
          marginBottom: "10px",
          borderRadius: "8px",
          border: "1px solid #ced4da",
        }}
      />
      <input
        type="date"
        value={newTasks.duedate ? newTasks.duedate.split("T")[0] : ""}
        onChange={handleFieldChange("duedate")}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
          borderRadius: "8px",
          border: "1px solid #ced4da",
        }}
      />
      <select
        value={newTasks.status || ""}
        onChange={handleFieldChange("status")}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
          borderRadius: "8px",
          border: "1px solid #ced4da",
        }}
      >
        <option value="">Select Status</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <button
        onClick={handleCreateOrUpdateTask}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {editingTaskId ? "Update Task" : "Create Task"}
      </button>
    </div>

    <div style={{ flex: 1, padding: "10px" }}>
      <h2>Created Tasks</h2>

      <div style={{ marginBottom: "20px" }}>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ced4da",
          }}
        >
          <option value="">All Tasks</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {createdTasks
        .filter((task) => 
          !filterStatus || task.status === filterStatus
        )
        .map((task) => (
          <div
            key={task._id}
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              padding: "15px",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                position: "absolute",
                right: "10px",
                backgroundColor: "orange",
                padding: "5px 10px",
                borderRadius: "5px",
                color: "#333",
              }}
            >
              {getTimeRemaining(task.duedate)}
            </span>
            <h3 style={{ margin: "0 0 10px" }}>{task.title}</h3>
            <p style={{ margin: "0 0 5px" }}>{task.description}</p>
            <p style={{ margin: "0 0 5px" }}>
              <strong>Status:</strong> {task.status}
            </p>
            <p style={{ margin: "0 0 10px" }}>
              <strong>Due Date:</strong>{" "}
              {new Date(task.duedate).toLocaleDateString()}
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleEditClick(task)}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(task._id)}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
    </div>
  </div>
</div>

  );
};

export default HomePage;
