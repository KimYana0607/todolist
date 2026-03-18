import {EditableSpan} from "@/common/components/EditableSpan/EditableSpan"
import {TaskStatus} from "@/common/enums"
import type {DomainTask, UpdateTaskModel} from "@/features/todolists/api/tasksApi.types"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import type {ChangeEvent} from "react"
import {getListItemSx} from "./TaskItem.styles"
import {useDeleteTaskMutation, useUpdateTaskMutation} from "@/features/todolists/api/tasksApi.ts";
import {DomainTodolist} from "@/features/auth/lib/types";

type Props = {
    task: DomainTask
    todolist: DomainTodolist
}

export const TaskItem = ({task, todolist}: Props) => {
    const [deleteTask] = useDeleteTaskMutation()
    const [updateTask] = useUpdateTaskMutation()

    const updateTaskHandler = (model: Partial<UpdateTaskModel>) => {
        updateTask({
            taskId: task.id,
            todolistId: todolist.id,
            model: {
                status: task.status,
                title: task.title,
                deadline: task.deadline ?? null,
                description: task.description ?? '',
                priority: task.priority,
                startDate: task.startDate ?? null,
                ...model,
            },
        });
    };

    const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New;
        updateTaskHandler({ status });
    };

    const changeTaskTitle = (title: string) => {
        updateTaskHandler({ title });
    };
    const deleteTaskHandler = async () => {
        console.log("task exists?", task)
        console.log("taskId:", task.id)
        await deleteTask({
            todolistId: todolist.id,
            taskId: task.id
        }).unwrap()
    }

    const isTaskCompleted = task.status === TaskStatus.Completed
    const disabled = todolist.entityStatus === "loading"

    return (
        <ListItem sx={getListItemSx(isTaskCompleted)}>
            <div>
                <Checkbox checked={isTaskCompleted} onChange={changeTaskStatus} disabled={disabled}/>
                <EditableSpan value={task.title} onChange={changeTaskTitle} disabled={disabled}/>
            </div>
            <IconButton onClick={deleteTaskHandler} disabled={disabled}>
                <DeleteIcon/>
            </IconButton>
        </ListItem>
    )
}
