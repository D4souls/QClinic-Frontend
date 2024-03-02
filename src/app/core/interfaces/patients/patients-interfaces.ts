
export interface modifyPatientInterface {
  firstname: string;
  lastname: string;
  gender: string;
  city: null | string;
  email: null | string;
  assignedDoctor: string;
  phone: number;
}

export interface patientsInterfaces {
  dni: string;
  firstname: string;
  lastname: string;
  city: null | string;
  email: null | string;
  doctorName: string;
}