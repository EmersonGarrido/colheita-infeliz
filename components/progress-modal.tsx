"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGameContext } from "./game-context"
import { Progress } from "@/components/ui/progress"
import { Award, CheckCircle2, CircleDashed } from "lucide-react"

interface ProgressModalProps {
  open: boolean
  onClose: () => void
}

export function ProgressModal({ open, onClose }: ProgressModalProps) {
  const { level, experience, experienceToNextLevel, tasks } = useGameContext()

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-amber-50 border-amber-200">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-amber-800">Seu Progresso</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="bg-white p-4 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-800" />
                <span className="font-medium">Nível {level}</span>
              </div>
              <span className="text-sm font-medium">
                {experience} / {experienceToNextLevel} XP
              </span>
            </div>
            <Progress value={(experience / experienceToNextLevel) * 100} className="h-2" />

            <div className="mt-4 text-sm text-gray-600">
              <p>Desbloqueios do nível atual:</p>
              <ul className="list-disc list-inside mt-1">
                {level >= 1 && <li>Cenouras</li>}
                {level >= 2 && <li>Milho</li>}
                {level >= 3 && <li>Morango</li>}
                {level >= 4 && <li>Tomate</li>}
                {level >= 5 && <li>Batata</li>}
                {level < 5 && (
                  <li>
                    Próximo nível: {level === 1 ? "Milho" : level === 2 ? "Morango" : level === 3 ? "Tomate" : "Batata"}
                  </li>
                )}
              </ul>
            </div>
          </div>

          <h3 className="font-bold text-lg text-amber-800">Tarefas Atuais</h3>

          <ScrollArea className="h-[250px] rounded-md border border-amber-200 bg-white p-4">
            <div className="grid gap-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border ${task.completed ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-100"}`}
                >
                  <div className="flex items-start gap-2">
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <CircleDashed className="h-5 w-5 text-amber-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{task.description}</h4>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm">
                          Progresso:{" "}
                          <span className="font-medium">
                            {task.current} / {task.target}
                          </span>
                        </div>
                        <div className="text-sm text-green-700 font-medium">Recompensa: {task.reward} moedas</div>
                      </div>
                      <Progress
                        value={(task.current / task.target) * 100}
                        className={`h-1.5 mt-1 ${task.completed ? "bg-green-100" : "bg-amber-100"}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

