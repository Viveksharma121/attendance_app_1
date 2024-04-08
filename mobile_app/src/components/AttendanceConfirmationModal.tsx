import React from 'react'
import { Portal, Text } from 'react-native-paper';
import { AttendanceState } from '../../types/employee/attendance';

const AttendanceConfirmationModal = ({visible, attendanceState, punchIn, punchOut,setVisible,}:{visible:boolean, attendanceState: AttendanceState}) => {
  return (
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
        dismissable
        >
        <Card disabled={true} style={{
          padding: 20
        }}>
          <Text variant='titleLarge'  style={{marginVertical: 10}}>
            Alert
          </Text>
          <Text >
            Are you sure you want to{' '}
            {attendanceState?.status === 0 ? 'punch in' : 'punch out'}?
          </Text>
          <View style={styles.modalSurface}>
            <Button
              mode="ghost"
              size="large"
              onPress={async () => {
                if (attendanceState?.status === 0)
                  await punchIn(loadAttendanceState);
                else await punchOut(loadAttendanceState);
                setVisible(false);
              }}>
              Yes
            </Button>
            <Button
              mode="ghost"
              size="large"
              
              onPress={() => setVisible(false)}>
              No
            </Button>
          </View>
        </Card>
      </Modal>
      </Portal>
  )
}

export default AttendanceConfirmationModal