import React from 'react'

function AllOrders({ params }) {
    const { id } = params

  return (
      <div>AllOrders: {id}</div>
  )
}

export default AllOrders