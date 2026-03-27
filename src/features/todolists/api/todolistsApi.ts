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
            query: (id) => ({method: 'DELETE', url: `/todo-lists/${id}`}),
            onQueryStarted: async (id, {dispatch, queryFulfilled})=>{
                const patchResult = dispatch(
                    todolistsApi.util.updateQueryData('getTodolists', undefined, (todolists: DomainTodolist[]) => {
                        const index = todolists.findIndex((todo) => todo.id === id)
                        if (index !== -1) {
                            todolists.splice(index, 1)
                        }
                    }),
                )
                try {
                    await queryFulfilled
                } catch (e) {
                    patchResult.undo()
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
