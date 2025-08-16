/* eslint-disable @typescript-eslint/no-explicit-any */
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

const SettingsPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        throw new Error("Failed to fetch user data.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    const token = localStorage.getItem("token");
    if (!token || !user) return;

    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: user.name, email: user.email }),
      });

      if (response.ok) {
        alert("პროფილი წარმატებით განახლდა!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "პროფილის განახლება ვერ მოხერხდა.");
      }
    } catch (err: any) {
      setProfileError(err.message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    const token = localStorage.getItem("token");
    if (!token) return;

    const form = e.target as HTMLFormElement;
    const currentPassword = form["current-password"].value;
    const newPassword = form["new-password"].value;

    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        alert("პაროლი წარმატებით შეიცვალა!");
        form.reset();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "პაროლის შეცვლა ვერ მოხერხდა.");
      }
    } catch (err: any) {
      setPasswordError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("/api/user", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "ანგარიშის გაუქმება ვერ მოხერხდა.");
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      fetchUser(token);
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>იტვირთება...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 flex-col sm:flex-row">
        <Sidebar />
        <div className="flex-1 p-8 bg-gray-100 dark:bg-gray-950 ">
          <h1 className="text-4xl font-bold mb-6">პარამეტრები</h1>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>პროფილის განახლება</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">სახელი</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="თქვენი სახელი"
                      value={user?.name || ""}
                      onChange={(e) =>
                        setUser((prev) =>
                          prev ? { ...prev, name: e.target.value } : null
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">ელფოსტა</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={user?.email || ""}
                      onChange={(e) =>
                        setUser((prev) =>
                          prev ? { ...prev, email: e.target.value } : null
                        )
                      }
                    />
                  </div>
                  {profileError && (
                    <p className="text-sm text-red-500">{profileError}</p>
                  )}
                  <Button type="submit">შენახვა</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>პაროლის შეცვლა</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">მიმდინარე პაროლი</Label>
                    <Input
                      id="current-password"
                      name="current-password"
                      type="password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">ახალი პაროლი</Label>
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
                  <Button type="submit">პაროლის შეცვლა</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ანგარიშის გაუქმება</CardTitle>
                <CardDescription>
                  თქვენი ანგარიშის გაუქმება წაშლის ყველა მონაცემს სამუდამოდ.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">ანგარიშის გაუქმება</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>დარწმუნებული ხართ?</DialogTitle>
                      <DialogDescription>
                        თქვენი ანგარიშის გაუქმება სამუდამოდ წაშლის თქვენს ყველა
                        ფინანსურ მონაცემს. ამ მოქმედების უკან დაბრუნება
                        შეუძლებელია.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">გაუქმება</Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                      >
                        {isDeleting
                          ? "იგზავნება..."
                          : "დიახ, ანგარიშის გაუქმება"}
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
