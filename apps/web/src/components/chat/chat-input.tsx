import { useCallback, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasText, setHasText] = useState(false);

  const handleSend = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const text = textarea.value.trim();
    if (!text) return;
    onSend(text);
    textarea.value = "";
    textarea.style.height = "auto";
    setHasText(false);
  }, [onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!disabled) handleSend();
      }
    },
    [disabled, handleSend],
  );

  const handleInput = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    setHasText(textarea.value.trim().length > 0);
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-6 pt-3">
      <div className="relative rounded-xl border border-border bg-secondary/50 focus-within:border-ring transition-colors">
        <Textarea
          ref={textareaRef}
          className="w-full resize-none border-0 bg-transparent px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 max-h-[200px] min-h-0 field-sizing-normal"
          placeholder="Send a message..."
          rows={1}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={disabled}
        />
        <Button
          size="icon-sm"
          onClick={handleSend}
          disabled={disabled}
          className={`absolute right-2 bottom-2 rounded-lg transition-opacity ${hasText ? "opacity-100" : "opacity-40"}`}
        >
          <ArrowUp className="size-4" />
        </Button>
      </div>
    </div>
  );
}
