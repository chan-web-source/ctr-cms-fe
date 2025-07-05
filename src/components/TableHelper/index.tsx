import React from 'react';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { FilterMatchMode } from 'primereact/api';
import { DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { ColumnFilterElementTemplateOptions } from 'primereact/column';
import styles from './style.module.css';

type FilterOption = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

interface MultiSelectFilterProps {
  options: FilterOption[];
  field: string;
  filters: DataTableFilterMeta;
  setFilters: (filters: DataTableFilterMeta) => void;
  // filterCallback?: (value: any) => void;
  value: string | null;
  className?: string;
}

interface GlobalSearchProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

// Custom text filter for data table columns
const LocalColumnSearchFilter = (
  filters: DataTableFilterMeta,
  setFilters: (filters: DataTableFilterMeta) => void
) => {
  const Component = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <InputText
          value={options.value || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            options.filterApplyCallback(e.target.value);
            setFilters({
              ...filters,
              [options.field]: {
                value: e?.target?.value ?? null,
                matchMode: FilterMatchMode.CONTAINS,
              },
            });
          }}
          placeholder="Search"
          className="p-inputtext-sm"
          style={{ width: '100%', fontSize: '1.1rem' }}
        />
      </div>
    );
  };
  Component.displayName = 'LocalColumnSearchFilter';
  return Component;
};

// for multi select in data table's filter
const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  options,
  field,
  filters,
  setFilters,
  // filterCallback,
  value,
  className,
}) => {
  const itemTemplate = (option: FilterOption) => {
    return (
      <div className={styles.filterBadge}>
        {option.icon}
        <span className={styles.filterText}>{option.label}</span>
      </div>
    );
  };

  const handleChange = (e: MultiSelectChangeEvent) => {
    // filterCallback(e.value);
    setFilters({
      ...filters,
      [field]: { value: e.value, matchMode: FilterMatchMode.IN },
    });
  };

  return (
    <MultiSelect
      value={Array.isArray(value) ? value : []}
      options={options}
      onChange={handleChange}
      itemTemplate={itemTemplate}
      optionLabel="label"
      placeholder="Any"
      className={`p-column-filter ${className || ''}`}
      maxSelectedLabels={1}
    />
  );
};
MultiSelectFilter.displayName = 'MultiSelectFilter';

const GlobalSearch: React.FC<GlobalSearchProps> = ({ value, onChange, className }) => {
  return (
    <div className={`${styles.searchContainer} ${className || ''}`}>
      <IconField className={styles.searchField}>
        <InputIcon className="pi pi-search" />
        <InputText
          value={value}
          onChange={onChange}
          placeholder="Search..."
          className={styles.searchInput}
        />
      </IconField>
    </div>
  );
};
GlobalSearch.displayName = 'GlobalSearch';

export { MultiSelectFilter, LocalColumnSearchFilter, GlobalSearch };
