import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Search, 
  Mic,
  MicOff,
  BarChart,
  Phone,
  User,
  Users,
  MessageSquare,
  FileText,
  Calendar,
  Filter,
  Plus,
  MoreHorizontal,
  ChevronDown,
  Edit,
  Trash2,
  Bot,
  Zap,
  Clock,
  ArrowRight
} from 'lucide-react';

// Customer Schema for validation
const CustomerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().regex(/^\d{7,15}$/, { 
    message: "Phone number must contain only digits and be between 7 to 15 characters long." }),
  status: z.enum(['Active', 'Pending', 'Inactive']),
});

const Customers = () => {
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false);
  const [isEditCustomerDialogOpen, setIsEditCustomerDialogOpen] = useState(false);
  const [customers, setCustomers] = useState([
    { id: '1', name: 'Emma Thompson', company: 'Acme Inc', email: 'emma@acme.com', phone: '+1 (555) 123-4567', status: 'Active', lastContact: '2 days ago', photo: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Michael Chen', company: 'TechSoft', email: 'michael@techsoft.com', phone: '+1 (555) 234-5678', status: 'Pending', lastContact: 'Yesterday', photo: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', name: 'Sophia Rodriguez', company: 'Global Media', email: 'sophia@globalmedia.com', phone: '+1 (555) 345-6789', status: 'Active', lastContact: '1 week ago', photo: 'https://i.pravatar.cc/150?img=3' },
    { id: '4', name: 'James Wilson', company: 'DataServe', email: 'james@dataserve.com', phone: '+1 (555) 456-7890', status: 'Inactive', lastContact: '3 days ago', photo: 'https://i.pravatar.cc/150?img=4' },
    { id: '5', name: 'Olivia Johnson', company: 'FinSolutions', email: 'olivia@finsolutions.com', phone: '+1 (555) 567-8901', status: 'Active', lastContact: 'Today', photo: 'https://i.pravatar.cc/150?img=5' },
  ]);

  const interactions = [
    { id: 1, type: 'call', date: 'Today, 10:32 AM', summary: 'Discussed premium plan options', ai: true },
    { id: 2, type: 'email', date: 'Yesterday', summary: 'Sent pricing proposal', ai: false },
    { id: 3, type: 'meeting', date: '3 days ago', summary: 'Product demo with team', ai: false },
    { id: 4, type: 'call', date: '1 week ago', summary: 'Initial outreach', ai: true },
  ];

  const notes = [
    { id: 1, date: 'Today', note: 'Interested in enterprise plan, needs approval from IT department' },
    { id: 2, date: 'Yesterday', note: 'Mentioned budget constraints, considering quarterly payment option' },
    { id: 3, date: 'Last week', note: 'Has concerns about integration with their existing CRM' },
  ];

  // Add Customer Form
  const addCustomerForm = useForm<z.infer<typeof CustomerSchema>>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      status: 'Active',
    }
  });

  // Edit Customer Form
  const editCustomerForm = useForm<z.infer<typeof CustomerSchema>>({
    resolver: zodResolver(CustomerSchema),
  });

  // Toggle Voice Search
  const toggleVoiceSearch = () => {
    setIsVoiceSearch(!isVoiceSearch);
  };

  // Handler for adding a new customer
  const handleAddCustomer = (data: z.infer<typeof CustomerSchema>) => {
    const newCustomer = {
      ...data,
      id: `${customers.length + 1}`,
      lastContact: 'Just now',
      photo: `https://i.pravatar.cc/150?img=${customers.length + 1}`
    };
    
    setCustomers([...customers, {
      id: newCustomer.id,
      name: newCustomer.name || '',
      company: newCustomer.company || '',
      email: newCustomer.email || '',
      phone: newCustomer.phone || '',
      status: newCustomer.status || 'Active',
      lastContact: newCustomer.lastContact,
      photo: newCustomer.photo,
    }]);
    addCustomerForm.reset();
    setIsAddCustomerDialogOpen(false);
  };

  // Handler for editing an existing customer
  const handleEditCustomer = (data: z.infer<typeof CustomerSchema>) => {
    setCustomers(customers.map(customer => 
      customer.id === selectedCustomer 
        ? { ...customer, ...data } 
        : customer
    ));
    
    setIsEditCustomerDialogOpen(false);
  };

  // Handler for deleting a customer
  const handleDeleteCustomer = () => {
    setCustomers(customers.filter(customer => customer.id !== selectedCustomer));
    setSelectedCustomer(null);
  };

  // Prepare edit form when a customer is selected for editing
  const prepareEditCustomer = () => {
    const customer = customers.find(c => c.id === selectedCustomer);
    if (customer) {
      editCustomerForm.reset({
        ...customer,
        status: customer.status as "Active" | "Pending" | "Inactive",
      });
      setIsEditCustomerDialogOpen(true);
    }
  };

  // Existing search and filter logic
  const filteredCustomers = searchQuery
    ? customers.filter(customer => 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : customers;

  const customerDetails = customers.find(c => c.id === selectedCustomer);

  return (
    <DashboardLayout>
      <div className="space-y-6 py-4">
        <div className="space-y-0.5">
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer relationships with AI-powered insights
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <DashboardCard className="bg-card/50 border-none">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search customers..." 
                    className="pl-8 bg-background/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  variant={isVoiceSearch ? "default" : "outline"} 
                  size="icon"
                  onClick={toggleVoiceSearch}
                  className={isVoiceSearch ? "bg-accent text-accent-foreground" : ""}
                >
                  {isVoiceSearch ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setIsAddCustomerDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-1 max-h-[600px] overflow-y-auto">
                {filteredCustomers.map((customer) => (
                  <button
                    key={customer.id}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg text-left hover:bg-background/80 transition-colors ${
                      selectedCustomer === customer.id ? 'bg-background/80 border-l-2 border-primary' : ''
                    }`}
                    onClick={() => setSelectedCustomer(customer.id)}
                  >
                    <img 
                      src={customer.photo}
                      alt={customer.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{customer.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{customer.company}</p>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${
                      customer.status === 'Active' ? 'bg-green-400' : 
                      customer.status === 'Pending' ? 'bg-yellow-400' : 'bg-gray-400'
                    }`}></div>
                  </button>
                ))}
                
                {filteredCustomers.length === 0 && (
                  <div className="text-center py-8">
                    <Search className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No customers found</p>
                  </div>
                )}
              </div>
            </DashboardCard>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            {selectedCustomer ? (
              <>
                <DashboardCard className="bg-card/50 border-none">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                    <img 
                      src={customerDetails?.photo}
                      alt={customerDetails?.name}
                      className="h-16 w-16 rounded-full"
                    />
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <h2 className="text-xl font-bold">{customerDetails?.name}</h2>
                          <p className="text-muted-foreground">{customerDetails?.company}</p>
                        </div>
                        
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          customerDetails?.status === 'Active' ? 'bg-green-900/20 text-green-400' : 
                          customerDetails?.status === 'Pending' ? 'bg-yellow-900/20 text-yellow-400' : 
                          'bg-gray-900/20 text-gray-400'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            customerDetails?.status === 'Active' ? 'bg-green-400' : 
                            customerDetails?.status === 'Pending' ? 'bg-yellow-400' : 'bg-gray-400'
                          }`}></span>
                          {customerDetails?.status}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{customerDetails?.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{customerDetails?.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Last contact: {customerDetails?.lastContact}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={prepareEditCustomer}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Customer</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={handleDeleteCustomer}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete Customer</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </DashboardCard>

                {/* Rest of the existing customer details tabs */}
                <Tabs defaultValue="overview" className="w-full">
                  {/* Your existing tabs content remains the same */}
                </Tabs>
              </>
            ) : (
              <DashboardCard className="bg-card/50 border-none h-[400px] flex flex-col items-center justify-center">
                <Users className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-semibold mb-1">No Customer Selected</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Select a customer from the list or use the search functionality to find a specific customer
                </p>
                <Button 
                  className="gap-2"
                  onClick={() => setIsAddCustomerDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add New Customer
                </Button>
              </DashboardCard>
            )}
          </div>
        </div>

        {/* Add Customer Dialog */}
        <Dialog open={isAddCustomerDialogOpen} onOpenChange={setIsAddCustomerDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <Form {...addCustomerForm}>
              <form onSubmit={addCustomerForm.handleSubmit(handleAddCustomer)} className="space-y-4">
                <FormField
                  control={addCustomerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addCustomerForm.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addCustomerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addCustomerForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter phone number" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addCustomerForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Add Customer</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Customer Dialog */}
        <Dialog open={isEditCustomerDialogOpen} onOpenChange={setIsEditCustomerDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
            </DialogHeader>
            <Form {...editCustomerForm}>
              <form onSubmit={editCustomerForm.handleSubmit(handleEditCustomer)} className="space-y-4">
                <FormField
                  control={editCustomerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editCustomerForm.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editCustomerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editCustomerForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editCustomerForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Update Customer</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Customers;