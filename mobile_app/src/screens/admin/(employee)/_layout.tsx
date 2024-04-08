import { SplashScreen, Stack } from 'expo-router';
import PageHeader from '../../components/PageHeader';
import { StyleSheet, Dimensions, Pressable } from 'react-native';
import React from 'react';

export default function EmployeeLayout() {
  const [refreshEmployee, setRefreshEmployee] = React.useState(0)

  return (
      <Stack>
        <Stack.Screen name="index" initialParams={{refreshEmployee}} options={{headerShown:false}}/>
        <Stack.Screen name="[id]" initialParams={{setRefreshEmployee}} options={{header:()=> <PageHeader name='Employee'/>}}  />
      </Stack>
  );
}


