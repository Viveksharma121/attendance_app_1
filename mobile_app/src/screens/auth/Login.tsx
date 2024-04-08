import React, {useEffect} from 'react';
// import { LoginParams } from "../../types";
// import {Button, Input, Surface, Spinner, Text} from '@ui-kitten/components';
import {
  StyleSheet,
  ImageProps,
  View,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
// import LoadingIndicator from "../../components/LoadingIndicator";
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {NativeStackScreenProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import checkAuth from '../../utils/checkAuth';
import SplashScreen from 'react-native-splash-screen';
import {AuthStackParams} from '../../navigation/AuthNavigation';
import {Button, Surface, Text, TextInput} from 'react-native-paper';
// //

type Props = NativeStackScreenProps<AuthStackParams, 'LOGIN'>;

export default function Login({navigation, route}: Props) {
  const Authenticate = async () => {
    const authState = await checkAuth();
    console.log('authState', authState);

    // setAppState(authState);
    if (authState !== 0)
      navigation.replace(
        authState === 1 ? 'EMPLOYEE_NAVIGATION' : 'ADMIN_NAVIGATION',
      );
  };

  useEffect(() => {
    let k = setTimeout(async () => {
      await Authenticate();
      SplashScreen.hide();
    }, 200);
    return () => {
      clearTimeout(k);
    };
  }, []);

  const [submitted, setSubmitted] = React.useState<boolean>(false);
  const [employeeId, setEmployeeId] = React.useState<string>('');

  const submit = async () => {
    if (employeeId === '') {
      Alert.alert('Please enter employee id');
      return;
    }

    setSubmitted(true);

    console.log('req', Config.BASE_URL + 'login.php');

    const RequestData = {
      empid: employeeId,
      deviceid: await DeviceInfo.getUniqueId(),
    };

    await axios
      .post(Config.BASE_URL + 'login.php', RequestData)
      .then(res => res.data)
      .then(async res => {
        console.log(res);
        switch (res.status) {
          case 1:
            await AsyncStorage.setItem('token', res.token);
            await AsyncStorage.setItem('isAdmin', '0');
            await Authenticate();
            break;
          case 2:
            navigation.push('PROFILE_DETAILS', {empid: employeeId});
            break;
          case 5:
            await AsyncStorage.setItem('token', res.token);
            await AsyncStorage.setItem('isAdmin', '1');
            await Authenticate();
            break;
          default:
            Alert.alert('Error', res.message ?? 'Something went wrong');
            break;
        }
      })
      .catch(err => {
        console.log('1', err);
        Alert.alert('Network Error');
      })
      .finally(() => {
        setSubmitted(false);
      });
  };

  const width = Dimensions.get('window').width;

  return (
    <Surface
      style={{
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        // paddingHorizontal: '15%',
        gap: 60,
        paddingVertical: 100,
      }}>
      <KeyboardAvoidingView
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
        <Text variant="headlineMedium" style={{fontWeight: '800'}}>
          ALPHA
        </Text>
        <Text
          variant="bodySmall"
          style={{
            marginBottom: 90,
          }}>
          EMPLOYEE ATTENDANCE
        </Text>
        <Text
          variant="headlineLarge"
          style={{
            fontWeight: 'bold',
          }}>
          LOGIN
        </Text>
        <Text
          variant="bodySmall"
          style={{
            marginBottom: 20,
          }}>
          Login to continue
        </Text>
        <TextInput
          disabled={submitted}
          onChangeText={val => setEmployeeId(val)}
          value={employeeId}
          mode="outlined"
          label={'Employee Id'}
          style={{width: width * 0.7, margin: 2}}
        />
        <Button
          onPress={submit}
          style={{margin: 2, width: width * 0.7, padding: 5, marginTop: 20}}
          mode="contained"
          loading={submitted}>
          {submitted ? 'LOADING' : 'SUBMIT'}
        </Button>
      </KeyboardAvoidingView>
    </Surface>
  );
}
