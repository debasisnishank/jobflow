"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Contact } from "@/models/contact.model";
import { DeleteAlertDialog } from "../DeleteAlertDialog";
import { ContactTableRow } from "./ContactTableRow";
import { useContactDelete } from "./hooks/useContactDelete";
import { ContactDetailsModal } from "./ContactDetailsModal";

type ContactsTableProps = {
  contacts: Contact[];
  editContact: (contact: Contact) => void;
  reloadContacts: () => void;
};

function ContactsTable({ contacts, editContact, reloadContacts }: ContactsTableProps) {
  const [viewContactId, setViewContactId] = useState<string | null>(null);
  const {
    alertOpen,
    setAlertOpen,
    contactToDelete,
    onDeleteContact,
    deleteContact,
  } = useContactDelete(reloadContacts);

  const handleViewContact = (contactId: string) => {
    setViewContactId(contactId);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-[#3B82F6]/5">
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Title</TableHead>
            <TableHead className="hidden md:table-cell font-semibold">
              Company
            </TableHead>
            <TableHead className="hidden lg:table-cell font-semibold">
              Email
            </TableHead>
            <TableHead className="hidden lg:table-cell font-semibold">
              Phone
            </TableHead>
            <TableHead className="w-[50px]">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact: Contact) => (
            <ContactTableRow
              key={contact.id}
              contact={contact}
              onEditContact={editContact}
              onDeleteContact={onDeleteContact}
              onViewContact={handleViewContact}
            />
          ))}
        </TableBody>
      </Table>
      <DeleteAlertDialog
        pageTitle="contact"
        open={alertOpen}
        onOpenChange={setAlertOpen}
        onDelete={deleteContact}
        alertTitle={`Are you sure you want to delete ${contactToDelete?.firstName} ${contactToDelete?.lastName || ""}?`}
        alertDescription="This action cannot be undone. This will permanently delete the contact and all associated interactions."
      />
      <ContactDetailsModal
        open={!!viewContactId}
        onOpenChange={(open) => !open && setViewContactId(null)}
        contactId={viewContactId}
        onReloadContacts={reloadContacts}
        onEditContact={editContact}
      />
    </>
  );
}

export default ContactsTable;

