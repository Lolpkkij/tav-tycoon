import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "./styles";

interface MainMenuProps {
  onNewGame: () => void;
  onContinue: () => void;
  onSettings: () => void;
  canContinue: boolean;
}

export default function MainMenu({ onNewGame, onContinue, onSettings, canContinue }: MainMenuProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 p-4">
      <h1 className="mb-6 text-4xl font-bold">Tav Tycoon</h1>
      <button
        type="button"
        className={`${PRIMARY_BUTTON} w-72 max-w-full`}
        onClick={onNewGame}
      >
        New Game
      </button>
      <button
        type="button"
        className={`${PRIMARY_BUTTON} w-72 max-w-full`}
        onClick={onContinue}
        disabled={!canContinue}
      >
        Continue
      </button>
      <button
        type="button"
        className={`${SECONDARY_BUTTON} w-72 max-w-full`}
        onClick={onSettings}
      >
        Settings
      </button>
    </div>
  );
}