import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


export default async  function checkAuth() : Promise<number> {
  /**
   * Check if the user is authenticated
   * @returns 0 if the user is not authenticated, 1 if the user is authenticated, 2 if the user is an admin
   */
const token = await AsyncStorage.getItem('token');

  if (token !== null) {
    const isAdmin = await AsyncStorage.getItem('isAdmin');
    axios.defaults.headers.common['Authorization'] = token;

    if (Number(isAdmin) === 1) return 2;

    return 1;
  }  

  return 0;
}