import React from 'react';
import {
  Avatar,
  Button,
  Icon,
  IconElement,
  Input,
  Layout,
  List,
  ListItem,
  Popover,
  Spinner,
  Text,
} from '@ui-kitten/components';
import { StyleSheet, Dimensions, Pressable, View, Alert } from 'react-native';
import Detail from '../components/Detail';
import { router } from 'expo-router';
import axios from 'axios';

interface Location {
  locationid: string;
  name: string;
  latitude: string;
  longitude: string;
}

const Page = () => {
  let change = 0;
  const [visible, setVisible] = React.useState(false);
  const [locations, setLocations] = React.useState<Array<Location>>([]);
  const [name, setName] = React.useState<string>('');
  const [coordinates, setCoordinates] = React.useState<string>('');

  const createLocation = async (name:string,coordinates:string) => {
    await axios
      .post(Config.BASE_URL + 'location/create.php', {
        name,
        latitude: coordinates.split(',')[0],
        longitude: coordinates.split(',')[1],
      })
      .then((res) => {
        console.log('res', res.data);
        if (res.data.status === 0) {
          Alert.alert('Error', res.data.message);
        } else if (res.data.status === 1) {
          Alert.alert('Success', res.data.message);
          // console.log(res.data);
          
          setLocations(res.data.locations);
          
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }

  const DeleteButton = ({locationid}:{locationid:string}): React.ReactElement => {
    return (
      <Button size="tiny" status="danger" appearance="outline" 
      onPress={async () => {
        console.log('delete',locationid);
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
              setLocations([])
              setLocations(
                locations.filter((location) => location.locationid !== locationid)
              );
              change++;
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

  const renderItem = ({
    item,
    index,
  }: {
    item: Location;
    index: number;
  }): React.ReactElement => (
    <ListItem
      key={item.locationid}
      title={item.name}
      description={`lat: ${
        item.latitude?.substring(0, 10) ?? 'null'
      } lon: ${item.longitude?.substring(0, 10) ?? 'null'} `}
      style={{ borderRadius: 10, marginBottom: 10, paddingHorizontal: 15 }}
      accessoryRight={() => <DeleteButton locationid={item.locationid} />}
    />
  );

  React.useEffect(() => {
    (async () => {
      await axios
        .get(Config.BASE_URL + 'location/all.php')
        .then((res) => {
          console.log('res', res.data);
          if (res.data.status === 0) {
            Alert.alert('Error', res.data.message);
          } else if (res.data.status === 1) {
            setLocations(res.data.locations);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    })();
  }, [change]);

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
            onPress={() => setVisible(true)}
          >
            Add Location
          </Button>
        )}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0)', borderWidth: 0 }}
      >
        <Layout style={styles.addLocationContainer}>
          {/* <Text category='h5' 
         >
            Enter Coordinates
          </Text> */}
          <Input placeholder="name" value={name} onChangeText={setName} />
          <Input
            placeholder="co-ordinates"
            value={coordinates}
            onChangeText={setCoordinates}
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
              onPress={() => {
                // console.log('name', name);
                // console.log('coordinates', coordinates.split(','));
                const [latitude,longitude] = coordinates.split(',');
                createLocation(name, coordinates)
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
          style={{ borderRadius: 11 }}
          data={locations}
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
    paddingBottom: 100,
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
    // flex: 4,
    // borderRadius: 10,
    // borderWidth: 0.5,
    maxHeight: Dimensions.get('window').height * 0.65,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 25,
    paddingHorizontal: 12,
    paddingVertical: 14,
    // backgroundColor: 'rgba(0, 0, 0, 0)',
    borderRadius: 20,
  },
  avatar: {
    marginHorizontal: 4,
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

export default Page;
