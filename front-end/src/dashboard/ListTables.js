function ListTables({ tables, handleFreeTableAndFinishReservation }) {
  
  if (!tables) return null;
  const sortedTables = tables.sort((a, b) => a.table_name.localeCompare(b.table_name));
  return (
    <div>
      <div className="py-3">
        <h2>Tables</h2>

        <div className="row">
          { sortedTables.map((table, index) => (
            <div key={index} className="col-6 col-md-3 col-xxl-4">
              <div className="card lightBackground darkBorder mb-2">
                <div className="card-body text-center pt-3 pb-2">
                  <h5 className="darkText py-2">{ table.table_name }</h5>
                  <h5 className="darkText" data-table-id-status={table.table_id} >{ !table.reservation_id ? "Free" : "Occupied" }</h5>
                  { table.reservation_id &&
                    <div className="d-flex justify-content-center pt-2">
                      <button type="button" className="btn accentBackground lightText w-100 text-center" data-table-id-finish={table.table_id} onClick={() => handleFreeTableAndFinishReservation(table.table_id)}>Finish</button> 
                    </div>
                  }
                </div>
              </div>
            </div>
          )) }
        </div>
      </div>
      <hr />
    </div>
  )
}

export default ListTables;