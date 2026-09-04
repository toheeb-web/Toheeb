import React from 'react';
import { CheckCircle2, Clock, ChefHat, Bike, PackageCheck, AlertCircle } from 'lucide-react';

const STEPS = [
  { key: 'PLACED', label: 'Order Placed', icon: Clock },
  { key: 'PREPARING', label: 'Kitchen Cooking', icon: ChefHat },
  { key: 'READY_FOR_DELIVERY', label: 'Food Ready', icon: PackageCheck },
  { key: 'RIDER_ASSIGNED', label: 'Courier Assigned', icon: Bike },
  { key: 'ON_THE_WAY', label: 'On The Way', icon: Bike },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 }
];

const getStepIndex = (status) => {
  switch (status) {
    case 'PLACED': return 0;
    case 'ACCEPTED': return 1;
    case 'PREPARING': return 1;
    case 'READY_FOR_DELIVERY': return 2;
    case 'RIDER_ASSIGNED': return 3;
    case 'PICKED_UP': return 4;
    case 'ON_THE_WAY': return 4;
    case 'DELIVERED': return 5;
    case 'REJECTED': return -1;
    default: return 0;
  }
};

export const OrderStatusStepper = ({ status }) => {
  const currentIndex = getStepIndex(status);

  if (status === 'REJECTED') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-3 text-red-700">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-semibold">Order was declined by the kitchen.</span>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      {/* Horizontal Bar on tablets & desktop, compact vertical list on small screens */}
      <div className="hidden sm:flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#E2D7CF] -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-brand-500 -translate-y-1/2 transition-all duration-500 z-0"
          style={{ width: `${(Math.max(0, currentIndex) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isDone 
                    ? 'bg-brand-500 text-white shadow-md' 
                    : 'bg-white border-2 border-[#E2D7CF] text-[#79747E]'
                } ${isCurrent ? 'ring-4 ring-brand-100 scale-110' : ''}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[11px] mt-1.5 font-medium whitespace-nowrap ${
                isCurrent ? 'text-brand-600 font-bold' : isDone ? 'text-[#1C1B1F]' : 'text-[#79747E]'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile view */}
      <div className="sm:hidden flex items-center justify-between bg-brand-50/70 p-3.5 rounded-2xl border border-brand-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold">
            {STEPS[Math.max(0, currentIndex)]?.icon && React.createElement(STEPS[Math.max(0, currentIndex)].icon, { className: "w-5 h-5" })}
          </div>
          <div>
            <p className="text-xs font-medium text-brand-600 uppercase tracking-wider">Current Status</p>
            <p className="text-sm font-bold text-[#1C1B1F]">{STEPS[Math.max(0, currentIndex)]?.label}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold px-2 py-1 bg-white rounded-lg text-brand-600 border border-brand-200">
            Step {currentIndex + 1} of {STEPS.length}
          </span>
        </div>
      </div>
    </div>
  );
};
