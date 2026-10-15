import type { SlotId } from "../game/types";
import { DAYS_PER_MONTH } from "../game/constants";
import { formatDate, formatCash } from "../game/dateUtils";
import {
  createNewSave,
  deleteSlot,
  listSlots,
  loadSlot,
} from "../game/saveManager";
import { PRIMARY_BUTTON, SECONDARY_BUTTON, DANGER_BUTTON, CARD } from "./styles";
import { useState } from "react";

interface SaveSlotScreenProps {
  onBack: () => void;
  onPickEmpty: (slotId: SlotId) => void;
  onLoad: (slotId: SlotId) => void;
}

export default function SaveSlotScreen({ onBack, onPickEmpty, onLoad }: SaveSlotScreenProps) {
  const [slots, setSlots] = useState<({ name: string } | null)[]>(listSlots());

  const handleLoadClick = (slotId: SlotId) => {
    const loaded = loadSlot(slotId);
    if (loaded !== null) {
      onLoad(slotId);
    }
  };

  const handleDeleteClick = (slotId: SlotId) => {
    if (window.confirm("Delete this save? This cannot be undone.")) {
      deleteSlot(slotId);
      setSlots(listSlots());
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Choose a Save Slot</h1>
      <div className="flex flex-col gap-4">
        {slots.map((slot, index) => {
          const slotId = index + 1;
          return (
            <div key={slotId} className={CARD}>
              {slot === null ? (
                <>
                  <div className="text-base font-semibold">Slot {slotId}: Empty Slot</div>
                  <button
                    type="button"
                    className={`${PRIMARY_BUTTON} mt-3 w-full`}
                    onClick={() => onPickEmpty(slotId as SlotId)}
                  >
                    Start
                  </button>
                </>
              ) : (
                <>
                  <div className="text-sm text-white/70">Slot {slotId}</div>
                  <div className="text-lg font-semibold">{slot.name}</div>
                  <div className="text-sm text-white/70">
                    Story | {formatDate(0)} | 10,000 Tav
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className={`${PRIMARY_BUTTON} flex-1 min-w-48`}
                      onClick={() => handleLoadClick(slotId as SlotId)}
                    >
                      Load
                    </button>
                    <button
                      type="button"
                      className={`${DANGER_BUTTON} flex-1 min-w-48`}
                      onClick={() => handleDeleteClick(slotId as SlotId)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className={`${SECONDARY_BUTTON} mt-4 w-72 max-w-full.self-center`}
        onClick={onBack}
      >
        Back
      </button>
    </div>
  );
}