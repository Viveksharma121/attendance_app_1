import axios from 'axios';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  reverseGeocodeAsync,
} from 'expo-location';
import { Alert } from 'react-native';

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // Convert distance to meters
  return distance;
}

type Coordinate = {
  latitude: number;
  longitude: number;
};

type Location = Coordinate & { name: string; locationId: string };

function isWithinRadius(
  location: Coordinate,
  coordinate: Coordinate,
  radiusMeters: number
) {
  if (location.latitude == null && location.longitude == null) return true;
  const distance = haversineDistance(
    location.latitude,
    location.longitude,
    coordinate.latitude,
    coordinate.longitude
  );
  return distance <= radiusMeters;
}

const radius = 1000; // Radius in meters

interface LocationResponse {
  status: number;
  address?: string|null;
  latitude?: number;
  longitude?: number;
  message?: string;
}

export default async function checkLocation(
  empid: string
): Promise<LocationResponse> {
  console.log('checking location');

  var result: LocationResponse = {status:0,message:"Unknown error"};
  let { status } = await requestForegroundPermissionsAsync();
  console.log('got location Status');

  if (status !== 'granted') {
    Alert.alert('Error', 'Location permission not granted');
    return { status: 2, message: 'Location permission not granted' };
  }
  console.log('got location permission');
  let location: Coordinate;
  try {
    location = await getCurrentPositionAsync({}).then((res) => {
      console.log(res, 'fck');
      if (res.mocked === true) {
        throw new Error('Mocked location');
      }
      return { longitude: res.coords.longitude, latitude: res.coords.latitude };
    });
  } catch (error:any) {
    console.log(error);
    return { status: 3, message: error.message??'Location not accessible' };
  }
  console.log('getting location');

  console.log('got location');
  await axios
    .get(Config.BASE_URL + `location.php?empid=${empid}`)
    .then(async (res) => {
      console.log(JSON.stringify(location), JSON.stringify(res.data));

      if (res.data.status == 2) {
        const address = await reverseGeocodeAsync(location).then((res) => {
          console.log(res);
          return res[0].name;
        }).catch((err) => {
          console.log(err);
          return null;
        });
        result = {
          status: 1,
          latitude: location.latitude,
          longitude: location.longitude,
          address,
        };
        console.log('no location assigned'); // geocode current location and send to server
      } else if (res.data.status == 1) {
        // console.log("assigned locations", res.data);
        // console.log(res.data.locations);
        // console.log("current location", location.coords);
        let locationArray: Array<Location> = res.data.locations;
        console.log('loc array', locationArray);
        let address = "null";
          if (locationArray.find((loc) => loc.locationId === "1")) {
            console.log('any location');
            
            address = await reverseGeocodeAsync(location).then((res) => {
              console.log(res);
              if (res) {
                return res[0].name +","+res[0].street +","+res[0].city +","+res[0].region +","+res[0].postalCode;
              }
              return "null";
            }).catch((err) => {
              console.log(err);
              return "null";
            });
          } else {
            locationArray = locationArray.filter(
              ({ latitude, longitude }) =>
                isWithinRadius(location, { latitude, longitude }, radius)
            );
            address = locationArray[0]?.name??"null";
          }
       

        if (locationArray.length > 0) {
          
          result = {status:1,
            latitude: location.latitude,
            longitude: location.longitude,
            address,
          };
        } else {
          result = {status:2,message:"You are not in the assigned location"};
        }
      } else {
        console.log(res.data);
        result = {status:0,message:"Unknown error1"};
      }
    })
    .catch((err) => {
      console.log(err);
      result = {status:0,message:"Unknown error2"};
    });
  console.log('location check  result', result);

  return result;
}
