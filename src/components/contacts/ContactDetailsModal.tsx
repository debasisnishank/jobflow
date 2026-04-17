"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, Linkedin, Building, Briefcase, Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Contact } from "@/models/contact.model";
import { format } from "date-fns";
import { DeleteAlertDialog } from "../DeleteAlertDialog";
import { useContactDelete } from "./hooks/useContactDelete";
import { ContactForm } from "./ContactForm";
import { getContactById } from "@/actions/contacts.actions";
import Loading from "../Loading";

interface ContactDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: string | null;
  onReloadContacts: () => void;
  onEditContact: (contact: Contact) => void;
}

export function ContactDetailsModal({
  open,
  onOpenChange,
  contactId,
  onReloadContacts,
  onEditContact,
}: ContactDetailsModalProps) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);

  const { alertOpen, setAlertOpen, contactToDelete, onDeleteContact, deleteContact } = useContactDelete(() => {
    onReloadContacts();
    onOpenChange(false);
  });

  useEffect(() => {
    if (open && contactId) {
      loadContact();
    } else {
      setContact(null);
    }
  }, [open, contactId]);

  const loadContact = async () => {
    if (!contactId) return;
    setLoading(true);
    try {
      const { data, success } = await getContactById(contactId);
      if (success && data) {
        setContact(data);
      }
    } catch (error) {
      console.error("Failed to load contact:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (contact) {
      setContactToEdit(contact);
      setEditDialogOpen(true);
    }
  };

  const handleReload = () => {
    loadContact();
    onReloadContacts();
  };

  if (!contact && !loading) return null;

  const fullName = contact
    ? `${contact.firstName}${contact.lastName ? ` ${contact.lastName}` : ""}`
    : "";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-2xl font-bold">{fullName}</DialogTitle>
            {contact && (
              <p className="text-sm text-muted-foreground mt-1">
                {contact.title && contact.company
                  ? `${contact.title} at ${contact.company}`
                  : contact.title || contact.company || "Contact"}
              </p>
            )}
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loading />
            </div>
          ) : contact ? (
            <div className="space-y-6 pt-4">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {contact.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-sm font-medium hover:text-[#3B82F6] transition-colors"
                          >
                            {contact.email}
                          </a>
                        </div>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <a
                            href={`tel:${contact.phone}`}
                            className="text-sm font-medium hover:text-[#3B82F6] transition-colors"
                          >
                            {contact.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    {contact.linkedInUrl && (
                      <div className="flex items-center gap-3">
                        <Linkedin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">LinkedIn</p>
                          <a
                            href={contact.linkedInUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium hover:text-[#3B82F6] transition-colors"
                          >
                            View Profile
                          </a>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {contact.title && (
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Job Title</p>
                          <p className="text-sm font-medium">{contact.title}</p>
                        </div>
                      </div>
                    )}
                    {contact.company && (
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Company</p>
                          <p className="text-sm font-medium">{contact.company}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Created</p>
                        <p className="text-sm font-medium">
                          {format(new Date(contact.createdAt), "PP")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {contact.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{contact.notes}</p>
                  </CardContent>
                </Card>
              )}

              {contact.tags && contact.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {contact.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-md bg-[#3B82F6]/10 px-2.5 py-0.5 text-xs font-medium text-[#3B82F6] border border-[#3B82F6]/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Contact
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onDeleteContact(contact)}
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <DeleteAlertDialog
        pageTitle="contact"
        open={alertOpen}
        onOpenChange={setAlertOpen}
        onDelete={deleteContact}
        alertTitle={`Are you sure you want to delete ${contact?.firstName} ${contact?.lastName || ""}?`}
        alertDescription="This action cannot be undone. This will permanently delete the contact and all associated interactions."
      />
      <ContactForm
        contactDialogOpen={editDialogOpen}
        setContactDialogOpen={setEditDialogOpen}
        contactToEdit={contactToEdit}
        setContactToEdit={setContactToEdit}
        reloadContacts={handleReload}
      />
    </>
  );
}

