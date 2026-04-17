import Image from "next/image";
import { CurrentUser } from "@/models/user.model";

export default function UserAvatar({ user }: { user: CurrentUser | null }) {
  if (!user) return null;
  return (
    <div className="relative">
      <Image
        src="/images/placeholder-user.jpg"
        width={36}
        height={36}
        alt={user.name || "Avatar"}
        className="overflow-hidden rounded-full border-2 border-background hover:border-primary/50 transition-colors cursor-pointer"
      />
      <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full"></span>
    </div>
  );
}
