import { ReactNode } from "react";

interface SubtitleSectionProps {
  icon?: ReactNode;
  subtitle?: string;
  description?: string;
}

export const SubtitleSection = ({
  icon,
  subtitle,
  description = "",
}: SubtitleSectionProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
        {icon && <span className="text-primary">{icon}</span>}
       <h3 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
          {subtitle}
        </h3>
      </div>
      {description && (
        <p className="max-w-[600px] text-muted-foreground text-base md:text-xl">
          {description}
        </p>
      )}
    </div>
  );
};
