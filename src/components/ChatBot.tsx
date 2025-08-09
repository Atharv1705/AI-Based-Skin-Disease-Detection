import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  X,
  Minimize2,
  Maximize2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { backend } from "@/integrations/backend/client";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatBotProps {
  className?: string;
}

export default function ChatBot({ className }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your SkinAI health assistant. I can help answer questions about skin conditions, provide general health information, and assist with your skin analysis results. How can I help you today?",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto focus when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (customMessage?: string) => {
    const finalMessage = customMessage ?? inputMessage.trim();
    if (!finalMessage || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: finalMessage,
      role: "user",
      timestamp: new Date()
    };

    // Add user & loading indicator in one state update
    setMessages(prev => [
      ...prev,
      userMessage,
      {
        id: "loading",
        content: "",
        role: "assistant",
        timestamp: new Date()
      }
    ]);

    setInputMessage("");
    setIsLoading(true);

    try {
      const context = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }));

      const data: any = await backend.healthChat(finalMessage, context);

      setMessages(prev =>
        prev.map(m =>
          m.id === "loading"
            ? {
                id: Date.now().toString(),
                content:
                  data.response ||
                  "I encountered an error processing your message.",
                role: "assistant",
                timestamp: new Date()
              }
            : m
        )
      );
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev =>
        prev.map(m =>
          m.id === "loading"
            ? {
                id: Date.now().toString(),
                content:
                  "I'm having trouble responding right now. Please try again.",
                role: "assistant",
                timestamp: new Date()
              }
            : m
        )
      );
      toast({
        title: "Chat Error",
        description: "Unable to get response from AI assistant",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Floating chat open button
  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-primary hover:opacity-90 z-50",
          className
        )}
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
      </Button>
    );
  }

  return (
    <Card
      className={cn(
        "fixed bottom-6 right-6 w-full sm:w-96 max-w-[95vw] h-[32rem] shadow-xl bg-card/95 backdrop-blur-md border-border/50 z-50 flex flex-col transition-all duration-200",
        isMinimized && "h-16",
        className
      )}
    >
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-sm">SkinAI Assistant</CardTitle>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          {/* Messages */}
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full px-4">
              <div className="space-y-4 py-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-start space-x-2 animate-fadeIn",
                      message.role === "user"
                        ? "justify-end flex-row-reverse space-x-reverse"
                        : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-3 h-3 text-primary" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "max-w-[80%] p-3 rounded-lg text-sm",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p
                        className={cn(
                          "text-xs mt-1 opacity-70",
                          message.role === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>

                    {message.role === "user" && (
                      <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing animation */}
                {isLoading && (
                  <div className="flex items-start space-x-2 animate-fadeIn">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-primary" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg flex space-x-1">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about skin health..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                size="icon"
                className="bg-gradient-primary hover:opacity-90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick reply badges */}
            <div className="flex flex-wrap gap-1 mt-2">
              {[
                "What are common skin conditions?",
                "How can I improve my skin health?"
              ].map((q, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-secondary/80"
                  onClick={() => sendMessage(q)}
                >
                  {i === 0 ? "Common conditions" : "Skin health tips"}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
