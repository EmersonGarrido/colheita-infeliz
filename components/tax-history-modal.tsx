"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGameContext } from "./game-context"
import { useLanguage } from "./language-context"
import { format } from "date-fns"
import { ptBR, enUS } from "date-fns/locale"

interface TaxHistoryModalProps {
  open: boolean
  onClose: () => void
}

export function TaxHistoryModal({ open, onClose }: TaxHistoryModalProps) {
  const { taxHistory, taxesPaid } = useGameContext()
  const { t, language } = useLanguage()

  // Função para formatar a data
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return format(date, "dd/MM/yyyy HH:mm", {
      locale: language === "pt-BR" ? ptBR : enUS,
    })
  }

  // Função para obter o nome do tipo de imposto
  const getTaxTypeName = (type: string) => {
    switch (type) {
      case "income":
        return t("incomeTax")
      case "capitalGains":
        return t("capitalGainsTax")
      case "sales":
        return t("salesTax")
      case "seedTax":
        return "Imposto sobre Sementes"
      default:
        return type
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-amber-50 border-amber-200">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-amber-800">{t("taxHistory")}</DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-4 bg-amber-100 rounded-lg">
          <div className="text-center">
            <h3 className="text-lg font-bold text-amber-800">{t("totalTaxesPaid")}</h3>
            <p className="text-2xl font-bold text-red-600">
              {taxesPaid} {t("coins")}
            </p>
          </div>
        </div>

        <ScrollArea className="h-[400px] rounded-md border border-amber-200 bg-white p-4">
          {taxHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">{t("noTaxesYet")}</div>
          ) : (
            <div className="space-y-4">
              {taxHistory.map((tax) => (
                <div key={tax.id} className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{getTaxTypeName(tax.type)}</h4>
                      <p className="text-sm text-gray-600">{formatDate(tax.date)}</p>
                    </div>
                    <div className="text-red-600 font-bold">
                      -{tax.amount} {t("coins")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

