import React from "react";
import { useDemoData } from "@mui/x-data-grid-generator";
import {
  DataGridPremium,
  GridCsvExportOptions,
  GridCsvGetRowsToExportParams,
  GridPagination,
  GridToolbarContainer,
  gridFilteredSortedRowIdsSelector,
  gridPageCountSelector,
  gridPaginatedVisibleSortedGridRowIdsSelector,
  useGridApiContext,
  useGridSelector,
  gridClasses,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid-premium";
import { Button, LinearProgress, TablePaginationProps } from "@mui/material";
import MuiPagination from "@mui/material/Pagination";
import { alpha, styled } from "@mui/material/styles";

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGridPremium)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}));

const getRowsFromCurrentPage = ({ apiRef }: GridCsvGetRowsToExportParams) =>
  gridPaginatedVisibleSortedGridRowIdsSelector(apiRef);

function CustomToolbar() {
  const apiRef = useGridApiContext();
  const handleExport = (options: GridCsvExportOptions) =>
    apiRef.current.exportDataAsCsv(options);

  const handleExportRows = (options: GridCsvExportOptions) =>
    apiRef.current.exportDataAsCsv(options);

  const getRowsWithGroups = ({ apiRef }: GridCsvGetRowsToExportParams) =>
    gridFilteredSortedRowIdsSelector(apiRef);

  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <Button
        onClick={() =>
          handleExport({ getRowsToExport: getRowsFromCurrentPage })
        }
      >
        Export Current page rows
      </Button>
      <Button
        onClick={() => handleExportRows({ getRowsToExport: getRowsWithGroups })}
      >
        Export Rows with groups
      </Button>
      <GridToolbarExport
        printOptions={{ hideFooter: true, hideToolbar: true }}
      />
    </GridToolbarContainer>
  );
}

function Pagination({
  page,
  onPageChange,
  className,
}: Pick<TablePaginationProps, "page" | "onPageChange" | "className">) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event as any, newPage - 1);
      }}
    />
  );
}

function CustomPagination(props: any) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
}

const multiFunTable = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, loading } = useDemoData({
    dataSet: "Employee",
    rowLength: 1000,
    maxColumns: 16,
    treeData: { maxDepth: 2, groupingField: "name", averageChildren: 3 },
  });

  const TableStyles = {
    height: "50rem",
    margin: "3.1rem",
    p: 2,
  };
  return (
    <StripedDataGrid
      sx={TableStyles}
      pagination={true}
      autoPageSize
      slots={{
        toolbar: CustomToolbar,
        pagination: CustomPagination,
        loadingOverlay: LinearProgress,
      }}
      slotProps={{
        toolbar: {
          printOptions: {
            hideFooter: true,
            hideToolbar: true,
          },
        },
      }}
      loading={loading}
      {...data}
      getRowClassName={(params: any) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      pageSizeOptions={[5, 10]}
    />
  );
};

export default multiFunTable;
