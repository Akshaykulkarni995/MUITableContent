import {
    DataGridPro,
    GridCellEditStopParams,
    GridCellEditStopReasons, MuiEvent,GridToolbar
  } from '@mui/x-data-grid-pro';

import React from 'react'

type rowsCol = {
    rows:any,
    columns:any,
    loading:any,
    sx:any
}

const dataTable: React.FC<rowsCol> = ({rows,columns,loading,sx}) => {
 
  return (
   <DataGridPro sx={sx}
    columns={columns}
    rows={rows}
    rowReordering
    loading={loading}
    // checkboxSelection
    slots={{ toolbar: GridToolbar }}
    sortingOrder={['asc', 'desc', null]}
    initialState={{
      sorting: {
        sortModel: [
          {
            field: 'title',
            sort: 'asc',
          },
        ],
        
      },
    }}
    pagination = {true}
    autoPageSize
    onCellEditStop={(params: GridCellEditStopParams, event: MuiEvent) => {
      if (params.reason === GridCellEditStopReasons.cellFocusOut) {
        event.defaultMuiPrevented = true;
      }
    }}
    isCellEditable={(params) => params.row.id === 5}
    disableMultipleColumnsFiltering
    pageSizeOptions={[10]}
    slotProps={{
      toolbar: {
        showQuickFilter: true,
        quickFilterProps: { debounceMs: 500 },
      },
    }}
   ></DataGridPro>
  )
}

export default dataTable
