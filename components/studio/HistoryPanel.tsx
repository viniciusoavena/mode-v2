"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { HistoryEntry } from "@/store/slices/slices-types"

interface HistoryPanelProps {
  history: HistoryEntry[];
  currentIndex: number;
  onJumpToAction: (index: number) => void;
  onClearHistory: () => void;
}

export function HistoryPanel({ history, currentIndex, onJumpToAction, onClearHistory }: HistoryPanelProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 flex items-center justify-between border-b">
        <h3 className="text-base font-semibold">History</h3>
        <Button variant="ghost" size="sm" onClick={onClearHistory} disabled={history.length === 0}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {history.length > 0 ? (
            history.map((action, index) => (
              <button
                key={index}
                onClick={() => onJumpToAction(index)}
                className={`w-full text-left p-2 rounded-md transition-colors ${
                  index === currentIndex ? "bg-accent" : "hover:bg-accent/50"
                }`}
              >
                <p className="text-sm font-medium">Action {index + 1}</p>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(), { addSuffix: true })}
                </div>
              </button>
            ))
          ) : (
            <div className="text-center text-muted-foreground text-sm py-8">
              <p>No actions yet.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
