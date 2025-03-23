
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CallSection } from '@/components/dashboard/CallSection';
import { VoiceCloneSection } from '@/components/dashboard/VoiceCloneSection';
import { CustomerSearch } from '@/components/dashboard/CustomerSearch';
import { CalendarSection } from '@/components/dashboard/CalendarSection';

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-10 py-4">
        <div className="space-y-0.5">
          <h1 className="text-3xl font-bold tracking-tight">Welcome, John</h1>
          <p className="text-muted-foreground">
            Manage your calls, customers, and schedule with AI-powered tools.
          </p>
        </div>
        
        <CallSection />
        <VoiceCloneSection />
        <CustomerSearch />
        <CalendarSection />
      </div>
    </DashboardLayout>
  );
};

export default Index;
