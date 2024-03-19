import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Screen from '../component/Screen';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useChat } from './useChat';
import { useCallback, useContext, useMemo, useState } from 'react';
import { Colors } from '../modules/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AuthContext from '../component/AuthContext';
import Message from './Message';

export default function ChatScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'Chat'>>();
  const { other, userIds } = params;
  const { loadingChat, chat, sendMessage, sending, messages, loadingMessages } =
    useChat(userIds);
  const [text, setText] = useState<string>('');
  const sendDisabled = useMemo(() => {
    return text.length === 0;
  }, [text]);
  const { user: me } = useContext(AuthContext);
  const loading = loadingChat || loadingMessages;

  const onChangeText = useCallback((newText: string) => {
    setText(newText);
  }, []);

  const onPressSendButton = useCallback(() => {
    if (me != null) {
      sendMessage(text, me);
    }
    setText('');
  }, [me, sendMessage, text]);

  const renderChat = useCallback(() => {
    if (chat === null) return;
    return (
      <View style={styles.chatContainer}>
        <View style={styles.membersSection}>
          <Text style={styles.membersTitleText}>대화상대</Text>
          <FlatList
            data={chat.users}
            renderItem={({ item: user }) => (
              <View style={styles.userProfile}>
                <Text style={styles.userProfileText}>{user.name[0]}</Text>
              </View>
            )}
            horizontal
          />
        </View>
        <FlatList
          inverted
          style={styles.messageList}
          data={messages}
          renderItem={({ item: message }) => (
            <Message
              createdAt={message.createdAt}
              isOtherMessage={message.user.userId !== me?.userId}
              name={message.user.name}
              text={message.text}
            />
          )}
        />
        <View style={styles.inputContainer}>
          <ScrollView style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={text}
              onChangeText={onChangeText}
              multiline
            />
          </ScrollView>
          <TouchableOpacity
            style={sendDisabled ? disabledSendButtonStyle : styles.sendButton}
            disabled={sendDisabled}
            onPress={onPressSendButton}>
            <Icon name="send" style={styles.sendIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [chat, onChangeText, text, sendDisabled, messages, me?.userId]);

  return (
    <Screen title={other.name}>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          renderChat()
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
    padding: 20,
  },
  membersSection: {},
  membersTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
  userProfile: {
    backgroundColor: Colors.black,
    width: 34,
    height: 34,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    justifyContent: 'center',
  },
  userProfileText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
  messageList: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputContainer: {
    flex: 1,
    marginRight: 10,
    borderRadius: 12,
    borderColor: Colors.black,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: 10,
    minHeight: 50,
    maxHeight: 150,
  },
  textInput: {
    padding: 0,
    minHeight: 50,
    justifyContent:"center"
  },
  sendButton: {
    backgroundColor: Colors.black,
    height: 50,
    width: 60,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    color: Colors.white,
    fontSize: 16,
  },
});

const disabledSendButtonStyle = [
  styles.sendButton,
  {
    backgroundColor: Colors.gray,
  },
];
