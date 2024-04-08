import React, {useEffect, useState} from 'react';
import {ImageProps, StatusBar, StyleSheet} from 'react-native';
import {ApplicationProvider, Icon, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import checkAuth from './utils/checkAuth';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthNavigation from './navigation/AuthNavigation';
import EmployeeNavigation from './navigation/EmployeeNavigation';
import AdminNavigation from './navigation/AdminNavigation';
import {AppStackParams} from '../types/rootNavigation';
import { Text } from 'react-native-paper';

const HeartIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="heart" />;

const AppStack = createNativeStackNavigator<AppStackParams>();

export default (): React.ReactElement => {
  /**
   * 0 = not authenticated
   * 1 = employee
   * 2 = admin
   */
  const [appState, setAppState] = useState(0);
  const [initialRoute, setInitialRoute] = useState('authNavigation');
  useEffect(() => {
  //   let k = setTimeout(async () => {
  //     const authState = await checkAuth();
  //     console.log('authState', authState);

  //     setAppState(authState);
      SplashScreen .hide();
  //   }, 200);
  //   return () => {
  //     clearTimeout(k);
  //   };
  }, []);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
          <AppStack.Navigator screenOptions={{headerShown: false}}>
            <AppStack.Screen
              name="AUTH_NAVIGATION"
              component={AuthNavigation}
            />
            <AppStack.Screen
              name="EMPLOYEE_NAVIGATION"
              component={EmployeeNavigation}
            />
            {/* <AppStack.Screen
              name="ADMIN_NAVIGATION"
              component={AdminNavigation}
            /> */}
          </AppStack.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  likeButton: {
    marginVertical: 16,
  },
});
