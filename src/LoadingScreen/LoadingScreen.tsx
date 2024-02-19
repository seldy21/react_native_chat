import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../modules/Colors';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color={"red"}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex:1
  },
});
