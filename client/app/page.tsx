"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Filter, RefreshCw, BotIcon, Search, AlertCircle, AlertTriangle, Clock, XCircle, Ban, Ticket, MoreHorizontal } from "lucide-react"
import { robotsApi, Robot as RobotType, AlertType } from "@/lib/api"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "true" | "false">("all")
  const [alertFilter, setAlertFilter] = useState<AlertType | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "lastWeek" | "lastMonth">("today")
  const [robots, setRobots] = useState<RobotType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [now, setNow] = useState(() => new Date().getTime());
  const [currentTab, setCurrentTab] = useState("alerts")

  const fetchRobots = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await robotsApi.getAllRobots()
      setRobots(data)
    } catch (error) {
      console.error("Failed to fetch robots:", error)
      setError(error instanceof Error ? error.message : 'Failed to fetch robots. Please try again.')
      setRobots([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRobots()
  }, [])

  // Update the timestamp periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date().getTime());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Add functions to check date ranges
  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  const isLastWeek = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    return date >= lastWeek && date <= today;
  }

  const isLastMonth = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    return date >= lastMonth && date <= today;
  }

  // Filter robots based on search term, status filter, and alert filter
  const filteredRobots = robots.filter((robot) => {
    const matchesSearch = robot.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || robot.status.toString() === statusFilter
    const matchesAlert = alertFilter === "all" || robot.alert === alertFilter
    const matchesPriority = priorityFilter === "all" || robot.priority === priorityFilter
    const matchesTime = timeFilter === "all" || 
      (timeFilter === "today" && isToday(robot.createdAt)) ||
      (timeFilter === "lastWeek" && isLastWeek(robot.createdAt)) ||
      (timeFilter === "lastMonth" && isLastMonth(robot.createdAt))

    return matchesSearch && matchesStatus && matchesAlert && matchesPriority && matchesTime
  })

  // Modify the stats calculation
  const stats = {
    total: robots.length,
    active: currentTab === "alerts" 
      ? robots.filter(r => r.status && isToday(r.createdAt)).length 
      : currentTab === "history"
      ? robots.filter(r => {
          const matchesTime = timeFilter === "all" || 
            (timeFilter === "today" && isToday(r.createdAt)) ||
            (timeFilter === "lastWeek" && isLastWeek(r.createdAt)) ||
            (timeFilter === "lastMonth" && isLastMonth(r.createdAt));
          return r.status && matchesTime;
        }).length
      : robots.filter(r => r.status).length,
    resolved: currentTab === "alerts"
      ? robots.filter(r => !r.status && isToday(r.createdAt)).length
      : currentTab === "history"
      ? robots.filter(r => {
          const matchesTime = timeFilter === "all" || 
            (timeFilter === "today" && isToday(r.createdAt)) ||
            (timeFilter === "lastWeek" && isLastWeek(r.createdAt)) ||
            (timeFilter === "lastMonth" && isLastMonth(r.createdAt));
          return !r.status && matchesTime;
        }).length
      : robots.filter(r => !r.status).length,
    alerts: {
      total: currentTab === "alerts"
        ? robots.filter(r => r.alert !== null && r.status && isToday(r.createdAt)).length // Only count active alerts
        : currentTab === "history"
        ? robots.filter(r => {
            const matchesTime = timeFilter === "all" || 
              (timeFilter === "today" && isToday(r.createdAt)) ||
              (timeFilter === "lastWeek" && isLastWeek(r.createdAt)) ||
              (timeFilter === "lastMonth" && isLastMonth(r.createdAt));
            return r.alert !== null && r.status && matchesTime; // Only count active alerts
          }).length
        : robots.filter(r => r.alert !== null && r.status).length, // Only count active alerts
      system: robots.filter(r => r.alert === 'System exception').length,
      scheduled: robots.filter(r => r.alert === 'Scheduled start failure').length,
      runtime: robots.filter(r => r.alert === 'Runtime Exceeded').length,
      terminated: robots.filter(r => r.alert === 'Terminated').length,
    }
  }

  // Function to render status badge with appropriate color
  const renderStatusBadge = (status: boolean, robotId: number) => {
    if (status) {
      return (
        <Badge 
          variant="outline" 
          className="bg-red-100 text-red-800 border-red-200 flex gap-1 items-center cursor-pointer hover:bg-red-200"
          onClick={() => handleToggleStatus(robotId)}
        >
          <CheckCircle2 className="h-3 w-3" /> Active
        </Badge>
      )
    } else {
      return (
        <Badge 
          variant="outline" 
          className="bg-green-100 text-green-800 border-green-200 flex gap-1 items-center cursor-pointer hover:bg-green-200"
          onClick={() => handleToggleStatus(robotId)}
        >
          <AlertCircle className="h-3 w-3" /> Resolved
        </Badge>
      )
    }
  }

  // Function to render alert badge with appropriate color and icon
  const renderAlertBadge = (alert: AlertType) => {
    if (!alert) return null;

    switch (alert) {
      case 'System exception':
        return <span className="text-black">System Exception</span>
      case 'Scheduled start failure':
        return <span className="text-black">Start Failure</span>
      case 'Runtime Exceeded':
        return <span className="text-black">Runtime Exceeded</span>
      case 'Terminated':
        return <span className="text-black">Terminated</span>
    }
  }

  const handleToggleStatus = async (robotId: number) => {
    try {
      await robotsApi.updateRobotStatus(robotId)
      // Refresh the robots list after toggling status
      fetchRobots()
    } catch (error) {
      console.error("Failed to toggle robot status:", error)
      setError('Failed to update robot status. Please try again.')
    }
  }

  // Modify formatTimeSpan to use the stable timestamp
  const formatTimeSpan = (dateString: string) => {
    const createdAt = new Date(dateString);
    const diffInSeconds = Math.floor((now - createdAt.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <BotIcon className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">RPA Monitoring Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1" 
              onClick={fetchRobots}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6 px-4">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Robots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All robots</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground">Completed tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-red-600">{stats.alerts.total}</div>
              <p className="text-xs text-muted-foreground">Issues requiring attention</p>
            </CardContent>
          </Card>
        </div>

        <Tabs 
          defaultValue="alerts" 
          className="mt-6"
          onValueChange={(value) => setCurrentTab(value)}
        >
          <TabsList>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="robots">Inventory</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>RPA Alerts</CardTitle>
                <CardDescription>
                 Showing alerts from today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search robots..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={statusFilter} onValueChange={(value: "all" | "true" | "false") => setStatusFilter(value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select 
                      value={alertFilter === null ? "none" : alertFilter} 
                      onValueChange={(value) => setAlertFilter(value === "none" ? null : value as AlertType)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by alert" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Alerts</SelectItem>
                        <SelectItem value="System exception">System Exception</SelectItem>
                        <SelectItem value="Scheduled start failure">Start Failure</SelectItem>
                        <SelectItem value="Runtime Exceeded">Runtime Exceeded</SelectItem>
                        <SelectItem value="Terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="1 - Critical">Critical</SelectItem>
                        <SelectItem value="2 - High">High</SelectItem>
                        <SelectItem value="3 - Moderate">Moderate</SelectItem>
                        <SelectItem value="4 - Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <div className="font-semibold flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Created At
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="font-semibold flex items-center gap-2">
                            <BotIcon className="h-4 w-4" />
                            Name
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="font-semibold flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Priority
                          </div>
                        </TableHead>
                          <TableHead>
                          <div className="font-semibold flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Alert
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="font-semibold flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            Status
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="font-semibold flex items-center gap-2">
                            <MoreHorizontal className="h-4 w-4" />
                            Actions
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            Loading robots...
                          </TableCell>
                        </TableRow>
                      ) : filteredRobots.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            {searchTerm || statusFilter !== 'all' || alertFilter !== 'all' || priorityFilter !== 'all' || timeFilter !== 'all'
                              ? 'No robots found matching your filters.'
                              : 'No robots available.'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRobots.map((robot) => (
                          <TableRow key={robot.id}>
                            <TableCell>
                              <div className="font-medium">
                                {formatTimeSpan(robot.createdAt)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-semibold">{robot.name}</div>
                              <div className="text-xs text-muted-foreground">
                                RBT-{String(robot.id).padStart(3, '0')}
                              </div>
                            </TableCell>
                            <TableCell>{robot.priority as '1 - Critical' | '2 - High' | '3 - Moderate' | '4 - Low'}</TableCell>
                            <TableCell>{renderAlertBadge(robot.alert)}</TableCell>
                            <TableCell>{renderStatusBadge(robot.status, robot.id)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-24 h-8 text-xs"
                                >
                                  Create Ticket
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-24 h-8 text-xs"
                                >
                                  Details
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>History</CardTitle>
                <CardDescription>
                  {timeFilter === "today" 
                    ? "Showing alerts from today" 
                    : timeFilter === "lastWeek"
                    ? "Showing alerts from last week"
                    : timeFilter === "lastMonth"
                    ? "Showing alerts from last month"
                    : "Showing all alerts"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search robots..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <Select value={statusFilter} onValueChange={(value: "all" | "true" | "false") => setStatusFilter(value)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select 
                      value={alertFilter === null ? "none" : alertFilter} 
                      onValueChange={(value) => setAlertFilter(value === "none" ? null : value as AlertType)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Filter by alert" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Alerts</SelectItem>
                        <SelectItem value="System exception">System Exception</SelectItem>
                        <SelectItem value="Scheduled start failure">Start Failure</SelectItem>
                        <SelectItem value="Runtime Exceeded">Runtime Exceeded</SelectItem>
                        <SelectItem value="Terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Filter by priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="1 - Critical">Critical</SelectItem>
                        <SelectItem value="2 - High">High</SelectItem>
                        <SelectItem value="3 - Moderate">Moderate</SelectItem>
                        <SelectItem value="4 - Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={timeFilter} onValueChange={(value) => setTimeFilter(value as typeof timeFilter)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Filter by time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="lastWeek">Last Week</SelectItem>
                        <SelectItem value="lastMonth">Last Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <div className="font-semibold flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Created At
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="font-semibold flex items-center gap-2">
                            <BotIcon className="h-4 w-4" />
                            Name
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="font-semibold flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Priority
                          </div>
                        </TableHead>
                          <TableHead>
                          <div className="font-semibold flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Alert
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="font-semibold flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            Status
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="font-semibold flex items-center gap-2">
                            <MoreHorizontal className="h-4 w-4" />
                            Actions
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            Loading robots...
                          </TableCell>
                        </TableRow>
                      ) : filteredRobots.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            {searchTerm || statusFilter !== 'all' || alertFilter !== 'all' || priorityFilter !== 'all' || timeFilter !== 'all'
                              ? 'No robots found matching your filters.'
                              : 'No robots available.'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRobots.map((robot) => (
                          <TableRow key={robot.id}>
                            <TableCell>
                              <div className="font-medium">
                                {formatTimeSpan(robot.createdAt)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-semibold">{robot.name}</div>
                              <div className="text-xs text-muted-foreground">
                                RBT-{String(robot.id).padStart(3, '0')}
                              </div>
                            </TableCell>
                            <TableCell>{robot.priority as '1 - Critical' | '2 - High' | '3 - Moderate' | '4 - Low'}</TableCell>
                            <TableCell>{renderAlertBadge(robot.alert)}</TableCell>
                            <TableCell>{renderStatusBadge(robot.status, robot.id)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-24 h-8 text-xs"
                                >
                                  Create Ticket
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-24 h-8 text-xs"
                                >
                                  Details
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="robots">
          <Card>
            <CardHeader>
              <CardTitle>Robot Inventory</CardTitle>
              <CardDescription>View and manage all your RPA robots.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Robot details will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Monitor the performance of your RPA system.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Performance metrics will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  </div>
)
}