import {TaskStatus} from "@/common/enums"
import {TaskItem} from "./TaskItem/TaskItem"
import List from "@mui/material/List"
import {useGetTasksQuery} from "@/features/todolists/api/tasksApi.ts";
import {TasksSkeleton} from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksSkeleton/TasksSkeleton.tsx";
import {DomainTodolist} from "@/features/auth/lib/types";
import {
    TasksPagination
} from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksPagination/TasksPagination.tsx";
import {useState} from "react";
import {TASK_COUNT} from "@/common/constants";

type Props = {
    todolist: DomainTodolist
}

export const Tasks = ({todolist}: Props) => {
    const {id, filter} = todolist

    const [page, setPage] = useState(1)

    const {data, isLoading} = useGetTasksQuery({id, params: {page}}, {refetchOnFocus: true})

    let filteredTasks = data?.items
    if (filter === "active") {
        filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.New)
    }
    if (filter === "completed") {
        filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.Completed)
    }

    if (isLoading) {
        return <TasksSkeleton/>
    }

    console.log(data)
    return (
        <>
            {filteredTasks?.length === 0 ? (
                <p>Тасок нет</p>
            ) : (<>
                    <List>{filteredTasks?.map((task) => <TaskItem key={task.id} task={task}
                                                                  todolist={todolist}/>)}</List>
                    {data?.totalCount && data.totalCount > TASK_COUNT ? (
                            <TasksPagination totalCount={data?.totalCount || 0} page={page} setPage={setPage}/>)
                        : <></>
                    }

                </>
            )}
        </>
    )
}

