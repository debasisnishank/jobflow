"use client";

import { useState } from "react";
import { Contact } from "@/models/contact.model";
import { deleteContact } from "@/actions/contacts.actions";
import { toast } from "../../ui/use-toast";

export function useContactDelete(reloadContacts: () => void) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const onDeleteContact = (contact: Contact) => {
    setContactToDelete(contact);
    setAlertOpen(true);
  };

  const deleteContactHandler = async () => {
    if (!contactToDelete) return;

    const { success, message } = await deleteContact(contactToDelete.id);

    if (success) {
      toast({
        title: "Success",
        description: "Contact deleted successfully",
        variant: "success",
      });
      setAlertOpen(false);
      setContactToDelete(null);
      reloadContacts();
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: message || "Failed to delete contact",
      });
    }
  };

  return {
    alertOpen,
    setAlertOpen,
    contactToDelete,
    onDeleteContact,
    deleteContact: deleteContactHandler,
  };
}



