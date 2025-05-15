
import { GROQS_URL } from "../constant.js";
import { apiSlice } from "./apiSlice.js";

export const aiApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        generateQuestion: builder.mutation({
            query: (data) => ({
                url: `${GROQS_URL}/generate-question`,
                method: 'POST',
                body: data,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }, 
            }),
            invalidatesTags: ['Ai'], 
        }),

        updateProgress: builder.mutation({
            query: (data) => ({
                url: `${GROQS_URL}/progress-update`,
                method: 'POST',
                body: data,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
              
            }),
            invalidatesTags: ['Ai'] 
        }),

        provideFeedback: builder.mutation({
            query: (data) => ({
                url: `${GROQS_URL}/feedback`,
                method: 'POST',
                body: data,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            
            }),
            invalidatesTags: ['Ai'] 
        })

    })
});

// ✅ Correct export hooks
export const { useGenerateQuestionMutation, useUpdateProgressMutation, useProvideFeedbackMutation } = aiApiSlice;
