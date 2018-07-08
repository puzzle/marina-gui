import { userEmployee, employee, employees } from './employee.reducer';

export * from './employee.actions';
export * from './employee.service';

export const employeeReducers = {
  userEmployee,
  employee,
  employees,
};
