import { cn } from "@/lib/utils";

interface InstructionSectionProps {
  instructions?: string;
}

const InstructionSection = ({ instructions }: InstructionSectionProps) => {
  const paragraphs = instructions
    ? instructions
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];
  return (
    <div className="flex-1 overflow-y-auto">
      {paragraphs.length > 0 ? (
        <div className="flex flex-col">
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className={cn(
                "text-sm leading-relaxed text-foreground py-4",
                i < paragraphs.length - 1 && "border-b border-border",
              )}
            >
              {paragraph}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          No instructions added yet.
        </p>
      )}
    </div>
  );
};

export default InstructionSection;
