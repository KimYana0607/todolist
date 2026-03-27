import type {GetTasksResponse, UpdateTaskModel} from "./tasksApi.types"
import {baseApi} from "@/app/baseApi.ts";
import {BaseResponse} from "@/common/types";
import {TASK_COUNT} from "@/common/constants";
import type {TagDescription} from "@reduxjs/toolkit/query";

type GetTasksArg = {id: string; params: {page: number}}
type ApiTag = "Todolists" | "Tasks" | "Auth"


type PatchCollection = {
    patches: any[],
    inversePatches: any[],
    undo: () => void
}
export const tasksApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getTasks: build.query<GetTasksResponse, GetTasksArg>({
            query: ({id, params}: GetTasksArg) => ({
                url: `/todo-lists/${id}/tasks`,
                params: {...params, count: TASK_COUNT}
            }),
            providesTags: (_result, _error, arg): TagDescription<ApiTag>[] => [{type: "Tasks", id: arg.id}],
        }),
        createTask: build.mutation<BaseResponse, { todolistId: string; title: string }>({
            query: ({todolistId, title}) => ({
                method: 'POST',
                url: `/todo-lists/${todolistId}/tasks`,
                body: {title}
            }),
            invalidatesTags: (_result, _error, {todolistId}): TagDescription<ApiTag>[] => [
                {type: "Tasks", id: todolistId},
            ],
        }),
        updateTask: build.mutation<BaseResponse, { todolistId: string; taskId: string; model: UpdateTaskModel }>({
            query: ({todolistId, taskId, model}) => ({
                method: 'PUT',
                url: `/todo-lists/${todolistId}/tasks/${taskId}`,
                body: model
            }),
            onQueryStarted: async ({todolistId, taskId, model}, {dispatch, queryFulfilled, getState}) => {
                const args = tasksApi.util.selectCachedArgsForQuery(getState(), 'getTasks')

                let patchResults: PatchCollection[] = []
                args.forEach((arg: GetTasksArg) => {
                    if (arg.id !== todolistId) return

                    patchResults.push(dispatch(
                        tasksApi.util.updateQueryData('getTasks', arg, (response: GetTasksResponse) => {
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
            invalidatesTags: (_result, _error, {todolistId}): TagDescription<ApiTag>[] => [
                {type: "Tasks", id: todolistId},
            ],
        }),
        deleteTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
            query: ({todolistId, taskId}) => ({
                method: 'DELETE',
                url: `/todo-lists/${todolistId}/tasks/${taskId}`,
            }),
            invalidatesTags: (_result, _error, {todolistId}): TagDescription<ApiTag>[] => [
                {type: "Tasks", id: todolistId},
            ],
        })

    })
})

export const {useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation} = tasksApi
