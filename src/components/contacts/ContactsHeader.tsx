"use client";

import { CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { Contact } from "@/models/contact.model";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

interface ContactsHeaderProps {
  contactDialogOpen: boolean;
  setContactDialogOpen: (open: boolean) => void;
  reloadContacts: () => void;
  contactToEdit: Contact | null;
  setContactToEdit: (contact: Contact | null) => void;
  onCreateContact: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function ContactsHeader({
  contactDialogOpen,
  setContactDialogOpen,
  reloadContacts,
  contactToEdit,
  setContactToEdit,
  onCreateContact,
  searchQuery,
  setSearchQuery,
}: ContactsHeaderProps) {
  return (
    <CardHeader className="border-b border-border/50 bg-gradient-to-r from-background to-muted/20 pb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Networking Contacts
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your professional network and track interactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            size="sm"
            className="h-9 gap-2 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white hover:from-[#2563EB] hover:to-[#1E3A8A] shadow-sm"
            onClick={onCreateContact}
          >
            <PlusCircle className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Contact
            </span>
          </Button>
        </div>
      </div>
    </CardHeader>
  );
}



