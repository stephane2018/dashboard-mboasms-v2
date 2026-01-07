"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Edit, Trash, Sms } from "iconsax-react"
import type { EnterpriseContactResponseType } from "@/core/models/contact-new"
import { ContactEditPopover } from "@/shared/common/contact-edit-popover"
import { checkPhoneValidation, getPhoneValidationStatus } from "@/core/utils/phone-validation"

interface ContactActionsProps {
  enterpriseId: string
  onUpdate: (contact: EnterpriseContactResponseType) => void
  onDelete: (contact: EnterpriseContactResponseType) => void
  onSendMessage: (contact: EnterpriseContactResponseType) => void
}

export const getContactsColumns = ({
  enterpriseId,
  onUpdate,
  onDelete,
  onSendMessage
}: ContactActionsProps): ColumnDef<EnterpriseContactResponseType>[] => [
  {
    header: "Nom",
    accessorKey: "firstname",
    cell: (row: any) => {
      const contact = row?.row?.original as EnterpriseContactResponseType | undefined
      if (!contact) return <div className="font-medium">-</div>
      return (
        <div>
          <div className="font-medium">
            {contact.firstname || ''} {contact.lastname || ''}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {contact.email || '-'}
          </div>
        </div>
      )
    },
  },
  {
    header: "Téléphone",
    accessorKey: "phoneNumber",
    cell: (row: any) => {
      const contact = row?.row?.original as EnterpriseContactResponseType | undefined
      return (
        <div className="font-medium">
          {contact?.phoneNumber || "-"}
        </div>
      )
    },
  },
  {
    header: "Pays/Ville",
    accessorKey: "country",
    cell: (row: any) => {
      const contact = row?.row?.original as EnterpriseContactResponseType | undefined
      return (
        <div className="text-sm text-muted-foreground">
          {contact?.country ? `${contact.country.toUpperCase()}${contact?.city ? ` / ${contact.city}` : ''}` : "-"}
        </div>
      )
    },
  },
  {
    header: "Archivé",
    accessorKey: "archived",
    cell: (row: any) => {
      const contact = row?.row?.original as EnterpriseContactResponseType | undefined
      const isArchived = contact?.archived ?? false
      return (
        <Badge variant={isArchived ? "destructive" : "outline"}>
          {isArchived ? "Oui" : "Non"}
        </Badge>
      )
    },
  },
  {
    header: "Statut",
    accessorKey: "enabled",
    cell: (row: any) => {
      const contact = row?.row?.original as EnterpriseContactResponseType | undefined
      const isEnabled = (contact as any)?.enabled ?? false
      return (
        <Badge
          variant="outline"
          className={`border-dashed border ${
            isEnabled
              ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "border-gray-400 bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
          }`}
        >
          {isEnabled ? "Actif" : "Inactif"}
        </Badge>
      )
    },
  },
  {
    header: "Validation",
    accessorKey: "phoneValidation",
    cell: (row: any) => {
      const contact = row?.row?.original as EnterpriseContactResponseType | undefined
      if (!contact) return null

      const phoneNumber = contact.phoneNumber || ''
      const validationStatus = getPhoneValidationStatus(phoneNumber)
      const isValid = validationStatus === "CORRECT"

      return (
        <Badge
          variant="outline"
          className={`border-dashed border ${
            isValid
              ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {isValid ? "Valide" : "Invalide"}
        </Badge>
      )
    },
  },
  {
    header: "Opérateur",
    accessorKey: "operator",
    cell: (row: any) => {
      const contact = row?.row?.original as EnterpriseContactResponseType | undefined
      if (!contact) return null

      const phoneNumber = contact.phoneNumber || ''
      const operator = checkPhoneValidation(phoneNumber)

      // Styles pour chaque opérateur avec bordure pointillée et fond
      const operatorStyles: Record<string, string> = {
        MTN: "border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
        ORANGE: "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
        NEXTTEL: "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
        CAMTEL: "border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
        UNKNOWN: "border-gray-400 bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
      }

      if (operator === "UNKNOWN") {
        return <span className="text-muted-foreground text-sm">-</span>
      }

      return (
        <Badge
          variant="outline"
          className={`border-dashed border ${operatorStyles[operator]}`}
        >
          {operator}
        </Badge>
      )
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: (row: any) => {
      const contact = row?.row?.original as EnterpriseContactResponseType | undefined
      if (!contact) return null

      return (
        <div className="flex items-center gap-2">
          <ContactEditPopover
            contact={contact}
            enterpriseId={enterpriseId}
            onUpdate={onUpdate}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Edit size={16} variant="Bulk" color="currentColor" className="text-blue-600" />
            </Button>
          </ContactEditPopover>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSendMessage(contact)}
            className="h-8 w-8 p-0"
          >
            <Sms size={16} variant="Bulk" color="currentColor" className="text-green-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(contact)}
            className="h-8 w-8 p-0"
          >
            <Trash size={16} variant="Bulk" color="currentColor" className="text-red-600" />
          </Button>
        </div>
      )
    },
  },
]
