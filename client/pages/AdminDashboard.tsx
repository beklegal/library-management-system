import { useState, useEffect } from "react";
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Plus,
  Settings,
  BarChart3,
  Clock,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardStats {
  totalBooks: number;
  totalUsers: number;
  booksCheckedOut: number;
  overdueBooks: number;
  newMembersThisMonth: number;
  popularGenre: string;
  averageCheckoutDuration: number;
  bookUtilizationRate: number;
}

interface RecentActivity {
  id: string;
  type: 'borrow' | 'return' | 'register' | 'overdue';
  user: string;
  book?: string;
  timestamp: string;
  details: string;
}

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 1250,
    totalUsers: 345,
    booksCheckedOut: 127,
    overdueBooks: 15,
    newMembersThisMonth: 23,
    popularGenre: 'Fiction',
    averageCheckoutDuration: 18,
    bookUtilizationRate: 68
  });

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'borrow',
      user: 'John Doe',
      book: 'The Midnight Library',
      timestamp: '2024-01-20T10:30:00Z',
      details: 'Book borrowed successfully'
    },
    {
      id: '2',
      type: 'return',
      user: 'Jane Smith',
      book: 'Atomic Habits',
      timestamp: '2024-01-20T09:15:00Z',
      details: 'Book returned on time'
    },
    {
      id: '3',
      type: 'register',
      user: 'Mike Johnson',
      timestamp: '2024-01-20T08:45:00Z',
      details: 'New user registration'
    },
    {
      id: '4',
      type: 'overdue',
      user: 'Sarah Wilson',
      book: 'Dune',
      timestamp: '2024-01-19T23:59:00Z',
      details: 'Book is 5 days overdue'
    }
  ]);

  useEffect(() => {
    // Simulate loading dashboard data
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You need administrator privileges to access this page.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'borrow':
        return <BookOpen className="h-4 w-4 text-blue-600" />;
      case 'return':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'register':
        return <Users className="h-4 w-4 text-purple-600" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Library management and analytics overview</p>
            </div>
            <div className="flex space-x-3">
              <Link to="/admin/books">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Book
                </Button>
              </Link>
              <Link to="/admin/books">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Books
                </Button>
              </Link>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Books</p>
                    <p className="text-2xl font-bold">{stats.totalBooks.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.booksCheckedOut} currently checked out
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    <p className="text-xs text-green-600 mt-1">
                      +{stats.newMembersThisMonth} this month
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Utilization Rate</p>
                    <p className="text-2xl font-bold">{stats.bookUtilizationRate}%</p>
                    <Progress value={stats.bookUtilizationRate} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Overdue Books</p>
                    <p className="text-2xl font-bold text-red-600">{stats.overdueBooks}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Requires attention
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Library Statistics</CardTitle>
                    <CardDescription>
                      Key performance indicators for the library
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Books Checked Out</span>
                      <span className="font-semibold">{stats.booksCheckedOut}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Available Books</span>
                      <span className="font-semibold">{stats.totalBooks - stats.booksCheckedOut}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Checkout Duration</span>
                      <span className="font-semibold">{stats.averageCheckoutDuration} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Most Popular Genre</span>
                      <Badge variant="outline">{stats.popularGenre}</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common administrative tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link to="/admin/books" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Manage Books
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => alert('User management coming soon!')}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => alert('Reports feature coming soon!')}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate Reports
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => alert('Settings coming soon!')}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      System Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Overdue Books Alert */}
              {stats.overdueBooks > 0 && (
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-800 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Attention Required
                    </CardTitle>
                    <CardDescription className="text-red-700">
                      There are {stats.overdueBooks} overdue books that need immediate attention.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="default" className="bg-red-600 hover:bg-red-700">
                      View Overdue Books
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest library transactions and user activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                        <div className="flex-shrink-0">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.user}
                              {activity.book && (
                                <span className="text-gray-600"> - {activity.book}</span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatTimestamp(activity.timestamp)}
                            </p>
                          </div>
                          <p className="text-xs text-gray-600">{activity.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Trends</CardTitle>
                    <CardDescription>
                      Book borrowing trends over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-gray-500">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                      <p>Chart visualization would go here</p>
                      <p className="text-sm">Integration with charting library needed</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Popular Categories</CardTitle>
                    <CardDescription>
                      Most borrowed book categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Fiction</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={85} className="w-20" />
                        <span className="text-sm">85%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Science</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={65} className="w-20" />
                        <span className="text-sm">65%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>History</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={45} className="w-20" />
                        <span className="text-sm">45%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Biography</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={30} className="w-20" />
                        <span className="text-sm">30%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
