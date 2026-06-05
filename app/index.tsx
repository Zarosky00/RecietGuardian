import React from 'react';
import SandboxDashboard from "@/test/sandbox/dashboard/index";
import ProductionDashboard from "@/app/(dashboard)/index";

export default function AppEntry() {
  if (process.env.EXPO_PUBLIC_APP_MODE === 'sandbox') {
    return <SandboxDashboard />;
  }
  return <ProductionDashboard />;
}

