// src/components/FeatureGate.jsx
'use client';
import React from 'react';
import useEntitlements from '@/hooks/useEntitlements';

export default function FeatureGate({
  feature,
  children,
  fallback = null,
  // when true, render the child but pass disabled + title if missing entitlement
  disableIfBlocked = false,
  blockedTitle = 'Upgrade your plan to use this',
}) {
  const { has, loading, error } = useEntitlements();

  if (loading) return null;          // keep the layout from flashing
  if (error)   return fallback ?? null;

  const allowed = has(feature);

  if (allowed) return children;

  if (disableIfBlocked && React.isValidElement(children)) {
    return React.cloneElement(children, {
      disabled: true,
      title: blockedTitle,
      onClick: undefined,            // avoid triggering the original handler
      className: [
        children.props.className,
        'opacity-60 cursor-not-allowed',
      ].filter(Boolean).join(' ')
    });
  }

  return fallback ?? null;
}