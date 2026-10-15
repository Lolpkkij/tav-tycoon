import type { GameMode, SaveData, SlotId } from "./types";
import { MAX_NAME_LENGTH, SAVE_VERSION, SLOT_IDS, START_CASH, STORAGE_PREFIX } from "./constants";

function keyFor(slotId: SlotId): string {
  return STORAGE_PREFIX + slotId;
}

function isValidSave(value: unknown, slotId: SlotId): value is SaveData {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    v.version === SAVE_VERSION &&
    v.slotId === slotId &&
    typeof v.name === "string" &&
    (v.mode === "story" || v.mode === "sandbox") &&
    typeof v.totalDays === "number" &&
    Number.isFinite(v.totalDays) &&
    typeof v.cash === "number" &&
    Number.isFinite(v.cash) &&
    typeof v.createdAt === "number" &&
    typeof v.updatedAt === "number"
  );
}

export function loadSlot(slotId: SlotId): SaveData | null {
  try {
    const raw = localStorage.getItem(keyFor(slotId));
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValidSave(parsed, slotId) ? parsed : null;
  } catch (error) {
    console.error("loadSlot failed", error);
    return null;
  }
}

export function saveSlot(data: SaveData): boolean {
  try {
    localStorage.setItem(keyFor(data.slotId), JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("saveSlot failed", error);
    return false;
  }
}

export function deleteSlot(slotId: SlotId): void {
  try {
    localStorage.removeItem(keyFor(slotId));
  } catch (error) {
    console.error("deleteSlot failed", error);
  }
}

export function listSlots(): (SaveData | null)[] {
  return SLOT_IDS.map((id) => loadSlot(id));
}

export function getMostRecentSave(): SaveData | null {
  let best: SaveData | null = null;
  for (const slot of listSlots()) {
    if (slot !== null && (best === null || slot.updatedAt > best.updatedAt)) {
      best = slot;
    }
  }
  return best;
}

export function createNewSave(slotId: SlotId, name: string, mode: GameMode): SaveData {
  const now = Date.now();
  return {
    version: SAVE_VERSION,
    slotId,
    name: name.trim().slice(0, MAX_NAME_LENGTH),
    mode,
    totalDays: 0,
    cash: START_CASH,
    createdAt: now,
    updatedAt: now,
  };
}