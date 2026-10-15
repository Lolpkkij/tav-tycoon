import { SECONDARY_BUTTON } from "./styles";

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold">Settings</h1>
      <p className="text-xl text-white/70">Settings will come later.</p>
      <button
        type="button"
        className={SECONDARY_BUTTON}
        onClick={onBack}
      >
        Back
      </button>
    </div>
  );
}