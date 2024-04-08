import React from 'react';
import LoadingIndicator from '../../components/LoadingIndicator';
// import { ProfileDetailsParams } from "../../types";
import {Alert, Dimensions, KeyboardAvoidingView} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Surface, Text, TextInput} from 'react-native-paper';
// import { setItemAsync } from "expo-secure-store";
// import * as Application from "expo-application";

export default function ProfileDetails({navigation, route}: any) {
  console.log('profile details');

  const [submitted, setSubmitted] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');

  const submit = async () => {
    if (name === '' || email === '') {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }
    setSubmitted(true);
    const data = {
      name: name.trim(),
      email: email.trim(),
      empid: route.params.empid,
      deviceid: await DeviceInfo.getUniqueId(),
    };
    console.log(data);

    await axios
      .post(Config.BASE_URL + 'firstLogin.php', data)
      .then(res => res.data)
      .then(async res => {
        console.log(res);
        await AsyncStorage.setItem('token', res.token);
        await AsyncStorage.setItem('isAdmin', '0');
        axios.defaults.headers.common['Authorization'] = res.token;
        navigation.replace('EMPLOYEE_NAVIGATION');
        // route.params.setAppState(res.status);
      })
      .catch(err => {
        console.log(err);
        Alert.alert('Error', err.message);
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
        justifyContent: 'center',
        alignItems: 'center',
        // paddingHorizontal: '15%',
        // gap: 60,
      }}>
      <KeyboardAvoidingView
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <Text style={{fontWeight: '900'}} variant="headlineLarge">
          PROFILE INFO
        </Text>
        <Text
          variant="bodyMedium"
          style={{
            marginBottom: 60,
          }}>
          Please fill in your details
        </Text>
        <TextInput
          label="Name"
          onChangeText={val => setName(val)}
          value={name}
          disabled={submitted}
          style={{
            width: width * 0.7,
            marginBottom: 20,
          }}
          mode="outlined"
        />
        <TextInput
          label="Email"
          onChangeText={val => setEmail(val)}
          value={email}
          disabled={submitted}
          style={{
            width: width * 0.7,
            marginBottom: 20,
          }}
          mode="outlined"
        />
        <Button
          onPress={submit}
          mode='contained'
          style={{margin: 2,
            width: width * 0.7,
            padding: 5,
            marginTop: 20,
          }}
          loading={submitted}
          disabled={submitted}
          >
          SUBMIT
        </Button>
      </KeyboardAvoidingView>
    </Surface>
  );
}
