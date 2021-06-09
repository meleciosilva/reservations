function ListTables({ tables, handleFreeTableAndFinishReservation }) {
  
  if (!tables) return null;
  const sortedTables = tables.sort((a, b) => a.table_name.localeCompare(b.table_name));
  return (
    <div>
      <h2>Tables</h2>

      <div className="row">
        { sortedTables.map((table, index) => (
          <div key={index} className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card mb-2">
              <div className="card-body">
                <h5 className="card-title">{ table.table_name }</h5>
                <p className="card-text font-weight-bold" data-table-id-status={table.table_id} >{ !table.reservation_id ? "Free" : "Occupied" }</p>
                { table.reservation_id && 
                  <button type="button" className="btn btn-danger" data-table-id-finish={table.table_id} onClick={() => handleFreeTableAndFinishReservation(table.table_id)}>Finish</button> 
                }
              </div>
            </div>
          </div>
        )) }
      </div>
      <hr />
    </div>
  )
}

export default ListTables;