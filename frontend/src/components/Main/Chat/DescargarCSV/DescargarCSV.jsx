import React from 'react';
import { CSVLink } from "react-csv";

const DescargarCSV = ({ data, columns, fileName = "datos_exportados.csv" }) => {
  
  if (!data || !columns) return null;

  return (
    <CSVLink
      data={data}
      headers={columns}
      filename={fileName}
      className="btn-csv"
      style={{
        display: "block",     
        marginTop: "10px",
        textAlign: "right",   
        color: "#166534",     
        fontWeight: "bold",
        textDecoration: "none",
        fontSize: "0.9rem",
        cursor: "pointer"
      }}
    >
      📥 Descargar CSV
    </CSVLink>
  );
};

export default DescargarCSV;