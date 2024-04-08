import { getItemAsync } from 'expo-secure-store';
import checkLocation from './checkLocation';
import { Alert } from 'react-native';
import axios from 'axios';
import { PunchState } from '../enums';

interface PunchProps {
  setPunchState: (punch: PunchState) => void;
  setLoading: (loading: boolean) => void;
  setSubmitted: (submitted: boolean) => void;
}

const punchIn = async ({
  setLoading,
  setPunchState,
  setSubmitted,
}: PunchProps) => {
  setSubmitted(true);
  setLoading(true);
  let submitTimeOut = setTimeout(() => {
    setLoading(false);
    setSubmitted(false);
    alert('Punchin Failed');
  }, 10000);
  await getItemAsync('loginState')
    .then(async (res) => {
      var state = res ? JSON.parse(res) : { empid: 'null' };

      await checkLocation(state.empid)
        .then(async (res) => {
          if (res.status === 0) {
            console.log('Error', res);
            Alert.alert('Error', res.message);
            return;
          } else if (res.status === 2) {
            Alert.alert('Alert', 'You are not at assigned location');
            return;
          }
            console.log('correct location');

            await axios
              .post(
                Config.BASE_URL + 'attendance/punchIn.php',
                {
                  empid: state.empid,
                  address: res.address,
                }
              )
              .then((res) => {
                console.log('punchIn result', res.data); //!!!!!!!!!!!!!!!!!!!!!!!

                if (res.data.status === 1) {
                  //1 success and 0 error
                  setPunchState(PunchState.PUNCHIN);
                } else if (res.data.status === 2) {
                  setPunchState(PunchState.PUNCHIN);
                  Alert.alert('Info', res.data.message);
                } else {
                  Alert.alert('Error 1', res.data.message);
                }
              })
              .catch((err) => {
                Alert.alert('Error 2', err.message);
                console.log(err);
              });
         
        })
        .catch((err) => {
          Alert.alert('Error 3', err.message);
          console.log(err);
        });
    })
    .catch((err) => {
      Alert.alert('Error 4', err.message);
    })
    .finally(() => {
      clearTimeout(submitTimeOut);
      setLoading(false);
      setSubmitted(false);
    });
};

const punchOut = async ({
  setLoading,
  setPunchState,
  setSubmitted,
}: PunchProps) => {
  setSubmitted(true);
  setLoading(true);
  let submitTimeOut = setTimeout(() => {
    setLoading(false);
    setSubmitted(false);
    alert('Punchout Failed');
  }, 10000);

  await getItemAsync('loginState')
    .then(async (res) => {
      var state = res ? JSON.parse(res) : { empid: 'null' };

      await checkLocation(state.empid)
        .then(async (res) => {
          if (res.status === 0) {
            console.log('Error', res);
            Alert.alert('Error', res.message);
            return;
          } else if (res.status === 2) {
            Alert.alert('Alert', 'You are not at assigned location');
            return;
          }

          await axios
            .post(
              Config.BASE_URL + 'attendance/punchOut.php',
              {
                empid: state.empid,
                address: res.address,
              }
            )
            .then((res) => {
              console.log('PunchOut status', res.data);

              if (res.data.status === 1) {
                //1 success and 0 error
                setPunchState(PunchState.PUNCHOUT);
              } else if (res.data.status === 2) {
                setPunchState(PunchState.PUNCHOUT);
                Alert.alert('Info', res.data.message);
              } else {
                Alert.alert('Error 1', res.data.message);
              }
            })
            .catch((err) => {
              Alert.alert('Error 2', err.message);
              console.log(err);
            });
        })
        .catch((err) => {
          Alert.alert('Error', err.message);
          console.log(err);
        });
    })
    .catch((err) => {
      Alert.alert('Error 3', err.message);
      console.log(err);
    })
    .finally(() => {
      clearTimeout(submitTimeOut);
      setLoading(false);
      setSubmitted(false);
    });
};

export { punchIn, punchOut };