import React, { useState } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import styles from './style.module.css';
import { LogManagementData } from '../../../types/management';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

interface LogListProps {
  title: string;
  data: LogManagementData[];
  setData: (data: LogManagementData[]) => void;
  onSearch: (value: string) => void;
  searchValue: string;
  isSearching: boolean;
}

export default function LogList(props: LogListProps) {
  const [selectedLogs, setSelectedLogs] = useState<LogManagementData[]>([]);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    created_at: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    user: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    action: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    entity_type: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    ip_address: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
  });

  const formatTimestamp = (value: string) => {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} - ${hours}:${minutes}:${seconds}`;
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    (_filters['global'] as { value: string | null; matchMode: string }).value = value;
    setFilters(_filters);
    props.onSearch(value);
  };

  const renderHeader = () => {
    return (
      <div className={styles.headerContent}>
        <h2 className={styles.title}>{props.title}</h2>
        <div className={styles.searchContainer}>
          <IconField iconPosition="left">
            <InputIcon className={`pi pi-${props.isSearching ? 'spin pi-spinner' : 'search'}`} />
            <InputText
              value={props.searchValue}
              onChange={onGlobalFilterChange}
              placeholder="Search..."
            />
          </IconField>
        </div>
        <div className={styles.filterContainer}>
          <button className={styles.filterButton}>
            Action
            <i className="pi pi-chevron-down" />
          </button>
          <button className={styles.filterButton}>
            User
            <i className="pi pi-chevron-down" />
          </button>
          <button className={styles.filterButton}>
            Date
            <i className="pi pi-chevron-down" />
          </button>
          <button className={styles.filterButton}>
            Module
            <i className="pi pi-chevron-down" />
          </button>
          <button className={styles.downloadButton}>
            <i className="pi pi-download" />
            Download
          </button>
        </div>
      </div>
    );
  };

  const moduleBodyTemplate = () => {
    return 'Authentication';
  };

  const header = renderHeader();

  return (
    <div className="card">
      <DataTable
        value={props.data}
        paginator
        header={header}
        rows={10}
        scrollable
        scrollHeight="flex"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]}
        dataKey="id"
        selectionMode="checkbox"
        selection={selectedLogs}
        onSelectionChange={(e) => {
          const logs = e.value as LogManagementData[];
          setSelectedLogs(logs);
        }}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={['created_at', 'first_name', 'action', 'entity_type', 'ip_address']}
        emptyMessage="No logs found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        resizableColumns
        columnResizeMode="fit"
        className={styles.tableStyle}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: '3rem' }}
          style={{ textAlign: 'center' }}
        />
        <Column
          field="created_at"
          header="Timestamp"
          sortable
          filter
          filterField="created_at"
          filterPlaceholder="Search by timestamp"
          body={(rowData) => formatTimestamp(rowData.created_at)}
          style={{ minWidth: '200px' }}
        />
        <Column
          field="first_name"
          header="User"
          sortable
          filter
          filterField="user"
          filterPlaceholder="Search by user"
          style={{ minWidth: '150px' }}
        />
        <Column
          field="action"
          header="Action"
          sortable
          filter
          filterPlaceholder="Search by action"
          style={{ minWidth: '150px' }}
        />
        <Column
          header="Module"
          sortable
          filter
          filterPlaceholder="Search by module"
          body={moduleBodyTemplate}
          style={{ minWidth: '150px' }}
        />
        <Column
          field="ip_address"
          header="IP Address"
          sortable
          filter
          filterPlaceholder="Search by IP"
          style={{ minWidth: '150px' }}
        />
      </DataTable>
    </div>
  );
}
