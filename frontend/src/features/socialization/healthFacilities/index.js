import React, { useState, useEffect } from "react";
import { Pie } from "@ant-design/plots";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import {
  DocumentTextIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

const HealthFacility = () => {
  const [healthFacilities, setHealthFacilities] = useState([]);
  const [healthFacilitiesCount, setHealthFacilitiesCount] = useState({});
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [pieData, setPieData] = useState([]);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  useEffect(() => {
    // Fetch health facilities data
    axios
      .get("http://localhost:5000/health_facilities")
      .then((response) => {
        setData(response.data);
        setHealthFacilities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching health facilities data:", error);
      });

    // Fetch health facilities count (Puskesmas, Klinik, Rumah Sakit)
    axios
      .get("http://localhost:5000/health_facilities/count")
      .then((response) => {
        setHealthFacilitiesCount(response.data);
        const { puskesmas, klinik, rumah_sakit } = response.data;
        setPieData([
          { type: "Puskesmas", value: puskesmas },
          { type: "Klinik", value: klinik },
          { type: "Rumah Sakit", value: rumah_sakit },
        ]);
      })
      .catch((error) => {
        console.error("Error fetching health facilities count:", error);
      });
  }, []);

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

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(healthFacilities);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fasilitas Kesehatan");
    XLSX.writeFile(workbook, "FasilitasKesehatan.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Data Fasilitas Kesehatan", 10, 10);
    const tableData = healthFacilities.map((item) => [
      item.name,
      item.address,
      item.region,
      item.subdistrict,
      item.time,
    ]);
    doc.autoTable({
      head: [["Nama", "Alamat", "Wilayah", "Kecamatan", "Tanggal"]],
      body: tableData,
    });
    doc.save("FasilitasKesehatan.pdf");
  };

  return (
    <div className="min-h-screen bg-base-200 px-6 py-10 space-y-12">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card bg-info text-white shadow-xl">
          <div className="card-body">
            <h2 className="text-3xl font-bold">
              {healthFacilitiesCount.puskesmas}
            </h2>
            <p>Jumlah Puskesmas</p>
          </div>
        </div>
        <div className="card bg-success text-white shadow-xl">
          <div className="card-body">
            <h2 className="text-3xl font-bold">
              {healthFacilitiesCount.klinik}
            </h2>
            <p>Jumlah Klinik</p>
          </div>
        </div>
        <div className="card bg-warning text-white shadow-xl">
          <div className="card-body">
            <h2 className="text-3xl font-bold">
              {healthFacilitiesCount.rumah_sakit}
            </h2>
            <p>Jumlah Rumah Sakit</p>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-base-100 p-6 rounded-xl shadow-lg">
        <h3 className="text-center font-semibold text-xl mb-1">
          Persentase Sosialisasi Fasilitas Kesehatan Berdasarkan Wilayah
        </h3>
        <p className="text-center text-sm mb-4 text-gray-500">
          Klik untuk melihat detail
        </p>
        <Pie {...pieConfig} />
      </div>

      {/* Table + Filter */}
      <div className="bg-base-100 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          Data Tabel Fasilitas Kesehatan
        </h2>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-full sm:w-1/3"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1); // reset ke halaman 1 saat cari
            }}
          />
          <div className="flex gap-2 w-full sm:w-1/3 justify-end">
            <button
              onClick={() => setIsFilterVisible(true)}
              className="btn btn-outline btn-[#7B74DA]"
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
                  <td className="text-center">
                    {(currentPage - 1) * rowsPerPage + idx + 1}
                  </td>
                  <td className="text-center">
                    {item.name || "Tidak ada data"}
                  </td>
                  <td className="text-center">
                    {item.address || "Tidak ada data"}
                  </td>
                  <td className="text-center">
                    {item.region || "Tidak ada data"}
                  </td>
                  <td className="text-center">
                    {item.subdistrict || "Tidak ada data"}
                  </td>
                  <td className="text-center">
                    {item.SK ? (
                      <CheckCircleIcon className="w-5 h-5 text-success mx-auto" />
                    ) : (
                      <XCircleIcon className="w-5 h-5 text-error mx-auto" />
                    )}
                  </td>
                  <td className="text-center">
                    {item.time
                      ? new Date(item.time).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Tidak ada data"}
                  </td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-primary">
                      <EyeIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          {/* Prev Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-sm btn-outline"
          >
            ← Prev
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {currentPage > 3 && (
              <>
                <button
                  onClick={() => setCurrentPage(1)}
                  className="btn btn-sm btn-outline"
                >
                  1
                </button>
                {currentPage > 4 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
              </>
            )}

            {Array.from({ length: 5 }, (_, i) => {
              const page = currentPage - 2 + i;
              if (page < 1 || page > totalPages) return null;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`btn btn-sm ${
                    page === currentPage ? "btn-primary" : "btn-outline"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="btn btn-sm btn-outline"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="btn btn-sm btn-outline"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthFacility;
