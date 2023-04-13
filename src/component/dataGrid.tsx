import Stack from "@mui/material/Stack";
import { USERS } from "./users";
import {
  DataGridPremium,
  GridColDef,
  GridToolbar,
  GridActionsCellItem,
} from "@mui/x-data-grid-premium";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Typography } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';

export default function TablePage() {
  return (
    <Stack sx = {{m:10}} >
      <Typography variant="h4" align="left">Premium Table (Data Grid)</Typography>
      <Typography variant="h6" align="left">Filtering:Column Filtering, Column Swapping, Column Editing</Typography>
      <Typography variant="h6" align="left">Pinning: Column Pinning,Drag & Drop </Typography>
      <Typography variant="h6" align="left">Search : Column search , Global Search</Typography>
      <Typography variant="h6" align="left">Pagination:Multiple option</Typography>
      <Typography variant="h6" align="left">Export: CSV,PDF </Typography>
      <DataGridPremium autoHeight
       experimentalFeatures={{ lazyLoading: true }}
        rows={USERS}
        columns={columns}
        slots={{  loadingOverlay: LinearProgress,toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
          pinnedColumns: { left: ["email"], right: ["actions"] },
        }}
        pagination={true}
     
      />
    </Stack>

  );
}

const columns: GridColDef[] = [
  { field: "id", headerName: "Id" },
  { field: "first_name", headerName: "First Name", width: 200, editable: true },
  { field: "last_name", headerName: "Last Name", width: 200, editable: true },
  { field: "email", headerName: "Email", width: 200 },
  {
    field: "gender",
    headerName: "Gender",
    width: 200,
  },
  { field: "dob", headerName: "Date of Birth", width: 200 },
  { field: "username", headerName: "User Name", width: 200 },
  {
    field: "actions",
    type: "actions",
    headerName: "Actions",
    width: 200,
    getActions: () => [
      <GridActionsCellItem icon={<EditIcon />} label="Edit" />,
      <GridActionsCellItem icon={<DeleteIcon />} label="Delete" />,
    ],
  },
];
