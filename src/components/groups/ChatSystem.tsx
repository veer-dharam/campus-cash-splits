
import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

interface ChatSystemProps {
  groupId: string;
  members: string[];
}

export const ChatSystem = ({ groupId, members }: ChatSystemProps) => {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (selectedMember) {
      const chatKey = selectedMember === 'group' 
        ? `chat-group-${groupId}` 
        : `chat-${groupId}-${selectedMember}`;
      const savedMessages = JSON.parse(localStorage.getItem(chatKey) || '[]');
      setMessages(savedMessages);
    }
  }, [selectedMember, groupId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedMember) return;

    const message: Message = {
      id: Math.random().toString(36).substring(2, 11),
      sender: 'You',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    const chatKey = selectedMember === 'group' 
      ? `chat-group-${groupId}` 
      : `chat-${groupId}-${selectedMember}`;
    
    const updatedMessages = [...messages, message];
    localStorage.setItem(chatKey, JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
    setNewMessage('');
  };

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Chats</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedMember('group');
              setIsDialogOpen(true);
            }}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Group Chat
          </Button>
          {members.filter(m => m !== 'You').map((member) => (
            <Button
              key={member}
              variant="outline"
              onClick={() => {
                setSelectedMember(member);
                setIsDialogOpen(true);
              }}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with {member}
            </Button>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedMember === 'group' ? 'Group Chat' : `Chat with ${selectedMember}`}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-[400px]">
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${
                    message.sender === 'You' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex gap-2 max-w-[80%] ${
                      message.sender === 'You'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    } p-2 rounded-lg`}
                  >
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
