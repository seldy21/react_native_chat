import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../modules/Colors';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 48,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
  center: {
    flex: 3,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  body: {
    flex: 1,
  },
  left: {
    flex: 1,
  },
  backBtnText: {
    color: Colors.black,
    paddingLeft: 20,
    fontSize: 20
  },
  right: {
    flex: 1,
  },
});

interface ScreenProps {
  title?: string;
  children?: React.ReactNode;
}

const Screen = ({ children, title }: ScreenProps) => {
  const { goBack, canGoBack } = useNavigation();
  const onPressBackBtn = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.left}>
          {canGoBack() && (
            <TouchableOpacity onPress={onPressBackBtn}>
              {/* <Text style={styles.backBtnText}>Back</Text> */}
              <Icon style={styles.backBtnText} name='arrow-back'/>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.center}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <View style={styles.right}></View>
      </View>
      <View style={styles.body}>{children}</View>
    </SafeAreaView>
  );
};

export default Screen;
