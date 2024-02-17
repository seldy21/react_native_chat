import { useNavigation } from '@react-navigation/native';
import Screen from '../component/Screen';
import { useCallback, useContext, useMemo, useState } from 'react';
import validator from 'validator';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../modules/Colors';
import AuthContext from '../component/AuthContext';

export default function SigninScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signin, processingSignin } = useContext(AuthContext);

  //email validator
  const emailErrorText = useMemo(() => {
    if (email.length === 0) {
      return '이메일을 입력하세요.';
    }
    if (!validator.isEmail(email)) {
      return '올바른 이메일이 아닙니다.';
    }
    return undefined;
  }, [email]);

  //password validator
  const pwdErrorText = useMemo(() => {
    if (password.length === 0) {
      return '비밀번호를 입력하세요.';
    }
    if (password.length < 6) {
      return '비밀번호는 여섯자리 이상 입력해야 합니다.';
    }
    return undefined;
  }, [password]);

  const signupButtonEnabled = useMemo(() => {
    return emailErrorText === undefined && pwdErrorText === undefined;
  }, [emailErrorText, pwdErrorText]);

  const signupBtnStyle = useMemo(() => {
    if (signupButtonEnabled) {
      return styles.signupButton;
    }
    return [styles.signupButton, styles.disabledSignupButton];
  }, [emailErrorText, pwdErrorText]);

  const onPressSignupButton = useCallback(async () => {
    try {
      await signin(email, password);
    } catch (err: any) {
      Alert.alert(err.message);
    }
  }, [email, password]);

  return (
    <Screen title="로그인">
      {processingSignin ? (
        <View style={styles.signingContainer}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <Section
            title={'이메일'}
            value={email}
            setValue={setEmail}
            error={emailErrorText}
          />
          <Section
            title={'비밀번호'}
            value={password}
            setValue={setPassword}
            error={pwdErrorText}
            secureText={true}
          />
          <View>
            <TouchableOpacity
              style={signupBtnStyle}
              onPress={onPressSignupButton}
              disabled={!signupButtonEnabled}>
              <Text style={{ color: Colors.white, fontWeight: 'bold' }}>
                로그인
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 10,
    color: Colors.black,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: Colors.gray,
    fontSize: 16,
  },
  errorText: {
    paddingTop: 5,
    fontSize: 14,
    color: Colors.red,
  },
  signupButton: {
    backgroundColor: Colors.skyblue,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  disabledSignupButton: {
    backgroundColor: Colors.gray,
  },
  signingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface SectionProps {
  title: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  error?: string;
  secureText?: boolean;
}

const Section: React.FC<SectionProps> = ({
  title,
  value,
  setValue,
  error,
  secureText,
}) => {
  const onChange = useCallback((text: string) => {
    setValue(text);
  }, []);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TextInput
        value={value}
        style={styles.input}
        onChangeText={onChange}
        secureTextEntry={secureText}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
