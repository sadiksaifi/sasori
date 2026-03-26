import { useCallback, useRef, useState } from "react";
import { ArrowUpIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const MODELS = [
  { label: "Opus", value: "opus-4" },
  { label: "Sonnet", value: "sonnet-4" },
  { label: "Haiku", value: "haiku-4.5" },
] as const;

const REASONING_LEVELS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Extra High", value: "extra-high" },
] as const;

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const [model, setModel] = useState("opus-4");
  const [reasoning, setReasoning] = useState("high");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [text, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleInput = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, []);

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col">
      <div className="h-12 bg-gradient-to-t from-background to-transparent" />
      <div className="pointer-events-auto bg-background px-window pb-5 pt-1">
        <div className="mx-auto max-w-3xl rounded-xl border border-quaternary-label bg-secondary-background px-5 pb-3 pt-4 xl:max-w-4xl 2xl:max-w-5xl">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              handleInput();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            disabled={disabled}
            rows={1}
            className="w-full resize-none bg-transparent text-title-3 font-normal text-label outline-none placeholder:text-tertiary-label"
          />

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center px-0.5">
              <InlineSelect value={model} onChange={setModel} label="Model">
                {MODELS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </InlineSelect>

              <InlineSelect value={reasoning} onChange={setReasoning} label="Reasoning">
                {REASONING_LEVELS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </InlineSelect>
            </div>

            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border transition-opacity",
                canSend
                  ? "border-secondary-label text-label active:opacity-70"
                  : "border-quaternary-label text-quaternary-label",
              )}
            >
              <ArrowUpIcon size={16} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InlineSelect({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="cursor-default appearance-none bg-transparent py-0.5 text-body text-secondary-label outline-none transition-colors hover:text-label"
    >
      <optgroup label={label}>{children}</optgroup>
    </select>
  );
}
