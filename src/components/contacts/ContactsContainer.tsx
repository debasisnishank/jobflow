"use client";

import { Card, CardContent } from "../ui/card";
import Loading from "../Loading";
import { ContactsHeader } from "./ContactsHeader";
import { ContactsList } from "./ContactsList";
import { ContactsEmptyState } from "./ContactsEmptyState";
import { ContactForm } from "./ContactForm";
import { useContacts } from "./hooks/useContacts";

export function ContactsContainer() {
  const {
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
  } = useContacts();

  const handleLoadMore = () => {
    loadContacts(page + 1, searchQuery);
  };

  return (
    <>
      <Card className="border border-border/70 shadow-lg">
        <ContactsHeader
          contactDialogOpen={contactDialogOpen}
          setContactDialogOpen={setContactDialogOpen}
          reloadContacts={reloadContacts}
          contactToEdit={contactToEdit}
          setContactToEdit={setContactToEdit}
          onCreateContact={createContact}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <CardContent className="p-6">
          {loading && <Loading />}
          {!loading && contacts.length > 0 ? (
            <ContactsList
              contacts={contacts}
              totalContacts={totalContacts}
              page={page}
              loading={loading}
              onEditContact={onEditContact}
              onReloadContacts={reloadContacts}
              onLoadMore={handleLoadMore}
            />
          ) : !loading ? (
            <ContactsEmptyState onCreateContact={createContact} />
          ) : null}
        </CardContent>
      </Card>
      <ContactForm
        contactDialogOpen={contactDialogOpen}
        setContactDialogOpen={setContactDialogOpen}
        contactToEdit={contactToEdit}
        setContactToEdit={setContactToEdit}
        reloadContacts={reloadContacts}
      />
    </>
  );
}

