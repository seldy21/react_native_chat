import { useCallback, useEffect, useState } from "react"
import { Chat, Collections, User } from "../types"
import firestore from '@react-native-firebase/firestore';
import _ from "lodash";

const getChatKey = (userIds: string[]) => {
  return _.orderBy(userIds, userId => userId, 'asc');
}

export const useChat = (userIds: string[]) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [loadingChat, setLoadingChat] = useState(false);

  const loadChat = useCallback(async () => {
    try {
      setLoadingChat(true);
      const chatSnapShot = await firestore().collection(Collections.CHATS).where('userIds', '==', getChatKey(userIds)).get();

      if (chatSnapShot.docs.length > 0) {
        const doc = chatSnapShot.docs[0];
        setChat({
          id: doc.id,
          userIds: doc.data().userIds as string[],
          users: doc.data().users as User[]
        })
        return;
      }
      const usersSnapShot = await firestore().collection(Collections.USERS).where('userId', 'in', userIds).get();

      const users = usersSnapShot.docs.map((doc) => doc.data() as User);
      const data = {
        userIds: getChatKey(userIds),
        users,
      };

      const doc = await firestore().collection(Collections.CHATS).add(data);
      setChat({
        id: doc.id,
        ...data
      })
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setLoadingChat(false)
    }
  }, [userIds]);
  useEffect(() => {
    loadChat();
  }, [loadChat])

  return {
    chat, loadingChat
  }
}