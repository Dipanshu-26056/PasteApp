import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem("pastes");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (pastes) => {
  localStorage.setItem("pastes", JSON.stringify(pastes));
};

const pasteSlice = createSlice({
  name: "paste",
  initialState: { pastes: loadFromStorage() },
  reducers: {
    addPaste(state, action) {
      const exists = state.pastes.find((p) => p._id === action.payload._id);
      if (exists) {
        toast.error("Paste with this title already exists");
        return;
      }
      state.pastes.push(action.payload);
      saveToStorage(state.pastes);
      toast.success("Paste created!");
    },
    updatePaste(state, action) {
      const idx = state.pastes.findIndex((p) => p._id === action.payload._id);
      if (idx !== -1) {
        state.pastes[idx] = action.payload;
        saveToStorage(state.pastes);
        toast.success("Paste updated!");
      }
    },
    removePaste(state, action) {
      state.pastes = state.pastes.filter((p) => p._id !== action.payload);
      saveToStorage(state.pastes);
      toast.success("Paste deleted");
    },
    resetAllPastes(state) {
      state.pastes = [];
      saveToStorage([]);
      toast.success("All pastes cleared");
    },
  },
});

export const { addPaste, updatePaste, removePaste, resetAllPastes } =
  pasteSlice.actions;
export default pasteSlice.reducer;
