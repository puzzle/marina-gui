import { employee, employees, userEmployee } from './employee.reducer';
import { configuration } from './configuration.reducer';

export * from './employee.actions';
export * from './employee.service';

export const employeeReducers = {
  userEmployee,
  employee,
  employees,
};

export const configurationReducers = {
  configuration,
};
