import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useForm, Controller } from "react-hook-form";
import {
  GridColDef,
  GridRowModelUpdate,
  useGridApiContext,
  GridRowParams,
} from "@mui/x-data-grid-pro";
import { randomEmail } from "@mui/x-data-grid-generator";
import { DataGridPremium } from "@mui/x-data-grid-premium";
import {
  Grid,
  LinearProgress,
} from "@mui/material";
import {
  CustomToolbar,
  CustomPagination,
} from "./MultiFunctionTable/multiFunTable";

function DetailPanelContent({ row }: { row: Patient }) {
//   const [open, setOpen] = React.useState(false);
  const apiRef = useGridApiContext();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: row,
    mode: "onChange",
  });

  const onSubmit = (data: GridRowModelUpdate) => {
    apiRef.current.updateRows([data]);
    apiRef.current.toggleDetailPanel(row.id);
  };

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

  return (
    <Stack
      sx={{ py: 2, height: "100%", boxSizing: "border-box" }}
      direction="column"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Paper sx={{ background: "#ffff8d", m: "auto", width: "90%", p: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Controller
              control={control}
              name="patient"
              rules={{ required: true }}
              render={({ field, fieldState: { invalid } }) => (
                <TextField
                  label="Patient First name"
                  size="small"
                  error={invalid}
                  required
                  fullWidth
                  {...field}
                />
              )}
            />
          </Grid>

          <Grid item xs={4}>
            <Controller
              control={control}
              name="plName"
              rules={{ required: true }}
              render={({ field, fieldState: { invalid } }) => (
                <TextField
                  label="Patient last name"
                  size="small"
                  error={invalid}
                  required
                  fullWidth
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              control={control}
              name="email"
              rules={{ required: true }}
              render={({ field, fieldState: { invalid } }) => (
                <TextField
                  label="email"
                  size="small"
                  error={invalid}
                  required
                  fullWidth
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Address 1"
              fullWidth
              variant="outlined"
              name="Address 1"
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Address 2"
              fullWidth
              variant="outlined"
              name="Address 2"
              size="small"
            />
          </Grid>
        </Grid>
        <Button
          sx={{ float: "right", m: "1rem" }}
          type="submit"
          variant="contained"
          size="small"
        >
          Save
        </Button>
        {/* <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
          Confirmation
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
             Are you sure ? you want to save  this information.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}   disabled={!isValid} autoFocus>
              Agree
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog> */}
      </Paper>
    </Stack>
  );
}

const columns: GridColDef[] = [
  { field: "id", headerName: "Patient ID" },
  { field: "patient", headerName: "Patient First Name", width: 200 },
  { field: "plName", headerName: "Patient Last Name", width: 200 },
  { field: "email", headerName: "Patient Email", width: 200 },
];

const rows = [
  {
    id: 1,
    patient: "Matheus",
    plName: "Souza",
    email: randomEmail(),
  },
  {
    id: 2,
    patient: "Olivier",
    plName: "Leblanc",
    email: randomEmail(),
  },
  {
    id: 3,
    patient: "Flavien",
    plName: "Dupont",
    email: randomEmail(),
  },
  {
    id: 4,
    patient: "Danail",
    plName: "Ivanov",
    email: randomEmail(),
  },
  {
    id: 5,
    patient: "Alexandre",
    plName: "Brunet",
    email: randomEmail(),
  },
];

type Patient = (typeof rows)[number];

export default function RowFormTable() {
  const getDetailPanelContent = React.useCallback(
    ({ row }: GridRowParams) => <DetailPanelContent row={row} />,
    []
  );

  const getDetailPanelHeight = React.useCallback(() => 240, []);

  return (
    <Box sx={{ height: 500, m: "2rem" }}>
      <DataGridPremium
        columns={columns}
        slots={{
          toolbar: CustomToolbar,
          pagination: CustomPagination,
          loadingOverlay: LinearProgress,
        }}
        rows={rows}
        rowThreshold={0}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
      />
    </Box>
  );
}
