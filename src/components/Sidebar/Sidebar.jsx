// components/Sidebar.tsx
import Link from 'next/link';
import { BiPerson, BiBookmarkHeart, BiGear } from 'react-icons/bi'; // react-icons

export default function Sidebar() {
  return (
    <div className="card" style={{ width: '100%', background: '#f8f9fa', borderRadius: '10px' }}>
      <div className="card-body p-3">
        <div className="text-center mb-3">
          <div
            className="avatar rounded-circle mb-2"
            style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#dee2e6',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              // fontSize: '28px',
            }}
          >
            <BiPerson />
          </div>
          <h6 className="mb-0">Srikanto</h6>
          <span className="text-muted small">Welcome back</span>
          <hr />
        </div>

        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link href="/users/srikanto" className="nav-link d-flex align-items-center text-dark">
              <BiPerson className="me-2" /> My Profile Page
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link href="/users/srikanto/collection" className="nav-link d-flex align-items-center text-dark">
              <BiBookmarkHeart className="me-2" /> My Saved Items
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/edit.srikanto" className="nav-link d-flex align-items-center text-dark">
              <BiGear className="me-2" /> Profile Settings
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
