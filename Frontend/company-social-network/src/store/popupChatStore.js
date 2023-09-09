import { create } from "zustand";


const usePopupChatStore = create((set, getState) => ({
    conversations: [],
    addConversation: (conversation) => {
        const state = getState();
        const newConversations = [...state.conversations]
        if (!newConversations.find(con => con._id == conversation?._id)) {
            newConversations.push(conversation)
        }
        set({ conversations: newConversations })
    },
    closeConversation: (conversation) => {
        const state = getState();
        const newConversations = [...state.conversations]
        set({ conversations: newConversations.filter(c => c?._id != conversation?._id) })
    },
}));

export default usePopupChatStore;

