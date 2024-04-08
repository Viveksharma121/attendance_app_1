import React, {useCallback, useMemo} from 'react';
import {
  Button,
  Layout,
  Text,
  Calendar,
  Select,
  SelectItem,
  IndexPath,
  Divider,
  List,
  ListItem,
} from '@ui-kitten/components';
import axios from 'axios';
import Config from 'react-native-config';
import { Record } from '../../../types/employee/attendance';
import { Alert, ScrollView } from 'react-native';
import { timeFormat } from '../../utils/timeFormat';

const years = [
  '2024',
  '2025',
  '2026',
  '2027',
  '2028',
  '2029',
  '2030',
  '2031',
  '2032',
  '2033',
  '2034',
  '2035',
  '2036',
  '2037',
  '2038',
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July ',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const monthNo = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  'July ': 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const RecordItem = ({item, index}: {item: Record; index: number}) => (
  <ListItem
    title={new Date(item.date).toDateString()}
    description={`${timeFormat(item.intime)} - ${timeFormat(item.outtime)}`}
  />
);

const AttendanceScreen = () => {
  const [selectedYearIndex, setSelectedYearIndex] = React.useState<IndexPath>(
    new IndexPath(0),
  );
  const displayValueYear = years[selectedYearIndex.row];

  const [selectedMonthIndex, setSelectedMonthIndex] = React.useState<IndexPath>(
    new IndexPath(0),
  );
  const displayValueMonth = months[selectedMonthIndex.row];
  const [initialLoad, setInitialLoad] = React.useState(true);

  const [records, setRecords] = React.useState<Record[]>([])


  const getAttendance = useMemo(() => {
    return async () => {
      const year = years[selectedYearIndex.row];
      const month = selectedMonthIndex.row + 1;
      
      await axios.get(`${Config.BASE_URL}employee/attendance/get.php?year=${year}&month=${month}`).
      then(res => res.data).
      then(res => {
        // console.log(res);
        if (res.status === 0) {
          Alert.alert('Error', res.message ?? 'Something went wrong');
          return;
        } else if (res.status === 1) {
        setRecords(res.records)
        // records.push(...res.records)
        // records.push(...res.records)
        // records.push(...res.records)
        // records.push(...res.records)
        // records.push(...res.records)
        // records.push(...res.records)
        // records.push(...res.records)
        // console.log(records.length);
        // setRecords(records)
        }
      })
    };
  }, [selectedYearIndex, selectedMonthIndex]);

  React.useEffect(() => {
    if (initialLoad) {
      const date = new Date();
      setSelectedYearIndex(new IndexPath(date.getFullYear() - 2024));
      setSelectedMonthIndex(new IndexPath(date.getMonth()));
      setInitialLoad(false);
    } else {
      getAttendance()
    };
  }, [selectedYearIndex, selectedMonthIndex]);

  return (
    <Layout
      style={{
        padding: 20,
        // gap: 15,
        flex: 1,
      }}>
      <Text status='primary' category='label' style={{
        marginBottom: 10,
        marginLeft: 5
      }}>Select Year</Text>
      <Select
        selectedIndex={selectedYearIndex}
        onSelect={index => setSelectedYearIndex(new IndexPath(Number(index)-1))}
        value={displayValueYear}>
        {years.map((item, index) => (
          <SelectItem key={index} title={item} />
        ))}
      </Select>
      <Text status='primary' category='label' style={{
        marginBottom: 10,
        marginTop: 20,
        marginLeft: 5
      }}>Select Month</Text>
      <Select
        selectedIndex={selectedMonthIndex}
        onSelect={index => setSelectedMonthIndex(new IndexPath(Number(index)-1))}
        value={displayValueMonth}>
        {months.map((item, index) => (
          <SelectItem key={index} title={item} />
        ))}
      </Select>
      <Divider />
      {/* <ScrollView> */}
      
        <List data={records} renderItem={RecordItem} style={{
          marginTop: 20,
          // marginBottom: 20
        }}/>
      {/* </ScrollView> */}
    </Layout>
  );
};

export default AttendanceScreen;
