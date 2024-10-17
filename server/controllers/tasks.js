import Task from "../models/Task.js";
import jwt from "jsonwebtoken";

export const createTask = async (req, res) => {
    try {
        const {
            userId,
            title,
            description,
            status,
            duedate,
        } = req.body;

        const newTask = new Task({
            userId,
            title,
            description,
            status,
            duedate,
        })

        console.log(newTask);
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const retrieveTasks = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) return res.sendStatus(403);
        
            try {
                console.log(user.id);
                    
                const tasks = await Task.find({ userId: user.id });
                res.status(200).json(tasks);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: err.message });
            }
          });
  };
  
export const editTask = async(req, res) => {
    const { id } = req.params;
    const { title, description, status, duedate } = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description, status, duedate },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteTask = async(req, res) => {
    const { id } = req.params;

    try {
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}