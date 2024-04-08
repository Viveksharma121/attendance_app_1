import { Button, Icon, IconElement, Layout, List, ListItem, Popover, Text } from '@ui-kitten/components';
import axios from 'axios';
import React from 'react'
import { Alert, StyleSheet, Dimensions } from 'react-native';
import { Employee } from '../types';
interface IListItem {
  empid: string;
  name: string;
}

export default function AEmployee() {
  const [visibleAE, setVisibleAE] = React.useState(false);
  const [avlEmployees, setAvlEmployees] = React.useState<Employee[]>([])

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
      title={`${item.name}`}
      description={`Employee Id: ${item.empid} `}
      accessoryLeft={renderItemIcon}
      style={{ borderRadius: 10, marginBottom: 10 }}
      onPress={() => {
        // router.push(`/(employee)/${item.empid}`,);
      }}
    />
    // </Link>
  );

  return (
    <Popover
    backdropStyle={styles.backdrop}
    visible={visibleAE}
    anchor={() => (
      <Button
        accessoryLeft={<Icon name="plus" />}
        appearance="ghost"
        onPress={async () => {
          console.log("fckkkk");
          
          await axios.get(Config.BASE_URL + 'employee/all.php').then((res) => {
            console.log('res', res.data);
            // if (res.data.status === 0) {
              // Alert.alert('Error', res.data.message);
            // } else if (res.data.status === 1) {
              setAvlEmployees(res.data)
              setVisibleAE(true)
              console.log("whyyy");
              console.log("avlLoc",avlEmployees);
              
              
            // }
          })
          .catch((err) => {
            console.log('err', err);
          });
          }}
      />
    )}
    style={{ backgroundColor: 'rgba(0, 0, 0, 0)', borderWidth: 0 }}
  >
  
   <Layout style={styles.addLocationContainer}>
    <Text category="s1">Select Employee</Text>
    <List
          // style={{maxHeight: 192}}
          data={avlEmployees}
          renderItem={renderItem}
        />
    <Button
      onPress={() => {
        setVisibleAE(false)
      }}
    >
      Close

    </Button>
   </Layout>
  </Popover>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  addLocationContainer: {
    width: Dimensions.get('window').width * 0.8,

    // paddingHorizontal: 20,
    position: "fixed",
    left:2,
    top:30,

    marginRight:240,
    gap: 15,
    // paddingTop: 20,
    // paddingBottom: 7,
    alignItems: 'center',
    borderRadius: 10,
    // marginTop: Dimensions.get('window').height * 0.2,
  },
  addLocationContainerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 30,
  },
});