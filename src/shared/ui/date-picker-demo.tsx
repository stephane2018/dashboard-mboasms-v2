"use client"

import React, { useState } from "react"
import { DatePicker, DateRangePicker, DateInput } from "@/shared/ui/date-picker"

export function DatePickerDemo() {
  const [singleDate, setSingleDate] = useState<Date | undefined>()
  const [rangeDate, setRangeDate] = useState<{
    from?: Date
    to?: Date
  }>({})
  const [inputDate, setInputDate] = useState<Date | undefined>()

  return (
    <div className="space-y-8 p-8 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-4">Date Picker Components</h2>
        <p className="text-muted-foreground mb-6">
          Exemples d'utilisation des composants de sélection de date
        </p>
      </div>

      {/* Single Date Picker */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Sélectionner une date</label>
        <DatePicker
          value={singleDate}
          onChange={setSingleDate}
          placeholder="Choisir une date"
          locale="fr"
        />
        {singleDate && (
          <p className="text-sm text-muted-foreground">
            Date sélectionnée: {singleDate.toLocaleDateString("fr-FR")}
          </p>
        )}
      </div>

      {/* Date Picker with Time */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Sélectionner une date et heure</label>
        <DatePicker
          value={singleDate}
          onChange={setSingleDate}
          placeholder="Choisir une date et heure"
          locale="fr"
          showTime={true}
        />
      </div>

      {/* Date Range Picker */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Sélectionner une plage de dates</label>
        <DateRangePicker
          from={rangeDate.from}
          to={rangeDate.to}
          onChange={setRangeDate}
          placeholder="Sélectionner une plage"
          locale="fr"
        />
        {rangeDate.from && rangeDate.to && (
          <p className="text-sm text-muted-foreground">
            Plage: {rangeDate.from.toLocaleDateString("fr-FR")} -{" "}
            {rangeDate.to.toLocaleDateString("fr-FR")}
          </p>
        )}
      </div>

      {/* Date Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Saisir une date (JJ/MM/YYYY)</label>
        <DateInput
          value={inputDate}
          onChange={setInputDate}
          placeholder="JJ/MM/YYYY"
          locale="fr"
        />
        {inputDate && (
          <p className="text-sm text-muted-foreground">
            Date saisie: {inputDate.toLocaleDateString("fr-FR")}
          </p>
        )}
      </div>

      {/* Summary */}
      <div className="border-t pt-6 mt-8">
        <h3 className="font-semibold mb-4">Résumé des sélections</h3>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Date unique:</span>{" "}
            {singleDate ? singleDate.toLocaleDateString("fr-FR") : "Non sélectionnée"}
          </p>
          <p>
            <span className="font-medium">Plage:</span>{" "}
            {rangeDate.from && rangeDate.to
              ? `${rangeDate.from.toLocaleDateString("fr-FR")} - ${rangeDate.to.toLocaleDateString("fr-FR")}`
              : "Non sélectionnée"}
          </p>
          <p>
            <span className="font-medium">Saisie:</span>{" "}
            {inputDate ? inputDate.toLocaleDateString("fr-FR") : "Non saisie"}
          </p>
        </div>
      </div>
    </div>
  )
}
