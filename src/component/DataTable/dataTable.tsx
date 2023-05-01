import {
    DataGridPro,
    MuiEvent,GridToolbar,DataGridProProps,
  } from '@mui/x-data-grid-pro';

import React from 'react'

type rowsCol = {
    rows:any,
    columns:any,
    loading:any,
    sx:any
}

const getTreeDataPath: DataGridProProps['getTreeDataPath'] = (row) => row.hierarchy;


const dataTable: React.FC<rowsCol> = ({rows,columns,loading,sx}) => {
  return (
   <DataGridPro sx={sx}
    columns={columns}
    rows={rows}
    rowReordering
    loading={loading}
    slots={{ toolbar: GridToolbar }}
    sortingOrder={['asc', 'desc', null]}
    pagination = {true}
    autoPageSize
    isCellEditable={(params) => params.row.id === 5}
    disableMultipleColumnsFiltering
    pageSizeOptions={[10]}
    slotProps={{
      toolbar: {
        showQuickFilter: true,
        quickFilterProps: { debounceMs: 500 },
      },
    }}
    getTreeDataPath={getTreeDataPath}
   ></DataGridPro>
  )
}

export default dataTable
