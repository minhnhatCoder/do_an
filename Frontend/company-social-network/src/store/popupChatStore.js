import { create } from "zustand";


const usePopupChatStore = create((set, getState) => ({
    conversations: [],
    addConversation: (conversation, updatedMessage) => {
        const state = getState();
        let newConversations = [...state.conversations]
        if (!newConversations.find(con => con._id == conversation?._id)) {
            newConversations.push(conversation)
        } else {
            newConversations = newConversations?.map(c => ({
                ...c, isPopup: true, last_message: {
                    ...c?.last_message, content: updatedMessage ?? c?.last_message?.content
                }
            }))
        }
        set({ conversations: newConversations })
    },
    closeConversation: (id) => {
        const state = getState();
        const newConversations = [...state.conversations]
        set({ conversations: newConversations.filter(c => c?._id != id) })
    },
    showConversation: (id) => {
        const state = getState();
        const newConversations = [...state.conversations]
        set({
            conversations: newConversations.map(c => {
                if (c?._id == id) {
                    return { ...c, isPopup: !c?.isPopup }
                } else return c
            })
        })
    },
}));

export default usePopupChatStore;

