"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Filter, RefreshCw, BotIcon as Robot, Search, AlertCircle, AlertTriangle, Clock, XCircle, Ban } from "lucide-react"
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
  const [robots, setRobots] = useState<RobotType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  // Filter robots based on search term, status filter, and alert filter
  const filteredRobots = robots.filter((robot) => {
    const matchesSearch = robot.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || robot.status.toString() === statusFilter
    const matchesAlert = alertFilter === "all" || robot.alert === alertFilter

    return matchesSearch && matchesStatus && matchesAlert
  })

  // Calculate stats
  const stats = {
    total: robots.length,
    active: robots.filter(r => r.status).length,
    resolved: robots.filter(r => !r.status).length,
    alerts: {
      total: robots.filter(r => r.alert !== null).length,
      system: robots.filter(r => r.alert === 'System exception').length,
      scheduled: robots.filter(r => r.alert === 'Scheduled start failure').length,
      runtime: robots.filter(r => r.alert === 'Runtime Exceeded').length,
      terminated: robots.filter(r => r.alert === 'Terminated').length,
    }
  }

  // Function to render status badge with appropriate color
  const renderStatusBadge = (status: boolean) => {
    if (status) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex gap-1 items-center">
          <CheckCircle2 className="h-3 w-3" /> Active
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex gap-1 items-center">
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

  const handleUpdateAlert = async (robotId: number, alert: AlertType) => {
    try {
      await robotsApi.updateRobotAlert(robotId, alert)
      fetchRobots()
    } catch (error) {
      console.error("Failed to update robot alert:", error)
      setError('Failed to update robot alert. Please try again.')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Robot className="h-6 w-6 text-primary" />
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
        <div className="grid gap-6 md:grid-cols-4">
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
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground">Currently active robots</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.resolved}</div>
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

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>RPA Robots</CardTitle>
            <CardDescription>Monitor and manage your RPA robots.</CardDescription>
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
                    <SelectItem value="none">No Alert</SelectItem>
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
                    <TableHead>Robot ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Alert</TableHead>
                    <TableHead>Actions</TableHead>
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
                        {searchTerm || statusFilter !== 'all' || alertFilter !== 'all'
                          ? 'No robots found matching your filters.'
                          : 'No robots available.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRobots.map((robot) => (
                      <TableRow key={robot.id}>
                        <TableCell>RBT-{String(robot.id).padStart(3, '0')}</TableCell>
                        <TableCell>{robot.name}</TableCell>
                        <TableCell>{renderStatusBadge(robot.status)}</TableCell>
                        <TableCell>{renderAlertBadge(robot.alert)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-24 h-8 text-xs"
                          >
                            Create Ticket
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}