export function PollutionMapSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="h-5 w-48 bg-muted rounded animate-pulse" />
        <div className="flex items-center gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 w-16 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
      <div className="h-[400px] bg-muted/20 animate-pulse flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading map...</div>
      </div>
    </div>
  );
}
