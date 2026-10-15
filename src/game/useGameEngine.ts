import { useCallback, useEffect, useRef, useState } from "react";
import type { GameSpeed, SaveData } from "./types";
import { BASE_DAY_MS, DAYS_PER_MONTH } from "./constants";
import { saveSlot } from "./saveManager";

export function useGameEngine(initialSave: SaveData) {
  const [save, setSave] = useState<SaveData>(initialSave);
  const [speed, setSpeed] = useState<GameSpeed>(1);
  const [tabHidden, setTabHidden] = useState<boolean>(document.hidden);
  const [saveMessage, setSaveMessage] = useState<string>("");

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
      setSave((prev) => ({ ...prev, totalDays: prev.totalDays + 1, updatedAt: Date.now() }));
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

  // Manual save. Returns true if it worked.
  const saveNow = useCallback((): boolean => {
    const ok = saveSlot({ ...saveRef.current, updatedAt: Date.now() });
    setSaveMessage(ok ? "Saved!" : "Save failed.");
    if (messageTimerRef.current !== null) {
      window.clearTimeout(messageTimerRef.current);
    }
    messageTimerRef.current = window.setTimeout(() => setSaveMessage(""), 2000);
    return ok;
  }, []);

  return { save, speed, setSpeed, saveNow, saveMessage };
}