"use client";

import { useState } from "react";
import {
  Clock,
  Flame,
  CheckCircle2,
  Circle,
  Zap,
  ChevronRight,
  Plus,
  Search,
  Timer,
  TrendingUp,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// ─── Sample Data ────────────────────────────────────────────────────────────

interface Task {
  id: string;
  title: string;
  status: "active" | "completed";
  friction: number; // 1-5 friction score
  category: string;
  elapsed: string;
}

const SAMPLE_TASKS: Task[] = [
  {
    id: "1",
    title: "Refactor auth middleware",
    status: "active",
    friction: 4,
    category: "Engineering",
    elapsed: "1h 23m",
  },
  {
    id: "2",
    title: "Fix CI pipeline flakiness",
    status: "active",
    friction: 5,
    category: "DevOps",
    elapsed: "2h 10m",
  },
  {
    id: "3",
    title: "Migrate legacy API routes",
    status: "active",
    friction: 3,
    category: "Engineering",
    elapsed: "45m",
  },
  {
    id: "4",
    title: "Resolve dependency conflicts",
    status: "active",
    friction: 2,
    category: "Engineering",
    elapsed: "18m",
  },
  {
    id: "5",
    title: "Update onboarding flow copy",
    status: "completed",
    friction: 1,
    category: "Product",
    elapsed: "32m",
  },
  {
    id: "6",
    title: "Fix dark mode token issues",
    status: "completed",
    friction: 2,
    category: "Design",
    elapsed: "1h 05m",
  },
  {
    id: "7",
    title: "Optimize image pipeline",
    status: "completed",
    friction: 3,
    category: "Performance",
    elapsed: "2h 47m",
  },
  {
    id: "8",
    title: "Audit third-party scripts",
    status: "completed",
    friction: 1,
    category: "Security",
    elapsed: "55m",
  },
];

// ─── Helper Components ──────────────────────────────────────────────────────

function FrictionDots({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 w-1.5 rounded-full transition-colors",
            i < level ? "bg-electric" : "bg-white/10"
          )}
        />
      ))}
    </div>
  );
}

function TaskItem({
  task,
  isSelected,
  onClick,
}: {
  task: Task;
  isSelected: boolean;
  onClick: () => void;
}) {
  const isCompleted = task.status === "completed";

  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full text-left px-4 py-3 rounded-lg transition-all duration-200",
        "hover:bg-surface-raised",
        isSelected && "bg-surface-raised ring-1 ring-electric/30",
        isCompleted && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {isCompleted ? (
            <CheckCircle2 className="h-4 w-4 text-electric" />
          ) : (
            <Circle className="h-4 w-4 text-white/30 group-hover:text-electric/60 transition-colors" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "text-sm font-medium truncate",
                isCompleted ? "line-through text-muted-foreground" : "text-white"
              )}
            >
              {task.title}
            </span>
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 shrink-0 text-white/20 transition-all",
                "group-hover:text-electric group-hover:translate-x-0.5"
              )}
            />
          </div>
          <div className="mt-1.5 flex items-center gap-3">
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-4 bg-white/5 text-muted-foreground border-0 hover:bg-white/10"
            >
              {task.category}
            </Badge>
            <FrictionDots level={task.friction} />
            <span className="text-[10px] text-muted-foreground font-mono">
              {task.elapsed}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function Home() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const activeTasks = SAMPLE_TASKS.filter(
    (t) =>
      t.status === "active" &&
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const completedTasks = SAMPLE_TASKS.filter(
    (t) =>
      t.status === "completed" &&
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTask = SAMPLE_TASKS.find((t) => t.id === selectedTaskId);
  const dailyStreak = 7;
  const activeCount = SAMPLE_TASKS.filter((t) => t.status === "active").length;
  const completedCount = SAMPLE_TASKS.filter(
    (t) => t.status === "completed"
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-electric/10 ring-1 ring-electric/20">
              <Clock className="h-4 w-4 text-electric" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wide text-white uppercase">
                Friction Clock
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
                Crush What Slows You Down
              </p>
            </div>
          </div>

          {/* Right: Stats & Streak */}
          <div className="flex items-center gap-5">
            {/* Quick stats */}
            <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-electric" />
                <span>
                  <span className="text-white font-semibold">{activeCount}</span>{" "}
                  Active
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span>
                  <span className="text-white font-semibold">
                    {completedCount}
                  </span>{" "}
                  Done
                </span>
              </div>
            </div>

            <Separator orientation="vertical" className="h-6 bg-white/[0.06] hidden sm:block" />

            {/* Streak counter */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-electric/[0.07] ring-1 ring-electric/20">
              <Flame className="h-4 w-4 text-electric" />
              <div className="flex flex-col leading-none">
                <span className="text-xs font-bold text-white">
                  {dailyStreak}-Day Streak
                </span>
                <span className="text-[9px] text-electric/70 tracking-wider uppercase">
                  Keep Going
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col lg:flex-row gap-0">
        {/* ── Left Sidebar: Task Log ────────────────────────────────────── */}
        <aside className="w-full lg:w-[30%] xl:w-[28%] border-r border-white/[0.06] flex flex-col min-h-0">
          {/* Sidebar Header */}
          <div className="px-4 pt-5 pb-3 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                Task Log
              </h2>
              <Button
                size="sm"
                className="h-7 px-2.5 text-[11px] bg-electric/10 text-electric hover:bg-electric/20 border-0 shadow-none"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs bg-white/[0.04] border-white/[0.06] text-white placeholder:text-muted-foreground/50 focus-visible:ring-electric/30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <Separator className="bg-white/[0.06]" />

          {/* Task List */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {/* Active Tasks */}
              {activeTasks.length > 0 && (
                <div className="space-y-0.5">
                  <div className="px-4 py-2 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-electric/80">
                      Active
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      {activeTasks.length}
                    </span>
                  </div>
                  {activeTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      isSelected={selectedTaskId === task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                    />
                  ))}
                </div>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div className="space-y-0.5 mt-3">
                  <div className="px-4 py-2 flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500/50" />
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
                      Completed
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      {completedTasks.length}
                    </span>
                  </div>
                  {completedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      isSelected={selectedTaskId === task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                    />
                  ))}
                </div>
              )}

              {activeTasks.length === 0 && completedTasks.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <p className="text-xs text-muted-foreground">
                    No tasks match your search.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Sidebar Footer */}
          <div className="px-4 py-3 border-t border-white/[0.06] bg-surface/50">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Total friction today</span>
              <span className="text-electric font-semibold font-mono">
                {SAMPLE_TASKS.reduce((acc, t) => acc + t.friction, 0)} pts
              </span>
            </div>
          </div>
        </aside>

        {/* ── Main Workspace ────────────────────────────────────────────── */}
        <section className="flex-1 flex items-center justify-center min-h-[50vh] lg:min-h-0">
          {selectedTask ? (
            <div className="w-full max-w-2xl px-6 py-8 space-y-6">
              {/* Task Detail Card */}
              <Card className="bg-surface border-white/[0.06] shadow-none">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-2 py-0.5 bg-electric/10 text-electric border-0"
                    >
                      {selectedTask.status === "active" ? "In Progress" : "Completed"}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-mono text-muted-foreground">
                        {selectedTask.elapsed}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-white mt-2">
                    {selectedTask.title}
                  </CardTitle>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 h-4 bg-white/5 text-muted-foreground border-0"
                    >
                      {selectedTask.category}
                    </Badge>
                    <FrictionDots level={selectedTask.friction} />
                    <span className="text-[10px] text-muted-foreground">
                      Friction Level {selectedTask.friction}/5
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-muted-foreground">Friction breakdown</span>
                      <span className="text-electric font-semibold">
                        {selectedTask.friction * 20}%
                      </span>
                    </div>
                    <Progress
                      value={selectedTask.friction * 20}
                      className="h-1.5 bg-white/[0.06] [&>div]:bg-electric"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-white/[0.03] p-3 text-center">
                      <TrendingUp className="h-4 w-4 text-electric mx-auto mb-1" />
                      <p className="text-[10px] text-muted-foreground">Impact</p>
                      <p className="text-sm font-bold text-white">
                        {selectedTask.friction * 12}min
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/[0.03] p-3 text-center">
                      <Zap className="h-4 w-4 text-electric mx-auto mb-1" />
                      <p className="text-[10px] text-muted-foreground">Energy Cost</p>
                      <p className="text-sm font-bold text-white">
                        {selectedTask.friction * 8}%
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/[0.03] p-3 text-center">
                      <Clock className="h-4 w-4 text-electric mx-auto mb-1" />
                      <p className="text-[10px] text-muted-foreground">Time Lost</p>
                      <p className="text-sm font-bold text-white">
                        {selectedTask.friction * 5}min
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center gap-6 px-6 text-center">
              {/* Decorative Ring */}
              <div className="relative">
                <div className="h-24 w-24 rounded-full border border-white/[0.06] flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full border border-electric/20 flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full bg-electric/10 flex items-center justify-center ring-1 ring-electric/30">
                      <Zap className="h-4 w-4 text-electric" />
                    </div>
                  </div>
                </div>
                {/* Orbiting dot */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="h-2 w-2 rounded-full bg-electric shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
                </div>
              </div>

              <div className="space-y-2 max-w-sm">
                <h2 className="text-lg font-semibold text-white">
                  Select a task to begin crushing friction.
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Pick an item from the Task Log to see its friction breakdown,
                  time cost, and energy impact. Every piece of friction you
                  eliminate sharpens your edge.
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-muted-foreground/50 tracking-widest uppercase">
                <div className="h-px w-8 bg-white/[0.08]" />
                <span>Friction Clock</span>
                <div className="h-px w-8 bg-white/[0.08]" />
              </div>
            </div>
          )}
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-white/[0.06] bg-black">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/50">
            <Clock className="h-3 w-3" />
            <span className="tracking-wider uppercase">Friction Clock</span>
          </div>
          <div className="text-[10px] text-muted-foreground/30 font-mono">
            v0.1.0
          </div>
        </div>
      </footer>
    </div>
  );
}
