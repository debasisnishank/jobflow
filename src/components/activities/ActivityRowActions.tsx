"use client";

import { CirclePlay, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

interface ActivityRowActionsProps {
  activityId: string;
  activityExist: boolean;
  onStartActivity: (activityId: string) => void;
  onDeleteActivity: (id: string) => void;
}

export function ActivityRowActions({
  activityId,
  activityExist,
  onStartActivity,
  onDeleteActivity,
}: ActivityRowActionsProps) {
  return (
    <div className="flex items-center gap-1">
      {!activityExist && (
        <Button
          title="Start Activity"
          aria-haspopup="true"
          size="icon"
          variant="ghost"
          onClick={() => onStartActivity(activityId)}
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#3B82F6]/10"
        >
          <CirclePlay className="h-4 w-4 text-green-600" />
          <span className="sr-only">Start Activity</span>
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-haspopup="true"
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[200px] border-border/50"
        >
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer text-green-600 focus:text-green-600 focus:bg-green-50 dark:focus:bg-green-950"
              onClick={() => onStartActivity(activityId)}
              disabled={activityExist}
            >
              <CirclePlay className="mr-2 h-4 w-4" />
              Start Activity
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
              onClick={() => onDeleteActivity(activityId)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

















