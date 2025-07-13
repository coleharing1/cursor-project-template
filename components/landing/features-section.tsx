/**
 * @fileoverview The interactive features section of the landing page.
 * It displays a list of features on the left and shows the details
 * of the selected feature on the right.
 */
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Target, Layers, Clock, BarChart3, Zap, Smartphone } from "lucide-react"

const features = [
  {
    icon: Target,
    title: "Today's Focus",
    description: "Select tasks from any list for your daily focus. The list auto-resets at midnight, giving you a fresh start every day.",
    image: "/images/feature-focus.png",
  },
  {
    icon: Layers,
    title: "Hierarchical Tasks",
    description: "Break down big ideas into manageable subtasks. Organize everything with custom categories and colors to keep your projects clear.",
    image: "/images/feature-hierarchy.png",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Estimate task duration and track the actual time spent on your work. Use this data to improve your future planning and efficiency.",
    image: "/images/feature-timer.png",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Visualize completion rates, productivity trends, and celebrate your achievements with beautiful, easy-to-understand charts.",
    image: "/images/feature-analytics.png",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for speed with optimistic updates and real-time sync. It even works offline and syncs your data when you're back online.",
    image: "/images/feature-sync.png",
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    description: "Beautifully designed for desktop, tablet, and mobile. Your tasks and progress follow you wherever you go.",
    image: "/images/feature-responsive.png",
  },
];

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(features[0]);

  return (
    <section id="features" className="container px-4">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
          Everything you need to stay organized
        </h2>
        <p className="mb-12 text-lg text-muted-foreground">
          Powerful features designed for how you actually work and think.
        </p>
      </div>
      
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-3">
        {/* Left Column: Feature List */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                onClick={() => setActiveFeature(feature)}
                className={cn(
                  "cursor-pointer rounded-lg p-4 transition-all",
                  activeFeature.title === feature.title
                    ? "bg-primary/10 ring-2 ring-primary"
                    : "hover:bg-accent/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description.split('.')[0]}.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Feature Image */}
        <div className="lg:col-span-2">
          <div className="relative h-[400px] w-full overflow-hidden rounded-xl border bg-secondary/50 shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center p-8"
              >
                {/* Replace with actual image */}
                <div className="w-full h-full bg-background rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Image for: {activeFeature.title}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
} 