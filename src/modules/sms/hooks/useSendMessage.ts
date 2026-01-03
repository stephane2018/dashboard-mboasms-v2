"use client"

import { useMutation } from "@tanstack/react-query"
import { sendSMS } from "../services/sms.service"
import type { SendMessageParams, SendMessageResponse } from "../types/sms.types"

/**
 * Hook to handle SMS sending with React Query mutation
 * @returns Mutation state and sendMessage function
 */
export function useSendMessage() {
    const mutation = useMutation<SendMessageResponse, Error, SendMessageParams>({
        mutationFn: sendSMS,
    })

    return {
        sendMessage: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
        data: mutation.data,
        reset: mutation.reset,
    }
}
