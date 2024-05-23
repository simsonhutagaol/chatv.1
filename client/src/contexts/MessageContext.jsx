import { createContext, useState } from "react";

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
    const [name, setName] = useState();

    return (
        <MessageContext.Provider value={{ name, setName }}>
            {children}
        </MessageContext.Provider>
    )
}
