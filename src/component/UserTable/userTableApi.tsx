import React,{useEffect,useState} from 'react'
import DataTable from "../DataTable/dataTable"
import {
  DataGridPro,
  GridColDef,
  GridRowsProp,
  GridActionsCellItem,
  GridCellEditStopParams,
  GridCellEditStopReasons,
} from '@mui/x-data-grid-pro';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const columns: GridColDef[] = [
  {field:'id',headerName:"User ID",width:150,editable: true,},
  {field:'title',headerName:"Name",width:150,editable: true,},
  {field:'body',headerName:"Description",minWidth:150,flex:1,editable: true,},
  {
    field: 'actions',
    type: 'actions',
    width: 100,
    getActions: () => [
      <GridActionsCellItem icon={<EditIcon />} label="Edit" />,
      <GridActionsCellItem icon={<DeleteIcon />} label="Delete" />,
    ],
  },
];
const TableStyles = {
  height:"50rem",
  margin:"3.1rem",
  p:2
  
}

const userTableApi = () => {
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [users, setUsers] = useState([])

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(()=>{
        fetch('https://jsonplaceholder.typicode.com/posts')
        .then((response) => response.json())
        .then((json)=>setUsers(json))

    },[])

  return (
    <DataTable 
    sx={TableStyles}
    rows={users}
    columns={columns}
    loading={!users.length} 
    ></DataTable>
  )
}

export default userTableApi
