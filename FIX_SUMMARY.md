Fixed 2 files in Tav Tycoon app:

1. src/components/SaveSlotScreen.tsx
   - Replaced entire file to show real save data instead of hardcoded values
   - Used actual slot data: mode, totalDays, and cash from the save
   - Fixed to display real mode (Story/Sandbox), formatted date, and formatted cash
   - Maintained all functionality: Start, Load, Delete with confirmation, Back

2. src/components/NewGameScreen.tsx
   - Removed 4 unused imports:
     * Changed: import { MAX_NAME_LENGTH, START_CASH } from "../game/constants"; 
       To: import { MAX_NAME_LENGTH } from "../game/constants";
     * Removed: import { formatCash } from "../game/dateUtils";
     * Removed: import { createNewSave, saveSlot } from "../game/saveManager";
   - No other changes made to the file