import React from "react";
import { useDemoData } from "@mui/x-data-grid-generator";
import {
  DataGridPremium,
  gridClasses,
  GridCsvExportOptions,
  GridCsvGetRowsToExportParams,
  gridFilteredSortedRowIdsSelector,
  GridInitialState,
  gridPageCountSelector,
  gridPaginatedVisibleSortedGridRowIdsSelector,
  GridPagination,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid-premium";
import {
  Box,
  Button,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  LinearProgress,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  TablePaginationProps,
  TextField,
} from "@mui/material";
import MuiPagination from "@mui/material/Pagination";
import { alpha, styled } from "@mui/material/styles";

const ODD_OPACITY = 0.2;

interface StateView {
  label: string;
  value: GridInitialState;
}

interface DemoState {
  views: { [id: string]: StateView };
  newViewLabel: string;
  activeViewId: string | null;
  isMenuOpened: boolean;
  menuAnchorEl: HTMLElement | null;
}

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

const SaveSettingsContainer = styled(Box)`
  display: flex;
  flex-grow: 1;
  justify-content: end;
`;

const getRowsFromCurrentPage = ({ apiRef }: GridCsvGetRowsToExportParams) =>
  gridPaginatedVisibleSortedGridRowIdsSelector(apiRef);

type DemoActions =
  | { type: "createView"; value: GridInitialState }
  | { type: "deleteView"; id: string }
  | { type: "setNewViewLabel"; label: string }
  | { type: "setActiveView"; id: string | null }
  | { type: "togglePopper"; element: HTMLElement }
  | { type: "closePopper" };

const demoReducer: React.Reducer<DemoState, DemoActions> = (state, action) => {
  switch (action.type) {
    case "createView": {
      const id = Math.random().toString();

      return {
        ...state,
        activeViewId: id,
        newViewLabel: "",
        views: {
          ...state.views,
          [id]: { label: state.newViewLabel, value: action.value },
        },
      };
    }

    case "deleteView": {
      const views = Object.fromEntries(
        Object.entries(state.views).filter(([id]) => id !== action.id)
      );

      let activeViewId: string | null;
      if (state.activeViewId !== action.id) {
        activeViewId = state.activeViewId;
      } else {
        const viewIds = Object.keys(state.views);

        if (viewIds.length === 0) {
          activeViewId = null;
        } else {
          activeViewId = viewIds[0];
        }
      }

      return {
        ...state,
        views,
        activeViewId,
      };
    }

    case "setActiveView": {
      return {
        ...state,
        activeViewId: action.id,
        isMenuOpened: false,
      };
    }

    case "setNewViewLabel": {
      return {
        ...state,
        newViewLabel: action.label,
      };
    }

    case "togglePopper": {
      return {
        ...state,
        isMenuOpened: !state.isMenuOpened,
        menuAnchorEl: action.element,
      };
    }

    case "closePopper": {
      return {
        ...state,
        isMenuOpened: false,
      };
    }

    default: {
      return state;
    }
  }
};

const DEMO_INITIAL_STATE: DemoState = {
  views: {},
  newViewLabel: "",
  isMenuOpened: false,
  menuAnchorEl: null,
  activeViewId: null,
};

function ViewListItem(props: {
  view: StateView;
  viewId: string;
  selected: boolean;
  onDelete: (viewId: string) => void;
  onSelect: (viewId: string) => void;
}) {
  const { view, viewId, selected, onDelete, onSelect, ...other } = props;

  return (
    <MenuItem selected={selected} onClick={() => onSelect(viewId)} {...other}>
      {view.label}
      <IconButton
        edge="end"
        aria-label="delete"
        size="small"
        onClick={(event) => {
          event.stopPropagation();
          onDelete(viewId);
        }}
      ></IconButton>
    </MenuItem>
  );
}

function NewViewListButton(props: {
  label: string;
  onLabelChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: () => void;
  isValid: boolean;
}) {
  const { label, onLabelChange, onSubmit, isValid } = props;
  const [isAddingView, setIsAddingView] = React.useState(false);

  const handleSubmitForm: React.FormEventHandler = (e) => {
    onSubmit();
    setIsAddingView(false);
    e.preventDefault();
  };

  return (
    <React.Fragment>
      <Button size="small" onClick={() => setIsAddingView(true)}>
        Save Layout
      </Button>
      <Dialog onClose={() => setIsAddingView(false)} open={isAddingView}>
        <form onSubmit={handleSubmitForm}>
          <DialogTitle>New Layout</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              value={label}
              onChange={onLabelChange}
              margin="dense"
              size="small"
              label="Layout Name"
              variant="standard"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={() => setIsAddingView(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              Save layout
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

function CustomToolbar() {
  const apiRef = useGridApiContext();
  const [state, dispatch] = React.useReducer(demoReducer, DEMO_INITIAL_STATE);

  const createNewView = () => {
    dispatch({
      type: "createView",
      value: apiRef.current.exportState(),
    });
  };

  const handleNewViewLabelChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch({ type: "setNewViewLabel", label: event.target.value });
  };

  const handleDeleteView = React.useCallback((viewId: string) => {
    dispatch({ type: "deleteView", id: viewId });
  }, []);

  const handleSetActiveView = (viewId: string) => {
    apiRef.current.restoreState(state.views[viewId].value);
    dispatch({ type: "setActiveView", id: viewId });
  };

  const handlePopperAnchorClick = (event: React.MouseEvent) => {
    dispatch({
      type: "togglePopper",
      element: event.currentTarget as HTMLElement,
    });
    event.stopPropagation();
  };

  const handleClosePopper = () => {
    dispatch({ type: "closePopper" });
  };

  const isNewViewLabelValid = React.useMemo(() => {
    if (state.newViewLabel.length === 0) {
      return false;
    }

    return Object.values(state.views).every(
      (view) => view.label !== state.newViewLabel
    );
  }, [state.views, state.newViewLabel]);

  const canBeMenuOpened = state.isMenuOpened && Boolean(state.menuAnchorEl);
  const popperId = canBeMenuOpened ? "transition-popper" : undefined;

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      dispatch({ type: "closePopper" });
    } else if (event.key === "Escape") {
      dispatch({ type: "closePopper" });
    }
  };

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
      <SaveSettingsContainer>
        <Button
          aria-describedby={popperId}
          type="button"
          size="small"
          id="custom-view-button"
          aria-controls={state.isMenuOpened ? "custom-view-menu" : undefined}
          aria-expanded={state.isMenuOpened ? "true" : undefined}
          aria-haspopup="true"
          onClick={handlePopperAnchorClick}
        >
          Layout list ({Object.keys(state.views).length})
        </Button>
        <ClickAwayListener onClickAway={handleClosePopper}>
          <Popper
            id={popperId}
            open={state.isMenuOpened}
            anchorEl={state.menuAnchorEl}
            role={undefined}
            transition
            placement="bottom-start"
            sx={{ zIndex: "modal" }}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>
                  <MenuList
                    autoFocusItem={state.isMenuOpened}
                    id="custom-view-menu"
                    aria-labelledby="custom-view-button"
                    onKeyDown={handleListKeyDown}
                  >
                    {Object.entries(state.views).map(([viewId, view]) => (
                      <ViewListItem
                        key={viewId}
                        view={view}
                        viewId={viewId}
                        selected={viewId === state.activeViewId}
                        onDelete={handleDeleteView}
                        onSelect={handleSetActiveView}
                      />
                    ))}
                  </MenuList>
                </Paper>
              </Fade>
            )}
          </Popper>
        </ClickAwayListener>
        <NewViewListButton
          label={state.newViewLabel}
          onLabelChange={handleNewViewLabelChange}
          onSubmit={createNewView}
          isValid={isNewViewLabelValid}
        />
      </SaveSettingsContainer>
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
    // maxColumns: 16,
    visibleFields: [
      'id',
      'name',
      'username',
      'rating',
      'email',
      'phone',
      'city',
      'country',
      'company',
      'website',
      'position',
      'salary',
      'isAdmin',
      'updated on',
      'created on',
    ],
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
