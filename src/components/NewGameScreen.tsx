import type { GameMode, SlotId } from "../game/types";
import { MAX_NAME_LENGTH, START_CASH } from "../game/constants";
import { formatCash } from "../game/dateUtils";
import { createNewSave, saveSlot } from "../game/saveManager";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "./styles";
import { useState } from "react";

interface NewGameScreenProps {
  slotId: SlotId;
  onCreate: (name: string, mode: GameMode) => boolean;
  onCancel: () => void;
}

export default function NewGameScreen({ slotId, onCreate, onCancel }: NewGameScreenProps) {
  const [name, setName] = useState("");
  const [mode, setMode] = useState<GameMode>("story");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      setError("Please enter a save name.");
      return;
    }
    if (!onCreate(trimmed, mode)) {
      setError("Could not save. Please allow this site to store data in your browser.");
      return;
    }
  };

  return (
    <form className="mx-auto flex w-full max-w-md flex-col gap-4 p-4" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold">
        New Game - Slot {slotId}
      </h1>
      <label htmlFor="save-name" className="text-sm text-white/70">
        Save name
      </label>
      <input
        id="save-name"
        type="text"
        maxLength={MAX_NAME_LENGTH}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setError("");
        }}
        className="w-full rounded-lg bg-white/10 px-4 py-3 text-base text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-green-500"
        placeholder="My Company"
      />
      {error && (
        <p role="alert" className="text-base text-red-400">{error}</p>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          className={mode === "story" ? PRIMARY_BUTTON : SECONDARY_BUTTON}
          onClick={() => setMode("story")}
          aria-pressed={mode === "story"}
        >
          Story
        </button>
        <button
          type="button"
          className={mode === "sandbox" ? PRIMARY_BUTTON : SECONDARY_BUTTON}
          onClick={() => setMode("sandbox")}
          aria-pressed={mode === "sandbox"}
        >
          Sandbox
        </button>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className={PRIMARY_BUTTON}
        >
          Create
        </button>
        <button
          type="button"
          className={SECONDARY_BUTTON}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}