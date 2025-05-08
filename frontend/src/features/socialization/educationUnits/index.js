import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "@ant-design/plots";
import * as XLSX from "xlsx";
import {
  DocumentTextIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const EducationUnits = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [drilldownData, setDrilldownData] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    fetchEducationUnits();
  }, []);

  const fetchEducationUnits = async () => {
    try {
      const response = await axios.get("http://localhost:5000/education_units");
      setData(response.data);
      processPieData(response.data);
    } catch (error) {
      console.error("Error fetching education unit data:", error);
    }
  };

  const fetchDrilldownData = async (region) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/education_units/region/${region}`
      );
      console.log("Fetched Drilldown Data:", response.data); // Periksa struktur data yang diterima

      if (!response.data || response.data.length === 0) {
        console.log("No data received for drilldown.");
        return;
      }

      const groupedBySubdistrict = response.data.reduce((acc, curr) => {
        const key = curr.subdistrict || "Tidak diketahui"; // Pastikan subdistrict ada
        const found = acc.find((item) => item.type === key);
        if (found) {
          found.value += 1;
        } else {
          acc.push({ type: key, value: 1 });
        }
        return acc;
      }, []);

      console.log("Grouped by Subdistrict:", groupedBySubdistrict); // Periksa data yang sudah digrupkan
      setDrilldownData(groupedBySubdistrict); // Set data drilldown dengan data yang sudah digrupkan
    } catch (error) {
      console.error("Error fetching drilldown data:", error);
    }
  };

  const handleBackFromDrilldown = () => {
    setSelectedRegion(null);
    processPieData(data);
  };

  const processPieData = (inputData) => {
    const summary = inputData.reduce((acc, curr) => {
      const key = curr.region || "Tidak diketahui"; // pastikan key sesuai dengan field yang benar
      const found = acc.find((item) => item.type === key);
      if (found) {
        found.value += 1;
      } else {
        acc.push({ type: key, value: 1 });
      }
      return acc;
    }, []);
    console.log("Processed Pie Data:", summary); // Tambahkan log untuk debug
    setPieChartData(summary);
  };

  const pieConfig = {
    appendPadding: 10,
    data: pieChartData,
    angleField: "value",
    colorField: "type", // pastikan 'type' adalah nama wilayah atau subdistrict sesuai data
    radius: 1,
    label: {
      type: "outer",
      content: "{name} ({percentage})",
    },
    interactions: [{ type: "element-active" }],
    tooltip: {
      formatter: (datum) => ({ name: datum.type, value: datum.value }),
    },
    onReady: (plot) => {
      plot.on("element:click", (e) => {
        const region = e.data?.data?.type; // Pastikan properti yang digunakan benar
        console.log("Region clicked:", region); // Verifikasi region yang dipilih
        if (region) {
          fetchDrilldownData(region); // Ambil data drilldown berdasarkan region yang diklik
          setSelectedRegion(region); // Update state untuk menampilkan drilldown
        }
      });
    },
  };

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

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Satuan Pendidikan");
    XLSX.writeFile(workbook, "SatuanPendidikan.xlsx");
  };

  return (
    <div className="min-h-screen bg-base-200 px-6 py-10 space-y-12">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {["TK", "SD", "SMP", "SMA"].map((jenjang, idx) => {
          const jumlah = data.filter((d) => d.name?.startsWith(jenjang)).length;
          const colors = [
            "bg-info",
            "bg-success",
            "bg-warning",
            "bg-orange-500",
          ];
          return (
            <div
              key={idx}
              className={`card ${colors[idx]} text-white shadow-xl`}
            >
              <div className="card-body">
                <h2 className="text-3xl font-bold">{jumlah}</h2>
                <p>Jumlah {jenjang}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pie Chart */}
      <div className="bg-base-100 p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-xl">
            {selectedRegion
              ? `Detail Kecamatan di Wilayah ${selectedRegion}`
              : "Persentase Sosialisasi Satuan Pendidikan Berdasarkan Wilayah"}
          </h3>
          {selectedRegion && (
            <button
              className="btn btn-sm btn-outline"
              onClick={handleBackFromDrilldown}
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Kembali
            </button>
          )}
        </div>
        <Pie {...pieConfig} />
      </div>

      {/* Drilldown Table */}
      {selectedRegion && (
        <div className="bg-base-100 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            Daftar Satuan Pendidikan di Kecamatan {selectedRegion}
          </h3>
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
                {drilldownData.map((item, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{idx + 1}</td>
                    <td className="text-center">
                      {item.name}
                    </td>
                    <td className="text-center">
                      {item.address}
                    </td>
                    <td className="text-center">
                      {item.region}
                    </td>
                    <td className="text-center">
                      {item.subdistrict}
                    </td>
                    <td className="text-center">
                      {item.suratK ? (
                        <CheckCircleIcon className="w-5 h-5 text-success mx-auto" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-error mx-auto" />
                      )}
                    </td>
                    <td className="text-center">
                      {item.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Table + Export */}
      <div className="bg-base-100 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Data Tabel Satuan Pendidikan</h2>
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
          </div>
        </div>

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
                  <td className="text-center">{item.name || "Tidak ada data"}</td>
                  <td className="text-center">{item.address || "Tidak ada data"}</td>
                  <td className="text-center">{item.region || "Tidak ada data"}</td>
                  <td className="text-center">{item.subdistrict || "Tidak ada data"}</td>
                  <td className="text-center">
                    {item.suratK ? (
                      <CheckCircleIcon className="w-5 h-5 text-success mx-auto" />
                    ) : (
                      <XCircleIcon className="w-5 h-5 text-error mx-auto" />
                    )}
                  </td>
                  <td className="text-center">{item.date || "Tidak ada data"}</td>
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

export default EducationUnits;
