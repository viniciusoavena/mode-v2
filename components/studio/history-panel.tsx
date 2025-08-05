import { useStudioStore } from "@/store/studio-store"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ImageIcon, Palette, Type, Layers, Sparkles, RotateCcw } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { HistoryEntry } from "@/store/slices/slices-types"

// Função para obter o ícone baseado no tipo de ação
const getActionIcon = (actionType: string) => {
  switch (actionType) {
    case "generation":
      return Sparkles
    case "layer":
      return Layers
    case "text":
      return Type
    case "color":
      return Palette
    case "image":
      return ImageIcon
    default:
      return RotateCcw
  }
}

// Função para categorizar ações baseado na descrição
const categorizeAction = (description: string): string => {
  const desc = description.toLowerCase()
  if (desc.includes("generat")) return "generation"
  if (desc.includes("layer") || desc.includes("add")) return "layer"
  if (desc.includes("text") || desc.includes("font")) return "text"
  if (desc.includes("color") || desc.includes("adjustment")) return "color"
  if (desc.includes("image")) return "image"
  return "other"
}

// Função para obter cor baseada no tipo
const getActionColor = (actionType: string): string => {
  switch (actionType) {
    case "generation":
      return "from-purple-500/20 to-pink-500/20 border-purple-500/30"
    case "layer":
      return "from-blue-500/20 to-cyan-500/20 border-blue-500/30"
    case "text":
      return "from-green-500/20 to-emerald-500/20 border-green-500/30"
    case "color":
      return "from-orange-500/20 to-red-500/20 border-orange-500/30"
    case "image":
      return "from-indigo-500/20 to-purple-500/20 border-indigo-500/30"
    default:
      return "from-gray-500/20 to-slate-500/20 border-gray-500/30"
  }
}

export function HistoryPanel() {
  const { history, currentIndex, undo, redo } = useStudioStore()

  // Criar histórico expandido com mais detalhes
  const expandedHistory =
    history?.map((item, index) => {
      const actionType = categorizeAction("Action")
      const Icon = getActionIcon(actionType)
      const colorClass = getActionColor(actionType)

      return {
        ...item,
        id: index,
        description: "Action",
        timestamp: new Date(),
        actionType,
        Icon,
        colorClass,
        isActive: index === currentIndex,
      }
    }) || []

  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-sm text-muted-foreground pt-10 px-4">
        <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
          <RotateCcw className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <p className="font-medium mb-2">No History Yet</p>
        <p className="text-xs leading-relaxed">
          Start creating and your actions will appear here. You can jump back to any previous state.
        </p>
      </div>
    )
  }

  const handleActionMenu = (action: string, item: any) => {
    switch (action) {
      case "jump":
        // jumpToAction(history.indexOf(item))
        break
      case "duplicate":
        // Implementar duplicação de ação
        console.log("Duplicate action:", item)
        break
      case "delete":
        // Implementar remoção de ação específica
        console.log("Delete action:", item)
        break
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 pb-4">
        <h3 className="text-base font-semibold">History</h3>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {}}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* History List */}
      <ScrollArea className="flex-1">
        <div className="space-y-3 px-3 pb-4">
          {expandedHistory.map((item, index) => (
            <div
              key={item.id}
              onClick={() => {}}
              className={`group relative rounded-xl p-4 transition-all duration-200 cursor-pointer border bg-gradient-to-br ${
                item.colorClass
              } ${
                item.isActive ? "ring-2 ring-primary/50 shadow-lg scale-[1.02]" : "hover:scale-[1.01] hover:shadow-md"
              }`}
            >
              {/* Content */}
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    item.isActive ? "bg-primary/20" : "bg-background/50"
                  }`}
                >
                  <item.Icon className={`w-4 h-4 ${item.isActive ? "text-primary" : "text-foreground/70"}`} />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium leading-tight mb-1 ${
                      item.isActive ? "text-foreground" : "text-foreground/90"
                    }`}
                  >
                    {item.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                  </p>
                </div>

                {/* Action Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => handleActionMenu("jump", item)}>Jump to State</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleActionMenu("duplicate", item)}>
                      Duplicate Action
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleActionMenu("delete", item)}
                      className="text-red-400 focus:text-red-300"
                    >
                      Remove from History
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Active Indicator */}
              {item.isActive && (
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      {history.length > 0 && (
        <div className="border-t border-border px-3 py-3 mt-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{history.length} actions</span>
            <span>Current: {currentIndex + 1}</span>
          </div>
        </div>
      )}
    </div>
  )
}
