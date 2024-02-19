import { View } from 'react-native';
import Screen from '../component/Screen';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types';

export default function ChatScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'Chat'>>();
  return <Screen title={params.other.name}></Screen>;
}
