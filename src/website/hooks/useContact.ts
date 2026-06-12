import { useContext } from "react";
import { ContactContext } from "../context/ContactContext";
export function useContact() {
    const context = useContext(ContactContext);
    if (!context) {
        throw new Error("useContact must be used within ContactDataProvider");
    }
    return context;
}