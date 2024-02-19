import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Screen from '../component/Screen';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../component/AuthContext';
import { Colors } from '../modules/Colors';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Collections, RootStackParamList, User } from '../types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  console.log(users, "유저");
  console.log(user?.userId);

  if (user === null) {
    return null;
  }

  const onPressLogout = () => {
    auth().signOut();
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const snapshot = await firestore().collection(Collections.USERS).get();
      setUsers(
        snapshot.docs
          .map(doc => doc.data() as User)
          .filter(other => other.userId !== user?.userId),
      );
    } catch (err: any) {
      Alert.alert(err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const { navigate } =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Screen title={'홈'}>
      <View style={styles.container}>
        <View>
          <Text style={styles.sectionTitle}>나의 정보</Text>
          <View style={styles.sectionContainer}>
            <View>
              <Text style={styles.nameText}>{user.name}</Text>
              <Text style={styles.emailText}>{user.email}</Text>
            </View>
            <TouchableOpacity onPress={onPressLogout}>
              <Text style={styles.logoutBtn}>로그아웃</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.userListSection}>
          {loadingUsers ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator />
            </View>
          ) : (
            <View>
              <Text style={styles.sectionTitle}>
                다른 사용자와 대화해 보세요!
              </Text>
              <FlatList
                style={styles.userList}
                data={users}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.userListItme}
                    onPress={() => {
                      navigate('Chat', {
                        userIds: [user.userId, item.userId],
                        other: item
                      });
                    }}>
                    <Text style={styles.userListText}>{item.name}</Text>
                    <Text>{item.email}</Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={() => <Text>친구를 추가해보세요!</Text>}
              />
            </View>
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    paddingBottom: 10,
  },
  sectionContainer: {
    backgroundColor: Colors.gray,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  emailText: {
    color: Colors.white,
  },
  logoutBtn: {
    color: Colors.white,
  },
  userListSection: {
    marginTop: 40,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  userList: {
    paddingTop: 10,
  },
  userListItme: {
    backgroundColor: Colors.lightGrey,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10,
  },
  separator: {
    height: 10,
  },
  userListText: {
    fontWeight: 'bold',
  },
});
