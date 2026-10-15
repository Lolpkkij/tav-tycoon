import { useState } from "react";
import type { SaveData, SlotId } from "../game/types";
import { SLOT_IDS } from "../game/constants";
import { formatCash, formatDate } from "../game/dateUtils";
import { deleteSlot, listSlots } from "../game/saveManager";
import { CARD, DANGER_BUTTON, PRIMARY_BUTTON, SECONDARY_BUTTON } from "./styles";

interface SaveSlotScreenProps {
  onBack: () => void;
  onPickEmpty: (slotId: SlotId) => void;
  onLoad: (slotId: SlotId) => void;
}

export default function SaveSlotScreen({ onBack, onPickEmpty, onLoad }: SaveSlotScreenProps) {
  const [slots, setSlots] = useState<(SaveData | null)[]>(() => listSlots());

  const handleDelete = (slotId: SlotId) => {
    if (window.confirm("Delete this save? This cannot be undone.")) {
      deleteSlot(slotId);
      setSlots(listSlots());
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Choose a Save Slot</h1>
      {SLOT_IDS.map((slotId, index) => {
        const slot = slots[index];
        return (
          <div key={slotId} className={CARD}>
            {slot === null || slot === undefined ? (
              <>
                <div className="text-base font-semibold">Slot {slotId}: Empty Slot</div>
                <button
                  type="button"
                  className={PRIMARY_BUTTON + " mt-3 w-full"}
                  onClick={() => onPickEmpty(slotId)}
                >
                  Start
                </button>
              </>
            ) : (
              <>
                <div className="text-sm text-white/70">Slot {slotId}</div>
                <div className="text-lg font-semibold">{slot.name}</div>
                <div className="text-sm text-white/70">
                  {(slot.mode === "story" ? "Story" : "Sandbox") +
                    " | " +
                    formatDate(slot.totalDays) +
                    " | " +
                    formatCash(slot.cash)}
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className={PRIMARY_BUTTON + " min-w-[120px] flex-1"}
                    onClick={() => onLoad(slotId)}
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    className={DANGER_BUTTON + " min-w-[120px] flex-1"}
                    onClick={() => handleDelete(slotId)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
      <button
        type="button"
        className={SECONDARY_BUTTON + " mt-2 w-72 max-w-full self-center"}
        onClick={onBack}
      >
        Back
      </button>
    </div>
  );
}