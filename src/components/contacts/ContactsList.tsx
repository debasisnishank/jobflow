"use client";

import { Contact } from "@/models/contact.model";
import ContactsTable from "./ContactsTable";
import { Button } from "../ui/button";

interface ContactsListProps {
  contacts: Contact[];
  totalContacts: number;
  page: number;
  loading: boolean;
  onEditContact: (contact: Contact) => void;
  onReloadContacts: () => void;
  onLoadMore: () => void;
}

export function ContactsList({
  contacts,
  totalContacts,
  page,
  loading,
  onEditContact,
  onReloadContacts,
  onLoadMore,
}: ContactsListProps) {
  return (
    <>
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <ContactsTable
          contacts={contacts}
          editContact={onEditContact}
          reloadContacts={onReloadContacts}
        />
      </div>
      <div className="mt-4 text-sm text-muted-foreground flex items-center justify-between">
        <span>
          Showing{" "}
          <strong className="text-foreground">
            {1} to {contacts.length}
          </strong>{" "}
          of <strong className="text-foreground">{totalContacts}</strong> contacts
        </span>
      </div>
      {contacts.length < totalContacts && (
        <div className="flex justify-center pt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={onLoadMore}
            disabled={loading}
            className="min-w-[120px] border-[#3B82F6]/30 hover:bg-[#3B82F6] hover:text-white hover:border-[#3B82F6]"
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </>
  );
}



