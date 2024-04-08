export function timeFormat (timeStr: string) {
  let time: any = timeStr.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [timeStr];

  if (time.length > 1) { // If time format correct
    
    time = time.slice (1);  // Remove full string match value
    time.pop(2)
    time.push(' ')
    time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
    
  }
  return time.join (''); // return adjusted time or original string
}
