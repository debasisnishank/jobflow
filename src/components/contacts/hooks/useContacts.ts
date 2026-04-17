"use client";

import { useCallback, useEffect, useState } from "react";
import { getContactsList } from "@/actions/contacts.actions";
import { Contact } from "@/models/contact.model";
import { APP_CONSTANTS } from "@/lib/constants";
import { toast } from "../../ui/use-toast";

export function useContacts() {
  const recordsPerPage = APP_CONSTANTS.RECORDS_PER_PAGE;
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
  const [totalContacts, setTotalContacts] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const loadContacts = useCallback(
    async (page: number, search?: string) => {
      setLoading(true);
      const { data, total, success, message } = await getContactsList(
        page,
        recordsPerPage,
        search
      );
      if (success && data) {
        setContacts((prev) => (page === 1 ? data : [...prev, ...data]));
        setTotalContacts(total);
        setPage(page);
        setLoading(false);
      } else {
        setLoading(false);
        return toast({
          variant: "destructive",
          title: "Error!",
          description: message,
        });
      }
    },
    [recordsPerPage]
  );

  const reloadContacts = useCallback(async () => {
    await loadContacts(1, searchQuery);
  }, [loadContacts, searchQuery]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadContacts(1, searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, loadContacts]);

  useEffect(() => {
    if (!contactDialogOpen && !contactToEdit) {
      reloadContacts();
    }
  }, [contactDialogOpen, contactToEdit, reloadContacts]);

  const createContact = () => {
    setContactToEdit(null);
    setContactDialogOpen(true);
  };

  const onEditContact = (contact: Contact) => {
    setContactToEdit(contact);
    setContactDialogOpen(true);
  };

  return {
    contacts,
    totalContacts,
    page,
    loading,
    searchQuery,
    setSearchQuery,
    contactDialogOpen,
    setContactDialogOpen,
    contactToEdit,
    setContactToEdit,
    loadContacts,
    reloadContacts,
    createContact,
    onEditContact,
  };
}



