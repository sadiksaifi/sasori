export function TypingIndicator() {
  return (
    <div className="flex items-start pl-1">
      <div className="flex gap-1">
        <span
          className="typing-dot inline-block size-2 rounded-full bg-muted-foreground"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="typing-dot inline-block size-2 rounded-full bg-muted-foreground"
          style={{ animationDelay: "200ms" }}
        />
        <span
          className="typing-dot inline-block size-2 rounded-full bg-muted-foreground"
          style={{ animationDelay: "400ms" }}
        />
      </div>
    </div>
  );
}
