"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Map } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function BuyLandButton() {
  const [showDialog, setShowDialog] = useState(false)
  const isMobile = useMobile()

  return (
    <>
      <div className={`fixed ${isMobile ? "bottom-24 right-4" : "right-4 top-1/2 -translate-y-1/2"} z-50`}>
        <Button
          onClick={() => setShowDialog(true)}
          className={`bg-green-700 hover:bg-green-800 text-white flex ${isMobile ? "flex-row" : "flex-col"} items-center gap-1 p-3 h-auto`}
          size={isMobile ? "sm" : "lg"}
        >
          <Map className={`${isMobile ? "h-4 w-4" : "h-6 w-6"}`} />
          <span className="text-xs font-medium">Comprar Terra</span>
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px] bg-amber-50 border-amber-200">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-red-800 flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Funcionalidade Desativada
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 p-4">
            <div className="bg-red-100 p-4 rounded-lg border border-red-200">
              <p className="text-gray-700">
                O governo acha que você não merece ou sabe lidar com terras. Agora deve tomar cuidado para o MST
                (Movimento Sem Terra) não invadir sua fazenda a qualquer momento.
              </p>
            </div>

            <div className="bg-amber-100 p-4 rounded-lg border border-amber-200">
              <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Aviso Importante
              </h3>
              <p className="text-amber-800">
                Plante, colha e regue corretamente suas plantações, pois elas também podem ser roubadas a qualquer
                momento!
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowDialog(false)} className="w-full bg-amber-600 hover:bg-amber-700">
              Entendi, vou ficar atento!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

