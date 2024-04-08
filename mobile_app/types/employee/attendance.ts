export type AttendanceState = {
  status: 0 | 1 | 2| 3;
  data?: {
    date: string;
    intime: string;
    outtime: string;
    inlocation: string;
    outlocation: string;
    inlocationlat: string;
    inlocationlon: string;
    outlocationlat: string;
    outlocationlon: string;
  };
} ;

export type Record = {
  date: string;
  intime: string;
  outtime: string;
  inlocation: string;
  outlocation: string;
};