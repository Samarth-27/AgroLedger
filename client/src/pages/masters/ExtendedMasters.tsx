import { GenericMasterGrid } from '../../components/GenericMasterGrid';
import {
  brokerHooks, transportHooks, vehicleHooks, labourHooks,
  expenseCategoryHooks, accountHeadHooks, bankHooks,
  financialYearHooks, systemSettingHooks
} from '../../hooks/useExtendedMasters';
import {
  BrokerSchema, TransportSchema, VehicleSchema, LabourSchema,
  ExpenseCategorySchema, AccountHeadSchema, BankSchema,
  FinancialYearSchema, SystemSettingSchema
} from '@mandi-erp/shared';

export const BrokerList = () => (
  <GenericMasterGrid
    title="Broker"
    schema={BrokerSchema}
    hooks={brokerHooks}
    columns={[
      { key: 'code', label: 'Code', type: 'text', hideInForm: true },
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'mobile', label: 'Mobile', type: 'text' },
      { key: 'brokerageRate', label: 'Brokerage Rate (%)', type: 'number' },
    ]}
  />
);

export const TransportList = () => (
  <GenericMasterGrid
    title="Transport"
    schema={TransportSchema}
    hooks={transportHooks}
    columns={[
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'mobile', label: 'Mobile', type: 'text' },
    ]}
  />
);

export const VehicleList = () => (
  <GenericMasterGrid
    title="Vehicle"
    schema={VehicleSchema}
    hooks={vehicleHooks}
    columns={[
      { key: 'vehicleNumber', label: 'Vehicle Number', type: 'text' },
      { key: 'transportId', label: 'Transport ID', type: 'text' },
    ]}
  />
);

export const LabourList = () => (
  <GenericMasterGrid
    title="Labour"
    schema={LabourSchema}
    hooks={labourHooks}
    columns={[
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'type', label: 'Type', type: 'select', options: ['PALLEDAR', 'HAMAL', 'TULAI'] },
      { key: 'rate', label: 'Rate / Unit', type: 'number' },
    ]}
  />
);

export const ExpenseCategoryList = () => (
  <GenericMasterGrid
    title="Expense Category"
    schema={ExpenseCategorySchema}
    hooks={expenseCategoryHooks}
    columns={[
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'description', label: 'Description', type: 'text' },
    ]}
  />
);

export const AccountHeadList = () => (
  <GenericMasterGrid
    title="Account Head"
    schema={AccountHeadSchema}
    hooks={accountHeadHooks}
    columns={[
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'type', label: 'Type', type: 'select', options: ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'] },
    ]}
  />
);

export const BankList = () => (
  <GenericMasterGrid
    title="Bank"
    schema={BankSchema}
    hooks={bankHooks}
    columns={[
      { key: 'name', label: 'Bank Name', type: 'text' },
      { key: 'accountNumber', label: 'Account Number', type: 'text' },
      { key: 'ifsc', label: 'IFSC Code', type: 'text' },
      { key: 'branch', label: 'Branch', type: 'text' },
    ]}
  />
);

export const FinancialYearList = () => (
  <GenericMasterGrid
    title="Financial Year"
    schema={FinancialYearSchema}
    hooks={financialYearHooks}
    columns={[
      { key: 'name', label: 'Financial Year (e.g. 2026-2027)', type: 'text' },
      { key: 'startDate', label: 'Start Date (YYYY-MM-DD)', type: 'text' },
      { key: 'endDate', label: 'End Date (YYYY-MM-DD)', type: 'text' },
      { key: 'isActive', label: 'Is Active', type: 'boolean' },
    ]}
  />
);

export const SystemSettingList = () => (
  <GenericMasterGrid
    title="System Setting"
    schema={SystemSettingSchema}
    hooks={systemSettingHooks}
    columns={[
      { key: 'key', label: 'Setting Key', type: 'text' },
      { key: 'value', label: 'Value', type: 'text' },
      { key: 'description', label: 'Description', type: 'text' },
    ]}
  />
);
