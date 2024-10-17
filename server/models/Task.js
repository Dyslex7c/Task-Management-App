import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        description: {
            type: String,
            required: true,
            min: 2,
            max: 200,
        },
        status: {
            type: String,
            required: true,
            enum: ["Pending", "In Progress", "Completed"]
        },
        duedate: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);
export default Task;