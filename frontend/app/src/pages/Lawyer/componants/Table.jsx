import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import "./table.css";
const DataTablef = ({ rows }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="table with pagination">
          <TableHead>
            <TableRow>
              <TableCell align="center">נתבע</TableCell>
              <TableCell align="center">תובע</TableCell>
              <TableCell align="center">מספר התיק</TableCell>
              <TableCell align="center">תאריך פתיחת התיק</TableCell>
              <TableCell align="center">סטאטוס</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {paginatedRows.map((row, index) => (
    <TableRow
      key={index}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="center">{row.attorneys?.defendant || "N/A"}</TableCell>
      <TableCell align="center">{row.attorneys?.plaintiff || "N/A"}</TableCell>
      <TableCell align="center">{row.caseId || "N/A"}</TableCell>
      <TableCell align="center">
        {row.openDate
          ? (() => {
              const date = new Date(row.openDate);
              const day = String(date.getDate()).padStart(2, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const year = date.getFullYear();
              return `${day}/${month}/${year}`;
            })()
          : "N/A"}
      </TableCell>
      <TableCell align="center">{row.status || "N/A"}</TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        tabIndex={0}
      />
    </Paper>
  );
};

export default DataTablef;
