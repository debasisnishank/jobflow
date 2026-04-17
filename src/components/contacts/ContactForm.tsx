"use client";

import { useState, useEffect } from "react";
import { Loader2, UserPlus, User } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Contact, ContactFormData } from "@/models/contact.model";
import { createContact, updateContact } from "@/actions/contacts.actions";
import { toast } from "../ui/use-toast";
import { CountryCodeDropdown } from "./CountryCodeDropdown";
import { parsePhoneNumber, getCountryCallingCode, getCountries } from "react-phone-number-input";
import type { Country } from "react-phone-number-input";

interface ContactFormProps {
  contactDialogOpen: boolean;
  setContactDialogOpen: (open: boolean) => void;
  contactToEdit: Contact | null;
  setContactToEdit: (contact: Contact | null) => void;
  reloadContacts: () => void;
}

export function ContactForm({
  contactDialogOpen,
  setContactDialogOpen,
  contactToEdit,
  setContactToEdit,
  reloadContacts,
}: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>("US");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    title: "",
    company: "",
    linkedInUrl: "",
    notes: "",
    tags: [],
  });

  useEffect(() => {
    if (contactToEdit) {
      let country: Country = "US";
      let phone = "";
      
      if (contactToEdit.phone) {
        try {
          const parsed = parsePhoneNumber(contactToEdit.phone);
          if (parsed && parsed.isValid()) {
            country = parsed.country || "US";
            phone = parsed.nationalNumber || "";
          } else {
            const phoneStr = contactToEdit.phone.replace(/^\+/, "");
            const match = phoneStr.match(/^(\d{1,3})(.*)/);
            if (match) {
              const possibleCode = match[1];
              const remaining = match[2];
              const codeCountry = getCountries().find((c) => 
                getCountryCallingCode(c) === possibleCode
              );
              if (codeCountry) {
                country = codeCountry;
                phone = remaining;
              } else {
                country = "US";
                phone = contactToEdit.phone.replace(/^\+/, "");
              }
            } else {
              country = "US";
              phone = contactToEdit.phone.replace(/^\+/, "");
            }
          }
        } catch {
          const phoneStr = contactToEdit.phone.replace(/^\+/, "");
          const match = phoneStr.match(/^(\d{1,3})(.*)/);
          if (match) {
            const possibleCode = match[1];
            const remaining = match[2];
            const codeCountry = getCountries().find((c) => 
              getCountryCallingCode(c) === possibleCode
            );
            if (codeCountry) {
              country = codeCountry;
              phone = remaining;
            } else {
              country = "US";
              phone = phoneStr;
            }
          } else {
            country = "US";
            phone = phoneStr;
          }
        }
      }
      
      setSelectedCountry(country);
      setPhoneNumber(phone);
      setFormData({
        firstName: contactToEdit.firstName || "",
        lastName: contactToEdit.lastName || "",
        email: contactToEdit.email || "",
        phone: contactToEdit.phone || "",
        title: contactToEdit.title || "",
        company: contactToEdit.company || "",
        linkedInUrl: contactToEdit.linkedInUrl || "",
        notes: contactToEdit.notes || "",
        tags: contactToEdit.tags || [],
      });
    } else {
      setSelectedCountry("US");
      setPhoneNumber("");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        title: "",
        company: "",
        linkedInUrl: "",
        notes: "",
        tags: [],
      });
    }
  }, [contactToEdit, contactDialogOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.firstName.trim()) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "First name is required",
        });
        setLoading(false);
        return;
      }

      const fullPhoneNumber = phoneNumber.trim()
        ? `+${getCountryCallingCode(selectedCountry)}${phoneNumber.trim()}`
        : "";

      const submitData = {
        ...formData,
        phone: fullPhoneNumber,
      };

      const result = contactToEdit
        ? await updateContact(contactToEdit.id, submitData)
        : await createContact(submitData);

      if (result.success) {
        toast({
          title: "Success",
          description: contactToEdit
            ? "Contact updated successfully"
            : "Contact created successfully",
          variant: "success",
        });
        setContactDialogOpen(false);
        setContactToEdit(null);
        reloadContacts();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to save contact",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setContactDialogOpen(false);
    setContactToEdit(null);
  };

  return (
    <Dialog open={contactDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] lg:max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8]">
              {contactToEdit ? (
                <User className="h-5 w-5 text-white" />
              ) : (
                <UserPlus className="h-5 w-5 text-white" />
              )}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                {contactToEdit ? "Edit Contact" : "Add New Contact"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                {contactToEdit
                  ? "Update contact information"
                  : "Add a new contact to your professional network"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john.doe@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="flex gap-2">
                <CountryCodeDropdown
                  value={selectedCountry}
                  onChange={(country) => setSelectedCountry(country || "US")}
                  defaultCountry="US"
                />
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setPhoneNumber(value);
                  }}
                  placeholder="1234567890"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Senior Recruiter"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="Tech Corp"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedInUrl">LinkedIn Profile URL</Label>
            <Input
              id="linkedInUrl"
              type="url"
              value={formData.linkedInUrl}
              onChange={(e) =>
                setFormData({ ...formData, linkedInUrl: e.target.value })
              }
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Add any additional notes about this contact..."
              rows={4}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-full sm:w-auto"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E3A8A] text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {contactToEdit ? "Updating..." : "Creating..."}
                </>
              ) : contactToEdit ? (
                "Update Contact"
              ) : (
                "Create Contact"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

