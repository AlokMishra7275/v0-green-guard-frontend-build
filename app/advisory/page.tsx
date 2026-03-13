"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Sparkles,
  Heart,
  Sun,
  AlertTriangle,
  Users,
  Building2,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvisorySection {
  title: string;
  severity: string;
  content: string;
  recommendations: string[];
}

interface Advisory {
  publicHealth: AdvisorySection;
  outdoorActivity: AdvisorySection;
  pollutionAlert: AdvisorySection;
  childrenElderly: AdvisorySection;
  governmentAction: AdvisorySection;
  generatedAt: string;
  validUntil: string;
}

const sectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  publicHealth: Heart,
  outdoorActivity: Sun,
  pollutionAlert: AlertTriangle,
  childrenElderly: Users,
  governmentAction: Building2,
};

const severityColors: Record<string, string> = {
  low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  moderate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  high: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function AdvisoryPage() {
  const [advisory, setAdvisory] = useState<Advisory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAdvisory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/advisory", {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate advisory");
      }
      
      const data = await response.json();
      setAdvisory(data.advisory);
    } catch (err) {
      setError("Failed to generate AI advisory. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const advisorySections = advisory
    ? [
        { key: "publicHealth", data: advisory.publicHealth },
        { key: "outdoorActivity", data: advisory.outdoorActivity },
        { key: "pollutionAlert", data: advisory.pollutionAlert },
        { key: "childrenElderly", data: advisory.childrenElderly },
        { key: "governmentAction", data: advisory.governmentAction },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <Brain className="h-4 w-4" />
                AI-Powered Analysis
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Environmental AI Advisory
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Get comprehensive AI-generated environmental insights and recommendations
                based on current air quality conditions and pollution forecasts.
              </p>

              <Button
                size="lg"
                onClick={generateAdvisory}
                disabled={isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating Advisory...
                  </>
                ) : advisory ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Regenerate Advisory
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate AI Environmental Advisory
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Error State */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-xl border border-border/50 bg-card/50 p-6 animate-pulse",
                      i === 0 && "md:col-span-2 lg:col-span-1"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-muted rounded-lg" />
                      <div className="flex-1">
                        <div className="h-5 w-32 bg-muted rounded mb-2" />
                        <div className="h-4 w-20 bg-muted rounded" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-muted rounded" />
                      <div className="h-4 w-4/5 bg-muted rounded" />
                      <div className="h-4 w-3/5 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Advisory Results */}
          <AnimatePresence>
            {advisory && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Validity Info */}
                <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      Generated: {new Date(advisory.generatedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>
                      Valid until: {new Date(advisory.validUntil).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Advisory Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {advisorySections.map(({ key, data }, index) => {
                    const Icon = sectionIcons[key] || AlertTriangle;
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className={cn(
                          "rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/30 transition-all",
                          index === 0 && "md:col-span-2 lg:col-span-1"
                        )}
                      >
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-4">
                          <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">
                              {data.title}
                            </h3>
                            <span
                              className={cn(
                                "inline-flex px-2 py-0.5 rounded-full text-xs font-medium border",
                                severityColors[data.severity]
                              )}
                            >
                              {data.severity.charAt(0).toUpperCase() + data.severity.slice(1)} Risk
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {data.content}
                        </p>

                        {/* Recommendations */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                            Recommendations
                          </h4>
                          <ul className="space-y-2">
                            {data.recommendations.map((rec, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Disclaimer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 p-4 rounded-xl bg-muted/30 border border-border/50 text-center"
                >
                  <p className="text-xs text-muted-foreground">
                    This advisory is generated by AI based on current environmental data and
                    should be used as general guidance only. For specific health concerns,
                    please consult with healthcare professionals or local authorities.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!advisory && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Brain className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                No Advisory Generated Yet
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Click the button above to generate a comprehensive AI-powered
                environmental advisory based on current conditions.
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
