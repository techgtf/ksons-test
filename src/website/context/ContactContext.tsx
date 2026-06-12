"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
interface ContactTypes {
  phone: string[];
  email: string[];
  address: string;
}

interface ContactContextType {
  contact: ContactTypes;
  setContact: React.Dispatch<React.SetStateAction<ContactTypes>>;
}

export const ContactContext = createContext<ContactContextType | undefined>(
  undefined,
);

export function ContactDataProvider({ children }: { children: ReactNode }) {
  const [contact, setContact] = useState<ContactTypes>({
    phone: ["9643705705"],
    email: ["info@ksonsgroup.com"],
    address: "Villa No - 01, Sunrakh Bangar, Vrindavan, Uttar Pradesh 281121",
  });

  // useEffect(() => {
  //     const fetchContact = async () => {
  //         try {
  //             const res = await fetch("/api/contact"); // your API route
  //             const data = await res.json();

  //             setContact(data);
  //         } catch (error) {
  //             console.error("Failed to fetch contact:", error);
  //         }
  //     };

  //     fetchContact();
  // }, []);

  return (
    <ContactContext.Provider value={{ contact, setContact }}>
      {children}
    </ContactContext.Provider>
  );
}
