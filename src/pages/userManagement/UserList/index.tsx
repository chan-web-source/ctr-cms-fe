import React, { useState, useEffect } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { AiOutlineEye } from 'react-icons/ai';
import { BiEditAlt } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import styles from './style.module.css';
import { UserManagementData } from '../../../types/management';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { ReactComponent as ExternalUserIcon } from '../../../assets/Icons/Table/List of Users/Account Type/External.svg';
import { ReactComponent as InternalUserIcon } from '../../../assets/Icons/Table/List of Users/Account Type/Internal.svg';
import { ReactComponent as ActiveStatusIcon } from '../../../assets/Icons/Table/List of Users/Account Status/Active.svg';
import { ReactComponent as InactiveStatusIcon } from '../../../assets/Icons/Table/List of Users/Account Status/Inactive.svg';
import {
  MultiSelectFilter,
  LocalColumnSearchFilter,
  GlobalSearch,
} from '../../../components/TableHelper';
import { formatTableDate } from '../../../utils/date';

interface UserListProps {
  title: string;
  data: UserManagementData[];
  setData: (data: UserManagementData[]) => void;
}

export default function UserList(props: UserListProps) {
  const [selectedUsers, setSelectedUsers] = useState<UserManagementData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const accountTypeOptions = [
    {
      label: 'Internal',
      value: 'Internal',
      icon: <InternalUserIcon className={styles.accountTypeIcon} />,
    },
    {
      label: 'External',
      value: 'External',
      icon: <ExternalUserIcon className={styles.accountTypeIcon} />,
    },
  ];
  const statusOptions = [
    { label: 'Active', value: 'Active', icon: <ActiveStatusIcon className={styles.statusIcon} /> },
    {
      label: 'Inactive',
      value: 'Inactive',
      icon: <InactiveStatusIcon className={styles.statusIcon} />,
    },
  ];
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    first_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    surname: { value: null, matchMode: FilterMatchMode.CONTAINS },
    division: { value: null, matchMode: FilterMatchMode.CONTAINS },
    role: { value: null, matchMode: FilterMatchMode.CONTAINS },
    account_status: { value: null, matchMode: FilterMatchMode.CONTAINS },
    account_type: { value: null, matchMode: FilterMatchMode.CONTAINS },
    last_login: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  useEffect(() => {
    setLoading(false);
  }, []);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    (_filters['global'] as { value: string | null; matchMode: string }).value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const AccountColumnBody = (rowData: UserManagementData) => {
    const Icon = rowData.account_type === 'Internal' ? InternalUserIcon : ExternalUserIcon;
    return (
      <div className={styles.accountTypeBadge}>
        <Icon className={styles.accountTypeIcon} />
        <span className={styles.accountTypeText}>{rowData.account_type}</span>
      </div>
    );
  };

  const AccountColumnFilter = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <MultiSelectFilter
        options={accountTypeOptions}
        field="account_type"
        filters={filters}
        setFilters={setFilters}
        // filterCallback={options.filterCallback}
        value={options?.value ?? null}
        className={styles.accountTypeFilter}
      />
    );
  };

  const StatusColumnFilter = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <MultiSelectFilter
        options={statusOptions}
        field="account_status"
        filters={filters}
        setFilters={setFilters}
        // filterCallback={options.filterCallback}
        value={options?.value ?? null}
      />
    );
  };

  const StatusColumnBody = (rowData: UserManagementData) => {
    const Icon = rowData.account_status === 'Active' ? ActiveStatusIcon : InactiveStatusIcon;
    return (
      <div className={styles.accountTypeBadge}>
        <Icon className={styles.accountTypeIcon} />
        <span className={styles.accountTypeText}>{rowData.account_status}</span>
      </div>
    );
  };

  const UserBodyColumn = (rowData: UserManagementData) => {
    return (
      <div className={styles.mainContent}>
        <span className={styles.userName}>{`${rowData.first_name} ${rowData.surname}`}</span>
      </div>
    );
  };

  const ActionBodyColumn = () => {
    return (
      <div className={styles.actionContent}>
        <AiOutlineEye className="cursor-pointer text-gray-600" size={20} />
        <BiEditAlt className="cursor-pointer text-gray-600" size={20} />
        <BsThreeDotsVertical className="cursor-pointer text-gray-600" size={20} />
      </div>
    );
  };

  const RenderHeader = () => {
    return (
      <div className={styles.headerContent}>
        <h2 className={styles.title}>{props.title}</h2>
        <div className={styles.searchActions}>
          <GlobalSearch value={globalFilterValue} onChange={onGlobalFilterChange} />
          <button className={styles.createButton}>
            <i className="pi pi-plus" />
            Create new user
          </button>
        </div>
      </div>
    );
  };

  const header = RenderHeader();
  return (
    <div className="card">
      <DataTable
        value={props.data}
        paginator
        header={header}
        rows={10}
        scrollable
        scrollHeight="flex"
        loading={loading}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]}
        dataKey="id"
        selectionMode="checkbox"
        selection={selectedUsers}
        onSelectionChange={(e) => {
          const users = e.value as UserManagementData[];
          setSelectedUsers(users);
        }}
        filters={filters}
        onFilter={(e) => setFilters(e.filters)}
        filterDisplay="row"
        globalFilterFields={[
          'name',
          'first_name',
          'surname',
          'division',
          'role',
          'representative',
          'account_type',
          'last_login',
        ]}
        emptyMessage="No users found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        resizableColumns
        columnResizeMode="fit"
        className={styles.tableStyle}
        showGridlines
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
        <Column
          field="first_name"
          header="User"
          body={UserBodyColumn}
          sortable
          sortField="first_name"
          filter
          filterField="first_name"
          filterElement={LocalColumnSearchFilter(filters, setFilters)}
          style={{ minWidth: '250px' }}
          showFilterMenu={false}
          filterMatchMode={FilterMatchMode.CONTAINS}
        />
        <Column
          field="division"
          header="Division"
          style={{ minWidth: '150px' }}
          filter
          filterField="division"
          filterElement={LocalColumnSearchFilter(filters, setFilters)}
          showFilterMenu={false}
          sortable
          filterMatchMode={FilterMatchMode.CONTAINS}
        />
        <Column
          field="role"
          header="Role"
          style={{ minWidth: '150px' }}
          filter
          filterField="role"
          filterElement={LocalColumnSearchFilter(filters, setFilters)}
          showFilterMenu={false}
          sortable
          filterMatchMode={FilterMatchMode.CONTAINS}
        />
        <Column
          field="account_status"
          header="Status"
          sortable
          filter
          filterField="account_status"
          filterElement={StatusColumnFilter}
          body={StatusColumnBody}
          style={{ minWidth: '150px' }}
          showFilterMenu={false}
          filterMatchMode={FilterMatchMode.IN}
        />
        <Column
          field="account_type"
          header="Account Type"
          sortable
          filter
          filterField="account_type"
          filterElement={AccountColumnFilter}
          body={AccountColumnBody}
          style={{ minWidth: '150px' }}
          showFilterMenu={false}
          filterMatchMode={FilterMatchMode.IN}
        />
        <Column
          field="last_login"
          header="Last Login"
          sortable
          filterField="last_login"
          // filter
          // filterElement={LocalColumnSearchFilter(filters, setFilters)}
          body={(rowData) => formatTableDate(rowData.last_login)}
          style={{ minWidth: '150px' }}
          showFilterMenu={false}
          filterMatchMode={FilterMatchMode.CONTAINS}
        />
        <Column
          body={ActionBodyColumn}
          headerStyle={{ width: '120px' }}
          bodyStyle={{ textAlign: 'center' }}
        />
      </DataTable>
    </div>
  );
}
