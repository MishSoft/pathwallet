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
  action?: "add_income" | "add_expense" | "advice" | "unknown";
  data?: Record<string, unknown>;
}

const ChatPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  // ჩატის ისტორიის წამოღება localStorage-დან
  useEffect(() => {
    const storedMessages = localStorage.getItem("chatHistory");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // ჩატის ისტორიის შენახვა localStorage-ში
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  // browser-ის beforeunload hook
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (messages.length > 0) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // აქ გამოიყენება cookie ავტორიზაციისთვის
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
        throw new Error(errorData.error || "Failed to receive a response.");
      }
    } catch (error: any) {
      const errorMessage: ChatMessage = { text: error.message, sender: "ai" };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to end the conversation?")) {
      localStorage.removeItem("chatHistory");
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 flex-col sm:flex-row">
        <Sidebar />
        <div className="flex-1 p-8 bg-gray-100 dark:bg-gray-950">
          <Card className="flex flex-col h-[80vh]">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                <span>AI Assistant</span>
              </CardTitle>
              <Button variant="outline" onClick={handleClearChat}>
                End Conversation
              </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-4 flex flex-col justify-between">
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
                      Loading...
                    </div>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
            <form onSubmit={handleSendMessage} className="flex p-2 gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question…"
                className="flex-1"
                disabled={loading}
              />
              <Button type="submit" disabled={loading} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
