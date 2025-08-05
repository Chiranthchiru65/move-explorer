"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";

import { User, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

export const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Error signing out");
      return;
    }

    toast.success("Signed out successfully");
    setIsOpen(false);

    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  const handleProfile = () => {
    setIsOpen(false);
    router.push("/profile");
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom-end"
      offset={10}
    >
      <PopoverTrigger>
        <Avatar
          as="button"
          className="transition-transform hover:scale-105 cursor-pointer"
          color="primary"
          name="User"
          size="sm"
          src="https://i.pravatar.cc/150?u=user@example.com"
        />
      </PopoverTrigger>
      <PopoverContent className="p-1">
        <div className="px-1 py-2 w-full min-w-[200px]">
          <div className="px-2 py-2">
            <p className="text-small font-bold text-foreground">John Doe</p>
            <p className="text-tiny text-foreground/60">john@example.com</p>
          </div>

          <div className="flex flex-col gap-1">
            <Button
              className="justify-start"
              variant="light"
              onPress={handleProfile}
              startContent={<User size={16} />}
            >
              Profile
            </Button>

            <Button
              className="justify-start text-danger"
              color="danger"
              variant="light"
              onPress={handleLogout}
              startContent={<LogOut size={16} />}
            >
              Logout
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
