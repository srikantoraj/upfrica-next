export default function DraftRow() {
    return (
      <tr className="border-b">
        <td><input type="checkbox" className="mx-auto" /></td>
        <td><button className="text-blue-600 underline">Edit</button></td>
        <td><span className="text-yellow-600">⚠️ Needs Info</span></td>
        <td>
          <img src="https://pics.ebaystatic.com/aw/pics/stockimage1.jpg" alt="default" className="h-12 w-12" />
        </td>
        <td>
          <p className="text-sm">Chandeliers, Sconces</p>
          <p className="text-xs text-gray-500">Architectural Antiques</p>
        </td>
        <td><input type="text" className="border rounded px-2 py-1 w-full" placeholder="Enter title" /></td>
        <td>N/A</td>
        <td>
          <select className="border rounded px-2 py-1">
            <option>Auction</option>
            <option>Buy it now</option>
          </select>
        </td>
        <td>
          <select className="border rounded px-2 py-1">
            <option>3 days</option>
            <option>7 days</option>
          </select>
        </td>
        <td>1</td>
        <td><input type="text" className="border rounded px-2 py-1 w-full" placeholder="£ Price" /></td>
      </tr>
    );
  }
  