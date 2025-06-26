'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star, Eye, BadgeCheck, Circle } from 'lucide-react';

const filters = [
  { label: 'All', value: 'all', icon: Circle },
  { label: 'Free', value: 'free', icon: BadgeCheck },
  { label: 'Popular', value: 'popular', icon: Star },
  { label: 'High Visibility', value: 'visibility', icon: Eye },
];

export default function PlanToggleFilter({ plans, setFilteredPlans }) {
  const [active, setActive] = useState('all');

  const handleFilterChange = (value) => {
    setActive(value);

    if (value === 'all') return setFilteredPlans(plans);

    const filtered = plans.filter((plan) => {
        if (value === 'free') return plan.is_free;
        if (value === 'popular') return plan.is_popular;
        if (value === 'visibility') return plan.is_visible;
        return true;
      });

    setFilteredPlans(filtered);
  };

  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {filters.map(({ label, value, icon: Icon }) => (
        <Button
          key={value}
          onClick={() => handleFilterChange(value)}
          variant={active === value ? 'default' : 'outline'}
          className="text-sm px-3 py-1 rounded-full flex items-center gap-1"
        >
          <Icon className="w-4 h-4" />
          {label}
        </Button>
      ))}
    </div>
  );
}
