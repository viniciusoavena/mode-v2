"use client"

import { useStudioStore } from "@/store/studio-store"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Check } from "lucide-react"
import { dynamicPromptSuggestions, fallbackPromptSuggestions } from "@/lib/mock-data"
import { useMemo } from "react"

export function AIAssistantPanel() {
  const {
    modifiers,
    setModifier,
    removeModifier,
    creativeMode,
    resourceType,
  } = useStudioStore()

  // Hook 'useMemo' para obter as sugestões corretas de forma eficiente
  const currentSuggestions = useMemo(() => {
    if (creativeMode && resourceType && dynamicPromptSuggestions[creativeMode]?.[resourceType]) {
      // Se encontrarmos uma combinação específica, usamos ela e adicionamos as sugestões de fallback
      return {
        ...fallbackPromptSuggestions,
        ...dynamicPromptSuggestions[creativeMode][resourceType],
      };
    }
    // Caso contrário, usamos apenas as sugestões de fallback
    return fallbackPromptSuggestions;
  }, [creativeMode, resourceType]);


  const handleSelectOption = (key: string, value: string) => {
    const lowerKey = key.toLowerCase().replace(' ', '-');
    if (modifiers[lowerKey] === value) {
      removeModifier(lowerKey);
    } else {
      setModifier(lowerKey, value);
    }
  }

  const SuggestionSection = ({ title, items }: { title: string, items: { name: string, desc: string }[] }) => {
    if (!items || items.length === 0) return null; // Não renderiza a seção se não houver itens

    const sectionKey = title.toLowerCase().replace(' ', '-');

    return (
        <div className="border-b border-border last:border-b-0">
            <Collapsible defaultOpen={true}>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-4 px-0 text-left hover:bg-transparent transition-colors">
                    <span className="font-medium text-foreground text-base">{title}</span>
                    <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-4">
                    <div className="space-y-2">
                        {items.map((item) => {
                            const isSelected = modifiers[sectionKey] === item.name;
                            return (
                                <Card
                                    key={item.name}
                                    className={`cursor-pointer transition-all duration-200 ${
                                        isSelected
                                        ? "bg-primary/10 border-primary/50 ring-1 ring-primary/30"
                                        : "bg-card hover:bg-accent/30 border-border"
                                    }`}
                                    onClick={() => handleSelectOption(title, item.name)}
                                >
                                    <CardContent className="p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-sm">{item.name}</span>
                                                    {isSelected && (
                                                        <Check className="h-4 w-4 text-primary" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    )
  }

  return (
    <div className="space-y-4 p-1">
        <div>
            <h3 className="text-base font-semibold mt-6 mb-2">AI Prompt Assistant</h3>
            {Object.entries(currentSuggestions).map(([title, items]) => (
              <SuggestionSection key={title} title={title} items={items} />
            ))}
        </div>
    </div>
  )
}