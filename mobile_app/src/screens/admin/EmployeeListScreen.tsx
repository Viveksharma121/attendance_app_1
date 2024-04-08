import React from 'react';
import {
  Button,
  Icon,
  IconElement,
  Input,
  Layout,
  List,
  ListItem,
  Popover,
  Text,
} from '@ui-kitten/components';
import { StyleSheet, Dimensions, Pressable, Alert } from 'react-native';
// import Detail from '../../components/Detail';
// import { Link, router } from 'expo-router';
import axios from 'axios';
import Config from 'react-native-config';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdminStackParams } from '../../../types/admin/navigation';

interface IListItem {
  empid: string;
  name: string;
}

type Props = NativeStackScreenProps<AdminStackParams, 'EMPLOYEE_LIST'>;

const EmployeeListScreen = ({navigation}:Props) => {
  const [empid, setEmpid] = React.useState('')
  const [employees, setEmployees] = React.useState<Array<IListItem>>([]);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {

    (async () => {
      await axios
        .get(Config.BASE_URL + 'admin/employee/all.php')
        .then((res) => {
          console.log('res', res.data);
          setEmployees(res.data);
        })
        .catch((err) => {
          console.log('err', err);
        });
    })();
  }, []);

  const createEmployee = async () => {
    await axios
      .post(Config.BASE_URL + 'employee/create.php', {
        empid,
      })
      .then((res) => {
        console.log('res', res.data);
        if (res.data.status === 0) {
          Alert.alert('Error', res.data.message);
        } else if (res.data.status === 1) {
          Alert.alert('Success', res.data.message);
          // console.log(res.data);
          setEmployees(res.data.employees);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }

  const renderItemIcon = (props: any): IconElement => (
    <Icon {...props} name="person" />
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: IListItem;
    index: number;
  }): React.ReactElement => (
    // <Link href={'/(employee)/' + item.empid}>
    <ListItem
      title={`${item.name} [${item.empid}]`}
      description={`${item.email} `}
      accessoryLeft={renderItemIcon}
      style={{ borderRadius: 10, marginBottom: 10 }}
      onPress={() => {
        navigation.navigate('EMPLOYEE_DETAIL', {id: item.empid})
        // router.push(`/(employee)/${item.empid}`,);
      }}
    />
    // </Link>
    
  );

  return (
    <Layout style={styles.container} level="2">
      <Popover
        backdropStyle={styles.backdrop}
        visible={visible}
        anchor={() => (
          <Button
            status="success"
            appearance="outline"
            size="giant"
            accessoryRight={<Icon name="person-add" />}
            onPress={() => setVisible(true)}
          >
            Add Employee
          </Button>
        )}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0)', borderWidth: 0 }}
      >
        <Layout style={styles.addLocationContainer}>
          <Input
            placeholder="employee id"
             value={empid} onChangeText={setEmpid}
          />
        
          <Layout style={styles.addLocationContainerButtons}>
            <Button
              status="danger"
              appearance="ghost"
              size="medium"
              onPress={() => setVisible(false)}
            >
              CANCEL
            </Button>
            <Button
              appearance="ghost"
              size="medium"
              onPress={async () => {
                await createEmployee();
                setVisible(false);
              }}
            >
              SUBMIT
            </Button>
          </Layout>
        </Layout>
        {/* <Layout style={styles.content}>        
          <Text category='h1'>Loading</Text>
          <Spinner  size='giant'/>
        </Layout> */}
      </Popover>

      <Layout level="3" style={styles.lowerDiv}>
        <List
          // style={{maxHeight: 192}}
          data={employees}
          renderItem={renderItem}
        />
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 30,
    gap: 30,
  },
  upperDiv: {
    // flex: 1,
    justifyContent: 'space-between',
  },
  details: {},
  upperDivRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  lowerDiv: {
    flex: 4,
    // borderRadius: 10,
    // borderWidth: 0.5,
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


export default EmployeeListScreen;
