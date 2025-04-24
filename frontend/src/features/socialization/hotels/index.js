import React, { useState } from "react";
import { Pie } from "@ant-design/plots";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import {
  DocumentTextIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

// Dummy data
const quantityData = [
  {
    name: "88 Embong Kenongo",
    address: "Rungkut Asri",
    region: "Timur",
    subdistrict: "Rungkut",
    suratK: "SK-2022-08-10",
    date: "12-07-2022",
  },
  {
    name: "Utami",
    address: "Nginden",
    region: "Timur",
    subdistrict: "Sukolilo",
    suratK: "",
    date: "10-08-2022",
  },
];

const Hotel = () => {
  const pieData = [
    { type: "Pusat", value: 29388853.5 },
    { type: "Timur", value: 26492684.4 },
    { type: "Barat", value: 10451490.2 },
    { type: "Selatan", value: 26492684.4 },
    { type: "Utara", value: 10451490.2 },
  ];

  const pieConfig = {
    appendPadding: 10,
    data: pieData,
    angleField: "value",
    colorField: "type",
    radius: 1,
    label: {
      type: "outer",
      content: "{name} ({percentage})",
    },
    interactions: [{ type: "element-active" }],
  };

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isFilterVisible, setIsFilterVisible] = useState(false); // ditambahkan

  const filteredData = quantityData.filter((item) => {
    return Object.values(item).some((val) =>
      val.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const openFilter = () => setIsFilterVisible(true);
  const closeFilter = () => setIsFilterVisible(false);

  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleViewDetails = (id) => {
    console.log("View details for ID:", id);
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hotel");
    XLSX.writeFile(workbook, "Hotel.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Data Hotel", 10, 10);
    const tableData = filteredData.map((item) => [
      item.name,
      item.address,
      item.region,
      item.subdistrict,
      item.date,
    ]);
    doc.autoTable({
      head: [["Nama", "Alamat", "Wilayah", "Kecamatan", "Tanggal"]],
      body: tableData,
    });
    doc.save("Hotel.pdf");
  };

  return (
    <div className="min-h-screen bg-base-200 px-6 py-10 space-y-12">

      {/* Pie Chart */}
      <div className="bg-base-100 p-6 rounded-xl shadow-lg">
        <h3 className="text-center font-semibold text-xl mb-1">
          Persentase Sosialisasi Hotel Berdasarkan Wilayah
        </h3>
        <p className="text-center text-sm mb-4 text-gray-500">
          Klik untuk melihat detail
        </p>
        <Pie {...pieConfig} />
      </div>

      {/* Table + Filter */}
      <div className="bg-base-100 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Data Tabel Hotel</h2>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-full sm:w-1/3"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="flex gap-2 w-full sm:w-1/3 justify-end">
            <button
              onClick={openFilter}
              className="btn btn-outline btn-info flex items-center text-sm h-10"
            >
              <FunnelIcon className="w-5 h-5 mr-1" />
              Filter
            </button>
            <button
              onClick={handleExportExcel}
              className="btn btn-outline btn-success"
            >
              <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
              Excel
            </button>
            <button
              onClick={handleExportPDF}
              className="btn btn-outline btn-error"
            >
              <DocumentTextIcon className="w-4 h-4 mr-1" />
              PDF
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-center">No.</th>
                <th className="text-center">Nama</th>
                <th className="text-center">Alamat</th>
                <th className="text-center">Wilayah</th>
                <th className="text-center">Kecamatan</th>
                <th className="text-center">SK</th>
                <th className="text-center">Tgl Kegiatan</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, idx) => (
                <tr key={idx}>
                  <td className="text-center">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                  <td className="text-center">{item.name}</td>
                  <td className="text-center">{item.address}</td>
                  <td className="text-center">{item.region}</td>
                  <td className="text-center">{item.subdistrict}</td>
                  <td>
                    <div className="flex justify-center">
                      {item.suratK ? (
                        <CheckCircleIcon className="w-5 h-5 text-success" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-error" />
                      )}
                    </div>
                  </td>
                  <td className="text-center">{item.date}</td>
                  <td>
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleViewDetails(item.id)}
                        className="btn btn-sm btn-info"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center text-gray-400">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Hotel;