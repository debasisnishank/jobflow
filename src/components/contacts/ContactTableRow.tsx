"use client";

import { Linkedin, Mail, Phone } from "lucide-react";
import {
  TableCell,
  TableRow,
} from "../ui/table";
import { Contact } from "@/models/contact.model";
import { ContactTableRowActions } from "./ContactTableRowActions";

interface ContactTableRowProps {
  contact: Contact;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contact: Contact) => void;
  onViewContact: (contactId: string) => void;
}

export function ContactTableRow({
  contact,
  onEditContact,
  onDeleteContact,
  onViewContact,
}: ContactTableRowProps) {
  const fullName = `${contact.firstName}${contact.lastName ? ` ${contact.lastName}` : ""}`;

  return (
    <TableRow
      key={contact.id}
      className="border-border/50 hover:bg-[#3B82F6]/5 transition-colors"
    >
      <TableCell className="font-medium">
        <button
          onClick={() => onViewContact(contact.id)}
          className="flex items-center text-foreground hover:text-[#3B82F6] transition-colors cursor-pointer"
        >
          {fullName}
        </button>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {contact.title || "-"}
      </TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground">
        {contact.company || "-"}
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        {contact.email ? (
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-1 text-muted-foreground hover:text-[#3B82F6] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Mail className="h-3.5 w-3.5" />
            <span className="truncate max-w-[200px]">{contact.email}</span>
          </a>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        {contact.phone ? (
          <a
            href={`tel:${contact.phone}`}
            className="flex items-center gap-1 text-muted-foreground hover:text-[#3B82F6] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone className="h-3.5 w-3.5" />
            <span>{contact.phone}</span>
          </a>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell>
        <ContactTableRowActions
          contact={contact}
          onEditContact={onEditContact}
          onDeleteContact={onDeleteContact}
          onViewContact={onViewContact}
        />
      </TableCell>
    </TableRow>
  );
}

