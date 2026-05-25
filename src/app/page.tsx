"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  ArrowLeft,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

type WorkspaceView = "form" | "timer" | "complete";

interface Task {
  id: string;
  title: string;
  status: "active" | "completed";
  friction: number;
  category: string;
  elapsed: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const TIMER_DURATION = 120; // 2 minutes in seconds

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

// ─── Friction Slider Labels ─────────────────────────────────────────────────

const FRICTION_LABELS: Record<number, string> = {
  1: "Trivial",
  2: "Easy",
  3: "Mild",
  4: "Moderate",
  5: "Stubborn",
  6: "Heavy",
  7: "Daunting",
  8: "Dreadful",
  9: "Brutal",
  10: "Pure Dread",
};

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
                isCompleted
                  ? "line-through text-muted-foreground"
                  : "text-white"
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

// ─── Circular Timer Component ───────────────────────────────────────────────

function CircularTimer({
  timeLeft,
  totalTime,
  isRunning,
  taskName,
  frictionLevel,
}: {
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  taskName: string;
  frictionLevel: number;
}) {
  const size = 280;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / totalTime;
  const strokeDashoffset = circumference * (1 - progress);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const displayTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Task context above timer */}
      <div className="text-center space-y-1">
        <p className="text-xs text-muted-foreground tracking-widest uppercase">
          Micro-Commitment
        </p>
        <h3 className="text-sm font-medium text-white max-w-[260px] truncate">
          {taskName}
        </h3>
        <div className="flex items-center justify-center gap-2">
          <FrictionDots level={Math.min(Math.ceil(frictionLevel / 2), 5)} />
          <span className="text-[10px] text-electric font-mono">
            Lvl {frictionLevel}
          </span>
        </div>
      </div>

      {/* SVG Timer Ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />
          {/* Subtle tick marks */}
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i * 6 * Math.PI) / 180;
            const isMajor = i % 5 === 0;
            const innerR = radius - (isMajor ? 14 : 10);
            const outerR = radius - 8;
            return (
              <line
                key={i}
                x1={size / 2 + innerR * Math.cos(angle)}
                y1={size / 2 + innerR * Math.sin(angle)}
                x2={size / 2 + outerR * Math.cos(angle)}
                y2={size / 2 + outerR * Math.sin(angle)}
                stroke={
                  isMajor
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(255,255,255,0.04)"
                }
                strokeWidth={isMajor ? 1.5 : 0.5}
              />
            );
          })}
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#00E5FF"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
            style={{
              filter: "drop-shadow(0 0 6px rgba(0,229,255,0.4))",
            }}
          />
          {/* Glowing endpoint dot */}
          {timeLeft > 0 && (
            <circle
              cx={
                size / 2 + radius * Math.cos(-Math.PI / 2 + 2 * Math.PI * progress)
              }
              cy={
                size / 2 + radius * Math.sin(-Math.PI / 2 + 2 * Math.PI * progress)
              }
              r={4}
              fill="#00E5FF"
              style={{
                filter: "drop-shadow(0 0 8px rgba(0,229,255,0.8))",
              }}
            />
          )}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-5xl font-bold tracking-wider text-white"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {displayTime}
          </span>
          <span className="text-[10px] text-muted-foreground tracking-widest uppercase mt-2">
            {isRunning ? "Focusing" : timeLeft === TIMER_DURATION ? "Ready" : "Paused"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function Home() {
  // Sidebar state
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Workspace form state
  const [taskInput, setTaskInput] = useState("");
  const [frictionValue, setFrictionValue] = useState<number[]>([5]);
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>("form");

  // Timer state
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const remainingRef = useRef<number>(TIMER_DURATION);

  // Computed
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

  // ── Timer Logic (accurate, based on real elapsed time) ────────────────────

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    remainingRef.current = timeLeft;
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      if (startTimeRef.current === null) return;
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const newTimeLeft = Math.max(0, remainingRef.current - elapsed);

      setTimeLeft(newTimeLeft);

      if (newTimeLeft <= 0) {
        clearTimer();
        setIsRunning(false);
        setWorkspaceView("complete");
      }
    }, 200); // Update frequently for smooth visuals
  }, [timeLeft, clearTimer]);

  const pauseTimer = useCallback(() => {
    if (startTimeRef.current !== null) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    }
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const resetWorkspace = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setTimeLeft(TIMER_DURATION);
    setWorkspaceView("form");
    setTaskInput("");
    setFrictionValue([5]);
  }, [clearTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const handleCalibrate = () => {
    if (!taskInput.trim()) return;
    setWorkspaceView("timer");
    setTimeLeft(TIMER_DURATION);
    setIsRunning(false);
  };

  const currentFriction = frictionValue[0];
  const frictionLabel = FRICTION_LABELS[currentFriction] || "";

  // Friction color interpolation: green → yellow → orange → red
  const frictionColor =
    currentFriction <= 3
      ? "text-emerald-400"
      : currentFriction <= 5
        ? "text-amber-400"
        : currentFriction <= 7
          ? "text-orange-400"
          : "text-red-400";

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

            <Separator
              orientation="vertical"
              className="h-6 bg-white/[0.06] hidden sm:block"
            />

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
                onClick={resetWorkspace}
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
            /* ── Selected Task Detail View ── */
            <div className="w-full max-w-2xl px-6 py-8 space-y-6">
              <Card className="bg-surface border-white/[0.06] shadow-none">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-2 py-0.5 bg-electric/10 text-electric border-0"
                    >
                      {selectedTask.status === "active"
                        ? "In Progress"
                        : "Completed"}
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
                      <span className="text-muted-foreground">
                        Friction breakdown
                      </span>
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
                      <p className="text-[10px] text-muted-foreground">
                        Energy Cost
                      </p>
                      <p className="text-sm font-bold text-white">
                        {selectedTask.friction * 8}%
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/[0.03] p-3 text-center">
                      <Clock className="h-4 w-4 text-electric mx-auto mb-1" />
                      <p className="text-[10px] text-muted-foreground">
                        Time Lost
                      </p>
                      <p className="text-sm font-bold text-white">
                        {selectedTask.friction * 5}min
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : workspaceView === "form" ? (
            /* ── Task Creation Form ── */
            <div className="w-full max-w-lg px-6 py-8">
              <div className="space-y-8">
                {/* Form Header */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-electric/10 ring-1 ring-electric/20 mb-2">
                    <Zap className="h-5 w-5 text-electric" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    What&apos;s in your way?
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Name the friction. Rate the resistance. Then crush it in 2
                    minutes.
                  </p>
                </div>

                {/* Form Card */}
                <Card className="bg-surface border-white/[0.06] shadow-none overflow-hidden">
                  <div className="p-6 space-y-6">
                    {/* Task Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                        What task are you avoiding?
                      </label>
                      <Input
                        placeholder="e.g. Write the project proposal..."
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && taskInput.trim()) {
                            handleCalibrate();
                          }
                        }}
                        className="h-11 text-sm bg-white/[0.03] border-white/[0.08] text-white placeholder:text-muted-foreground/40 focus-visible:ring-electric/30 focus-visible:border-electric/30"
                      />
                    </div>

                    <Separator className="bg-white/[0.04]" />

                    {/* Friction Slider */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                          Rate your resistance to starting
                        </label>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-2xl font-bold font-mono tabular-nums",
                              frictionColor
                            )}
                          >
                            {currentFriction}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            /10
                          </span>
                        </div>
                      </div>

                      {/* Slider */}
                      <div className="relative px-1">
                        <Slider
                          value={frictionValue}
                          onValueChange={setFrictionValue}
                          min={1}
                          max={10}
                          step={1}
                          className="w-full [&_[data-slot=slider-track]]:bg-white/[0.06] [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:rounded-full [&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-emerald-400 [&_[data-slot=slider-range]]:via-amber-400 [&_[data-slot=slider-range]]:to-red-500 [&_[data-slot=slider-thumb]]:h-5 [&_[data-slot=slider-thumb]]:w-5 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-white [&_[data-slot=slider-thumb]]:bg-surface [&_[data-slot=slider-thumb]]:shadow-[0_0_12px_rgba(0,229,255,0.3)] [&_[data-slot=slider-thumb]]:hover:shadow-[0_0_20px_rgba(0,229,255,0.5)] [&_[data-slot=slider-thumb]]:transition-shadow"
                        />
                        {/* Scale labels */}
                        <div className="flex justify-between mt-2 px-0.5">
                          <span className="text-[9px] text-emerald-400/70 font-medium">
                            Easy
                          </span>
                          <span className="text-[9px] text-muted-foreground/40 font-medium">
                            5
                          </span>
                          <span className="text-[9px] text-red-400/70 font-medium">
                            Pure Dread
                          </span>
                        </div>
                      </div>

                      {/* Friction label pill */}
                      <div className="flex justify-center">
                        <div
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                            currentFriction <= 3
                              ? "bg-emerald-400/10 text-emerald-400"
                              : currentFriction <= 5
                                ? "bg-amber-400/10 text-amber-400"
                                : currentFriction <= 7
                                  ? "bg-orange-400/10 text-orange-400"
                                  : "bg-red-400/10 text-red-400"
                          )}
                        >
                          <div
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              currentFriction <= 3
                                ? "bg-emerald-400"
                                : currentFriction <= 5
                                  ? "bg-amber-400"
                                  : currentFriction <= 7
                                    ? "bg-orange-400"
                                    : "bg-red-400"
                            )}
                          />
                          {frictionLabel}
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-white/[0.04]" />

                    {/* Calibrate Button */}
                    <Button
                      onClick={handleCalibrate}
                      disabled={!taskInput.trim()}
                      className={cn(
                        "w-full h-12 text-sm font-bold tracking-wider uppercase",
                        "bg-electric text-black hover:bg-electric/90",
                        "disabled:opacity-30 disabled:cursor-not-allowed",
                        "shadow-[0_0_24px_rgba(0,229,255,0.2)] hover:shadow-[0_0_32px_rgba(0,229,255,0.35)]",
                        "transition-all duration-300"
                      )}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Calibrate
                    </Button>
                  </div>
                </Card>

                {/* Footer hint */}
                <p className="text-[10px] text-muted-foreground/30 text-center tracking-wider">
                  2 minutes is all it takes to break through the barrier
                </p>
              </div>
            </div>
          ) : workspaceView === "timer" ? (
            /* ── Timer View ── */
            <div className="w-full max-w-xl px-6 py-8 flex flex-col items-center gap-8">
              {/* Back button */}
              <button
                onClick={() => {
                  clearTimer();
                  setIsRunning(false);
                  setTimeLeft(TIMER_DURATION);
                  setWorkspaceView("form");
                }}
                className="self-start flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors group"
              >
                <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
                Back to form
              </button>

              {/* Circular Timer */}
              <CircularTimer
                timeLeft={timeLeft}
                totalTime={TIMER_DURATION}
                isRunning={isRunning}
                taskName={taskInput}
                frictionLevel={currentFriction}
              />

              {/* Action Button */}
              <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                {!isRunning ? (
                  <Button
                    onClick={startTimer}
                    className={cn(
                      "w-full h-13 text-sm font-bold tracking-wider uppercase",
                      "bg-electric text-black hover:bg-electric/90",
                      "shadow-[0_0_24px_rgba(0,229,255,0.25)] hover:shadow-[0_0_40px_rgba(0,229,255,0.4)]",
                      "transition-all duration-300",
                      timeLeft < TIMER_DURATION && "ring-1 ring-electric/30"
                    )}
                  >
                    <Timer className="h-4 w-4 mr-2" />
                    {timeLeft < TIMER_DURATION
                      ? "Resume 2-Minute Micro-Commitment"
                      : "Start 2-Minute Micro-Commitment"}
                  </Button>
                ) : (
                  <Button
                    onClick={pauseTimer}
                    variant="outline"
                    className={cn(
                      "w-full h-13 text-sm font-bold tracking-wider uppercase",
                      "bg-transparent text-electric border-electric/30 hover:bg-electric/10 hover:border-electric/50",
                      "transition-all duration-300"
                    )}
                  >
                    Pause
                  </Button>
                )}

                {/* Reset link */}
                <button
                  onClick={resetWorkspace}
                  className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  Start over
                </button>
              </div>
            </div>
          ) : (
            /* ── Complete View ── */
            <div className="w-full max-w-md px-6 py-8 flex flex-col items-center gap-6 text-center">
              {/* Trophy animation */}
              <div className="relative">
                <div className="h-28 w-28 rounded-full bg-electric/10 ring-2 ring-electric/30 flex items-center justify-center shadow-[0_0_40px_rgba(0,229,255,0.2)]">
                  <Trophy className="h-12 w-12 text-electric" />
                </div>
                {/* Sparkle dots */}
                <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-electric shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
                <div className="absolute -bottom-2 -left-2 h-2 w-2 rounded-full bg-electric/60 shadow-[0_0_6px_rgba(0,229,255,0.4)]" />
                <div className="absolute top-2 -left-3 h-1.5 w-1.5 rounded-full bg-electric/40" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">
                  Friction Crushed.
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You committed to 2 minutes and delivered. That&apos;s how
                  momentum starts.
                </p>
              </div>

              {/* Stats */}
              <Card className="w-full bg-surface border-white/[0.06] shadow-none">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <p className="text-lg font-bold text-electric">2:00</p>
                      <p className="text-[10px] text-muted-foreground">
                        Committed
                      </p>
                    </div>
                    <div className="text-center border-x border-white/[0.06]">
                      <p className="text-lg font-bold text-white">
                        {currentFriction}/10
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Resistance
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-emerald-400">
                        +1
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Streak
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action buttons */}
              <div className="flex flex-col gap-3 w-full max-w-xs">
                <Button
                  onClick={resetWorkspace}
                  className={cn(
                    "w-full h-12 text-sm font-bold tracking-wider uppercase",
                    "bg-electric text-black hover:bg-electric/90",
                    "shadow-[0_0_24px_rgba(0,229,255,0.25)] hover:shadow-[0_0_32px_rgba(0,229,255,0.4)]",
                    "transition-all duration-300"
                  )}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Crush Another
                </Button>
                <button
                  onClick={() => {
                    setTimeLeft(TIMER_DURATION);
                    setIsRunning(false);
                    setWorkspaceView("timer");
                  }}
                  className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors flex items-center gap-1.5 justify-center"
                >
                  <RotateCcw className="h-3 w-3" />
                  Re-run same task
                </button>
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
