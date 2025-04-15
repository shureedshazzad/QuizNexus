import { USERS_URL } from "../constant.js";
import { apiSlice } from "./apiSlice.js";

//her info are stored in local storage

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => (
        {
            login: builder.mutation({
                query: (data) => (
                    {
                        url: `${USERS_URL}/auth`,
                        method: "POST",
                        body: data,
                    }
                ),
            }),

            register: builder.mutation({
                query: (data) => (
                    {
                        url: `${USERS_URL}`,
                        method: "POST",
                        body: data,
                    }
                )
            }),

            logout: builder.mutation({
                query: () => ({
                    url: `${USERS_URL}/logout`,
                    method: "POST",
                })
            }),

            profile: builder.mutation({
                query: (data) => (
                    {
                        url: `${USERS_URL}/profile`,
                        method: 'PUT',
                        body: data,
                    }
                ),
            }),
    
    
            getUsers:builder.query({
                query: () => ({
                    url: USERS_URL,
                }),
                providesTags: ['Users'],
                keepUnusedDataFor: 5
            }),
    
            
            deleteUser:builder.mutation({
                query: (userId) => ({
                    url: `${USERS_URL}/${userId}`,
                    method:'DELETE'
                })
            }),
    
            getUserDetails:builder.query({
                query: (id) => ({
                    url: `${USERS_URL}/${id}`,
    
                }),
                keepUnusedDataFor: 5,
            }),
    
            forgetPassword: builder.mutation({
                query: (email) => ({
                  url: `${USERS_URL}/forget-password`,
                  method: 'POST',
                  body: { email },
                }),
              }),
    
              verifyOTP: builder.mutation({
                query: ({ email, otp }) => ({
                  url: `${USERS_URL}/verify-otp`,
                  method: 'POST',
                  body: { email, otp },
                }),
              }),
    
              verifyOTPReg: builder.mutation({
                query: ({ email, otp, count }) => ({
                  url: `${USERS_URL}/verify-otp-reg`,
                  method: 'POST',
                  body: { email, otp, count },
                }),
              }),
    
               resetPassword : builder.mutation({
                query: ({ email, password }) => ({
                  url: `${USERS_URL}/reset-password`,
                  method: 'POST',
                  body: { email, password },
                }),
              }),

        }
    )
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useProfileMutation,
    useGetUsersQuery,
    useGetUserDetailsQuery,
    useDeleteUserMutation,
    useForgetPasswordMutation,
    useVerifyOTPMutation,
    useVerifyOTPRegMutation,
    useResetPasswordMutation

} = usersApiSlice;