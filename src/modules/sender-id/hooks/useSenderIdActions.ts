"use client"

import { useState } from "react"
import { toast } from "sonner"
import { senderIdService } from "../services"
import type {
  CreateSenderIdInput,
  UpdateSenderIdInput,
  UpdateSenderIdStatusInput,
} from "../types"

export function useSenderIdActions() {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const createSenderId = async (input: CreateSenderIdInput) => {
    setIsCreating(true)
    try {
      const result = await senderIdService.createSenderId(input)
      toast.success("Sender ID créé avec succès")
      return result
    } catch (error) {
      console.error("Error creating sender ID:", error)
      toast.error("Erreur lors de la création du Sender ID")
      throw error
    } finally {
      setIsCreating(false)
    }
  }

  const updateSenderId = async (id: string, input: UpdateSenderIdInput) => {
    setIsUpdating(true)
    try {
      const result = await senderIdService.updateSenderId(id, input)
      toast.success("Sender ID modifié avec succès")
      return result
    } catch (error) {
      console.error("Error updating sender ID:", error)
      toast.error("Erreur lors de la modification du Sender ID")
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  const updateSenderIdStatus = async (id: string, input: UpdateSenderIdStatusInput) => {
    setIsUpdatingStatus(true)
    try {
      const result = await senderIdService.updateSenderIdStatus(id, input)
      toast.success("Statut du Sender ID mis à jour avec succès")
      return result
    } catch (error) {
      console.error("Error updating sender ID status:", error)
      toast.error("Erreur lors de la mise à jour du statut")
      throw error
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const deleteSenderId = async (id: string) => {
    setIsDeleting(true)
    try {
      await senderIdService.deleteSenderId(id)
      toast.success("Sender ID supprimé avec succès")
    } catch (error) {
      console.error("Error deleting sender ID:", error)
      toast.error("Erreur lors de la suppression du Sender ID")
      throw error
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    createSenderId,
    updateSenderId,
    updateSenderIdStatus,
    deleteSenderId,
    isCreating,
    isUpdating,
    isDeleting,
    isUpdatingStatus,
  }
}
