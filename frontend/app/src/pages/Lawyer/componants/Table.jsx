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
    <Paper sx={{ width: "100%", overflow: "hidden" }} role="region" aria-label="טבלת תיקים עם עמודים">
  <TableContainer>
    <Table sx={{ minWidth: 650 }} aria-label="טבלה עם נתוני תיקים">
      <TableHead>
        <TableRow>
          <TableCell align="center" scope="col">נתבע</TableCell>
          <TableCell align="center" scope="col">תובע</TableCell>
          <TableCell align="center" scope="col">מספר התיק</TableCell>
          <TableCell align="center" scope="col">תאריך פתיחת התיק</TableCell>
          <TableCell align="center" scope="col">סטאטוס</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
  {paginatedRows.map((row, index) => (
    <TableRow
      key={index}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      tabIndex={0}
      aria-label={`תיק מספר ${row.caseId || "N/A"} של תובע ${row.attorneys?.plaintiff || "לא ידוע"} ונתבע ${row.attorneys?.defendant || "לא ידוע"}, נפתח בתאריך ${row.openDate || "לא ידוע"}, סטטוס: ${row.status || "לא ידוע"}`}
    >
      <TableCell align="center" role="cell">{row.attorneys?.defendant || "N/A"}</TableCell>
      <TableCell align="center" role="cell">{row.attorneys?.plaintiff || "N/A"}</TableCell>
      <TableCell align="center" role="cell">{row.caseId || "N/A"}</TableCell>
      <TableCell align="center" role="cell">
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
      <TableCell align="center" role="cell">{row.status || "N/A"}</TableCell>
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
    aria-label="ניווט עמודים בטבלה"
  />
</Paper>

  );
};

export default DataTablef;
