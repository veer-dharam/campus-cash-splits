
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Group } from "@/types";
import { useState, useRef, useEffect } from "react";
import { Users, Send, User as UserIcon } from "lucide-react";

interface GroupChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User;
  group: Group;
}

interface GroupChatMessage {
  id: string;
  text: string;
  from: string;
  userName: string;
}

export function GroupChatDialog({ open, onOpenChange, currentUser, group }: GroupChatDialogProps) {
  const [messages, setMessages] = useState<GroupChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, {
      id: Date.now().toString(),
      text: input,
      from: currentUser.id,
      userName: currentUser.name
    }]);
    setInput("");
  };

  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-md">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Users size={18} />
            Group Chat — {group.name}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 px-4 pt-4 h-72 overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-muted-foreground text-center text-sm mt-3">
              Start the conversation for this group!
            </div>
          )}
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex mb-1 ${msg.from === currentUser.id ? "justify-end" : "justify-start"}`}
            >
              <div className={`rounded px-3 py-1 text-sm max-w-[75%] 
                ${msg.from === currentUser.id 
                  ? "bg-primary text-white" 
                  : "bg-gray-200 text-gray-900"}`}>
                <span className="block font-semibold text-xs mb-0.5 opacity-75">
                  {msg.from === currentUser.id ? "You" : msg.userName}
                </span>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <DialogFooter className="border-t p-4 pt-2 gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message"
            onKeyDown={e => {
              if (e.key === "Enter") sendMessage();
            }}
            className="flex-1"
          />
          <Button variant="secondary" size="icon" onClick={sendMessage} disabled={!input.trim()}>
            <Send size={18} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
