import { useCallback, useContext, useMemo, useState } from 'react';
import validator from 'validator';
import Screen from '../component/Screen';
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
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPwd, setConfirmedPwd] = useState('');
  const [name, setName] = useState('');
  const { processingSignup, signup } = useContext(AuthContext);
  const { navigate } =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
    if (password !== confirmedPwd) {
      return '비밀번호를 확인해주세요.';
    }
    return undefined;
  }, [password, confirmedPwd]);

  //password confirm validator
  const confirmPwdErrorText = useMemo(() => {
    if (confirmedPwd.length === 0) {
      return '비밀번호를 다시 한 번 입력하세요.';
    }
    if (confirmedPwd.length < 6) {
      return '비밀번호는 여섯자리 이상 입력해야 합니다.';
    }
    if (password !== confirmedPwd) {
      return '비밀번호를 확인해주세요.';
    }
    return undefined;
  }, [password, confirmedPwd]);

  //name validator
  const nameErrorText = useMemo(() => {
    if (name.length === 0) {
      return '이름을 입력하세요.';
    }
    return undefined;
  }, [name.length]);
  
  const signupButtonEnabled = useMemo(() => {
    return (
      emailErrorText === undefined &&
      pwdErrorText === undefined &&
      confirmPwdErrorText === undefined &&
      nameErrorText === undefined
    );
  }, [emailErrorText, pwdErrorText, confirmPwdErrorText, nameErrorText]);

  const signupBtnStyle = useMemo(() => {
    if (signupButtonEnabled) {
      return styles.signupButton;
    }
    return [styles.signupButton, styles.disabledSignupButton];
  }, [signupButtonEnabled]);

  const onPressSignupButton = useCallback(async () => {
    try {
      await signup(email, password, name);
    } catch (err: any) {
      Alert.alert(err.message);
    }
  }, [signup, email, password, name]);

  const onPressSigninButton = useCallback(() => {
    navigate('Signin');
  }, [navigate]);

  return (
    <Screen title="회원가입">
      {processingSignup ? (
        <View style={styles.signinContainer}>
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
            title={'이름'}
            value={name}
            setValue={setName}
            error={nameErrorText}
          />
          <Section
            title={'비밀번호'}
            value={password}
            setValue={setPassword}
            error={pwdErrorText}
            secureText={true}
          />
          <Section
            title={'비밀번호 확인'}
            value={confirmedPwd}
            setValue={setConfirmedPwd}
            error={confirmPwdErrorText}
            secureText={true}
          />
          <View>
            <TouchableOpacity
              style={signupBtnStyle}
              onPress={onPressSignupButton}
              disabled={!signupButtonEnabled}>
              <Text style={{ color: Colors.white, fontWeight: 'bold' }}>
                회원 가입
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.signinTextButton}
              onPress={onPressSigninButton}>
              <Text style={styles.signinText}>이미 계정이 있으신가요?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </Screen>
  );
};

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

export default SignupScreen;

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
  signinTextButton: {
    marginTop: 5,
    alignItems: 'center',
    padding: 10,
  },
  signinText: {
    color: Colors.black,
    fontSize: 16,
  },
  signinContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
