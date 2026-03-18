import {EditableSpan} from "@/common/components"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import styles from "./TodolistTitle.module.css"
import {
    todolistsApi,
    useChangeTodolistTitleMutation,
    useDeleteTodolistMutation
} from "@/features/todolists/api/todolistsApi.ts";
import {useAppDispatch} from "@/common/hooks";
import {ResultCode} from "@/common/enums";
import {RequestStatus} from "@/common/types";
import {DomainTodolist} from "@/features/auth/lib/types";

type Props = {
    todolist: DomainTodolist
}

export const TodolistTitle = ({todolist}: Props) => {
    const {id, title, entityStatus} = todolist

    const dispatch = useAppDispatch()
    const [deleteTodolist] = useDeleteTodolistMutation()
    const [changeTodolistTitle] = useChangeTodolistTitleMutation()

    const changeEntityStatus = (entityStatus: RequestStatus)=>{
        dispatch(
            todolistsApi.util.updateQueryData('getTodolists', undefined, (response) => {
                const todolist = response.find((todolist) => todolist.id === id)
                if (todolist) {
                    todolist.entityStatus = entityStatus
                }
            }),
        )
    }
    const deleteTodolistHandler = () => {
        changeEntityStatus('loading')
        deleteTodolist(id).unwrap().then((data) => {
            if (data.resultCode === ResultCode.Error) {
                changeEntityStatus('failed')
            }
        })
            .catch(() => {
                changeEntityStatus('failed')
            })
    }

    const changeTodolistTitleHandler = (title: string) => {
        changeTodolistTitle({id, title})
    }

    return (
        <div className={styles.container}>
            <h3>
                <EditableSpan value={title} onChange={changeTodolistTitleHandler}/>
            </h3>
            <IconButton onClick={deleteTodolistHandler} disabled={entityStatus === "loading"}>
                <DeleteIcon/>
            </IconButton>
        </div>
    )
}
