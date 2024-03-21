import { create } from "zustand";

const useChatStore = create((set) => ({
    // similar to gpt chat - we have chat instances with many messages within each instance
    // and there can be many instances on each day - today, yesterday, week ago, month ago...
    // each instance will have an ID , a title, day created like today/yesterday; then  list of messages [{}, {}, {}...]
    // chat instances
    chatInstances: [],

    getCurrentChatMessages: () => {
        const currentChatInstance = set().chatInstances.find(
            (instance) => instance.sessionID === set().currentChatInstance
        );
        return currentChatInstance.messages;
    },
    setCurrentChatMessages: (sessionID, messages) => {
        set((state) => {
            const chatInstances = state.chatInstances;

            console.log("setCurrentChatMessages");
            console.log(chatInstances);

            const instance = chatInstances.find(
                (instance) => instance.sessionID === sessionID
            );
            instance.messages = messages;

            return { ...state, chatInstances };

            // return ({
            //     chatInstances: state.chatInstances.map((instance) =>
            //         instance.sessionID === sessionID
            //             ? {
            //                   ...instance,
            //                   messages
            //               }
            //             : instance
            //     )
            // })
        });
    },

    addMessageToChat: (message) => {
        set((state) => ({
            chatInstances: state.chatInstances.map((instance) =>
                instance.sessionID === state.currentChatInstance
                    ? {
                          ...instance,
                          messages: [...instance.messages, message]
                      }
                    : instance
            )
        }));

    },

    // set all instances - when user logs in
    setChatInstances: (instances) => set({ chatInstances: instances }),
    // new chat Instance
    addChatInstance: (instance) =>
        set((state) => ({ chatInstances: [instance, ...state.chatInstances] })),
    // delete chat instance - with the id
    deleteChatInstance: (id) =>
        set((state) => ({
            chatInstances: state.chatInstances.filter(
                (instance) => instance.sessionID !== id
            )
        })),
    // delete all chat instances
    deleteAllChatInstances: () =>
        set((state) => ({
            chatInstances: []
        })),

    editChatInstanceTitle: (id, title) =>
        set((state) => ({
            chatInstances: state.chatInstances.map((instance) => {
                return instance.sessionID === id
                    ? { ...instance, title }
                    : instance;
            })
        })),
    getChatInstance: (id) => {
        const chatInstance = set().chatInstances.find(
            (instance) => instance.sessionID === id
        );
        return chatInstance;
    },

    // active instance in the view of user - when user clicks on a chat instance or creates new
    currentChatInstance: null,
    getCurrentChatInstance: () => set().currentChatInstance,
    setCurrentChatInstance: (id) => set({ currentChatInstance: id }),
    clearCurrentChatInstance: () => set({ currentChatInstance: null })
}));

const useAuthStore = create((set) => ({
    user: null,
    logout: () => set({ user: null }),
    login: (user) => set({ user })
}));

export { useAuthStore, useChatStore };
