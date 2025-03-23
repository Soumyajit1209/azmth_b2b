
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Phone, 
  User, 
  Users, 
  MessageSquare, 
  Mic, 
  Bot, 
  Zap, 
  BarChart3,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Index = () => {
  const [businessMetrics, setBusinessMetrics] = useState({
    totalCalls: 1842,
    activeCustomers: 487,
    conversionRate: 23.4,
    revenue: 145800
  });
  
  const salesData = [
    { name: 'Jan', value: 65000 },
    { name: 'Feb', value: 59000 },
    { name: 'Mar', value: 80000 },
    { name: 'Apr', value: 81000 },
    { name: 'May', value: 56000 },
    { name: 'Jun', value: 55000 },
    { name: 'Jul', value: 72000 },
  ];
  
  const aiUsageData = [
    { name: 'Human', value: 32 },
    { name: 'AI', value: 45 },
    { name: 'Hybrid', value: 23 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  
  const upcomingEvents = [
    { id: 1, title: 'Product Demo', time: 'Today, 2:00 PM', with: 'Michael Chen', type: 'video' },
    { id: 2, title: 'Team Meeting', time: 'Tomorrow, 10:00 AM', with: 'Sales Team', type: 'meeting' },
    { id: 3, title: 'Follow-up Call', time: 'Wed, 3:30 PM', with: 'Emma Thompson', type: 'call' },
  ];
  
  const recentCustomers = [
    { id: 1, name: 'Olivia Johnson', company: 'FinSolutions', photo: 'https://i.pravatar.cc/150?img=5' },
    { id: 2, name: 'James Wilson', company: 'DataServe', photo: 'https://i.pravatar.cc/150?img=4' },
    { id: 3, name: 'Sophia Rodriguez', company: 'Global Media', photo: 'https://i.pravatar.cc/150?img=3' },
  ];
  
  return (
    <DashboardLayout>
      <div className="space-y-6 py-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, John</h1>
          <p className="text-muted-foreground">
            Here's an overview of your sales performance and AI-powered tools
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DashboardCard className="bg-primary/10 border-none">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Calls</p>
                <h3 className="text-2xl font-bold">
                  <AnimatedNumber value={businessMetrics.totalCalls} />
                </h3>
                <p className="text-xs text-green-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" /> +12.5% from last month
                </p>
              </div>
              <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary" />
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard className="bg-accent/10 border-none">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <h3 className="text-2xl font-bold">
                  <AnimatedNumber value={businessMetrics.conversionRate} formatter={(value) => `${value}%`} />
                </h3>
                <p className="text-xs text-green-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" /> +5.2% from last month
                </p>
              </div>
              <div className="h-12 w-12 bg-accent/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard className="bg-yellow-500/10 border-none">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Customers</p>
                <h3 className="text-2xl font-bold">
                  <AnimatedNumber value={businessMetrics.activeCustomers} />
                </h3>
                <p className="text-xs text-yellow-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" /> +2.7% from last month
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard className="bg-green-500/10 border-none">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <h3 className="text-2xl font-bold">
                  <AnimatedNumber 
                    value={businessMetrics.revenue}
                    formatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                  />
                </h3>
                <p className="text-xs text-red-400 flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" /> -3.1% from last month
                </p>
              </div>
              <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </DashboardCard>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DashboardCard className="lg:col-span-2 bg-card/50 border-none">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Sales Performance</h3>
              <select className="bg-background border border-border rounded p-1 text-sm">
                <option>Last 7 Months</option>
                <option>Last 12 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(20, 20, 30, 0.9)', borderColor: '#666' }} 
                    labelStyle={{ color: 'white' }}
                    formatter={(value) => [`$${(value / 1000).toFixed(1)}k`, 'Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
          
          <DashboardCard className="bg-card/50 border-none">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">AI Usage</h3>
              <Button variant="ghost" size="sm" className="text-xs gap-1 h-7">
                <Bot className="h-3 w-3" />
                Details
              </Button>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={aiUsageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {aiUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(20, 20, 30, 0.9)', borderColor: '#666' }} 
                    labelStyle={{ color: 'white' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {aiUsageData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  <span className="text-xs">{entry.name}</span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DashboardCard className="bg-card/50 border-none">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button asChild className="h-auto py-4 flex flex-col gap-2 items-center">
                <Link to="/calls">
                  <Phone className="h-6 w-6" />
                  <span>Start Call</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto py-4 flex flex-col gap-2 items-center">
                <Link to="/voice-clone">
                  <Mic className="h-6 w-6" />
                  <span>Voice Clone</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto py-4 flex flex-col gap-2 items-center">
                <Link to="/customers">
                  <Users className="h-6 w-6" />
                  <span>Customers</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto py-4 flex flex-col gap-2 items-center">
                <Link to="/analytics">
                  <BarChart className="h-6 w-6" />
                  <span>Analytics</span>
                </Link>
              </Button>
            </div>
            
            <div className="mt-6 bg-background/50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">AI Assistant</p>
                  <p className="text-xs text-muted-foreground">Voice-powered help</p>
                </div>
              </div>
              <p className="text-sm mb-3">
                Use the AI assistant to quickly search data, schedule calls, or get insights about your customers.
              </p>
              <Button size="sm" variant="outline" className="w-full gap-2">
                <Mic className="h-3 w-3" />
                <span>Activate Voice Assistant</span>
              </Button>
            </div>
          </DashboardCard>
          
          <DashboardCard className="bg-card/50 border-none">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Upcoming Events</h3>
              <Button asChild variant="ghost" size="sm" className="gap-1 text-xs h-7">
                <Link to="/calendar">
                  <Calendar className="h-3 w-3" />
                  View All
                </Link>
              </Button>
            </div>
            
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-background/50 p-3 rounded-lg flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    event.type === 'call' ? 'bg-blue-900/30 text-blue-400' : 
                    event.type === 'video' ? 'bg-purple-900/30 text-purple-400' : 
                    'bg-green-900/30 text-green-400'
                  }`}>
                    {event.type === 'call' ? <Phone className="h-5 w-5" /> :
                     event.type === 'video' ? <Zap className="h-5 w-5" /> :
                     <Users className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{event.title}</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{event.time}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">with {event.with}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <Button asChild variant="outline" className="w-full">
                <Link to="/calendar">
                  <span>View Calendar</span>
                </Link>
              </Button>
            </div>
          </DashboardCard>
          
          <DashboardCard className="bg-card/50 border-none">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Recent Customers</h3>
              <Button asChild variant="ghost" size="sm" className="gap-1 text-xs h-7">
                <Link to="/customers">
                  <Users className="h-3 w-3" />
                  View All
                </Link>
              </Button>
            </div>
            
            <div className="space-y-3 mb-4">
              {recentCustomers.map((customer) => (
                <div key={customer.id} className="bg-background/50 p-3 rounded-lg flex items-center gap-3">
                  <img 
                    src={customer.photo}
                    alt={customer.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">{customer.company}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-accent/10 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">AI Insight</p>
                  <p className="text-xs text-muted-foreground">Based on recent activity</p>
                </div>
              </div>
              <p className="text-sm mb-3">
                FinSolutions customers have shown high interest in your new API integration. Consider scheduling a focused demo.
              </p>
              <Button size="sm" className="w-full">
                Schedule Demo
              </Button>
            </div>
          </DashboardCard>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
