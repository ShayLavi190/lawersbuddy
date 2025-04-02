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
const DataTable = ({ rows }) => {
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
    <Paper
  sx={{ width: "100%", overflow: "hidden" }}
  role="region"
  aria-label="טבלת פגישות עם ניווט עמודים"
>
  <TableContainer>
    <Table sx={{ minWidth: 650 }} aria-label="טבלת פגישות">
      <TableHead>
        <TableRow>
          <TableCell align="center" scope="col">שם לקוח</TableCell>
          <TableCell align="center" scope="col">תאריך</TableCell>
          <TableCell align="center" scope="col">שעה</TableCell>
          <TableCell align="center" scope="col">מיקום</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
  {paginatedRows.map((row, index) => (
    <TableRow
      key={index}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      tabIndex={0}
      aria-label={`פגישה עם ${row.client}, בתאריך ${row.date}, בשעה ${row.time}, במיקום ${row.location}`}
    >
      <TableCell align="center" role="cell">{row.client}</TableCell>
      <TableCell align="center" role="cell">{row.date}</TableCell>
      <TableCell align="center" role="cell">{row.time}</TableCell>
      <TableCell align="center" role="cell">{row.location}</TableCell>
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
    aria-label="בקרת עמודים בטבלת הפגישות"
  />
</Paper>

  );
};

export default DataTable;
