import type { GameMode, GameSpeed } from "../game/types";
import { formatDate, formatCash } from "../game/dateUtils";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "./styles";

interface TopBarProps {
  name: string;
  mode: GameMode;
  totalDays: number;
  cash: number;
  speed: GameSpeed;
  onSpeedChange: (speed: GameSpeed) => void;
}

const speedOptions: { value: GameSpeed; label: string }[] = [
  { value: 0, label: "Pause" },
  { value: 1, label: "1x" },
  { value: 2, label: "2x" },
  { value: 5, label: "5x" },
];

export default function TopBar({ name, mode, totalDays, cash, speed, onSpeedChange }: TopBarProps) {
  return (
    <header className="bg-white/5 p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-base font-bold">{name}</div>
          <div className="text-sm text-white/70">
            {mode === "story" ? "Story" : "Sandbox"}
          </div>
        </div>
        <div className="text-base font-semibold">{formatDate(totalDays)}</div>
        <div className="text-base font-semibold text-green-400">{formatCash(cash)}</div>
      </div>
      <div className="mt-2 flex flex-wrap justify-end gap-2">
        {speedOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={speed === option.value ? PRIMARY_BUTTON : SECONDARY_BUTTON}
            onClick={() => onSpeedChange(option.value)}
            aria-pressed={speed === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </header>
  );
}