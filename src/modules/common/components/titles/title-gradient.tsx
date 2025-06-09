"use client"
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface TitleGradientProps {
  badgeText?: string;
  badgeIcon?: ReactNode;
  tagIcon?: ReactNode;
  title: string;
  subtitle?: string;
  description?: string;
}

export const TitleGradient = ({
  badgeText,
  badgeIcon,
  tagIcon,
  title,
  subtitle = "",
  description = "",
}: TitleGradientProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center">
      {badgeText && (
        <Badge
          variant="outline"
          className="bg-primary/10 border-primary/20 text-primary"
        >
          {badgeIcon && <span className="px-2">{badgeIcon}</span>}
          {badgeText}
        </Badge>
      )}

      <div className="space-y-2 md:space-y-4 flex flex-col md:flex-row gap-2 md:gap-4 items-center justify-center">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
          {title}
        </h2>
        {tagIcon && tagIcon}
      </div>

      {subtitle && (
        <p className="text-muted-foreground max-w-[700px] mx-auto text-sm md:text-base">
          {subtitle}
        </p>
      )}

      <div className="flex items-center justify-center space-x-2">
        <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full" />
        <div className="h-1 w-8 bg-gradient-to-r from-secondary to-accent rounded-full" />
        <div className="h-1 w-4 bg-accent rounded-full" />
      </div>

      <p className="mx-auto max-w-[700px] text-muted-foreground text-sm md:text-lg lg:text-xl">
        {description}
      </p>
    </div>
  );
};
