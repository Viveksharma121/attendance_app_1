import React, { useEffect, useState } from 'react';
import {
  Button,
  Datepicker,
  Divider,
  Icon,
  IconElement,
  Input,
  Layout,
  ListItem,
  Text,
  // DatepickerElement
} from '@ui-kitten/components';
import { StyleSheet, Dimensions, ScrollView, Alert, View } from 'react-native';
// import Detail from '../../components/Detail';
// import { router, useLocalSearchParams } from 'expo-router';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import axios from 'axios';
import Config from 'react-native-config';
import Detail from '../../components/admin/Detail';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminStackParams } from '../../../types/admin/navigation';
import AEmployee from '../../components/admin/AEmployee';
// import { Employee, Location } from '../../types';
// import AEmployee from '../../components/AEmployee';

const CalendarIcon = (props: any): IconElement => (
  <Icon {...props} name="calendar" />
);



const AEDelete = ({ empid }: { empid: string }): React.ReactElement => (
  <Button size="tiny" status="danger" appearance="ghost">
    REMOVE
  </Button>
);

const ALDelete = ({
  locationid,
}: {
  locationid: string;
}): React.ReactElement => {
  console.log(locationid);
  return (
    <Button
      size="tiny"
      status="danger"
      appearance="ghost"
      onPress={() => console.log('del locationid', locationid)}
    >
      REMOVE
    </Button>
  );
};

const locationListItem = (item: Location): React.ReactElement => (
  <Layout level="2" key={item.locationid}>
    <Divider />
    <ListItem
      title={item.name}
      description={`lat: ${item.latitude?.substring(0, 10) ?? 'null'} lon: ${
        item.longitude?.substring(0, 10) ?? 'null'
      } `}
      style={{ backgroundColor: 'transparent' }}
      accessoryRight={() => <ALDelete locationid={item.locationid} />}
    />
  </Layout>
);
const employeeListItem = (item: Employee): React.ReactElement => {
  return (
    <View key={item.empid}>
      <Divider />
      <ListItem
        // key={item.empid}
        title={item.name}
        description={`Employee Id: ${item.empid} `}
        accessoryRight={() => <AEDelete empid={item.empid} />}
      />
    </View>
  );
};

type Props = NativeStackScreenProps<AdminStackParams, 'EMPLOYEE_DETAIL'>;

const EmployeeDetailScreen = ({route}:Props): React.JSX.Element => {
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [empid, setEmpid] = useState('');
  const [manager, setManager] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [locations, setLocations] = useState<Array<Location>>([]);
  const [employees, setEmployees] = useState<Array<Employee>>([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [deleteLocation, setDeleteLocation] = React.useState(false);
  const [deleteAssignedEmp, setDeleteAssignedEmp] = React.useState(false);
  const [visibleAE, setVisibleAE] = React.useState(false);
  const [visibleAL, setVisibleAL] = React.useState(false);

  const [date, setDate] = React.useState(new Date());
  const [inTime, setInTime] = React.useState(new Date());
  const [outTime, setOutTime] = React.useState(new Date());
  const [avlLocations, setAvlLocations] = useState<Location[]>([]);

  const AssignLButton = ({
    locationid,
  }: {
    locationid: string;
  }): React.ReactElement => {
    return (
      <Button
        size="tiny"
        status="danger"
        appearance="outline"
        onPress={async () => {
          console.log('delete', locationid);
          await axios
            .post(Config.BASE_URL + 'location/delete.php', {
              locationid,
            })
            .then((res) => {
              console.log('res', res.data);
              if (res.data.status === 0) {
                Alert.alert('Error', res.data.message);
              } else if (res.data.status === 1) {
                Alert.alert('Success', res.data.message);
                setLocations([]);
                setLocations(
                  locations.filter(
                    (location) => location.locationid !== locationid
                  )
                );
              }
            })
            .catch((err) => {
              console.log('err', err);
            });
        }}
      >
        DELETE
      </Button>
    );
  };

  const ALocation = ({
    item,
    index,
  }: {
    item: Location;
    index: number;
  }): React.ReactElement => (
    <ListItem
      key={item.locationid}
      title={item.name}
      description={`lat: ${item.latitude?.substring(0, 10) ?? 'null'} lon: ${
        item.longitude?.substring(0, 10) ?? 'null'
      } `}
      style={{ borderRadius: 10, marginBottom: 10, paddingHorizontal: 15 }}
      accessoryRight={() => <AssignLButton locationid={item.locationid} />}
    />
  );

  useEffect(() => {
    //get employee data from id
    // console.log(id);

    (async () => {
      await axios
        .post(Config.BASE_URL + 'admin/employee/profile.php', {
          empid: route.params.id,
        })
        // .then()
        .then((res) => {
          console.log('profile', res.data);
          // setEmployees(res.data);
          setName(res.data.employee.name);
          setEmail(res.data.employee.email);
          setEmpid(res.data.employee.empid);
          setManager(res.data.employee?.manager ?? 'Not assigned');
          setLastUpdated(res.data.employee.lastupdated);
          setLocations(res.data.locations ?? []);
          setEmployees(res.data.employees ?? []);
          setLatitude(res.data.employee.latitude);
          setLongitude(res.data.employee.longitude);
        })
        .catch((err) => {
          console.log('err', err);
        });
    })();
  }, []);

  // const [date, setDate] = React.useState(new Date());

  const onChangeIn = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setInTime(currentDate);
  };

  const onChangeOut = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setOutTime(currentDate);
  };

  const showModeIn = (currentMode: any) => {
  //   DateTimePickerAndroid.open({
  //     value: inTime,
  //     onChange: onChangeIn,
  //     mode: currentMode,
  //     is24Hour: false,
  //   });
  };

  const showModeOut = (currentMode: any) => {
    // DateTimePickerAndroid.open({
    //   value: outTime,
    //   onChange: onChangeOut,
    //   mode: currentMode,
    //   is24Hour: false,
    // });
  };

  const showTimepickerIn = () => {
    showModeIn('time');
  };
  const showTimepickerOut = () => {
    showModeOut('time');
  };

  const deleteEmployee = async () => {
    await axios
      .post(Config.BASE_URL + 'employee/delete.php', {
        empid,
      })
      .then((res) => {
        console.log('delete', res.data);
        if (res.data.status === 0) {
          Alert.alert('Error', res.data.message);
        } else if (res.data.status === 1) {
          // props.setRefreshEmployee(empid)
          router.back();
          Alert.alert('Success', res.data.message);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  const resetDeviceId = async () => {
    await axios
      .post(Config.BASE_URL + 'employee/reset.php', {
        empid,
      })
      .then((res) => {
        console.log('reset', res.data);
        if (res.data.status === 0) {
          Alert.alert('Error', res.data.message);
        } else if (res.data.status === 1) {
          Alert.alert('Success', res.data.message);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  return (
    <Layout style={{ flex: 1 }}>
      <ScrollView>
        <Layout style={styles.container}>
          <Layout level="1" style={styles.upperDiv}>
            <Detail attribute="Name" value={name ?? 'not set'} />
            <Divider />

            <Detail attribute="Email" value={email ?? 'not set'} />
            <Divider />

            <Detail attribute="Employee Id" value={empid} />
            <Divider />

            <Detail attribute="Manager" value={manager} />
            <Divider />

            {/* make arragements for multiple manager case*/}
            <Detail attribute="Last Updated" value={lastUpdated} />
          </Layout>

          {/* <Button
            status="info"
            appearance="outline"
            size="giant"
            // onPress={() =>
              // router.push(
              //   `/(employee)/employeeLocation?latitude=${latitude}&longitude=${999}`
              // )
            // }
          >
            Last Updated Location
          </Button> */}
          <Datepicker
          
          />
          <Layout level="2" style={styles.attendanceContainer}>
            <Layout style={styles.attendance} level="2">
              <Layout
                level="2"
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text category="s1">IN TIME</Text>
                <Input
                  onFocus={() => showTimepickerIn()}
                  placeholder="Time"
                  value={String(inTime.toLocaleTimeString())}
                />
              </Layout>
              <Layout
                level="2"
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text category="s1">OUT TIME</Text>
                <Input
                  onFocus={() => showTimepickerOut()}
                  placeholder="Time"
                  value={String(outTime.toLocaleTimeString())}
                />
              </Layout>
            </Layout>
            <Layout style={styles.attendance} level="2">
              <Button status="primary" size="medium">
                Mark Attendance
              </Button>
              <Datepicker
                size="large"
                placeholder="Pick Date"
                date={date}
                onSelect={(nextDate) => setDate(nextDate)}
                accessoryRight={CalendarIcon}
              />
            </Layout>
          </Layout>

          {/* <Layout
            level="2"
            style={styles.assignedLocation}
            pointerEvents={deleteLocation ? 'none' : 'auto'}
          >
            <Layout style={styles.assignedLocationTop} level="2">
              <Text category="s1">Assigned Locations</Text>
              <Button accessoryLeft={<Icon name="plus" />} appearance="ghost" />
            </Layout>
            <Divider style={{ backgroundColor: 'darkgray' }} />
            <Layout style={styles.assignedLocationBottom} level="2">
              {locations.length > 0 ? (
                locations.map((item, index) => locationListItem(item))
              ) : (
                <Text
                  category="s1"
                  style={{ textAlign: 'center', marginVertical: 13 }}
                >
                  No locations assigned
                </Text>
              )}
            </Layout>
          </Layout> */}

          {/* <Layout
            level="2"
            style={styles.assignedLocation}
            pointerEvents={deleteAssignedEmp ? 'none' : 'auto'}
          >
            <Layout style={styles.assignedLocationTop} level="2">
              <Text category="s1">Assigned Emloyees To Manage</Text>
              <AEmployee/>
            </Layout>
            <Divider style={{ backgroundColor: 'darkgray' }} />
            <Layout style={styles.assignedLocationBottom} level="2">
              {employees.length > 0 ? (
                employees.map((item, index) => employeeListItem(item))
              ) : (
                <Text
                  category="s1"
                  style={{ textAlign: 'center', marginVertical: 13 }}
                >
                  No employees assigned
                </Text>
              )}
            </Layout>
          </Layout> */}

          <Button
            status="warning"
            appearance="outline"
            size="giant"
            onPress={resetDeviceId}
          >
            Reset Device Id
          </Button>

          <Button
            status="danger"
            appearance="outline"
            size="giant"
            onPress={deleteEmployee}
          >
            Delete Employee
          </Button>
        </Layout>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingVertical: 30,
    gap: 30,
  },
  upperDiv: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
  },
  attendance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  lowerDiv: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 4,
    borderRadius: 10,
  },
  assignedLocation: {
    // alignItems: 'center',
    flex: 1,
    borderRadius: 10,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingBottom: 10,
    position: 'relative',
  },
  assignedLocationTop: {
    flexDirection: 'row',
    // height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
  },
  assignedLocationBottom: {
    borderBottomEndRadius: 7,
    borderBottomStartRadius: 7,
    overflow: 'hidden',
  },
  attendanceContainer: {
    gap: 15,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    alignItems: 'center',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  addLocationContainer: {
    paddingHorizontal: 20,
    gap: 15,
    paddingTop: 20,
    paddingBottom: 7,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: Dimensions.get('window').height * 0.2,
  },
  addLocationContainerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 30,
  },
});

export default EmployeeDetailScreen;
