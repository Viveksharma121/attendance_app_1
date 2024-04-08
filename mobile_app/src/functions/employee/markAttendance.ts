import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {Alert} from 'react-native';
import Config from 'react-native-config';

export const punchIn = async (loadAttendanceState: any): Promise<any> => {
  Geolocation.getCurrentPosition(
    async position => {
      console.log(position.coords);

      const coords = position.coords;

      const requestBody = {
        lat: coords.latitude,
        lon: coords.longitude,
      };
      const token = await AsyncStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = token;
      await axios
        .post(`${Config.BASE_URL}employee/attendance/punchIn.php`, requestBody)
        .then(res => res.data)
        .then(response => {
          console.log(response);
          // Alert.alert('Alert', response.message);
          switch (response.status) {
            case 0:
              Alert.alert('Alert', response.message);
              break;
            case 1:
              Alert.alert('Success', response.message);
              break;
            case 2:
              Alert.alert('Error', response.message);
              break;
            default:
              Alert.alert('Error', response.message);
              break;
          }

          loadAttendanceState();
        })
        .catch(error => {
          console.log(error.message);
          // console.log(JSON.stringify(error));
          
          Alert.alert('Error', error.message);
        });
      console.log('punch in');
    },
    error => {
      console.log(error.message);
      Alert.alert('Error', error.message);
    },
    {
      enableHighAccuracy: true,
    },
  );
};

export const punchOut = async (loadAttendanceState: any): Promise<any> => {
  Geolocation.getCurrentPosition(
    async position => {
      console.log(position.coords);

      const coords = position.coords;

      const requestBody = {
        lat: coords.latitude,
        lon: coords.longitude,
      };
      const token = await AsyncStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = token;
      await axios
        .post(`${Config.BASE_URL}employee/attendance/punchOut.php`, requestBody)
        .then(res => res.data)
        .then(response => {

          switch (response.status) {
            case 0:
              Alert.alert('Alert', response.message);
              break;
            case 1:
              Alert.alert('Success', response.message);
              break;
            case 2:
              Alert.alert('Error', response.message);
              break;
            default:
              Alert.alert('Error', response.message);
              break;
          }
          loadAttendanceState();
        })
        .catch(error => {
          console.log(error.message);
          Alert.alert('Error', error.message);
        });
      console.log('punch out');
    },
    error => {
      console.log(error.message);
      Alert.alert('Error', error.message);
    },
    {
      enableHighAccuracy: true,
    },
  );
}
