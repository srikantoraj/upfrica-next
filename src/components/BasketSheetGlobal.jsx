// src/components/BasketSheetGlobal.jsx
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import BasketSheet from './BasketSheet';
import {
  selectBasketItems,
  updateQuantity,
  removeFromBasket,
  addToBasket,
} from '@/app/store/slices/cartSlice';
import {
  selectBasketSheetOpen,
  closeBasketSheet,
} from '@/app/store/slices/uiSlice';

export default function BasketSheetGlobal() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dispatch = useDispatch();
  const isOpen = useSelector(selectBasketSheetOpen);
  const basket = useSelector(selectBasketItems);

  const onClose = () => dispatch(closeBasketSheet());
  const onQuantityChange = (id, quantity) =>
    dispatch(updateQuantity({ id, quantity }));       // ⬅️ match slice
  const onRemove = (id) => dispatch(removeFromBasket(id)); // ⬅️ match slice
  const onUndoRemove = (item) => dispatch(addToBasket(item));

  if (!mounted) return null;

  const portalTarget =
    document.getElementById('portal-root') || document.body;

  return createPortal(
    <BasketSheet
      isOpen={isOpen}
      onClose={onClose}
      basket={basket}
      onQuantityChange={onQuantityChange}
      onRemove={onRemove}
      onUndoRemove={onUndoRemove}
    />,
    portalTarget
  );
}