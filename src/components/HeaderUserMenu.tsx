"use client";

import Link from "next/link";
import { LogOut, User, Settings } from "lucide-react";
import { useTransition } from "react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { handleSignOut } from "@/actions/auth.actions";

interface HeaderUserMenuProps {
  userName?: string | null;
  userEmail?: string | null;
  align?: "start" | "center" | "end";
}

export function HeaderUserMenu({
  userName,
  userEmail,
  align = "end",
}: HeaderUserMenuProps) {
  const [isPending, startTransition] = useTransition();

  const onSignOut = () => {
    startTransition(async () => {
      await handleSignOut();
    });
  };

  return (
    <DropdownMenuContent align={align} className="w-56">
      <DropdownMenuLabel className="font-normal text-left">
        <div className="flex flex-col space-y-1 text-left">
          {userName && (
            <p className="text-sm font-medium leading-none text-left">{userName}</p>
          )}
          {userEmail && (
            <p className="text-xs leading-none text-muted-foreground text-left">
              {userEmail}
            </p>
          )}
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild className="text-left">
        <Link href="/dashboard/profile" className="flex items-center text-left">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className="text-left">
        <Link href="/dashboard/settings" className="flex items-center text-left">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={onSignOut}
        disabled={isPending}
        className="cursor-pointer text-left"
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Sign out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
