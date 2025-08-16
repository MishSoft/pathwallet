/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send } from "lucide-react";

interface ChatMessage {
  text: string;
  sender: "user" | "ai";
  action?: "add_income" | "add_expense";
  data?: any; // აქ იქნება მონაცემები მოქმედებისთვის
}

const ChatPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: ChatMessage = {
          text: data.message,
          sender: "ai",
          action: data.action,
          data: data.data,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "პასუხის მიღება ვერ მოხერხდა.");
      }
    } catch (error: any) {
      const errorMessage: ChatMessage = { text: error.message, sender: "ai" };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteAction = async (message: ChatMessage) => {
    // აქ შესრულდება ბეკენდის მოქმედება
    if (!message.action || !message.data) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    if (message.action === "add_income") {
      try {
        const response = await fetch("/api/income", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(message.data),
        });

        if (response.ok) {
          const successMessage: ChatMessage = {
            text: "შემოსავალი წარმატებით დაემატა!",
            sender: "ai",
          };
          setMessages((prev) => [...prev, successMessage]);
        } else {
          throw new Error("მოქმედება ვერ შესრულდა.");
        }
      } catch (error: any) {
        const errorMessage: ChatMessage = { text: error.message, sender: "ai" };
        setMessages((prev) => [...prev, errorMessage]);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
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
          <Card className="flex flex-col h-[80vh]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                <span>AI ასისტენტი</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-4 flex flex-col justify-between">
              <ScrollArea className="flex-1 pr-4 mb-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg max-w-[75%] mb-2 ${
                        msg.sender === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="p-2 rounded-lg max-w-[75%] mb-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white">
                      იტვირთება...
                    </div>
                  </div>
                )}
              </ScrollArea>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="დასვით შეკითხვა..."
                  className="flex-1"
                  disabled={loading}
                />
                <Button type="submit" disabled={loading} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
