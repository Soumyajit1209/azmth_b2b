import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Phone, Users, TrendingUp, MessageSquare } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const Analytics = () => {
  // State to hold API data
  const [salesData, setSalesData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [conversionRateData, setConversionRateData] = useState([]);
  const [customerEngagementData, setCustomerEngagementData] = useState([]);
  const [customerSentimentData, setCustomerSentimentData] = useState([]);

  // Fetch Sales Performance Data
  useEffect(() => {
    fetch('/analytics/sales-performance')
      .then((res) => res.json())
      .then((data) => setSalesData(data))
      .catch((error) => console.error('Error fetching sales performance data:', error));
  }, []);

  // Fetch AI vs Human Performance Data
  useEffect(() => {
    fetch('/analytics/performance')
      .then((res) => res.json())
      .then((data) => setPerformanceData(data))
      .catch((error) => console.error('Error fetching performance data:', error));
  }, []);

  // Fetch Conversion Rate Data
  useEffect(() => {
    fetch('/analytics/conversion-rate')
      .then((res) => res.json())
      .then((data) => setConversionRateData(data))
      .catch((error) => console.error('Error fetching conversion rate data:', error));
  }, []);

  // Fetch Customer Engagement Data
  useEffect(() => {
    fetch('/analytics/customer-engagement')
      .then((res) => res.json())
      .then((data) => setCustomerEngagementData(data))
      .catch((error) => console.error('Error fetching customer engagement data:', error));
  }, []);

  // Fetch Customer Sentiment Data
  useEffect(() => {
    fetch('/analytics/customer-sentiment')
      .then((res) => res.json())
      .then((data) => setCustomerSentimentData(data))
      .catch((error) => console.error('Error fetching customer sentiment data:', error));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 py-4">
        <div className="space-y-0.5">
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your sales performance, AI efficiency, and customer engagement metrics
          </p>
        </div>
        
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DashboardCard className="bg-primary/10 border-none">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Calls</p>
                <h3 className="text-2xl font-bold">1,284</h3>
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
                <h3 className="text-2xl font-bold">23.4%</h3>
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
                <h3 className="text-2xl font-bold">487</h3>
                <p className="text-xs text-yellow-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" /> +2.7% from last month
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard className="bg-red-500/10 border-none">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Usage</p>
                <h3 className="text-2xl font-bold">67.8%</h3>
                <p className="text-xs text-green-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" /> +15.3% from last month
                </p>
              </div>
              <div className="h-12 w-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </DashboardCard>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">AI Performance</TabsTrigger>
            <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            <DashboardCard className="bg-card/50 border-none p-4">
              <h3 className="text-xl font-semibold mb-4">Sales Performance</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(20, 20, 30, 0.9)', borderColor: '#666' }} 
                      labelStyle={{ color: 'white' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="calls" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="conversions" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="amount" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DashboardCard className="bg-card/50 border-none p-4">
                <h3 className="text-xl font-semibold mb-4">Call Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(20, 20, 30, 0.9)', borderColor: '#666' }} 
                        labelStyle={{ color: 'white' }}
                      />
                      <Legend />
                      <Bar dataKey="aiCalls" name="AI Handled" fill="#8884d8" />
                      <Bar dataKey="humanCalls" name="Human Handled" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>
              
              <DashboardCard className="bg-card/50 border-none p-4">
                <h3 className="text-xl font-semibold mb-4">Conversion by Source</h3>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={conversionRateData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {conversionRateData.map((entry, index) => (
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
              </DashboardCard>
            </div>
          </TabsContent>
          
          {/* AI Performance Tab */}
          <TabsContent value="performance" className="mt-6 space-y-6">
            <DashboardCard className="bg-card/50 border-none p-4">
              <h3 className="text-xl font-semibold mb-4">AI vs Human Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Hardcoded performance details */}
                <div className="bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">AI Performance</h4>
                    <span className="text-xs bg-green-400/20 text-green-400 px-2 py-1 rounded">
                      +23% Efficiency
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Average Call Duration</span>
                      <span className="font-medium">4m 12s</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Conversion Rate</span>
                      <span className="font-medium">24.5%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Customer Satisfaction</span>
                      <span className="font-medium">4.3/5</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Human Performance</h4>
                    <span className="text-xs bg-blue-400/20 text-blue-400 px-2 py-1 rounded">
                      Baseline
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Average Call Duration</span>
                      <span className="font-medium">6m 47s</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Conversion Rate</span>
                      <span className="font-medium">21.2%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Customer Satisfaction</span>
                      <span className="font-medium">4.5/5</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={[
                      { week: 'W1', human: 18, ai: 22, aiAssisted: 25 },
                      { week: 'W2', human: 17, ai: 24, aiAssisted: 27 },
                      { week: 'W3', human: 19, ai: 26, aiAssisted: 29 },
                      { week: 'W4', human: 16, ai: 28, aiAssisted: 31 },
                      { week: 'W5', human: 18, ai: 29, aiAssisted: 33 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="week" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(20, 20, 30, 0.9)', borderColor: '#666' }} 
                      labelStyle={{ color: 'white' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="human" name="Human Only" stroke="#0088FE" />
                    <Line type="monotone" dataKey="ai" name="AI Only" stroke="#00C49F" />
                    <Line type="monotone" dataKey="aiAssisted" name="AI Assisted Human" stroke="#FFBB28" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </TabsContent>
          
          {/* Customer Insights Tab */}
          <TabsContent value="customers" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DashboardCard className="bg-card/50 border-none p-4">
                <h3 className="text-xl font-semibold mb-4">Customer Engagement</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={customerEngagementData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(20, 20, 30, 0.9)', borderColor: '#666' }} 
                        labelStyle={{ color: 'white' }}
                      />
                      <Legend />
                      <Bar dataKey="count" name="Interactions" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>
              
              <DashboardCard className="bg-card/50 border-none p-4">
                <h3 className="text-xl font-semibold mb-4">Customer Sentiment</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={customerSentimentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="date" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(20, 20, 30, 0.9)', borderColor: '#666' }} 
                        labelStyle={{ color: 'white' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="positive" name="Positive" stroke="#00C49F" />
                      <Line type="monotone" dataKey="neutral" name="Neutral" stroke="#FFBB28" />
                      <Line type="monotone" dataKey="negative" name="Negative" stroke="#FF8042" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>
            </div>
            
            {/* Top Performing Segments table remains hardcoded */}
            <DashboardCard className="bg-card/50 border-none p-4">
              <h3 className="text-xl font-semibold mb-4">Top Performing Segments</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-muted">
                      <th className="text-left py-3 px-4">Customer Segment</th>
                      <th className="text-left py-3 px-4">Conversion Rate</th>
                      <th className="text-left py-3 px-4">Avg. Deal Size</th>
                      <th className="text-left py-3 px-4">Retention Rate</th>
                      <th className="text-left py-3 px-4">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { segment: 'Enterprise', conversion: '28%', deal: '$15,420', retention: '92%', growth: '+15%' },
                      { segment: 'Mid-Market', conversion: '32%', deal: '$7,840', retention: '85%', growth: '+23%' },
                      { segment: 'Small Business', conversion: '24%', deal: '$2,350', retention: '78%', growth: '+18%' },
                      { segment: 'Startups', conversion: '35%', deal: '$1,720', retention: '65%', growth: '+42%' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-muted/20">
                        <td className="py-3 px-4">{row.segment}</td>
                        <td className="py-3 px-4">{row.conversion}</td>
                        <td className="py-3 px-4">{row.deal}</td>
                        <td className="py-3 px-4">{row.retention}</td>
                        <td className="py-3 px-4 text-green-400">{row.growth}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DashboardCard>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
