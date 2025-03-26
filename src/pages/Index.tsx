import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { CalendarIcon, ChevronDown, Users, Phone, PieChart, UserPlus, CheckCheck, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

// Mock Data (replace with actual API calls)
const mockNewUsers = {
  count: 45,
  percentageChange: 12,
};

const mockTotalRevenue = {
  amount: 12345,
  percentageChange: -5,
};

const mockTaskCompletion = {
  completed: 32,
  total: 36,
};

const mockSalesData = [
  { date: '2024-01-01', sales: 1200 },
  { date: '2024-01-02', sales: 1500 },
  { date: '2024-01-03', sales: 1300 },
  { date: '2024-01-04', sales: 1600 },
  { date: '2024-01-05', sales: 1400 },
  { date: '2024-01-06', sales: 1700 },
  { date: '2024-01-07', sales: 1500 },
  { date: '2024-01-08', sales: 1800 },
  { date: '2024-01-09', sales: 1600 },
  { date: '2024-01-10', sales: 1900 },
  { date: '2024-01-11', sales: 1700 },
  { date: '2024-01-12', sales: 2000 },
  { date: '2024-01-13', sales: 1800 },
  { date: '2024-01-14', sales: 2100 },
  { date: '2024-01-15', sales: 1900 },
  { date: '2024-01-16', sales: 2200 },
  { date: '2024-01-17', sales: 2000 },
  { date: '2024-01-18', sales: 2300 },
  { date: '2024-01-19', sales: 2100 },
  { date: '2024-01-20', sales: 2400 },
  { date: '2024-01-21', sales: 2200 },
  { date: '2024-01-22', sales: 2500 },
  { date: '2024-01-23', sales: 2300 },
  { date: '2024-01-24', sales: 2600 },
  { date: '2024-01-25', sales: 2400 },
  { date: '2024-01-26', sales: 2700 },
  { date: '2024-01-27', sales: 2500 },
  { date: '2024-01-28', sales: 2800 },
  { date: '2024-01-29', sales: 2600 },
  { date: '2024-01-30', sales: 2900 },
];

const Index = () => {
  const [sales, setSales] = useState({
    data: mockSalesData,
    labels: mockSalesData.map(item => item.date),
  });
  const [timeframe, setTimeframe] = useState('30d');

  useEffect(() => {
    const today = new Date();
    const startDate = new Date();

    switch (timeframe) {
      case '7d':
        startDate.setDate(today.getDate() - 7);
        break;
      case '14d':
        startDate.setDate(today.getDate() - 14);
        break;
      case '30d':
        startDate.setDate(today.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(today.getDate() - 90);
        break;
      default:
        startDate.setDate(today.getDate() - 30);
        break;
    }

    const filteredData = mockSalesData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= today;
    });

    setSales({
      data: filteredData,
      labels: filteredData.map(item => item.date),
    });
  }, [timeframe]);

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Dashboard</h3>
          <p className="text-muted-foreground">
            Track your overall progress.
          </p>
        </div>
        <Separator />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard title="New Users" icon={<Users className="h-4 w-4" />}>
            <div className="space-y-2">
              <p className="text-2xl font-semibold">{mockNewUsers.count}</p>
              <p className="text-sm text-muted-foreground">
                <span className={cn(mockNewUsers.percentageChange > 0 ? "text-green-500" : "text-red-500")}>
                  {mockNewUsers.percentageChange > 0 ? "+" : ""}
                  {mockNewUsers.percentageChange}%
                </span> change
              </p>
            </div>
          </DashboardCard>

          <DashboardCard title="Total Revenue" icon={<Phone className="h-4 w-4" />}>
            <div className="space-y-2">
              <p className="text-2xl font-semibold">${mockTotalRevenue.amount}</p>
              <p className="text-sm text-muted-foreground">
                <span className={cn(mockTotalRevenue.percentageChange > 0 ? "text-green-500" : "text-red-500")}>
                  {mockTotalRevenue.percentageChange > 0 ? "+" : ""}
                  {mockTotalRevenue.percentageChange}%
                </span> change
              </p>
            </div>
          </DashboardCard>

          <DashboardCard title="Task Completion" icon={<CheckCheck className="h-4 w-4" />}>
            <div className="space-y-2">
              <p className="text-2xl font-semibold">{mockTaskCompletion.completed}/{mockTaskCompletion.total}</p>
              <p className="text-sm text-muted-foreground">
                Tasks completed this month
              </p>
            </div>
          </DashboardCard>

          <DashboardCard title="Support Tickets" icon={<MessageSquare className="h-4 w-4" />}>
            <div className="space-y-2">
              <p className="text-2xl font-semibold">12</p>
              <p className="text-sm text-muted-foreground">
                Open support requests
              </p>
            </div>
          </DashboardCard>
        </div>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>
                Your sales performance over time
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2 pb-4">
              <div className="flex items-center justify-between">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-8 ml-auto">
                      {sales.labels.length > 0 ? `Last ${sales.labels.length}d` : 'Last 30d'}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleTimeframeChange('7d')}>Last 7 days</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTimeframeChange('14d')}>Last 14 days</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTimeframeChange('30d')}>Last 30 days</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTimeframeChange('90d')}>Last 90 days</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={sales.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest activities and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2 pb-4">
              <ul className="list-none space-y-3">
                <li className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Meeting with John at 3:00 PM</span>
                </li>
                <li className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">New user signed up</span>
                </li>
                <li className="flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Generated monthly report</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
