import { useCallback, useEffect, useRef, useState } from "react";
import type { GameSpeed, ProductId, SaveData, StatusMessage } from "./types";
import { BASE_DAY_MS, DAYS_PER_MONTH } from "./constants";
import { saveSlot } from "./saveManager";
import { advanceDay, restockAll, setPrice } from "./economy";
import { formatCash } from "./dateUtils";

export function useGameEngine(initialSave: SaveData) {
  const [save, setSave] = useState<SaveData>(initialSave);
  const [speed, setSpeed] = useState<GameSpeed>(1);
  const [tabHidden, setTabHidden] = useState<boolean>(document.hidden);
  const [message, setMessage] = useState<StatusMessage | null>(null);

  // Always holds the newest save. Used by timers and event handlers.
  const saveRef = useRef<SaveData>(initialSave);
  const messageTimerRef = useRef<number | null>(null);

  // IMPORTANT: keep this effect first. It must run before the effects below.
  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  // Watch if the browser tab is hidden. Save when it becomes hidden.
  useEffect(() => {
    const onChange = () => {
      setTabHidden(document.hidden);
      if (document.hidden) {
        saveSlot({ ...saveRef.current, updatedAt: Date.now() });
      }
    };
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  // The game clock. One tick = one in-game day.
  useEffect(() => {
    if (speed === 0 || tabHidden) return;
    const id = window.setInterval(() => {
      setSave((prev) => ({ ...advanceDay(prev), updatedAt: Date.now() }));
    }, BASE_DAY_MS / speed);
    return () => window.clearInterval(id);
  }, [speed, tabHidden]);

  // Auto-save when a new month starts.
  useEffect(() => {
    if (save.totalDays > 0 && save.totalDays % DAYS_PER_MONTH === 0) {
      saveSlot(saveRef.current);
    }
  }, [save.totalDays]);

  // Clear the message timer when the game screen closes.
  useEffect(() => {
    return () => {
      if (messageTimerRef.current !== null) {
        window.clearTimeout(messageTimerRef.current);
      }
    };
  }, []);

  // Shows a message for 2 seconds.
  const showMessage = useCallback((next: StatusMessage): void => {
    setMessage(next);
    if (messageTimerRef.current !== null) {
      window.clearTimeout(messageTimerRef.current);
    }
    messageTimerRef.current = window.setTimeout(() => setMessage(null), 2000);
  }, []);

  // Manual save. Returns true if it worked.
  const saveNow = useCallback((): boolean => {
    const ok = saveSlot({ ...saveRef.current, updatedAt: Date.now() });
    showMessage(ok ? { text: "Saved!", ok: true } : { text: "Save failed.", ok: false });
    return ok;
  }, [showMessage]);

  // Fill the shop stock to the target.
  const restock = useCallback((): void => {
    const preview = restockAll(saveRef.current);
    if (!preview.ok) {
      showMessage({
        text: preview.cost === 0 ? "Stock is already full." : "Not enough cash to restock.",
        ok: false,
      });
      return;
    }
    setSave((prev) => {
      const result = restockAll(prev);
      return result.ok ? { ...result.save, updatedAt: Date.now() } : prev;
    });
    showMessage({ text: "Restocked for " + formatCash(preview.cost) + ".", ok: true });
  }, [showMessage]);

  // Change the selling price of one product. The limits are checked inside setPrice.
  const changePrice = useCallback((productId: ProductId, newPrice: number): void => {
    setSave((prev) => {
      const next = setPrice(prev, productId, newPrice);
      return next === prev ? prev : { ...next, updatedAt: Date.now() };
    });
  }, []);

  return { save, speed, setSpeed, saveNow, restock, changePrice, message };
}