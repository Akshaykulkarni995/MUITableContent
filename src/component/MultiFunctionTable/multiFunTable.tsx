import React from 'react'
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const multiFunTable = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, loading } = useDemoData({
        dataSet: 'Employee',
        rowLength: 1000,
        treeData: { maxDepth: 2, groupingField: 'name', averageChildren: 10 },
      });

      const TableStyles = {
        height:"50rem",
        margin:"3.1rem",
        p:2
        
      }
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro 
      sx={TableStyles}
      pagination = {true}
      autoPageSize
      slots={{ toolbar: GridToolbar }}
      loading={loading} 
      {...data} 
      pageSizeOptions={[10]}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
        },
      }}
      
      />
    </div>
  )
}

export default multiFunTable
