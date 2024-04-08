// import {
//   Button,
//   Card,
//   Divider,
//   Icon,
//   Surface,
//   List,
//   ListItem,
//   Modal,
//   Spinner,
//   Text,
// } from '@ui-kitten/components';
import {StyleSheet, Alert, Dimensions, View, Linking} from 'react-native';
import React from 'react';
import Loading from '../Loading';
import axios from 'axios';
import {AttendanceState} from '../../../types/employee/attendance';
import {checkAttendanceState} from '../../functions/employee/checkAttendanceState';
import {punchIn, punchOut} from '../../functions/employee/markAttendance';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {EmployeeStackParams} from '../../../types/employee/navigation';
import {timeFormat} from '../../utils/timeFormat';
// import {Header} from '../../components/Header';
import {
  Appbar,
  Avatar,
  Button,
  Card,
  Divider,
  Modal,
  Portal,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';

// const MapIcon = (props: any) => <Icon name="map" {...props} />;

// export const LoginButton = () => (
//   <Button accessoryLeft={MapIcon}>Login with Facebook</Button>
// );

interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

const data = new Array(8).fill({
  title: 'Item',
  description: 'Description for Item',
});

type Props = NativeStackScreenProps<EmployeeStackParams, 'EMPLOYEE_HOME'>;

export default function EmployeeHomeScreen({navigation}: Props) {
  console.log('Home');
  const [punchState, setPunchState] = React.useState(0); // 0 for start, 1 for puch in, 2 for punch out
  const [submitted, setSubmitted] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [visible, setVisible] = React.useState(false);
  const [attendanceState, setAttendanceState] =
    React.useState<AttendanceState>();
  const [locations, setLocations] = React.useState<Location[] | null>([]);

  const loadAttendanceState = async () => {
    const state = await checkAttendanceState();
    setAttendanceState(state);
    console.log('state', state);
  };

  React.useEffect(() => {
    loadAttendanceState();
  }, []);

  const theme = useTheme();

  return (
    <>
      <Portal>
        <Modal
          visible={visible}
          // onBackdropPress={() => setVisible(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            // padding: 20,
            margin: 20,
            borderRadius: 10,
          }}
          dismissable>
          <Card
            disabled={true}
            style={{
              paddingVertical: 20,
              paddingHorizontal: 30,
            }}>
            <Text variant="titleLarge" style={{marginVertical:3, marginLeft:6}}>
              Alert
            </Text>
            <Text>
              Are you sure you want to{' '}
              {attendanceState?.status === 0 ? 'punch in' : 'punch out'}?
            </Text>
            <View style={styles.modalSurface}>
              <Button
                onPress={async () => {
                  if (attendanceState?.status === 0)
                    await punchIn(loadAttendanceState);
                  else await punchOut(loadAttendanceState);
                  setVisible(false);
                }}>
                Yes
              </Button>
              <Button
                onPress={() => setVisible(false)}>
                No
              </Button>
            </View>
          </Card>
        </Modal>
      </Portal>

      <Appbar.Header style={{elevation: 9}}>
        <Appbar.Content
          title={new Date().toLocaleDateString()}
          titleStyle={{
            fontWeight: 'bold',
          }}
        />
        <Avatar.Text
          size={35}
          label="SR"
          style={{
            marginRight: 10,
          }}
        />
      </Appbar.Header>

      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 20,
          flex: 1,
          gap: 20,
          // backgroundColor: theme.colors.surface,'
          // backgroundColor: '#f5f5f5'
        }}>
        <Surface
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 20,
            backgroundColor: theme.colors.primaryContainer,
            borderRadius: 15,
          }}>
          <View>
            <Text
              variant="headlineSmall"
              style={{
                fontWeight: 'bold',
                color: theme.colors.onPrimaryContainer,
              }}>
              Mark
            </Text>
            <Text
              variant="headlineSmall"
              style={{
                fontWeight: 'bold',
                color: theme.colors.onPrimaryContainer,
              }}>
              your
            </Text>
            <Text
              variant="headlineSmall"
              style={{
                fontWeight: 'bold',
                color: theme.colors.onPrimaryContainer,
              }}>
              attendance
            </Text>
          </View>
          <View
            style={{
              gap: 10,
            }}>
            <Button
              mode="elevated"
              style={{
                backgroundColor:
                  attendanceState?.status != 1
                    ? theme.colors.primary
                    : theme.colors.onSurfaceDisabled,
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 3,
              }}
              labelStyle={{fontWeight: 'bold', fontSize: 16}}
              contentStyle={{}}
              textColor={theme.colors.onPrimary}
              onPress={() => {
                setVisible(true);
              }}
              disabled={attendanceState?.status === 1}>
              Punch In
            </Button>
            <Button
              mode="elevated"
              style={{
                backgroundColor:
                  attendanceState?.status != 0
                    ? theme.colors.primary
                    : theme.colors.onSurfaceDisabled,
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 3,
              }}
              labelStyle={{fontWeight: 'bold', fontSize: 16}}
              contentStyle={{}}
              textColor={theme.colors.onPrimary}
              disabled={attendanceState?.status === 0}
              onPress={() => {
                setVisible(true);
              }}>
              Punch Out
            </Button>
          </View>
        </Surface>

        <Surface
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 20,
            paddingHorizontal: 30,
            gap: 30,
          }}>
          {/* <Text >HOME</Text> */}
          {/* {attendanceState?.status === 0 ? (
            <Button
              mode="outlined"
              style={styles.punchInButton}
              onPress={async () => setVisible(true)}
              disabled={submitted}>
              Punch In
            </Button>
          ) : (
            <Button
              mode="outlined"
              style={styles.punchInButton}
              disabled={attendanceState?.status === 2}
              onPress={async () => setVisible(true)}>
              Punch Out
            </Button>
          )} */}
          {/* <LoginButton /> */}

          {attendanceState?.data?.intime !== undefined && (
            <Surface
              // mode='primary'
              style={{
                width: '100%',
                borderRadius: 10,
                // borderWidth: 0.1,
                // borderColor: '#ff2f00',
                paddingHorizontal: 20,
                paddingBottom: 10,
                paddingTop: 15,
                elevation: 8,
                // backgroundColor: '#ff2f00'
              }}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <Text>TODAY</Text>

                <Text>
                  {new Date(attendanceState.data.date).toDateString()}
                </Text>
              </View>
              <Divider />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignItems: 'center',
                }}>
                <Text>Punch In:</Text>
                <Button
                  // accessoryRight={MapIcon}
                  onPress={async () => {
                    await Linking.openURL(
                      `https://www.google.com/maps/search/?api=1&query=${attendanceState.data?.inlocationlat},${attendanceState.data?.inlocationlon}`,
                    );
                  }}>
                  <Text>{timeFormat(attendanceState.data.intime)}</Text>
                </Button>
              </View>
              <Divider />
              {attendanceState.data.outtime !== null && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'center',
                    // backgroundColor: '#ff2f00',
                  }}>
                  <Text>Punch Out:</Text>
                  <Button
                    // accessoryRight={MapIcon}
                    onPress={async () => {
                      await Linking.openURL(
                        `https://www.google.com/maps/search/?api=1&query=${attendanceState.data?.outlocationlat},${attendanceState.data?.outlocationlon}`,
                      );
                    }}>
                    <Text>{timeFormat(attendanceState.data.outtime)}</Text>
                  </Button>

                  {/* <Icon name="map" style={{
                  height:40}}/> */}
                </View>
              )}
            </Surface>
          )}

          <Surface
            //
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Button
              style={styles.utilButtons}
              mode="contained"
              onPress={() => {
                navigation.push('EMPLOYEE_ATTENDANCE');
              }}>
              <Text>Attendance</Text>
            </Button>
            <Button
              style={styles.utilButtons}
              mode="contained"
              onPress={() => {
                navigation.push('EMPLOYEE_PROFILE');
              }}>
              <Text> Profile</Text>
            </Button>
          </Surface>

          <Surface style={styles.listSurface}>
            <Text style={styles.listTitle}>Assigned Locations</Text>
            <Divider />
            {/* {locations === null ? (
            <Text  style={{textAlign: 'center'}}>
              Error fetching locations
            </Text>
          ) : locations?.length === 0 ? (
            <Text  style={{textAlign: 'center'}}>
              No locations assigned
            </Text>
          ) : (
            <List
              style={{maxHeight: 250}}
              data={locations}
              ItemSeparatorComponent={Divider}
              renderItem={renderItem}
            />
          )} */}
          </Surface>
        </Surface>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  utilButtons: {
    width: Dimensions.get('window').width / 2 - 45,
    height: Dimensions.get('window').width / 2 - 60,
    borderRadius: 20,
    // borderWidth: 2,
    // borderColor: 'cornflowerblue',
    elevation: 30,
  },
  punchInButton: {
    width: '100%',
    height: 90,
    borderRadius: 20,
    // marginVertical: 60,
    // elevation: 30,
    // backgroundColor: '#ff2f00',
  },
  listSurface: {
    // height: 350,
    elevation: 9,

    flex: 1,
    marginBottom: 30,
    width: '100%',
    borderRadius: 10,
    // borderWidth: 1,
    // borderColor: 'grey'
  },
  listTitle: {
    textAlign: 'center',
    marginVertical: 25,
  },
  container: {
    minHeight: 192,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalSurface: {
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop: 25,
  },
});
