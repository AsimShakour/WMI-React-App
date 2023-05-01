import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  margin-top: 20px;

  th {
    text-align: left;
    padding: 10px;
    background-color: #f2f2f2;
  }

  td {
    padding: 10px;
    border: 1px solid #ddd;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const SearchBox = styled.input`
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 5px;
  width: 100%;
`;

const SelectBox = styled.select`
  margin-top: 10px;
  padding: 5px;
`;

const Spinner = () =>  {
  return <Loader>Loading...</Loader>;
};

var urlData = "wmi";
var All_Countries = "All Countries";
let urlHref = "https://localhost:5001/";

const App = () => {
  // Create state variables
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(All_Countries);

  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(urlHref + urlData);
      const jsonData = await response.json();
      setData(jsonData);
      setLoading(false);
    };

    fetchData();
  }, []);

   // Get unique country names from data
   const countries = [All_Countries, ...new Set(data?.map(item => item.Country).filter(Boolean))];
   
   // Filter data based on selected country and search term
   const filteredData = data?.filter(item => {
     if (selectedCountry !== All_Countries && item.Country !== selectedCountry) {
       return false;
     }

 
     if (search) {
       const searchRegex = new RegExp(search, 'i');
       return (
         searchRegex.test(item.Id) ||
         searchRegex.test(item.Name) ||
         searchRegex.test(item.Country) ||
         searchRegex.test(item.VehicleType) ||
         searchRegex.test(item.WMI) ||
         searchRegex.test(item.DateAvailableToPublic) ||
         searchRegex.test(item.CreatedOn) ||
         searchRegex.test(item.UpdatedOn) 
       );
     }
 
     return true;
   });
 
   // Sort filtered data by CreatedOn and then by WMI
   const sortedData = filteredData?.sort((a, b) => {
     if (a.CreatedOn < b.CreatedOn) {
       return 1;
     } else if (a.CreatedOn > b.CreatedOn) {
       return -1;
     } else if (a.WMI > b.WMI) {
       return 1;
     } else if (a.WMI < b.WMI) {
       return -1;
     } else {
       return 0;
     }
   });

   const handleSearch = event => {
    setSearch(event.target.value);
  };

  const setCountryChange = event => {
    setSelectedCountry(event.target.value);
  };

  return (
    <div>
      WMI Data - Honda | Total: <span>{filteredData?.length}</span> 
      {loading ? <Spinner /> : 
      ( 
      <> <br />
      <SearchBox
        type="text"
        placeholder="Search by Id, Name, Country, Vehicle Type, WMI, Date Available To Public, Created On, or Updated On"
        value={search}
        onChange={handleSearch}
      />
      {/* Country selector */}
      <SelectBox onChange={setCountryChange}>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </SelectBox>

      {/* Data table */}
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Country</th>
            <th>Vehicle Type</th>
            <th>WMI</th>
            <th>Date Available To Public</th>
            <th>Created On</th>
            <th>Updated On</th>
          </tr>
        </thead>
        <tbody>
          {sortedData?.map((item, index) => (
            <tr key={index}>
              <td>{item.Id}</td>
              <td>{item.Name}</td>
              <td>{item.Country}</td>
              <td>{item.VehicleType}</td>
              <td>{item.WMI}</td>
              <td>{item.DateAvailableToPublic}</td>
              <td>{item.CreatedOn}</td>
              <td>{item.UpdatedOn || "-"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      </>
      )}
    </div>
  );
};

export default App;
