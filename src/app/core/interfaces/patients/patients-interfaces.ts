
export interface modifyPatientInterface {
  firstname: string;
  lastname: string;
  gender: string;
  city: null | string;
  email: null | string;
  assignedDoctor: string;
  phone: number;
}

export interface patientsInterfaces extends modifyPatientInterface {
  dni: string;
}