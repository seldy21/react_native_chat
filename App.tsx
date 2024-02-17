/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useCallback } from 'react';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Screens = () => {
  const { user, processingSignin, processingSignup, initialized } = useContext(AuthContext);

  const renderRootStack = useCallback(() => {
    if (!initialized) {
      return (<Stack.Screen name="Loading" component={LoadingScreen}/>)
    }
    if (user !== null && !processingSignin && !processingSignup) {
      //login
      return <Stack.Screen name="Home" component={HomeScreen} />;
    }
    //logout
    return (
      <>
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Signin" component={SigninScreen} />
      </>
    );
  }, [user, processingSignin, processingSignup]);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {renderRootStack()}
        {/* <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Signin" component={SigninScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { RootStackParamList } from './src/types';
import SignupScreen from './src/SignupScreen/SignupScreen';
import AuthProvider from './src/component/AuthProvider';
import SigninScreen from './src/SigninScreen/SigninScreen';
import AuthContext from './src/component/AuthContext';
import HomeScreen from './src/HomeScreen/HomeScreen';
import LoadingScreen from './src/LoadingScreen/LoadingScreen';

const App = () => {
  return (
    <AuthProvider>
      <Screens />
    </AuthProvider>
  );
};

export default App;
