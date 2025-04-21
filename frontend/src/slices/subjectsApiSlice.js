
import { SUBJECTS_URL } from "../constant.js";
import { apiSlice } from "./apiSlice.js";

export const subjectsApiSlice = apiSlice.injectEndpoints ({
    endpoints: (builder) => ({
        createSubjects: builder.mutation({
            query: (data) => ({
                url: `${SUBJECTS_URL}/create`,
                method: 'POST',
                body: data,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }, // Ensures cookies (JWT) are sent
            }),
               invalidatesTags: ['Subject'], // Invalidate the 'Quiz' cache tag when a quiz is created
        }),
        getAllSubjects: builder.query({
            query: () => ({
                url: `${SUBJECTS_URL}`,
                method: 'GET',
                providesTags: ['Subject'],
                keepUnusedDataFor: 5, // Keeps data for 5 seconds
                credentials: 'include',
            }), 
        }),
        deleteSubject: builder.mutation({   
            query: (id) => ({
                url: `${SUBJECTS_URL}/delete/${id}`,
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',

                },
            }),
                // If the deletion is successful, we invalidate 'Quiz' to refresh the data
            invalidatesTags: ['Subject'], 
        }),

        showProgress: builder.query({
            query: ({ userId, subjectId }) => ({
              url: `${SUBJECTS_URL}/progress?userId=${userId}&subjectId=${subjectId}`,
              method: 'GET',
              credentials: 'include',
            }),
            providesTags: ['Subject'],
            keepUnusedDataFor: 5,
        }),
    })
})

export const
{
    useCreateSubjectsMutation,
    useGetAllSubjectsQuery,
    useDeleteSubjectMutation,
    useShowProgressQuery
} = subjectsApiSlice