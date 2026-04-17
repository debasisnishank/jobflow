"use client";

import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";

interface ContactsEmptyStateProps {
  onCreateContact: () => void;
}

export function ContactsEmptyState({ onCreateContact }: ContactsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-[#3B82F6]/10 p-6 mb-4">
        <UserPlus className="h-12 w-12 text-[#3B82F6]" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No contacts yet
      </h3>
      <p className="text-sm text-gray-600 mb-6 max-w-sm">
        Start building your professional network by adding your first contact.
        Track recruiters, hiring managers, and industry connections.
      </p>
      <Button
        onClick={onCreateContact}
        className="bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E3A8A] text-white"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Add Your First Contact
      </Button>
    </div>
  );
}



