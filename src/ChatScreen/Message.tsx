import moment from 'moment';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../modules/Colors';

interface MessageProps {
  name: string;
  text: string;
  createdAt: Date;
  isOtherMessage: boolean;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  nameText: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
  },
  messageContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 12,
    color: Colors.gray,
    paddingRight: 7,
  },
  bubble: {
    backgroundColor: Colors.black,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexShrink: 1,
  },
  messageText: {
    color: Colors.white,
  },
});

const otherMessageStyles = StyleSheet.create({
  container: {
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  bubble: {
    backgroundColor: Colors.lightGrey,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexShrink: 1
  },
  timeText: {
    fontSize: 12,
    color: Colors.gray,
    paddingLeft: 7,
  },
  messageContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'flex-end',
  },
  nameText:styles.nameText,
  messageText :{
    color: Colors.black,
  }
});

export default function Message({
  name,
  text,
  createdAt,
  isOtherMessage,
}: MessageProps) {
  const messageStyles = isOtherMessage ? otherMessageStyles : styles;

  const renderMessageContainer = useCallback(() => {
    const _component = [
      <Text key={'time'} style={messageStyles.timeText}>
        {moment(createdAt).format('HH:mm')}
      </Text>,
      <View key={'message'} style={messageStyles.bubble}>
        <Text style={messageStyles.messageText}>{text}</Text>
      </View>,
    ];
    return isOtherMessage ? _component.reverse() : _component;
  }, [createdAt, text]);

  return (
    <View style={messageStyles.container}>
      <Text style={messageStyles.nameText}>{name}</Text>
      <View style={messageStyles.messageContainer}>
        {renderMessageContainer()}
      </View>
    </View>
  );
}
