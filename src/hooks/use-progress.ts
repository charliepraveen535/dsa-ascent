import { useLocalStorage } from "./use-local-storage";
import { ROADMAP, TOTAL_DAYS } from "@/lib/roadmap";

export type ProgressState = {
  completedDays: number[];
  startedAt: string; // ISO date
  currentDay: number; // user-controlled "today"
};

const DEFAULT: ProgressState = {
  completedDays: [],
  startedAt: new Date().toISOString(),
  currentDay: 1,
};

export function useProgress() {
  const [state, setState] = useLocalStorage<ProgressState>("dsa.progress", DEFAULT);

  const toggleDay = (day: number) => {
    setState((s) => ({
      ...s,
      completedDays: s.completedDays.includes(day)
        ? s.completedDays.filter((d) => d !== day)
        : [...s.completedDays, day].sort((a, b) => a - b),
    }));
  };

  const setCurrentDay = (day: number) => {
    setState((s) => ({ ...s, currentDay: Math.max(1, Math.min(TOTAL_DAYS, day)) }));
  };

  const reset = () => setState({ ...DEFAULT, startedAt: new Date().toISOString() });

  const percent = Math.round((state.completedDays.length / TOTAL_DAYS) * 100);
  const todaysPlan = ROADMAP[state.currentDay - 1];

  return { state, toggleDay, setCurrentDay, reset, percent, todaysPlan };
}
