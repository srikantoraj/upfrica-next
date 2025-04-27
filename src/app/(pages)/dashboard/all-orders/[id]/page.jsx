import React from 'react'

function AllOrders({ params }) {
    const { id } = params

  return (
      <div>One Order: {id}</div>
  )
}

export default AllOrders