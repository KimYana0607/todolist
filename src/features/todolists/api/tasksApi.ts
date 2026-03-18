import type {GetTasksResponse, UpdateTaskModel} from "./tasksApi.types"
import {baseApi} from "@/app/baseApi.ts";
import {BaseResponse} from "@/common/types";

export const tasksApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getTasks: build.query<GetTasksResponse, string>({
            query: (todolistId) => `/todo-lists/${todolistId}/tasks`,
            providesTags: ['Tasks']
        }),
        createTask: build.mutation<BaseResponse, { todolistId: string; title: string }>({
            query: ({todolistId, title}) => ({
                method: 'POST',
                url: `/todo-lists/${todolistId}/tasks`,
                body: {title}
            }),
            invalidatesTags: ['Tasks']
        }),
        updateTask: build.mutation<BaseResponse, { todolistId: string; taskId: string; model: UpdateTaskModel }>({
            query: ({todolistId, taskId, model}) => ({
                method: 'PUT',
                url: `/todo-lists/${todolistId}/tasks/${taskId}`,
                body: model
            }),
            invalidatesTags: ['Tasks']
        }),
        deleteTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
            query: ({todolistId, taskId}) => ({
                method: 'DELETE',
                url: `/todo-lists/${todolistId}/tasks/${taskId}`,
            }),
            invalidatesTags: ['Tasks']
        })

    })
})

export const {useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation} = tasksApi
