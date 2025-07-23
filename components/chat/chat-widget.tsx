"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { MessageSquare, Send, X, Minimize2, Users, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"

interface Message {
  id: string
  sender_id: string
  receiver_id: string | null
  message: string
  created_at: string
  sender?: {
    full_name: string
    role: string
  }
}

interface ChatUser {
  id: string
  full_name: string
  role: string
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [selectedUser, setSelectedUser] = useState<string>("general")
  const [users, setUsers] = useState<ChatUser[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentUser = getCurrentUser()

  useEffect(() => {
    if (isOpen && currentUser) {
      loadUsers()
      loadMessages()
      const interval = setInterval(loadMessages, 3000)
      return () => clearInterval(interval)
    }
  }, [isOpen, selectedUser, currentUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadUsers = async () => {
    if (!currentUser) return

    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name, role")
        .neq("id", currentUser.id)
        .eq("is_active", true)
        .order("full_name")

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error("Error loading users:", error)
    }
  }

  const loadMessages = async () => {
    if (!currentUser) return

    try {
      setLoading(true)
      let query = supabase
        .from("chat_messages")
        .select(`
          id,
          sender_id,
          receiver_id,
          message,
          created_at,
          sender:users!chat_messages_sender_id_fkey(full_name, role)
        `)
        .order("created_at", { ascending: true })

      // Handle general chat vs private messages
      if (selectedUser === "general" || !selectedUser) {
        // General chat - messages with null receiver_id
        query = query.is("receiver_id", null)
      } else {
        // Private messages between current user and selected user
        query = query.or(
          `and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser}),and(sender_id.eq.${selectedUser},receiver_id.eq.${currentUser.id})`,
        )
      }

      const { data, error } = await query

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error("Error loading messages:", error)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return

    try {
      const messageData = {
        sender_id: currentUser.id,
        receiver_id: selectedUser === "general" ? null : selectedUser,
        message: newMessage.trim(),
      }

      const { error } = await supabase.from("chat_messages").insert([messageData])

      if (error) throw error

      setNewMessage("")
      loadMessages()
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800"
      case "admin":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Super Admin"
      case "admin":
        return "Admin"
      default:
        return "Usuario"
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className={`fixed bottom-4 right-4 w-80 shadow-xl z-50 ${isMinimized ? "h-12" : "h-96"}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat Interno
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => setIsMinimized(!isMinimized)} className="h-6 w-6">
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-3 flex flex-col h-80">
          {/* User Selection */}
          <div className="mb-3">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Chat general" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Chat General
                  </div>
                </SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{user.full_name}</span>
                      <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>{getRoleLabel(user.role)}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 mb-3">
            {loading ? (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.length === 0 ? (
                  <div className="flex justify-center items-center h-20 text-gray-500 text-sm">
                    {selectedUser === "general" ? "No hay mensajes en el chat general" : "No hay mensajes privados"}
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === currentUser?.id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-2 ${
                          message.sender_id === currentUser?.id ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {message.sender_id !== currentUser?.id && (
                          <div className="flex items-center gap-1 mb-1">
                            <Avatar className="h-4 w-4">
                              <AvatarFallback className="text-xs">
                                {message.sender?.full_name?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">{message.sender?.full_name}</span>
                            <Badge className={`text-xs ${getRoleBadgeColor(message.sender?.role || "")}`}>
                              {getRoleLabel(message.sender?.role || "")}
                            </Badge>
                          </div>
                        )}
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs opacity-70 mt-1">{formatTime(message.created_at)}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Message Input */}
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedUser === "general" ? "Mensaje para todos..." : "Mensaje privado..."}
              className="flex-1 h-8"
            />
            <Button onClick={sendMessage} size="icon" className="h-8 w-8" disabled={!newMessage.trim()}>
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// Export both default and named exports to handle different import styles
export { ChatWidget }
