import type {Todolist} from "./todolistsApi.types"
import {BaseResponse} from "@/common/types";
import {baseApi} from "@/app/baseApi.ts";
import {DomainTodolist} from "@/features/auth/lib/types";

export const todolistsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getTodolists: build.query<DomainTodolist[], void>({
            query: () =>  "/todo-lists",
            transformResponse: (todolists: Todolist[]): DomainTodolist[] => {
                return todolists.map((tl) => ({...tl, filter: "all", entityStatus: "idle"}))
            },
            providesTags: ['Todolists'],
        }),
        createTodolist: build.mutation<BaseResponse<{ item: Todolist }>, string>({
            query: (title) => {
                return {
                    method: 'POST',
                    url: "/todo-lists",
                    body: {title}
                }
            },
            invalidatesTags: ['Todolists'],
        }),
        changeTodolistTitle: build.mutation<BaseResponse, { id: string; title: string }>({
            query: ({id, title}) => {
                return {
                    method: 'PUT',
                    url: `/todo-lists/${id}`,
                    body: {title}
                }
            },
            invalidatesTags: ['Todolists'],
        }),
        deleteTodolist: build.mutation<BaseResponse, string>({
            query: (id) => {
                return {
                    method: 'DELETE',
                    url: `/todo-lists/${id}`
                }
            },
            invalidatesTags: ['Todolists'],
        })
    }),
})

export const {
    useGetTodolistsQuery,
    useCreateTodolistMutation,
    useChangeTodolistTitleMutation,
    useDeleteTodolistMutation
} = todolistsApi


// export const todolistsApi = {
//   getTodolists() {
//     return instance.get<Todolist[]>("/todo-lists")
//   },
//   changeTodolistTitle(payload: { id: string; title: string }) {
//     const { id, title } = payload
//     return instance.put<BaseResponse>(`/todo-lists/${id}`, { title })
//   },
//   createTodolist(title: string) {
//     return instance.post<BaseResponse<{ item: Todolist }>>("/todo-lists", { title })
//   },
//   deleteTodolist(id: string) {
//     return instance.delete<BaseResponse>(`/todo-lists/${id}`)
//   },
// }
