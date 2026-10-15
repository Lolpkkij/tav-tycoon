import type { SaveData } from "../game/types";
import { useGameEngine } from "../game/useGameEngine";
import TopBar from "./TopBar";
import ShopPanel from "./ShopPanel";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "./styles";

interface GameScreenProps {
  initialSave: SaveData;
  onExit: () => void;
}

export default function GameScreen({ initialSave, onExit }: GameScreenProps) {
  const { save, speed, setSpeed, saveNow, restock, message } = useGameEngine(initialSave);

  const handleSaveAndExit = () => {
    if (saveNow()) {
      onExit();
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col pb-[env(safe-area-inset-bottom)]">
      <TopBar
        name={save.name}
        mode={save.mode}
        totalDays={save.totalDays}
        cash={save.cash}
        speed={speed}
        onSpeedChange={setSpeed}
      />
      <main className="flex flex-1 items-start justify-center p-4">
        <ShopPanel shop={save.shop} onRestock={restock} />
      </main>
      <footer className="flex flex-wrap items-center gap-3 p-4">
        <button type="button" className={PRIMARY_BUTTON} onClick={() => { saveNow(); }}>
          Save Now
        </button>
        <button type="button" className={SECONDARY_BUTTON} onClick={handleSaveAndExit}>
          Save &amp; Exit
        </button>
        <span
          aria-live="polite"
          className={message !== null && message.ok ? "text-base text-green-400" : "text-base text-red-400"}
        >
          {message !== null ? message.text : ""}
        </span>
      </footer>
    </div>
  );
}