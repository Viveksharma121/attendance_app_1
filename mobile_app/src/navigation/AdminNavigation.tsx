import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AdminHome from '../screens/admin/AdminHomeScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import BottomTabBar from '../components/BottomBar'
import { AdminStackParams } from '../../types/admin/navigation'
import EmployeeListScreen from '../screens/admin/EmployeeListScreen'
import EmployeeDetailScreen from '../screens/admin/EmployeeDetailScreen'

const AdminStack = createNativeStackNavigator<AdminStackParams>()
// const AdminStack = createBottomTabNavigator()
const AdminNavigation = () => {
  return (
    <AdminStack.Navigator screenOptions={{}}>
      <AdminStack.Screen name="ADMIN_HOME" component={AdminHome} options={{headerShown:false}}/>
      <AdminStack.Screen name="EMPLOYEE_LIST" component={EmployeeListScreen}  options={{headerTitle:"Employees List"}}/>
      <AdminStack.Screen name="EMPLOYEE_DETAIL" component={EmployeeDetailScreen} options={{headerTitle:"Employee Detail"}}/>
    </AdminStack.Navigator>
  )
}

export default AdminNavigation