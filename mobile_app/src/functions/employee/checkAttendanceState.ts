import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Alert} from 'react-native';
import Config from 'react-native-config';
import {AttendanceState} from '../../../types/employee/attendance';

/*
 * Check the attendance state of the user
 * @returns 0 if not marked, 1 if punched in, 2 if punched out, 3 if error
 */
export const checkAttendanceState = async (): Promise<AttendanceState> => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (token === null) {
      Alert.alert('empty auth token');
    }

    const response = await axios.get(
      `${Config.BASE_URL}employee/attendance/status.php`,
    );

    const attendanceState: AttendanceState = response.data;

    return attendanceState;
  } catch (error: any) {
    console.log(error);
    Alert.alert('Error', error.message);
    return {
      status: 3,
    };
  }
}
