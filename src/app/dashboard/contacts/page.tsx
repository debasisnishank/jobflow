import { Metadata } from "next";
import { ContactsContainer } from "@/components/contacts/ContactsContainer";

export const metadata: Metadata = {
  title: "Networking Contacts",
  description: "Manage your professional network and track interactions",
};

export default function ContactsPage() {
  return (
    <div className="col-span-3">
      <ContactsContainer />
    </div>
  );
}



