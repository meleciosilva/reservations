import { useEffect, useState } from "react";
import { fetchTables } from "../utils/api";

function Tables() {
  const [tables, setTables] = useState(null);

  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    // setReservationsError(null);
    fetchTables(abortController.signal)
      .then(setTables)
      .catch(console.log);
    return () => abortController.abort();
  }

  return (
    <div>
      <h2>Tables</h2>

      <div className="row">
        { tables && tables.map(table => (
          <div key={table.table_id} className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card mb-2">
              <div className="card-body">
                <h5 className="card-title">{ table.table_name }</h5>
                <p className="card-text" data-table-id-status={table.table_id} >{ !table.reservation_id ? "Free" : "Occupied" }</p>
              </div>
            </div>
          </div>
        )) }
      </div>
      <hr />
    </div>
  )
}

export default Tables;