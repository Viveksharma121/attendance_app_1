import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/auth/Login';
import ProfileDetails from '../screens/auth/ProfileDetails';

export type AuthStackParams = {
  LOGIN: undefined;
  PROFILE_DETAILS: {
    empid: string;
  }
  EMPLOYEE_NAVIGATION: undefined;
  ADMIN_NAVIGATION: undefined;
}

const authStack = createNativeStackNavigator<AuthStackParams>();

const AuthNavigation = (props:any) => {
  return (
    <authStack.Navigator screenOptions={{headerShown:false}}>
      <authStack.Screen name="LOGIN" component={Login} 
      // initialParams={{...props}} 
      />
      <authStack.Screen name="PROFILE_DETAILS" component={ProfileDetails} 
      // initialParams={{...props}} 
      />
    </authStack.Navigator>
  )
}

export default AuthNavigation