import React from 'react';
import HomeHeader from '../../components/admin/HomeHeader';
import { ButtonGroup, Divider, Icon, Layout, Text, Button } from '@ui-kitten/components';
import {
  StyleSheet,
  Dimensions,
  Pressable,
  ImageBackground,
  ImageProps,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminStackParams } from '../../../types/admin/navigation';

interface Section {
  title: string;
  icon: string;
  path: '/(employee)' | '/location' | '/attendance';
}

const sections: Section[] = [
{
  title: 'Employee',
  icon: 'people-outline',
  path: '/(employee)',
},
{
  title: 'Location',
  icon: 'map-outline',
  path: '/location',
},
{
  title: 'Attendance',
  icon: 'file-text-outline',
  path: '/attendance',

}
]

type Props = NativeStackScreenProps<AdminStackParams, 'ADMIN_HOME'>;

const AdminHome = ({navigation}:Props) => {
  const employeeRef = React.useRef<Icon<Partial<ImageProps>>>(null);
  const locationRef = React.useRef<Icon<Partial<ImageProps>>>(null);
  const attendanceRef = React.useRef<Icon<Partial<ImageProps>>>(null);
  // const infiniteAnimationIconRef = React.useRef<Icon<Partial<ImageProps>>>();
  // const noAnimationIconRef = React.useRef();

  // React.useEffect(() => {
  //   infiniteAnimationIconRef.current?.startAnimation();
  // }, []);
  return (
    <Layout style={styles.container} level="1">
      <Text category="h4" style={{ marginVertical: 12, fontStyle:'italic' }}
      // appearance='primary'
      status='primary'
      >
        STATS
      </Text>
      <Layout style={{
        elevation: 10,
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
        // marginTop: 10,
      }}
      
      level="2"
      >
        <Text category="h6">Today</Text>
        <Text category="s2">Punched In:</Text>
        <Text category="s2">Punched Out:</Text>
        <Text category="s1">Total Hours:</Text>
        <Divider />
        <Text category="h6">This Month</Text>
        <Text category="s2">Punched In:</Text>
        <Text category="s2">Punched Out:</Text>

      </Layout>
      <Text category="h4" style={{ marginVertical: 12, fontStyle:'italic' }}
      status='primary'
      >
        MANAGE
      </Text>
      <Layout style={{
        elevation: 10,
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
        // marginTop: 10,
      }}>
          <Button
            onPress={() => navigation.navigate('EMPLOYEE_LIST')}
            accessoryRight={(props) => (
              <Icon
                {...props}
                // ref={employeeRef}
                name="people-outline"
                // style={styles.iconContainer}
              />
            )}
            appearance='ghost'
            size='giant'
          >
            <Text>Employee</Text>
          </Button>

              <Divider />

          <Button
            // ref={locationRef}
            onPress={() => navigation.navigate('ADMIN_ATTENDANCE')}
            accessoryRight={(props) => (
              <Icon
                {...props}
                // ref={locationRef}
                name="file"
                // style={styles.iconContainer}
              />
            )}
            appearance='ghost'
            size='giant'
          >
            <Text>Attendance</Text>
          </Button>
       
      </Layout>
      <Button
      onPress={async () => {
        await AsyncStorage.clear();
        navigation.replace('AUTH_NAVIGATION');
      }}
      >
        <Text>
          logout
        </Text>
      </Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 10,
    // gap: 10,
  },
  main: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  box: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').width * 0.35,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 20,
    paddingLeft: 30,
  },
  // i want a round container for the icon with whitish background and somewhat transparent
  iconContainer: { 
    width: 60, 
    height: 50, 
    tintColor: 'rgba(255,255,255,0.8)' 
  },
  boxContainer: {
    overflow: 'hidden',
    borderRadius: 20,
  },
});

export default AdminHome;
