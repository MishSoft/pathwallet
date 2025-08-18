"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

interface User {
  name: string;
  email: string;
}

const SettingsPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user", { credentials: "include" });
      if (response.ok) {
        const userData: User = await response.json();
        setUser(userData);
      } else if (response.status === 401) {
        router.push("/login");
      } else {
        throw new Error("Failed to fetch user data.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    if (!user) return;

    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: user.name, email: user.email }),
      });

      if (response.ok) {
        alert("პროფილი წარმატებით განახლდა!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "პროფილის განახლება ვერ მოხერხდა.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) setProfileError(error.message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError("");

    const form = e.currentTarget;
    const currentPassword = (
      form.elements.namedItem("current-password") as HTMLInputElement
    ).value;
    const newPassword = (
      form.elements.namedItem("new-password") as HTMLInputElement
    ).value;

    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        alert("პაროლი წარმატებით შეიცვალა!");
        form.reset();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "პაროლის შეცვლა ვერ მოხერხდა.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) setPasswordError(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/user", {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        // JWT cookie–ს წაშლა
        document.cookie = "token=; path=/; max-age=0";

        // შემდეგ რედირექცია
        router.push("/login");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "ანგარიშის გაუქმება ვერ მოხერხდა.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 flex-col sm:flex-row">
        <Sidebar />
        <div className="flex-1 p-8 bg-gray-100 dark:bg-gray-950">
          <h1 className="text-4xl font-bold mb-6">Settings</h1>

          <div className="grid gap-6">
            {/* Update Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Update Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={user.name}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                    />
                  </div>
                  {profileError && (
                    <p className="text-sm text-red-500">{profileError}</p>
                  )}
                  <Button type="submit">Save</Button>
                </form>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      name="current-password"
                      type="password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      name="new-password"
                      type="password"
                      required
                    />
                  </div>
                  {passwordError && (
                    <p className="text-sm text-red-500">{passwordError}</p>
                  )}
                  <Button type="submit">Update Password</Button>
                </form>
              </CardContent>
            </Card>

            {/* Delete Account */}
            <Card>
              <CardHeader>
                <CardTitle>Delete Account</CardTitle>
                <CardDescription>
                  Deleting your account will permanently erase all your data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                      <DialogDescription>
                        Deleting your account will permanently erase all your
                        financial data. This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Yes, delete account"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
