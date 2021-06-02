function Reservations({ reservations }) {
  
  if (!reservations) return null;
  return (
    <div>
      { reservations.map(item => item.first_name) }
    </div>
  )
}

export default Reservations;