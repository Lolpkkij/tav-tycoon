import { useState } from "react";
import type { GameMode, SaveData, Screen, SlotId } from "../game/types";
import { createNewSave, getMostRecentSave, loadSlot, saveSlot } from "../game/saveManager";
import MainMenu from "./MainMenu";
import SaveSlotScreen from "./SaveSlotScreen";
import NewGameScreen from "./NewGameScreen";
import SettingsScreen from "./SettingsScreen";
import GameScreen from "./GameScreen";

export default function GameApp() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [selectedSlotId, setSelectedSlotId] = useState<SlotId | null>(null);
  const [activeSave, setActiveSave] = useState<SaveData | null>(null);

  const handleContinue = () => {
    const recent = getMostRecentSave();
    if (recent !== null) {
      setActiveSave(recent);
      setScreen("game");
    }
  };

  const handleLoad = (slotId: SlotId) => {
    const loaded = loadSlot(slotId);
    if (loaded !== null) {
      setActiveSave(loaded);
      setScreen("game");
    }
  };

  const handlePickEmpty = (slotId: SlotId) => {
    setSelectedSlotId(slotId);
    setScreen("newGame");
  };

  // Returns true if the new game was created and saved.
  const handleCreate = (name: string, mode: GameMode): boolean => {
    if (selectedSlotId === null) return false;
    const newSave = createNewSave(selectedSlotId, name, mode);
    if (!saveSlot(newSave)) return false;
    setActiveSave(newSave);
    setScreen("game");
    return true;
  };

  const handleExit = () => {
    setActiveSave(null);
    setScreen("menu");
  };

  return (
    <div className="min-h-[100dvh] bg-[#0b1d3a] text-white">
      {screen === "menu" && (
        <MainMenu
          onNewGame={() => setScreen("slots")}
          onContinue={handleContinue}
          onSettings={() => setScreen("settings")}
          canContinue={getMostRecentSave() !== null}
        />
      )}
      {screen === "slots" && (
        <SaveSlotScreen
          onBack={() => setScreen("menu")}
          onPickEmpty={handlePickEmpty}
          onLoad={handleLoad}
        />
      )}
      {screen === "newGame" && selectedSlotId !== null && (
        <NewGameScreen
          slotId={selectedSlotId}
          onCreate={handleCreate}
          onCancel={() => setScreen("slots")}
        />
      )}
      {screen === "settings" && <SettingsScreen onBack={() => setScreen("menu")} />}
      {screen === "game" && activeSave !== null && (
        <GameScreen
          key={activeSave.slotId + "-" + activeSave.createdAt}
          initialSave={activeSave}
          onExit={handleExit}
        />
      )}
    </div>
  );
}