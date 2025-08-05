"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HistoryPanel } from "./history-panel"
import { AIAssistantPanel } from "./AIAssistantPanel"
import { AdjustPanel } from "./AdjustPanel"

export function RightPanel({ setCropLayerId }: { setCropLayerId: (id: string | null) => void }) {
  return (
    <div className="flex h-full flex-col bg-card/80 backdrop-blur-xl">
      <div className="p-4 flex-1 flex flex-col">
        <Tabs defaultValue="adjust" className="flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0 bg-background/50">
            <TabsTrigger value="ai" className="text-xs">
              AI
            </TabsTrigger>
            <TabsTrigger value="adjust" className="text-xs">
              Adjust
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs">
              History
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-4 overflow-hidden">
            <TabsContent value="ai" className="mt-0 px-0 h-full">
              <ScrollArea className="h-full">
                <AIAssistantPanel />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="adjust" className="mt-0 h-full">
              <ScrollArea className="h-full">
                <AdjustPanel setCropLayerId={setCropLayerId} />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="history" className="mt-0 h-full">
              <HistoryPanel />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}