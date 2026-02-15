import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../socket/socketContext";

export const useGlobalSocketHandlers = () => {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleGlobalMessage = (data) => {
      console.log("🌐 Global message received:", data);

      // ✅ Handle both conversationId and conversation_id
      const numericConversationId = Number(data.conversationId || data.conversation_id);

      if (!numericConversationId) {
        console.error("❌ No conversation ID found in message data:", data);
        return;
      }

      console.log("📝 Updating cache for conversation:", numericConversationId);

      // ✅ Check if query exists and is active
      const existingData = queryClient.getQueryData(["messages", numericConversationId]);
      console.log("📊 Current messages in cache:", existingData?.length || 0);

      if (existingData && existingData.length > 0) {
        // ✅ Cache exists, update it
        queryClient.setQueryData(
          ["messages", numericConversationId],
          (old = []) => {
            if (old.some((msg) => msg.id === data.id)) {
              console.log("⚠️ Message already exists in cache");
              return old;
            }
            
            console.log("✅ Adding message to existing cache");
            return [...old, data];
          },
        );

        // Force re-render
        setTimeout(() => {
          queryClient.invalidateQueries({ 
            queryKey: ["messages", numericConversationId],
            refetchType: 'none'
          });
        }, 0);
      } else {
        // ❌ Cache doesn't exist or is empty
        console.log("⚠️ No cache found - forcing refetch");
        
        // Just invalidate to trigger a refetch when component mounts
        queryClient.invalidateQueries({ 
          queryKey: ["messages", numericConversationId]
        });
      }

      // ✅ Update conversations list
      queryClient.setQueryData(["conversations"], (old = []) => {
        if (!old || old.length === 0) return old;

        console.log("📝 Updating conversation list");

        const updated = old.map((conv) =>
          conv.conversation_id === numericConversationId
            ? {
                ...conv,
                last_message: data.text,
                updatedAt: data.createdAt || new Date().toISOString(),
                last_sender: data.sender_id,
              }
            : conv,
        );

        return updated.sort(
          (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0),
        );
      });

      console.log("✅ Global message handler completed");
    };

    const handleGlobalDeleteMessage = (data) => {
      console.log("🌐 Global delete message:", data);

      const numericConversationId = Number(data.conversationId || data.conversation_id);

      if (!numericConversationId) {
        console.error("❌ No conversation ID found in delete data:", data);
        return;
      }

      // Update messages cache
      queryClient.setQueryData(
        ["messages", numericConversationId],
        (old = []) => {
          if (!old) return old;
          return old.filter((msg) => msg.id !== (data.messageId || data.id));
        },
      );

      // Force re-render
      setTimeout(() => {
        queryClient.invalidateQueries({ 
          queryKey: ["messages", numericConversationId],
          refetchType: 'none'
        });
      }, 0);
    };

    // ✅ Listen globally to all messages
    socket.on("receive_message", handleGlobalMessage);
    socket.on("delete_message", handleGlobalDeleteMessage);

    return () => {
      socket.off("receive_message", handleGlobalMessage);
      socket.off("delete_message", handleGlobalDeleteMessage);
    };
  }, [socket, queryClient]);
};