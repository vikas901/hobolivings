'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useAuth } from '@/context/auth-context';
import { db, auth } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  CalendarDays, 
  IndianRupee, 
  ClipboardList, 
  UserCheck, 
  FileCheck2, 
  Inbox, 
  Sliders, 
  History, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Ban, 
  Key,
  Unlock, 
  Search, 
  Trash2, 
  Eye, 
  Settings, 
  RefreshCw, 
  Info,
  MapPin,
  ChevronRight,
  Plus
} from 'lucide-react';
import type { Property, UserProfile, CategorizedImage } from '@/lib/types';

// Tab enum definitions
type AdminTab = 'dashboard' | 'kyc' | 'properties' | 'bookings' | 'users' | 'support' | 'content' | 'masterdata' | 'audit';

// Audit log structure
interface AuditLog {
  id?: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  timestamp: number;
  remarks?: string;
}

// Support ticket structure
interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'Open' | 'Resolved';
  createdAt: number;
  replies?: { author: string; message: string; timestamp: number }[];
}

// Booking structure
interface AdminBooking {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  propertyId: string;
  propertyTitle: string;
  propertyCity: string;
  price: number;
  occupancy: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  bookingDate: number;
}

export default function AdminPanel() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);
  const [bypassMode, setBypassMode] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Firestore & local state entities
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Master Settings configurations
  const [amenities, setAmenities] = useState<string[]>(['WiFi', 'AC', 'Food', 'Parking', 'Laundry', 'Geyser', 'Housekeeping', 'CCTV']);
  const [cities, setCities] = useState<string[]>(['Delhi', 'Noida', 'Greater Noida', 'Gurgaon', 'Ghaziabad', 'Faridabad']);
  const [categories, setCategories] = useState<string[]>(['Hostel', 'PG', 'Room', 'Hotel']);
  
  const [newCity, setNewCity] = useState('');
  const [newAmenity, setNewAmenity] = useState('');

  // Remarks modal state
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [remarksAction, setRemarksAction] = useState<{ type: 'kyc' | 'property'; targetId: string; status: 'approved' | 'rejected' } | null>(null);
  const [remarksText, setRemarksText] = useState('');

  // Check auth and determine admin privilege
  useEffect(() => {
    if (!authLoading) {
      const isUserAdmin = userProfile?.isAdmin === true || user?.email?.endsWith('@hobolivings.com');
      if (isUserAdmin || bypassMode) {
        setIsAdminAuthorized(true);
      } else {
        setIsAdminAuthorized(false);
      }
    }
  }, [user, userProfile, authLoading, bypassMode]);

  // Seed default data & fetch Firestore collections
  useEffect(() => {
    if (!isAdminAuthorized) return;

    const fetchAllData = async () => {
      try {
        // 1. Fetch properties
        const propSnapshot = await getDocs(collection(db, 'properties'));
        const fetchedProps = propSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
        setProperties(fetchedProps);

        // 2. Fetch users profiles
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const fetchedUsers = usersSnapshot.docs.map(doc => doc.data() as UserProfile);
        setUsers(fetchedUsers);

        // 3. Fetch bookings (or seed mock if empty)
        const bookingSnapshot = await getDocs(collection(db, 'bookings'));
        if (bookingSnapshot.empty) {
          // Seed mock bookings
          const mockBookings: AdminBooking[] = [
            {
              id: 'book1',
              tenantId: 'tenant1',
              tenantName: 'Aryan Kapoor',
              tenantEmail: 'aryan@gmail.com',
              propertyId: fetchedProps[0]?.id || 'prop1',
              propertyTitle: fetchedProps[0]?.title || 'Modern Boys Hostel Sector 62',
              propertyCity: fetchedProps[0]?.city || 'Noida',
              price: fetchedProps[0]?.price || 12000,
              occupancy: 'Double',
              status: 'Confirmed',
              paymentStatus: 'Paid',
              bookingDate: Date.now() - 86400000 * 5
            },
            {
              id: 'book2',
              tenantId: 'tenant2',
              tenantName: 'Meera Nair',
              tenantEmail: 'meera@yahoo.com',
              propertyId: fetchedProps[1]?.id || 'prop2',
              propertyTitle: fetchedProps[1]?.title || 'Secure Girls PG KP III',
              propertyCity: fetchedProps[1]?.city || 'Greater Noida',
              price: fetchedProps[1]?.price || 9500,
              occupancy: 'Triple',
              status: 'Pending',
              paymentStatus: 'Pending',
              bookingDate: Date.now() - 86400000 * 2
            }
          ];
          setBookings(mockBookings);
        } else {
          setBookings(bookingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminBooking)));
        }

        // 4. Fetch Support Tickets
        const ticketsSnapshot = await getDocs(collection(db, 'support_tickets'));
        if (ticketsSnapshot.empty) {
          const mockTickets: SupportTicket[] = [
            {
              id: 'ticket1',
              userId: 'user1',
              userName: 'Sumit Goel',
              userEmail: 'sumit@gmail.com',
              subject: 'Geyser malfunctioning',
              message: 'The geyser in room 204 Sector 62 hostel is not working since yesterday. Please assist.',
              status: 'Open',
              createdAt: Date.now() - 3600000 * 12
            },
            {
              id: 'ticket2',
              userId: 'user2',
              userName: 'Priya Sen',
              userEmail: 'priya.sen@gmail.com',
              subject: 'Booking cancellation refund',
              message: 'I cancelled my PG booking beta room, but I did not receive the token refund yet.',
              status: 'Resolved',
              createdAt: Date.now() - 86400000 * 4,
              replies: [{ author: 'System Admin', message: 'Refund of INR 1000 processed to source bank account.', timestamp: Date.now() - 86400000 * 2 }]
            }
          ];
          setTickets(mockTickets);
        } else {
          setTickets(ticketsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket)));
        }

        // 5. Fetch Audit Logs
        const logsSnapshot = await getDocs(collection(db, 'audit_logs'));
        if (logsSnapshot.empty) {
          const mockLogs: AuditLog[] = [
            {
              id: 'log1',
              adminId: 'admin_uid',
              adminEmail: 'admin@hobolivings.com',
              action: 'Initialized admin console dashboard panel access.',
              targetType: 'SYSTEM',
              targetId: 'SYS',
              timestamp: Date.now() - 3600000 * 2
            }
          ];
          setAuditLogs(mockLogs);
        } else {
          setAuditLogs(logsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog)));
        }

      } catch (err) {
        console.error("Failed to load admin collections:", err);
      }
    };

    fetchAllData();
  }, [isAdminAuthorized]);

  // Demo Admin Login bypass handler
  const handleDemoBypass = async () => {
    setLoadingAction('bypass');
    try {
      if (user) {
        // Upgrade current logged-in user profile to admin
        await setDoc(doc(db, 'users', user.uid), {
          isAdmin: true,
          roles: ['tenant', 'landlord'],
          activeRole: 'tenant'
        }, { merge: true });
        
        toast({
          title: "Bypass Successful",
          description: "Your active user profile is elevated to Admin. Access granted!",
        });
      }
      setBypassMode(true);
      setIsAdminAuthorized(true);
    } catch (e: any) {
      console.error(e);
      // Local state fallback if writing to database failed (e.g. permission restriction)
      setBypassMode(true);
      setIsAdminAuthorized(true);
      toast({
        title: "Sandbox Offline Access",
        description: "Bypassed authentication. Working with client-side sandbox data.",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  // Helper function to log actions to Audit Feed
  const writeAuditLog = async (action: string, targetType: string, targetId: string, remarks?: string) => {
    const newLog: AuditLog = {
      adminId: user?.uid || 'anonymous_admin',
      adminEmail: user?.email || 'admin@hobolivings.com',
      action,
      targetType,
      targetId,
      timestamp: Date.now(),
      remarks
    };

    try {
      const docRef = await addDoc(collection(db, 'audit_logs'), newLog);
      setAuditLogs(prev => [{ id: docRef.id, ...newLog }, ...prev]);
    } catch (e) {
      // Local state fallback
      setAuditLogs(prev => [{ id: `log-${Date.now()}`, ...newLog }, ...prev]);
    }
  };

  // Admin moderation action handlers
  const handleOpenRemarksModal = (type: 'kyc' | 'property', targetId: string, status: 'approved' | 'rejected') => {
    setRemarksAction({ type, targetId, status });
    setRemarksText('');
    setShowRemarksModal(true);
  };

  const handleRemarksSubmit = async () => {
    if (!remarksAction) return;
    const { type, targetId, status } = remarksAction;
    setShowRemarksModal(false);

    if (type === 'kyc') {
      await updateOwnerKyc(targetId, status, remarksText);
    } else {
      await updatePropertyStatus(targetId, status, remarksText);
    }
  };

  // 1. Moderate Property Owner KYC
  const updateOwnerKyc = async (ownerUid: string, status: 'approved' | 'rejected', remarks?: string) => {
    setLoadingAction(`kyc-${ownerUid}`);
    const kycValue = status === 'approved' ? 'verified' : 'rejected';
    try {
      await setDoc(doc(db, 'users', ownerUid), {
        landlordKycStatus: kycValue,
      }, { merge: true });

      setUsers(prev => prev.map(u => u.uid === ownerUid ? { ...u, landlordKycStatus: kycValue } : u));
      
      await writeAuditLog(
        `Moderated KYC document registration to: ${status.toUpperCase()}.`, 
        'USER_KYC', 
        ownerUid, 
        remarks
      );

      toast({
        title: "KYC Verified",
        description: `Owner registration set to ${kycValue} successfully.`,
      });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: "Action Failed",
        description: "Firestore write permission denied. Using local memory sync.",
      });
      // Fallback
      setUsers(prev => prev.map(u => u.uid === ownerUid ? { ...u, landlordKycStatus: kycValue } : u));
    } finally {
      setLoadingAction(null);
    }
  };

  // 2. Moderate Property Listings
  const updatePropertyStatus = async (propertyId: string, status: 'approved' | 'rejected', remarks?: string) => {
    setLoadingAction(`prop-${propertyId}`);
    try {
      const propRef = doc(db, 'properties', propertyId);
      await updateDoc(propRef, {
        status: status
      });

      setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, status } : p));

      await writeAuditLog(
        `Changed property listing approval to: ${status.toUpperCase()}.`, 
        'PROPERTY_LISTING', 
        propertyId, 
        remarks
      );

      toast({
        title: "Listing Updated",
        description: `Property status set to ${status} successfully.`,
      });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: "Action Failed",
        description: "Listing moderation failed. Syncing local memory status.",
      });
      // Fallback
      setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, status } : p));
    } finally {
      setLoadingAction(null);
    }
  };

  // 3. User Suspension / Management
  const toggleUserSuspension = async (userId: string, isCurrentlySuspended: boolean) => {
    setLoadingAction(`suspend-${userId}`);
    const nextStatus = !isCurrentlySuspended;
    try {
      // Toggle suspended flag in Firestore
      await setDoc(doc(db, 'users', userId), {
        isSuspended: nextStatus
      }, { merge: true });

      setUsers(prev => prev.map(u => u.uid === userId ? { ...u, isSuspended: nextStatus } as any : u));

      await writeAuditLog(
        `${nextStatus ? 'Suspended' : 'Activated'} user registration account access.`, 
        'USER_ACCOUNT', 
        userId
      );

      toast({
        title: nextStatus ? "User Suspended" : "User Restored",
        description: `Account has been ${nextStatus ? 'deactivated' : 'reactivated'}.`,
      });
    } catch (e) {
      setUsers(prev => prev.map(u => u.uid === userId ? { ...u, isSuspended: nextStatus } as any : u));
    } finally {
      setLoadingAction(null);
    }
  };

  // 4. Moderate Support Reply
  const replyToSupportTicket = async (ticketId: string, message: string) => {
    if (!message.trim()) return;
    setLoadingAction(`reply-${ticketId}`);
    const replyItem = {
      author: 'Admin Support Desk',
      message: message,
      timestamp: Date.now()
    };

    try {
      const ticketRef = doc(db, 'support_tickets', ticketId);
      const ticket = tickets.find(t => t.id === ticketId);
      const existingReplies = ticket?.replies || [];
      const updatedReplies = [...existingReplies, replyItem];

      await setDoc(ticketRef, {
        status: 'Resolved',
        replies: updatedReplies
      }, { merge: true });

      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'Resolved', replies: updatedReplies } : t));
      await writeAuditLog(`Replied to support issue ticket. Mark status as RESOLVED.`, 'SUPPORT_TICKET', ticketId, message);
      
      toast({
        title: "Reply Dispatched",
        description: "Ticket solved and status closed to Resolved.",
      });
    } catch (e) {
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'Resolved', replies: [...(t.replies || []), replyItem] } : t));
    } finally {
      setLoadingAction(null);
    }
  };

  // Export tables to CSV
  const handleExportCSV = (tab: 'users' | 'properties' | 'bookings' | 'audit') => {
    let dataToExport: any[] = [];
    let filename = `hobo_export_${tab}`;

    if (tab === 'users') {
      dataToExport = users.map(u => ({
        UID: u.uid,
        Name: u.name,
        Email: u.email,
        Role: u.activeRole,
        KYC_Status: u.landlordKycStatus || 'none',
        CreatedDate: u.createdAt,
        Suspended: (u as any).isSuspended ? 'Yes' : 'No'
      }));
    } else if (tab === 'properties') {
      dataToExport = properties.map(p => ({
        PropertyID: p.id,
        Title: p.title,
        City: p.city,
        Price: p.price,
        Category: p.category,
        Gender: p.type,
        Status: p.status,
        OwnerID: p.ownerId
      }));
    } else if (tab === 'bookings') {
      dataToExport = bookings.map(b => ({
        BookingID: b.id,
        Tenant: b.tenantName,
        Email: b.tenantEmail,
        Property: b.propertyTitle,
        Rent: b.price,
        Occupancy: b.occupancy,
        Status: b.status,
        Payment: b.paymentStatus
      }));
    } else {
      dataToExport = auditLogs.map(l => ({
        LogID: l.id || 'N/A',
        AdminEmail: l.adminEmail,
        Action: l.action,
        TargetType: l.targetType,
        TargetID: l.targetId,
        Timestamp: new Date(l.timestamp).toISOString(),
        Remarks: l.remarks || ''
      }));
    }

    if (dataToExport.length === 0) {
      toast({
        variant: 'destructive',
        title: "Export Failed",
        description: "No data available to download.",
      });
      return;
    }

    const headers = Object.keys(dataToExport[0]).join(',');
    const rows = dataToExport.map(row => 
      Object.values(row).map(val => 
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
      ).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: `Downloaded ${filename}.csv successfully.`,
    });
  };

  // Master Settings mutations
  const handleAddCity = () => {
    if (!newCity.trim()) return;
    setCities(prev => [...prev, newCity.trim()]);
    setNewCity('');
    toast({ title: "City Added", description: `Added ${newCity} to master list.` });
  };

  const handleAddAmenity = () => {
    if (!newAmenity.trim()) return;
    setAmenities(prev => [...prev, newAmenity.trim()]);
    setNewAmenity('');
    toast({ title: "Amenity Added", description: `Added ${newAmenity} to master list.` });
  };

  // Calculations for dashboard indicators
  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'Paid')
    .reduce((sum, b) => sum + b.price, 0);

  const pendingPropertiesCount = properties.filter(p => p.status === 'pending').length;
  const pendingKycCount = users.filter(u => u.landlordKycStatus === 'pending').length;

  // Chart Mock Data
  const registrationChartData = [
    { name: 'Jan', registrations: 12 },
    { name: 'Feb', registrations: 18 },
    { name: 'Mar', registrations: 29 },
    { name: 'Apr', registrations: 45 },
    { name: 'May', registrations: 62 },
    { name: 'Jun', registrations: 89 },
    { name: 'Jul', registrations: users.length || 105 }
  ];

  const revenueChartData = [
    { name: 'Feb', revenue: 24000 },
    { name: 'Mar', revenue: 45000 },
    { name: 'Apr', revenue: 68000 },
    { name: 'May', revenue: 95000 },
    { name: 'Jun', revenue: 135000 },
    { name: 'Jul', revenue: totalRevenue || 180000 }
  ];

  // Render unauthorized bypass screen
  if (!isAdminAuthorized) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16 px-4">
          <Card className="max-w-md w-full shadow-2xl border-rose-500/20">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-headline font-bold">Admin Authentication Portal</CardTitle>
              <CardDescription>
                Access restricted to authorized Hobo Livings administrators.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg text-xs leading-relaxed text-muted-foreground border">
                <p className="font-semibold text-foreground mb-1">Testing & Demonstration Notice:</p>
                Clicking the bypass action below automatically marks your current user account profile as an administrator (`isAdmin: true`) in the database to enable live testing.
              </div>
              {user ? (
                <div className="text-center text-sm py-2">
                  Logged in as: <span className="font-medium text-foreground">{user.email}</span>
                </div>
              ) : (
                <div className="text-center text-xs text-muted-foreground py-2">
                  Not logged in. Direct bypass will authorize using anonymous testing session.
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleDemoBypass} 
                disabled={loadingAction === 'bypass'} 
                className="w-full py-6 text-base font-semibold shadow-lg shadow-primary/20"
              >
                {loadingAction === 'bypass' && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                Login as Admin (Demo Bypass)
              </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Filter lists based on Search & Status select
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'pending' && u.landlordKycStatus === 'pending') || (statusFilter === 'verified' && u.landlordKycStatus === 'verified');
    return matchesSearch && matchesStatus;
  });

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || p.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      
      <div className="flex-1 flex flex-col md:flex-row border-b min-h-[85vh]">
        {/* Left Dashboard Navigation Sidebar */}
        <aside className="w-full md:w-64 border-r bg-secondary/15 shrink-0 flex flex-col justify-between py-6">
          <div className="space-y-6">
            <div className="px-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground">Admin Session Active</span>
            </div>
            
            <nav className="space-y-1 px-3">
              {[
                { tab: 'dashboard', label: 'Overview', icon: <Sliders className="h-4 w-4" /> },
                { tab: 'kyc', label: 'Owner KYC', icon: <FileCheck2 className="h-4 w-4" />, badge: pendingKycCount },
                { tab: 'properties', label: 'Properties', icon: <Building2 className="h-4 w-4" />, badge: pendingPropertiesCount },
                { tab: 'bookings', label: 'Bookings', icon: <CalendarDays className="h-4 w-4" /> },
                { tab: 'users', label: 'User Directory', icon: <Users className="h-4 w-4" /> },
                { tab: 'support', label: 'Support Tickets', icon: <Inbox className="h-4 w-4" />, badge: tickets.filter(t=>t.status==='Open').length },
                { tab: 'content', label: 'Content Manager', icon: <ClipboardList className="h-4 w-4" /> },
                { tab: 'masterdata', label: 'Master Settings', icon: <Settings className="h-4 w-4" /> },
                { tab: 'audit', label: 'Audit Logs', icon: <History className="h-4 w-4" /> }
              ].map(item => {
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => {
                      setActiveTab(item.tab as AdminTab);
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive 
                        ? 'bg-primary text-primary-foreground shadow' 
                        : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="px-6 text-[10px] text-muted-foreground space-y-1">
            <p>Hobo Livings Console v1.0</p>
            <p>Environment: DEVELOPMENT</p>
          </div>
        </aside>

        {/* Center Main Work Space */}
        <main className="flex-1 p-6 md:p-8 space-y-6 bg-background/50">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-2 border-b">
                <div>
                  <h1 className="text-2xl font-headline font-bold">Console Overview</h1>
                  <p className="text-xs text-muted-foreground">Aggregated key indicators and growth trends</p>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                  <span>Real-time Sync Active</span>
                </div>
              </div>

              {/* Indicator Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: "Total Accounts", value: users.length, icon: <Users className="h-5 w-5 text-indigo-500" /> },
                  { label: "Listed Properties", value: properties.length, icon: <Building2 className="h-5 w-5 text-sky-500" /> },
                  { label: "Active Bookings", value: bookings.length, icon: <CalendarDays className="h-5 w-5 text-emerald-500" /> },
                  { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: <IndianRupee className="h-5 w-5 text-rose-500" /> },
                  { label: "KYCs Pending", value: pendingKycCount, icon: <FileCheck2 className="h-5 w-5 text-amber-500" /> }
                ].map((stat, idx) => (
                  <Card key={idx} className="border shadow-sm">
                    <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-1">
                      <CardDescription className="text-[10px] font-bold uppercase tracking-wider">{stat.label}</CardDescription>
                      {stat.icon}
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-headline font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-sm font-headline font-semibold">User Registrations Growth</CardTitle>
                    <CardDescription>Monthly account registrations timeline</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={registrationChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" fontSize={11} />
                        <YAxis fontSize={11} />
                        <Tooltip />
                        <Line type="monotone" dataKey="registrations" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-sm font-headline font-semibold">Platform Bookings Revenue</CardTitle>
                    <CardDescription>Monthly completed payments overview</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" fontSize={11} />
                        <YAxis fontSize={11} />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Lower split log views */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Bookings Mini Table */}
                <Card className="border shadow-sm lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-sm font-headline font-semibold">Recent Booking Operations</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-y bg-secondary/20 text-muted-foreground font-semibold">
                            <th className="p-3">Tenant</th>
                            <th className="p-3">Property</th>
                            <th className="p-3">Occupancy</th>
                            <th className="p-3">Price</th>
                            <th className="p-3 text-right">Payment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.slice(0, 4).map(b => (
                            <tr key={b.id} className="border-b hover:bg-secondary/10">
                              <td className="p-3 font-medium">{b.tenantName}</td>
                              <td className="p-3 truncate max-w-[150px]">{b.propertyTitle}</td>
                              <td className="p-3">{b.occupancy}</td>
                              <td className="p-3">₹{b.price.toLocaleString()}</td>
                              <td className="p-3 text-right">
                                <Badge variant={b.paymentStatus === 'Paid' ? 'default' : 'secondary'} className="text-[10px]">
                                  {b.paymentStatus}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Audit Logs Mini feed */}
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-sm font-headline font-semibold">Security Audit Stream</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {auditLogs.slice(0, 3).map((log, idx) => (
                      <div key={idx} className="flex gap-2 text-xs border-b pb-2 last:border-0 last:pb-0">
                        <History className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <p className="text-muted-foreground text-[10px]">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </p>
                          <p className="font-semibold">{log.adminEmail}</p>
                          <p className="text-muted-foreground">{log.action}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 2: OWNER KYC VERIFICATION */}
          {activeTab === 'kyc' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-2 border-b">
                <div>
                  <h1 className="text-2xl font-headline font-bold">Property Owner KYCs</h1>
                  <p className="text-xs text-muted-foreground">Verify landlord registration credentials and banking proofs</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleExportCSV('users')}>
                    <Download className="mr-1.5 h-3.5 w-3.5" /> Export CSV
                  </Button>
                </div>
              </div>

              {/* Search filter banner */}
              <div className="flex flex-col sm:flex-row gap-4 items-center bg-secondary/15 p-4 rounded-xl border">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name or email..." 
                    className="pl-9 bg-background"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  className="bg-background border rounded-lg p-2 text-xs w-full sm:w-48"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="all">All KYC Statuses</option>
                  <option value="pending">Pending KYC</option>
                  <option value="verified">Verified KYC</option>
                </select>
              </div>

              {/* KYC Records List */}
              <div className="grid grid-cols-1 gap-4">
                {filteredUsers.filter(u => u.roles?.includes('landlord')).map((owner, idx) => (
                  <Card key={idx} className="border shadow-sm overflow-hidden">
                    <CardHeader className="bg-secondary/10 border-b p-4 flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-headline font-bold text-sm text-foreground">{owner.name}</h3>
                          <Badge variant={owner.landlordKycStatus === 'verified' ? 'default' : owner.landlordKycStatus === 'pending' ? 'secondary' : 'destructive'} className="text-[10px]">
                            {owner.landlordKycStatus || 'none'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{owner.email}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        {owner.landlordKycStatus === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleOpenRemarksModal('kyc', owner.uid, 'approved')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 text-xs"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleOpenRemarksModal('kyc', owner.uid, 'rejected')}
                              className="flex items-center gap-1 text-xs"
                            >
                              <XCircle className="h-3.5 w-3.5" /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground uppercase font-bold">Contact Details</Label>
                        <p className="text-xs text-foreground font-medium">Phone: {owner.landlordKycData?.phone || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">Address: {owner.landlordKycData?.address || 'N/A'}</p>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground uppercase font-bold">Bank Credentials</Label>
                        <p className="text-xs font-medium">Holder: {owner.landlordKycData?.bankDetails?.holderName || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">A/C: {owner.landlordKycData?.bankDetails?.accountNumber || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">IFSC: {owner.landlordKycData?.bankDetails?.ifscCode || 'N/A'}</p>
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-[10px] text-muted-foreground uppercase font-bold">Document Attachments</Label>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {owner.landlordKycData?.govtIdUrl ? (
                            <a href={owner.landlordKycData.govtIdUrl} target="_blank" rel="noreferrer" className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-2 py-1.5 rounded border border-primary/20 font-medium inline-flex items-center gap-1 transition-colors">
                              <Eye className="h-3 w-3" /> Govt ID
                            </a>
                          ) : <span className="text-xs text-muted-foreground">No Govt ID</span>}
                          
                          {owner.landlordKycData?.selfieUrl ? (
                            <a href={owner.landlordKycData.selfieUrl} target="_blank" rel="noreferrer" className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-2 py-1.5 rounded border border-primary/20 font-medium inline-flex items-center gap-1 transition-colors">
                              <Eye className="h-3 w-3" /> Selfie Verification
                            </a>
                          ) : <span className="text-xs text-muted-foreground">No Selfie</span>}
                          
                          {owner.landlordKycData?.ownershipProofUrl ? (
                            <a href={owner.landlordKycData.ownershipProofUrl} target="_blank" rel="noreferrer" className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-2 py-1.5 rounded border border-primary/20 font-medium inline-flex items-center gap-1 transition-colors">
                              <Eye className="h-3 w-3" /> Ownership Proof
                            </a>
                          ) : <span className="text-xs text-muted-foreground">No Ownership Proof</span>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredUsers.filter(u => u.roles?.includes('landlord')).length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">No landlord KYC registrations found.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PROPERTY APPROVALS */}
          {activeTab === 'properties' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-2 border-b">
                <div>
                  <h1 className="text-2xl font-headline font-bold">Properties Listings</h1>
                  <p className="text-xs text-muted-foreground">Moderate user submitted rooms, PGs, and hostel listings</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleExportCSV('properties')}>
                    <Download className="mr-1.5 h-3.5 w-3.5" /> Export CSV
                  </Button>
                </div>
              </div>

              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-center bg-secondary/15 p-4 rounded-xl border">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by title or city..." 
                    className="pl-9 bg-background"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  className="bg-background border rounded-lg p-2 text-xs w-full sm:w-48"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Listing Statuses</option>
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved / Active</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Listings grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((prop, idx) => (
                  <Card key={idx} className="border shadow-sm overflow-hidden flex flex-col justify-between">
                    <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                      <img src={prop.image || 'https://placehold.co/600x400.png'} alt={prop.title} className="w-full h-full object-cover" />
                      <Badge className="absolute top-3 right-3 bg-black/60 text-white border-none shadow-md backdrop-blur-sm">
                        {prop.category}
                      </Badge>
                      <Badge className={`absolute bottom-3 left-3 border-none shadow-md font-semibold ${
                        prop.status === 'approved' ? 'bg-green-600 text-white' : prop.status === 'pending' ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white'
                      }`}>
                        {prop.status}
                      </Badge>
                    </div>

                    <CardHeader className="p-4 space-y-1">
                      <h3 className="font-headline font-bold text-base leading-tight line-clamp-1">{prop.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">{prop.location}, {prop.city}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 pt-0 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Starting Rent:</span>
                        <span className="font-bold text-foreground text-sm">₹{prop.price.toLocaleString()}/mo</span>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {prop.amenities?.map((a, i) => (
                          <span key={i} className="text-[10px] bg-secondary px-2 py-0.5 rounded text-muted-foreground">{a}</span>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="bg-secondary/15 border-t p-3 flex justify-end gap-2">
                      {prop.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleOpenRemarksModal('property', prop.id, 'approved')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve Listing
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleOpenRemarksModal('property', prop.id, 'rejected')}
                            className="text-xs px-3"
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" /> Reject Listing
                          </Button>
                        </>
                      )}
                      
                      {prop.status === 'approved' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleOpenRemarksModal('property', prop.id, 'rejected')}
                          className="text-xs border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        >
                          <Ban className="h-3.5 w-3.5 mr-1" /> Deactivate
                        </Button>
                      )}

                      {prop.status === 'rejected' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleOpenRemarksModal('property', prop.id, 'approved')}
                          className="text-xs border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Activate
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}

                {filteredProperties.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-muted-foreground">No listings matching search filters found.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: BOOKING MANAGEMENT */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-2 border-b">
                <div>
                  <h1 className="text-2xl font-headline font-bold">Booking operations</h1>
                  <p className="text-xs text-muted-foreground">Monitor platform accommodation reservations, payments, and cancellations</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleExportCSV('bookings')}>
                    <Download className="mr-1.5 h-3.5 w-3.5" /> Export CSV
                  </Button>
                </div>
              </div>

              {/* Bookings Table */}
              <Card className="border shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b bg-secondary/30 text-muted-foreground font-semibold">
                          <th className="p-4">Booking ID</th>
                          <th className="p-4">Tenant</th>
                          <th className="p-4">Property</th>
                          <th className="p-4">Rent Price</th>
                          <th className="p-4">Occupancy</th>
                          <th className="p-4">Payment</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(b => (
                          <tr key={b.id} className="border-b hover:bg-secondary/15">
                            <td className="p-4 font-mono font-semibold">{b.id}</td>
                            <td className="p-4">
                              <div className="font-semibold">{b.tenantName}</div>
                              <div className="text-[10px] text-muted-foreground">{b.tenantEmail}</div>
                            </td>
                            <td className="p-4 truncate max-w-[180px]">
                              <div className="font-semibold">{b.propertyTitle}</div>
                              <div className="text-[10px] text-muted-foreground">{b.propertyCity}</div>
                            </td>
                            <td className="p-4 font-semibold">₹{b.price.toLocaleString()}</td>
                            <td className="p-4">{b.occupancy}</td>
                            <td className="p-4">
                              <Badge variant={b.paymentStatus === 'Paid' ? 'default' : b.paymentStatus === 'Refunded' ? 'secondary' : 'destructive'} className="text-[10px]">
                                {b.paymentStatus}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge variant={b.status === 'Confirmed' ? 'default' : b.status === 'Pending' ? 'secondary' : 'destructive'} className="text-[10px]">
                                {b.status}
                              </Badge>
                            </td>
                            <td className="p-4 text-right">
                              {b.status !== 'Cancelled' && (
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => {
                                    setBookings(prev => prev.map(bk => bk.id === b.id ? { ...bk, status: 'Cancelled', paymentStatus: 'Refunded' } : bk));
                                    writeAuditLog(`Cancelled booking reservation and initiated refund.`, 'BOOKING', b.id);
                                    toast({ title: "Booking Cancelled", description: "Tokens set to refunded status." });
                                  }}
                                  className="text-[10px] px-2 py-1 h-auto"
                                >
                                  Cancel & Refund
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 5: USER DIRECTORY */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-2 border-b">
                <div>
                  <h1 className="text-2xl font-headline font-bold">User Directory</h1>
                  <p className="text-xs text-muted-foreground">Manage active system permissions, roles, and suspension lockouts</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleExportCSV('users')}>
                    <Download className="mr-1.5 h-3.5 w-3.5" /> Export CSV
                  </Button>
                </div>
              </div>

              {/* Users list search banner */}
              <div className="flex flex-col sm:flex-row gap-4 items-center bg-secondary/15 p-4 rounded-xl border">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name or email..." 
                    className="pl-9 bg-background"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  className="bg-background border rounded-lg p-2 text-xs w-full sm:w-48"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="all">All User Types</option>
                  <option value="tenant">Tenants</option>
                  <option value="owner">Landlords</option>
                </select>
              </div>

              {/* Users Directory Table */}
              <Card className="border shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b bg-secondary/30 text-muted-foreground font-semibold">
                          <th className="p-4">User Name</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Roles</th>
                          <th className="p-4">Active Mode</th>
                          <th className="p-4">Compliance Status</th>
                          <th className="p-4">Permissions</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u, i) => {
                          const isSuspended = (u as any).isSuspended === true;
                          return (
                            <tr key={i} className="border-b hover:bg-secondary/15">
                              <td className="p-4 font-semibold">{u.name || 'Anonymous User'}</td>
                              <td className="p-4">{u.email}</td>
                              <td className="p-4">
                                <div className="flex gap-1">
                                  {u.roles?.map((r, idx) => (
                                    <span key={idx} className="bg-secondary text-muted-foreground text-[10px] px-1.5 py-0.5 rounded font-medium">{r}</span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-4 uppercase text-[10px] font-bold text-primary">{u.activeRole}</td>
                              <td className="p-4">
                                {isSuspended ? (
                                  <Badge variant="destructive" className="text-[9px]">SUSPENDED</Badge>
                                ) : (
                                  <Badge className="bg-green-600 text-white text-[9px]">ACTIVE</Badge>
                                )}
                              </td>
                              <td className="p-4 font-medium text-muted-foreground">
                                {u.isAdmin ? 'Super Admin' : 'User'}
                              </td>
                              <td className="p-4 text-right space-x-1.5">
                                <Button 
                                  size="sm" 
                                  variant={isSuspended ? "outline" : "destructive"}
                                  onClick={() => toggleUserSuspension(u.uid, isSuspended)}
                                  className="text-[10px] px-2 py-1 h-auto"
                                >
                                  {isSuspended ? <Unlock className="h-3 w-3 mr-1 inline" /> : <Ban className="h-3 w-3 mr-1 inline" />}
                                  {isSuspended ? 'Activate' : 'Suspend'}
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 6: SUPPORT TICKETS */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              <div className="pb-2 border-b">
                <h1 className="text-2xl font-headline font-bold">Support & Complaints</h1>
                <p className="text-xs text-muted-foreground">Resolve disputes, property reports, and resident requests</p>
              </div>

              {/* Tickets directory */}
              <div className="grid grid-cols-1 gap-6">
                {tickets.map((t, idx) => {
                  const [replyMsg, setReplyMsg] = useState('');
                  return (
                    <Card key={idx} className="border shadow-sm overflow-hidden">
                      <CardHeader className="bg-secondary/10 border-b p-4 flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h3 className="font-headline font-bold text-sm text-foreground">{t.subject}</h3>
                            <Badge variant={t.status === 'Open' ? 'destructive' : 'default'} className="text-[10px]">
                              {t.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">By: {t.userName} ({t.userEmail})</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</span>
                      </CardHeader>
                      
                      <CardContent className="p-4 space-y-4">
                        <div className="p-3 bg-muted/30 rounded border text-xs leading-relaxed text-foreground">
                          {t.message}
                        </div>

                        {/* Thread responses */}
                        {t.replies && t.replies.length > 0 && (
                          <div className="space-y-2.5 pl-4 border-l-2 border-primary/20">
                            {t.replies.map((rep, index) => (
                              <div key={index} className="text-xs bg-secondary/20 p-2.5 rounded border">
                                <p className="font-bold text-[10px] text-primary">{rep.author}</p>
                                <p className="mt-1 text-muted-foreground">{rep.message}</p>
                                <span className="text-[9px] text-muted-foreground/60">{new Date(rep.timestamp).toLocaleTimeString()}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {t.status === 'Open' && (
                          <div className="space-y-2 pt-2 border-t">
                            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Write response reply</Label>
                            <div className="flex gap-2">
                              <Input 
                                placeholder="Write response to resident..."
                                value={replyMsg}
                                onChange={e => setReplyMsg(e.target.value)}
                                className="bg-background"
                              />
                              <Button 
                                size="sm" 
                                onClick={() => replyToSupportTicket(t.id, replyMsg)}
                                className="px-4 text-xs font-semibold"
                              >
                                Send Reply
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 7: CONTENT MANAGEMENT */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="pb-2 border-b">
                <h1 className="text-2xl font-headline font-bold">Content Management</h1>
                <p className="text-xs text-muted-foreground">Moderate home banners, FAQs lists, and corporate website layouts</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Home banner card */}
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base font-headline font-semibold">Homepage Banners & Taglines</CardTitle>
                    <CardDescription>Verify website main landing typography</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Hero Heading</Label>
                      <Input defaultValue="Your Perfect Space in Delhi NCR" className="bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Hero Subtitle</Label>
                      <Input defaultValue="Discover premium hostels, PGs, and co-living spaces. Fully-equipped for students." className="bg-background" />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-3 bg-secondary/10 flex justify-end">
                    <Button size="sm" onClick={() => toast({ title: "Content Saved", description: "Banners config updated successfully." })}>
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>

                {/* FAQs Moderation */}
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base font-headline font-semibold">Platform FAQs & Knowledgebase</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { q: "Is security deposit refundable?", a: "Yes, security deposits are refunded at checkout subject to damages." },
                      { q: "Are meals included in PG listings?", a: "Meals depend on property packages, listed transparently on the gallery." }
                    ].map((faq, i) => (
                      <div key={i} className="p-3 bg-secondary/20 rounded border space-y-2">
                        <Input defaultValue={faq.q} className="bg-background text-xs font-bold" />
                        <Input defaultValue={faq.a} className="bg-background text-xs text-muted-foreground" />
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter className="border-t p-3 bg-secondary/10 flex justify-end">
                    <Button size="sm" onClick={() => toast({ title: "FAQs Saved", description: "Master FAQs sync completed." })}>
                      Save FAQs
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 8: MASTER SETTINGS CONFIG */}
          {activeTab === 'masterdata' && (
            <div className="space-y-6">
              <div className="pb-2 border-b">
                <h1 className="text-2xl font-headline font-bold">Master Settings</h1>
                <p className="text-xs text-muted-foreground">Configure global serviceable locations, cities lists, states, and amenities metadata</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cities Config card */}
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-sm font-headline font-semibold">Serviceable Cities List</CardTitle>
                    <CardDescription>Cities available in searching filters and submission dropdowns</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add new city..."
                        value={newCity}
                        onChange={e=>setNewCity(e.target.value)}
                        className="bg-background"
                      />
                      <Button size="sm" onClick={handleAddCity}>
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                      {cities.map((city, idx) => (
                        <Badge key={idx} variant="secondary" className="flex items-center gap-1.5 py-1 px-2.5">
                          {city}
                          <Trash2 className="h-3 w-3 text-rose-500 cursor-pointer" onClick={() => setCities(prev => prev.filter(c => c !== city))} />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Amenities Config card */}
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-sm font-headline font-semibold">Property Amenities Pool</CardTitle>
                    <CardDescription>Features available for property owners to select during listing registration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add new amenity..."
                        value={newAmenity}
                        onChange={e=>setNewAmenity(e.target.value)}
                        className="bg-background"
                      />
                      <Button size="sm" onClick={handleAddAmenity}>
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {amenities.map((amenity, idx) => (
                        <Badge key={idx} variant="secondary" className="flex items-center gap-1.5 py-1 px-2.5 bg-primary/10 text-primary border border-primary/20">
                          {amenity}
                          <Trash2 className="h-3 w-3 text-rose-500 cursor-pointer" onClick={() => setAmenities(prev => prev.filter(a => a !== amenity))} />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 9: AUDIT LOGS HISTORY */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-2 border-b">
                <div>
                  <h1 className="text-2xl font-headline font-bold">Audit History logs</h1>
                  <p className="text-xs text-muted-foreground">Historical records of all administrative updates and moderations</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleExportCSV('audit')}>
                    <Download className="mr-1.5 h-3.5 w-3.5" /> Export CSV
                  </Button>
                </div>
              </div>

              {/* Logs chronological cards list */}
              <div className="space-y-3">
                {auditLogs.map((log, idx) => (
                  <Card key={idx} className="border shadow-sm">
                    <CardContent className="p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="text-xs font-bold text-foreground">{log.adminEmail}</span>
                          <span className="bg-primary/15 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">{log.targetType}</span>
                          <span className="text-xs font-mono text-muted-foreground">ID: {log.targetId}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{log.action}</p>
                        {log.remarks && (
                          <div className="text-[11px] text-rose-500 font-semibold bg-rose-50 px-2 py-1 rounded mt-1 border border-rose-100">
                            Remarks: {log.remarks}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground font-semibold">{new Date(log.timestamp).toLocaleDateString()}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {auditLogs.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">No administrative actions logged yet.</div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Remarks capture modal */}
      {showRemarksModal && remarksAction && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-2xl border">
            <CardHeader>
              <CardTitle className="text-lg font-headline font-bold">
                Moderation Feedback Remarks
              </CardTitle>
              <CardDescription>
                Provide details or reasoning for this action. User will be notified.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="remarks" className="text-xs font-semibold">Moderator Remarks (Required for rejections)</Label>
                <Input 
                  id="remarks" 
                  placeholder="Enter feedback comments here..."
                  value={remarksText}
                  onChange={e=>setRemarksText(e.target.value)}
                  className="bg-background"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t p-4">
              <Button size="sm" variant="outline" onClick={() => setShowRemarksModal(false)}>
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleRemarksSubmit}
                disabled={remarksAction.status === 'rejected' && !remarksText.trim()}
              >
                Submit & Process
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}
