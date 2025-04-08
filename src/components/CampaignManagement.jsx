
"use client"

import { useState, useEffect } from "react"
import { DashboardCard } from "@/components/ui/DashboardCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  FileSpreadsheet,
  Play,
  Pause,
  BarChart3,
  List,
  RefreshCw,
  Trash2,
  ArrowLeft,
  Calendar,
  CheckCircle,
  XCircle,
  Phone
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import toast from "react-hot-toast"

const CampaignManagement = ({ onBack }) => {
  const [campaignFile, setCampaignFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [activeCampaignTab, setActiveCampaignTab] = useState("list")
  const [campaigns, setCampaigns] = useState([
    {
      id: "camp-1",
      name: "Q1 Customer Outreach",
      status: "active",
      progress: 37,
      total: 150,
      completed: 56,
      pending: 94,
      failed: 0,
      date: "Apr 5, 2025"
    },
    {
      id: "camp-2",
      name: "Product Launch Announcement",
      status: "completed",
      progress: 100,
      total: 75,
      completed: 75,
      pending: 0,
      failed: 0,
      date: "Mar 28, 2025"
    },
    {
      id: "camp-3",
      name: "Renewal Contacts",
      status: "paused",
      progress: 62,
      total: 120,
      completed: 74,
      pending: 46,
      failed: 0,
      date: "Apr 2, 2025"
    }
  ])
  
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCampaignFile(file)
    }
  }
  
  const uploadCampaign = async () => {
    if (!campaignFile) {
      toast.error("Please select an Excel file first")
      return
    }
    
    setIsUploading(true)
    
   
    const formData = new FormData()
    formData.append('file', campaignFile)
    formData.append('name', campaignFile.name.replace('.xlsx', ''))
    
    try {
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      
      const newCampaign = {
        id: `camp-${Date.now()}`,
        name: campaignFile.name.replace('.xlsx', ''),
        status: "queued",
        progress: 0,
        total: Math.floor(Math.random() * 100) + 50,
        completed: 0,
        pending: Math.floor(Math.random() * 100) + 50,
        failed: 0,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }
      
      setCampaigns([newCampaign, ...campaigns])
      setCampaignFile(null)
      toast.success("Campaign uploaded successfully")
    } catch (error) {
      console.error("Error uploading campaign:", error)
      toast.error("Failed to upload campaign")
    } finally {
      setIsUploading(false)
    }
  }
  
  const toggleCampaignStatus = (id, currentStatus) => {
    setCampaigns(campaigns.map(campaign => {
      if (campaign.id === id) {
        return {
          ...campaign,
          status: currentStatus === 'active' ? 'paused' : 'active'
        }
      }
      return campaign
    }))
    
    toast.success(`Campaign ${currentStatus === 'active' ? 'paused' : 'activated'}`)
  }
  
  const deleteCampaign = (id) => {
    setCampaigns(campaigns.filter(campaign => campaign.id !== id))
    toast.success("Campaign deleted")
  }
  
  return (
    <div className="space-y-6 py-4 animate-in slide-in-from-right">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Campaign Management</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <DashboardCard className="bg-card/50 border-none h-full">
            <h3 className="text-xl font-semibold mb-4">Upload Campaign</h3>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-background/50 transition-colors cursor-pointer">
                <input 
                  type="file" 
                  id="campaign-file" 
                  className="hidden" 
                  accept=".xlsx,.xls" 
                  onChange={handleFileChange}
                />
                <label htmlFor="campaign-file" className="cursor-pointer flex flex-col items-center">
                  <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-2" />
                  {campaignFile ? (
                    <p className="text-sm font-medium">{campaignFile.name}</p>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Upload Excel File</p>
                      <p className="text-xs text-muted-foreground mt-1">Click to browse or drag and drop</p>
                    </>
                  )}
                </label>
              </div>
              
              <Button 
                className="w-full gap-2" 
                onClick={uploadCampaign} 
                disabled={!campaignFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Start Campaign</span>
                  </>
                )}
              </Button>
              
              <div className="bg-background/50 p-4 rounded-lg space-y-3">
                <h4 className="text-sm font-medium">Campaign Requirements</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                    <span>Excel file with customer contacts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                    <span>Required columns: Name, Phone, Company</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                    <span>Optional: Email, Notes, Priority</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                    <span>Max 5,000 contacts per file</span>
                  </li>
                </ul>
                
                <a href="#" className="text-xs text-primary hover:underline">Download template</a>
              </div>
            </div>
          </DashboardCard>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <DashboardCard className="bg-card/50 border-none">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Campaign List</h3>
              
              <Tabs value={activeCampaignTab} onValueChange={setActiveCampaignTab} className="w-[200px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="list">
                    <List className="h-4 w-4 mr-1" />
                    List
                  </TabsTrigger>
                  <TabsTrigger value="stats">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Stats
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <TabsContent value="list" className="mt-0 space-y-4">
              <div className="space-y-2">
                <AnimatePresence>
                  {campaigns.map(campaign => (
                    <motion.div
                      key={campaign.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="bg-background/50 p-4 rounded-lg border border-border/40"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{campaign.name}</h4>
                            <span 
                              className={`text-xs px-1.5 py-0.5 rounded ${
                                campaign.status === 'active' ? 'bg-green-500/20 text-green-500' : 
                                campaign.status === 'paused' ? 'bg-yellow-500/20 text-yellow-500' :
                                campaign.status === 'completed' ? 'bg-blue-500/20 text-blue-500' :
                                'bg-muted/20 text-muted-foreground'
                              }`}
                            >
                              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {campaign.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {campaign.total} contacts
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {campaign.status !== 'completed' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8"
                              onClick={() => toggleCampaignStatus(campaign.id, campaign.status)}
                            >
                              {campaign.status === 'active' ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 text-destructive hover:text-destructive"
                            onClick={() => deleteCampaign(campaign.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{campaign.progress}%</span>
                        </div>
                        <Progress value={campaign.progress} className="h-2" />
                        
                        <div className="flex justify-between mt-2 text-xs">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span>Completed: {campaign.completed}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span>Pending: {campaign.pending}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            <span>Failed: {campaign.failed}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {campaigns.length === 0 && (
                  <div className="bg-background/50 p-8 rounded-lg text-center">
                    <div className="flex flex-col items-center">
                      <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
                      <h4 className="text-lg font-medium mb-2">No Campaigns</h4>
                      <p className="text-muted-foreground text-sm">
                        Upload an Excel file to start your first campaign
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="stats" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-background/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Calls</p>
                      <p className="text-2xl font-semibold">345</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-background/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-900/20 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-semibold">78%</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-background/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-900/20 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Campaigns</p>
                      <p className="text-2xl font-semibold">2</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="h-64 bg-background/50 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-3">Campaign Performance</h4>
                <div className="h-48">
                  {/* Chart would go here - placeholder for now */}
                  <div className="flex h-full items-end gap-3">
                    {[65, 42, 78, 57, 35, 84, 61].map((value, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-primary/60 rounded-t"
                          style={{ height: `${value}%` }}
                        ></div>
                        <span className="text-xs text-muted-foreground">{`Camp ${i+1}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}

export default CampaignManagement