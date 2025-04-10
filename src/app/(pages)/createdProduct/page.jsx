import { FaRegEdit } from "react-icons/fa";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
import { AiFillWarning } from "react-icons/ai";
import { BsImage } from "react-icons/bs";

const DraftListingRow = () => {
  return (
    <tr>
      <td>
        <input type="checkbox" />
        {/* You could replace with an icon toggle: <FaCheckSquare /> / <FaRegSquare /> */}
      </td>
      <td>
        <button>
          <FaRegEdit title="Edit item" />
        </button>
      </td>
      <td>
        <AiFillWarning color="orange" title="Needs Attention" />
      </td>
      <td>
        <BsImage />
        {/* OR show actual image like <img src="..." alt="preview" /> */}
      </td>
      <td>
        Chandeliers, Sconces & Lighting Fixtures <br />
        Antiques &gt; Architectural Antiques
      </td>
      <td>
        <textarea placeholder="Enter title..." />
      </td>
      <td>N/A</td>
      <td>
        <select>
          <option value="Auction">Auction</option>
          <option value="BuyItNow">Buy it now</option>
        </select>
      </td>
      <td>
        <select>
          <option value="Days_3">3 days</option>
          <option value="Days_5">5 days</option>
          <option value="Days_7" selected>
            7 days
          </option>
          <option value="Days_10">10 days</option>
        </select>
      </td>
      <td>1</td>
      <td>£ <input type="text" placeholder="Buy it now" /></td>
      <td>£ <input type="text" placeholder="Starting bid" /></td>
      <td>No</td>
      <td>
        <select defaultValue="2">
          <option value="1">1 working day</option>
          <option value="2">2 working days</option>
          <option value="3">3 working days</option>
        </select>
      </td>
      <td>N/A</td>
      <td>Immediate</td>
      <td>-</td>
      <td></td>
      <td>0 completed</td>
      <td>
        <button>Edit description</button>
      </td>
      <td>Eligible</td>
      <td></td>
      <td>N/A</td>
      <td>£0.00</td>
    </tr>
  );
};

