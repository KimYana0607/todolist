import type {GetTasksResponse, UpdateTaskModel} from "./tasksApi.types"
import {baseApi} from "@/app/baseApi.ts";
import {BaseResponse} from "@/common/types";
import {TASK_COUNT} from "@/common/constants";


type PatchCollection = {
    patches: any[],
    inversePatches: any[],
    undo: () => void
}
export const tasksApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getTasks: build.query<GetTasksResponse, { id: string, params: { page: number } }>({
            query: ({id, params}) => ({
                url: `/todo-lists/${id}/tasks`,
                params: {...params, count: TASK_COUNT}
            }),
            providesTags: (_result, _error, arg) => {
                return [{type: 'Tasks', id: arg.id}]
            }
        }),
        createTask: build.mutation<BaseResponse, { todolistId: string; title: string }>({
            query: ({todolistId, title}) => ({
                method: 'POST',
                url: `/todo-lists/${todolistId}/tasks`,
                body: {title}
            }),
            invalidatesTags: (_result, _error, {todolistId}) => [{type: 'Tasks', id: todolistId}]
        }),
        updateTask: build.mutation<BaseResponse, { todolistId: string; taskId: string; model: UpdateTaskModel }>({
            query: ({todolistId, taskId, model}) => ({
                method: 'PUT',
                url: `/todo-lists/${todolistId}/tasks/${taskId}`,
                body: model
            }),
            onQueryStarted: async ({todolistId, taskId, model}, {dispatch, queryFulfilled, getState}) => {
                const args = tasksApi.util?.selectCachedArgsForQuery(getState(), 'getTasks')

                let patchResults: PatchCollection[] = []
                args.forEach((arg) => {
                    patchResults.push(dispatch(
                        tasksApi.util.updateQueryData('getTasks', {
                            id: todolistId,
                            params: {page: arg.params.page}
                        }, (response) => {
                            const index = response.items.findIndex((todo) => todo.id === taskId)
                            if (index !== -1) {
                                response.items[index] = {...response.items[index], ...model}
                            }
                        }),
                    ))
                })
                try {
                    await queryFulfilled
                } catch (e) {
                    patchResults.forEach((patchResult) => {
                        patchResult.undo()
                    })
                }
            },
            invalidatesTags: (_result, _error, {todolistId}) => {
                return [{type: 'Tasks', id: todolistId}]
            }
        }),
        deleteTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
            query: ({todolistId, taskId}) => ({
                method: 'DELETE',
                url: `/todo-lists/${todolistId}/tasks/${taskId}`,
            }),
            invalidatesTags: (_result, _error, {todolistId}) => {
                return [{type: 'Tasks', id: todolistId}]
            }
        })

    })
})

export const {useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation} = tasksApi
