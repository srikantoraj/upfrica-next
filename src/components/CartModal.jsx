import { HiXMark } from 'react-icons/hi2';
import Link from 'next/link';

const CartModal = ({
  basket,
  isModalVisible,
  handleCloseModal,
  handleQuantityChange,
  QuantityControl,
}) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 px-5 z-50 overflow-y-auto 
        ${isModalVisible ? 'opacity-100 visible' : 'opacity-0 invisible'} 
        transition-opacity duration-300`}
      onClick={handleCloseModal}
    >
      <div
        className={`
          bg-white rounded-lg shadow-lg
          w-full sm:w-2/3 md:w-3/4 lg:w-2/4 xl:w-2/5 2xl:w-1/3
          max-w-3xl 
          p-6 sm:p-8
          mx-auto mt-10 
          transform 
          ${isModalVisible ? 'translate-y-0' : '-translate-y-full'}
          transition-transform duration-300
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with larger font size */}
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-3xl font-bold">
            {basket.length} Items added to basket
          </h3>
          <button onClick={handleCloseModal} className="text-gray-600 hover:text-gray-900">
            <HiXMark className="h-8 w-8" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4">
          <ul className="space-y-4">
            {basket.length > 0 ? (
              basket.map((item, index) => (
                <li
                  key={index}
                  className="flex flex-col md:grid md:grid-cols-5 gap-4 items-center border-b pb-3 text-lg"
                >
                  <div className="md:col-span-1">
                    <img
                      src={item?.image?.[0] ?? 'https://via.placeholder.com/150'}
                      alt={item.title}
                      className="h-16 w-16 object-cover rounded"
                    />
                  </div>
                  <div className="md:col-span-4 w-full">
                    <div className="font-medium text-gray-800">{item.title}</div>
                    <div className="flex flex-wrap gap-5 items-center mt-2">
                      <p className="text-gray-700">
                        Price: {item.price.currency_iso}{' '}
                        {(item.price.cents / 100).toFixed(2)}
                      </p>
                      <div className="flex items-center text-lg font-medium">
                        <span className="mr-2">Qty:</span>
                        <QuantityControl
                          quantity={item.quantity}
                          onDecrease={() => handleQuantityChange(index, -1)}
                          onIncrease={() => handleQuantityChange(index, 1)}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500">No items in the basket.</p>
            )}
          </ul>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-center pt-4 space-x-4">
          <Link href="/checkout">
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-3xl hover:bg-yellow-600">
              Checkout Item
            </button>
          </Link>
          <Link href="/cart">
            <button className="px-4 py-2 rounded-3xl border bg-white shadow-md">
              View Basket
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
