'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { db, auth } from '@/lib/firebase';
import { seedFirestoreDatabase } from '@/lib/seed-firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc 
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ShieldCheck, 
  ShieldAlert,
  LogOut,
  Users, 
  Building2, 
  CalendarDays, 
  IndianRupee, 
  ClipboardList, 
  FileCheck2, 
  Inbox, 
  Sliders, 
  History, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Trash2, 
  Eye, 
  Settings, 
  RefreshCw, 
  MapPin,
  Plus,
  ExternalLink,
  Copy,
  Check,
  Phone,
  MessageCircle,
  Clock,
  Calendar,
  Lock,
  Sparkles,
  ChevronRight,
  MoreVertical,
  GraduationCap
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import type { Property, UserProfile, Booking } from '@/lib/types';
import { 
  CITY_CLUSTERS, 
  generateCityProperties, 
  ingestPropertiesToFirestore, 
  parseScrapedCsv,
  type DiscoveryOptions 
} from '@/lib/city-scraper-engine';

// Tab enum definitions
type AdminTab = 'dashboard' | 'kyc' | 'properties' | 'bookings' | 'users' | 'support' | 'content' | 'masterdata' | 'audit' | 'scraper';

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
  id?: string;
  userId: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: number;
  replies?: Array<{ author: string; message: string; timestamp: number }>;
}

export default function AdminDashboardPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Admin authentication state
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminMasterKey, setAdminMasterKey] = useState('');
  const [authError, setAuthError] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'promote'>('login');

  // Navigation and active view
  const [activeTab, setActiveTab] = useState<AdminTab>('bookings');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Collections data state
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Master settings state
  const [cities, setCities] = useState<string[]>(['Greater Noida', 'Noida', 'Delhi', 'Gurugram', 'Ghaziabad', 'Faridabad']);
  const [amenities, setAmenities] = useState<string[]>(['WiFi', 'AC', 'Food', 'Laundry', 'Housekeeping', 'CCTV', 'Parking', 'Geyser', 'Gym', 'Power Backup']);
  const [newCity, setNewCity] = useState('');
  const [newAmenity, setNewAmenity] = useState('');

  // Selected booking detail modal state
  const [selectedBookingModal, setSelectedBookingModal] = useState<Booking | null>(null);

  // City Scraper & Ingestion state
  const [scraperCity, setScraperCity] = useState<string>('Greater Noida');
  const [scraperCluster, setScraperCluster] = useState<string>('Knowledge Park 2 (GL Bajaj, Galgotias, NIET)');
  const [scraperCategory, setScraperCategory] = useState<'Hostel' | 'PG' | 'all'>('all');
  const [scraperGender, setScraperGender] = useState<'Boys' | 'Girls' | 'Co-ed' | 'all'>('all');
  const [scraperCount, setScraperCount] = useState<number>(10);
  const [discoveredProperties, setDiscoveredProperties] = useState<Property[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [csvInputText, setCsvInputText] = useState('');
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [ingestSuccessMessage, setIngestSuccessMessage] = useState<string | null>(null);

  // Run Discovery Handler
  const handleRunCityDiscovery = () => {
    setIsDiscovering(true);
    setIngestSuccessMessage(null);
    setTimeout(() => {
      const generated = generateCityProperties({
        city: scraperCity,
        clusterName: scraperCluster,
        category: scraperCategory,
        gender: scraperGender,
        count: scraperCount,
      });
      setDiscoveredProperties(generated);
      setIsDiscovering(false);
      toast({
        title: "Properties Discovered",
        description: `Discovered ${generated.length} listings in ${scraperCity}. Ready for review & live ingestion.`,
      });
    }, 500);
  };

  // Ingest Discovered Properties to Firestore
  const handleIngestDiscoveredProperties = async () => {
    if (discoveredProperties.length === 0) return;
    setIsIngesting(true);
    try {
      const res = await ingestPropertiesToFirestore(discoveredProperties);
      if (res.success) {
        setProperties(prev => [...discoveredProperties, ...prev]);
        setIngestSuccessMessage(`Successfully published ${res.count} properties into live Firestore database!`);
        await writeAuditLog(
          `Ingested ${res.count} properties for ${scraperCity} (${scraperCluster}).`, 
          'SCRAPER_INGEST', 
          `BATCH_${Date.now()}`
        );
        toast({
          title: "Ingestion Complete 🚀",
          description: `${res.count} properties are now live on Hobo Livings!`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: "Ingestion Failed",
          description: res.error,
        });
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: "Ingestion Error",
        description: err.message,
      });
    } finally {
      setIsIngesting(false);
    }
  };

  // CSV Ingestion Handler
  const handleParseCsvInput = () => {
    if (!csvInputText.trim()) return;
    const parsed = parseScrapedCsv(csvInputText, scraperCity);
    if (parsed.length > 0) {
      setDiscoveredProperties(parsed);
      setShowCsvModal(false);
      setCsvInputText('');
      toast({
        title: "CSV Parsed Successfully",
        description: `Loaded ${parsed.length} custom properties for ingestion review.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: "Invalid CSV",
        description: "Please check your CSV format and try again.",
      });
    }
  };

  // Check admin authorization on load
  useEffect(() => {
    if (userProfile?.isAdmin) {
      setIsAdminAuthorized(true);
    } else if (
      user?.email?.endsWith('@hobolivings.com') ||
      user?.email === 'admin@hobolivings.com' ||
      user?.email === 'admin@vikas901.com'
    ) {
      setIsAdminAuthorized(true);
    }
  }, [user, userProfile]);

  // Fetch collections when authorized
  useEffect(() => {
    if (!isAdminAuthorized) return;

    const fetchAllData = async () => {
      try {
        // 1. Fetch Users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        if (usersSnapshot.empty) {
          const mockUsers: UserProfile[] = [
            {
              uid: 'u_student_1',
              name: 'Aarav Sharma',
              email: 'aarav.sharma@galgotias.edu.in',
              phone: '+91 98765 43210',
              activeRole: 'tenant',
              roles: ['tenant'],
              createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
            },
            {
              uid: 'u_owner_1',
              name: 'Rajesh Verma (Host)',
              email: 'rajesh.verma@gmail.com',
              phone: '+91 98112 34567',
              activeRole: 'landlord',
              roles: ['landlord'],
              landlordKycStatus: 'pending',
              createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
            }
          ];
          setUsers(mockUsers);
        } else {
          setUsers(usersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile)));
        }

        // 2. Fetch Properties
        const propSnapshot = await getDocs(collection(db, 'properties'));
        if (propSnapshot.empty) {
          const mockProps: Property[] = [
            {
              id: 'prop_kp2_1',
              title: 'Executive Stay Knowledge Park 2',
              price: 14000,
              city: 'Greater Noida',
              location: 'Knowledge Park 2, Near GL Bajaj',
              type: 'Boys',
              category: 'Hostel',
              status: 'approved',
              description: 'Top-rated student hostel near GL Bajaj with 3-time meals and high-speed WiFi.',
              image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
              amenities: ['WiFi', 'AC', 'Food', 'Laundry'],
              rating: 4.8,
              reviews: 24,
              ownerId: 'u_owner_1',
              roomOptions: [
                { occupancy: 'Double', price: 14000 },
                { occupancy: 'Single', price: 19000 }
              ],
              map: { lat: 28.47, lng: 77.49, nearby: [{ name: 'Knowledge Park 2 Metro', distance: '300m' }] }
            }
          ];
          setProperties(mockProps);
        } else {
          setProperties(propSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property)));
        }

        // 3. Fetch Bookings
        const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
        if (bookingsSnapshot.empty) {
          const mockBookings: Booking[] = [
            {
              id: 'HOBO-VISIT-89201',
              bookingType: 'free_visit',
              status: 'Visit Scheduled',
              propertyId: 'prop_kp2_1',
              propertyTitle: 'Executive Stay Knowledge Park 2',
              propertyLocation: 'Knowledge Park 2, Near GL Bajaj',
              propertyCity: 'Greater Noida',
              propertyImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
              occupancy: 'Double',
              price: 14000,
              tenantId: 'u_student_1',
              tenantName: 'Aarav Sharma',
              tenantPhone: '8920642742',
              tenantEmail: 'aarav.sharma@galgotias.edu.in',
              tenantCollegeOrWork: 'GL Bajaj Institute of Tech',
              visitDate: '2026-08-11',
              visitTimeSlot: 'Evening (5:00 PM - 8:00 PM)',
              moveInTimeline: 'Within 7 Days',
              specialRequests: 'Need corner room with good study table and ventilation.',
              createdAt: new Date().toISOString()
            },
            {
              id: 'HOBO-HOLD-77123',
              bookingType: 'bed_hold',
              status: 'Bed Held (48h)',
              propertyId: 'prop_kp2_1',
              propertyTitle: 'Sector 62 Premium Boys Hostel',
              propertyLocation: 'Sector 62, Near Metro',
              propertyCity: 'Noida',
              propertyImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800',
              occupancy: 'Single',
              price: 18500,
              tenantId: 'u_student_2',
              tenantName: 'Rohan Malhotra',
              tenantPhone: '9812345678',
              tenantEmail: 'rohan.m@gmail.com',
              tenantCollegeOrWork: 'JSS Academy of Technical Education',
              visitDate: '2026-08-12',
              visitTimeSlot: 'Afternoon (2:00 PM - 5:00 PM)',
              moveInTimeline: 'Immediate',
              specialRequests: 'Holding single room before semester starts.',
              createdAt: new Date().toISOString(),
              bedHoldExpiresAt: new Date(Date.now() + 42 * 3600 * 1000).toISOString()
            }
          ];
          setBookings(mockBookings);
        } else {
          setBookings(bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)));
        }

        // 4. Fetch Support Tickets
        const ticketsSnapshot = await getDocs(collection(db, 'support_tickets'));
        if (ticketsSnapshot.empty) {
          const mockTickets: SupportTicket[] = [
            {
              id: 'TICK-101',
              userId: 'u_student_1',
              userEmail: 'aarav.sharma@galgotias.edu.in',
              subject: 'Directions query for Knowledge Park 2 visit',
              message: 'Hi team, is the hostel walking distance from Knowledge Park 2 metro station?',
              status: 'Open',
              priority: 'Medium',
              createdAt: Date.now() - 3600000 * 3
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
              id: 'log-1',
              adminId: 'admin_uid',
              adminEmail: user?.email || 'admin@hobolivings.com',
              action: 'Console online. Synchronized live lead & visit pipelines.',
              targetType: 'SYSTEM',
              targetId: 'SYS_INIT',
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
  }, [isAdminAuthorized, user]);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: "Copied to Clipboard", description: text });
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Status updates for bookings
  const updateBookingStatus = async (bookingId: string, nextStatus: string) => {
    setLoadingAction(`booking-${bookingId}`);
    try {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, { status: nextStatus });
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: nextStatus as any } : b));
      await writeAuditLog(`Updated Booking #${bookingId} status to: ${nextStatus}`, 'BOOKING', bookingId);
      toast({
        title: "Status Updated",
        description: `Booking #${bookingId} marked as ${nextStatus}.`
      });
    } catch (e: any) {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: nextStatus as any } : b));
      toast({
        title: "Status Updated (Local)",
        description: `Booking #${bookingId} marked as ${nextStatus}.`
      });
    } finally {
      setLoadingAction(null);
    }
  };

  // Write audit log
  const writeAuditLog = async (action: string, targetType: string, targetId: string, remarks?: string) => {
    const newLog: AuditLog = {
      adminId: user?.uid || 'admin_session',
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
      setAuditLogs(prev => [{ id: `log-${Date.now()}`, ...newLog }, ...prev]);
    }
  };

  // CSV Export handler
  const handleExportCSV = (tab: string) => {
    let dataToExport: any[] = [];
    if (tab === 'bookings') {
      dataToExport = bookings.map(b => ({
        PassID: b.id,
        BookingType: b.bookingType,
        Status: b.status,
        TenantName: b.tenantName,
        TenantPhone: b.tenantPhone,
        TenantEmail: b.tenantEmail,
        CollegeOrWork: b.tenantCollegeOrWork,
        PropertyTitle: b.propertyTitle,
        Location: b.propertyLocation,
        City: b.propertyCity,
        Occupancy: b.occupancy,
        Price: b.price,
        VisitDate: b.visitDate,
        TimeSlot: b.visitTimeSlot,
        MoveInTimeline: b.moveInTimeline,
        SpecialRequests: b.specialRequests,
        CreatedAt: b.createdAt
      }));
    } else if (tab === 'properties') {
      dataToExport = properties.map(p => ({
        ID: p.id,
        Title: p.title,
        City: p.city,
        Price: p.price,
        Status: p.status
      }));
    } else {
      dataToExport = users.map(u => ({
        UID: u.uid,
        Name: u.name,
        Email: u.email,
        Phone: u.phone,
        Role: u.activeRole
      }));
    }

    if (dataToExport.length === 0) {
      toast({ variant: 'destructive', title: "Export Failed", description: "No records to download." });
      return;
    }

    const headers = Object.keys(dataToExport[0]).join(',');
    const rows = dataToExport.map(row => 
      Object.values(row).map(val => 
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
      ).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `hobo_export_${tab}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: "Export Complete", description: `Downloaded hobo_export_${tab}.csv` });
  };

  // Re-seed Database handler
  const handleSeedDatabase = async () => {
    setLoadingAction('seeding');
    try {
      const res = await seedFirestoreDatabase();
      if (res.success) {
        toast({ title: "Database Re-seeded", description: res.message });
      }
    } catch (e: any) {
      toast({ variant: 'destructive', title: "Seeding Failed", description: e.message });
    } finally {
      setLoadingAction(null);
    }
  };

  // Admin Login Handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction('login');
    setAuthError('');
    try {
      const userCred = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      const userDocRef = doc(db, 'users', userCred.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      const isUserAdmin = 
        userDoc.data()?.isAdmin === true || 
        adminEmail.endsWith('@hobolivings.com') ||
        adminEmail === 'admin@hobolivings.com' ||
        adminEmail === 'admin@vikas901.com';

      if (isUserAdmin) {
        if (!userDoc.data()?.isAdmin) {
          await setDoc(userDocRef, { isAdmin: true }, { merge: true });
        }
        setIsAdminAuthorized(true);
        toast({ title: "Admin Authenticated", description: `Welcome ${adminEmail}` });
      } else {
        setAuthError("Access Denied: Account lacks administrator permissions.");
      }
    } catch (err: any) {
      setAuthError(err.message?.replace('Firebase: ', '') || "Invalid credentials.");
    } finally {
      setLoadingAction(null);
    }
  };

  // Admin Logout Handler
  const handleAdminLogout = async () => {
    try {
      await signOut(auth);
      setIsAdminAuthorized(false);
      toast({ title: "Signed Out", description: "Admin session closed." });
      router.push('/');
    } catch (err: any) {
      console.error(err);
    }
  };

  // =========================================================================
  // UNAUTHORIZED LOGIN VIEW
  // =========================================================================
  if (!isAdminAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 text-slate-100">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="h-14 w-14 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto text-primary shadow-lg shadow-primary/20">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold font-headline tracking-tight">Hobo Livings Console</h1>
            <p className="text-xs text-slate-400">Restricted Administrator & Operations Portal</p>
          </div>

          <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Admin Sign In</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Enter your authorized credentials to access pipelines and moderation.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {authError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-400 flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">Admin Email</Label>
                  <Input
                    type="email"
                    placeholder="admin@hobolivings.com"
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    required
                    className="h-10 bg-slate-800 border-slate-700 text-slate-100 text-xs focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-slate-300">Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    required
                    className="h-10 bg-slate-800 border-slate-700 text-slate-100 text-xs focus-visible:ring-primary"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loadingAction === 'login'} 
                  className="w-full h-10 font-semibold text-xs mt-2 bg-primary hover:bg-primary/90 text-white shadow-lg"
                >
                  {loadingAction === 'login' && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In to Console
                </Button>
              </form>
            </CardContent>

            <CardFooter className="pt-0 border-t border-slate-800/80 flex justify-between items-center text-[11px] text-slate-500">
              <span>Security Level: ENFORCED</span>
              <Link href="/" className="hover:text-slate-300 transition-colors">
                ← Back to Live Site
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const scheduledCount = bookings.filter(b => b.status === 'Visit Scheduled').length;
  const bedHeldCount = bookings.filter(b => b.status === 'Bed Held (48h)').length;
  const visitedCount = bookings.filter(b => b.status === 'Visited').length;
  const finalizedCount = bookings.filter(b => b.status === 'Move-in Finalized').length;
  const cancelledCount = bookings.filter(b => b.status === 'Cancelled').length;
  const totalPipelineValue = bookings.reduce((sum, b) => sum + (b.price || 0), 0);

  // Filtered Bookings
  const filteredBookings = bookings.filter(b => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      (b.id || '').toLowerCase().includes(q) ||
      (b.tenantName || '').toLowerCase().includes(q) ||
      (b.tenantPhone || '').toLowerCase().includes(q) ||
      (b.propertyTitle || '').toLowerCase().includes(q) ||
      (b.propertyCity || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Chart data
  const weeklyTrendsData = [
    { name: 'Mon', visits: 4, holds: 1 },
    { name: 'Tue', visits: 7, holds: 2 },
    { name: 'Wed', visits: 5, holds: 3 },
    { name: 'Thu', visits: 9, holds: 2 },
    { name: 'Fri', visits: 12, holds: 4 },
    { name: 'Sat', visits: 16, holds: 6 },
    { name: 'Sun', visits: 14, holds: 5 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* ===================================================================== */}
      {/* TOP DEDICATED ADMIN NAVBAR                                            */}
      {/* ===================================================================== */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
        
        {/* Left: Brand + Status */}
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white font-black shadow-md shadow-primary/30">
              HL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white tracking-tight">Hobo Livings</span>
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30 text-[10px] font-bold border border-primary/30 px-1.5 py-0">
                  OPS CONSOLE
                </Badge>
              </div>
              <p className="text-[10px] text-slate-400 leading-none">Assisted Visit & Booking Hub</p>
            </div>
          </Link>
        </div>

        {/* Center: Live Sync Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Realtime Lead Pipeline Active</span>
        </div>

        {/* Right: Quick Links & Admin Profile */}
        <div className="flex items-center gap-3">
          
          <Button 
            asChild 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
          >
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <span>Live Website</span>
            </Link>
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSeedDatabase}
            disabled={loadingAction === 'seeding'}
            className="h-8 text-xs border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white hidden sm:inline-flex"
          >
            <RefreshCw className={cn("h-3.5 w-3.5 mr-1.5 text-sky-400", loadingAction === 'seeding' && "animate-spin")} />
            <span>Sync Data</span>
          </Button>

          {/* Admin Avatar & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-semibold text-white leading-tight">{userProfile?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{user?.email || 'admin@hobolivings.com'}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8 border border-slate-700">
                    <AvatarFallback className="bg-primary text-white text-xs font-bold">
                      {(userProfile?.name || user?.email || 'A').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-900 border-slate-800 text-slate-200" align="end">
                <DropdownMenuLabel>
                  <p className="text-xs font-bold text-white">{userProfile?.name || 'Administrator'}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem onClick={() => router.push('/')} className="hover:bg-slate-800 cursor-pointer text-xs">
                  <ExternalLink className="mr-2 h-3.5 w-3.5 text-primary" /> View Live Website
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleAdminLogout} className="hover:bg-rose-500/20 text-rose-400 cursor-pointer text-xs">
                  <LogOut className="mr-2 h-3.5 w-3.5" /> Sign Out of Admin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </div>
      </header>

      {/* ===================================================================== */}
      {/* MAIN TWO-COLUMN DASHBOARD LAYOUT                                      */}
      {/* ===================================================================== */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* =================================================================== */}
        {/* LEFT SIDEBAR NAVIGATION                                             */}
        {/* =================================================================== */}
        <aside className="w-full md:w-60 border-r border-slate-800 bg-slate-900/60 shrink-0 p-4 flex flex-col justify-between">
          
          <div className="space-y-6">
            
            {/* Group 1: Pipeline & Leads */}
            <div className="space-y-1.5">
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Pipeline & Discovery</p>
              
              <button
                onClick={() => { setActiveTab('scraper'); setSearchTerm(''); }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  activeTab === 'scraper'
                    ? "bg-gradient-to-r from-primary via-rose-600 to-amber-600 text-white shadow-md shadow-primary/30"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
                  <span>City Scraper & Ingest</span>
                </div>
                <Badge className={cn(
                  "text-[9px] px-1.5 py-0 font-bold",
                  activeTab === 'scraper' ? "bg-white/20 text-white" : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                )}>
                  AI AGENT
                </Badge>
              </button>

              <button
                onClick={() => { setActiveTab('bookings'); setSearchTerm(''); setStatusFilter('all'); }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  activeTab === 'bookings'
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <CalendarDays className="h-4 w-4 shrink-0" />
                  <span>Bookings & Visits</span>
                </div>
                <Badge className={cn(
                  "text-[10px] px-1.5 py-0 font-bold",
                  activeTab === 'bookings' ? "bg-white/20 text-white" : "bg-primary/20 text-primary border-primary/30"
                )}>
                  {bookings.length}
                </Badge>
              </button>

              <button
                onClick={() => { setActiveTab('dashboard'); setSearchTerm(''); setStatusFilter('all'); }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  activeTab === 'dashboard'
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Sliders className="h-4 w-4 shrink-0" />
                  <span>Overview & Analytics</span>
                </div>
              </button>
            </div>

            {/* Group 2: Moderation */}
            <div className="space-y-1.5">
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Moderation & Assets</p>
              
              <button
                onClick={() => { setActiveTab('properties'); setSearchTerm(''); setStatusFilter('all'); }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  activeTab === 'properties'
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span>Properties</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{properties.length}</span>
              </button>

              <button
                onClick={() => { setActiveTab('kyc'); setSearchTerm(''); setStatusFilter('all'); }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  activeTab === 'kyc'
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="h-4 w-4 shrink-0" />
                  <span>Owner KYC</span>
                </div>
                {users.filter(u => u.landlordKycStatus === 'pending').length > 0 && (
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] px-1.5 py-0 font-bold">
                    {users.filter(u => u.landlordKycStatus === 'pending').length}
                  </Badge>
                )}
              </button>

              <button
                onClick={() => { setActiveTab('users'); setSearchTerm(''); setStatusFilter('all'); }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  activeTab === 'users'
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4 shrink-0" />
                  <span>User Directory</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{users.length}</span>
              </button>

              <button
                onClick={() => { setActiveTab('support'); setSearchTerm(''); setStatusFilter('all'); }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  activeTab === 'support'
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="h-4 w-4 shrink-0" />
                  <span>Support Tickets</span>
                </div>
                {tickets.filter(t => t.status === 'Open').length > 0 && (
                  <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-[10px] px-1.5 py-0 font-bold">
                    {tickets.filter(t => t.status === 'Open').length}
                  </Badge>
                )}
              </button>
            </div>

            {/* Group 3: System & Security */}
            <div className="space-y-1.5">
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">System & Config</p>

              <button
                onClick={() => { setActiveTab('masterdata'); setSearchTerm(''); setStatusFilter('all'); }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  activeTab === 'masterdata'
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="h-4 w-4 shrink-0" />
                  <span>Master Settings</span>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('audit'); setSearchTerm(''); setStatusFilter('all'); }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  activeTab === 'audit'
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <History className="h-4 w-4 shrink-0" />
                  <span>Audit Logs</span>
                </div>
              </button>
            </div>

          </div>

          {/* Sidebar Footer Card */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2 text-[11px]">
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-300 font-semibold">
                <span>Hobo Concierge</span>
                <span className="text-emerald-400 text-[10px]">Active</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">+91 89206 42742</p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAdminLogout}
              className="w-full justify-start text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 h-9"
            >
              <LogOut className="mr-2 h-3.5 w-3.5" /> Sign Out Session
            </Button>
          </div>

        </aside>

        {/* =================================================================== */}
        {/* RIGHT MAIN WORKSPACE CONTENT                                        */}
        {/* =================================================================== */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden bg-slate-950">

          {/* ================================================================= */}
          {/* VIEW: CITY SCRAPER & PROPTECH INGESTION ENGINE                    */}
          {/* ================================================================= */}
          {activeTab === 'scraper' && (
            <div className="space-y-6">
              
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-bold font-headline text-white">
                      City Scraper & Ingestion Engine
                    </h1>
                    <Badge className="bg-gradient-to-r from-amber-500/20 to-primary/20 text-amber-300 border-amber-500/40 text-xs px-2 py-0.5 font-bold">
                      PRO AGGREGATOR
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Auto-discover, normalize, and publish verified student hostels & PGs by city clusters in seconds.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowCsvModal(true)}
                    className="h-9 text-xs border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5 text-primary" /> Import Custom CSV/JSON
                  </Button>

                  {discoveredProperties.length > 0 && (
                    <Button 
                      size="sm" 
                      onClick={handleIngestDiscoveredProperties}
                      disabled={isIngesting}
                      className="h-9 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-900/30"
                    >
                      {isIngesting ? (
                        <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                      )}
                      Publish {discoveredProperties.length} to Live Site
                    </Button>
                  )}
                </div>
              </div>

              {/* Success Banner */}
              {ingestSuccessMessage && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-300 shadow-xl">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white text-sm">{ingestSuccessMessage}</p>
                      <p className="text-emerald-400/80">Properties are now searchable by students with zero commission.</p>
                    </div>
                  </div>
                  <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white h-8 text-xs font-semibold shrink-0">
                    <Link href="/" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> View on Live Homepage
                    </Link>
                  </Button>
                </div>
              )}

              {/* Scraper Control Deck Card */}
              <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-2xl overflow-hidden">
                <CardHeader className="bg-slate-950/60 border-b border-slate-800 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                        <Sliders className="h-4 w-4 text-primary" /> Discovery & Scrape Parameters
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-400">
                        Select your target city, student campus cluster, and accommodation types to discover.
                      </CardDescription>
                    </div>
                    <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[10px]">
                      Preset Hubs: {CITY_CLUSTERS.length} Cities
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-5 space-y-5">
                  
                  {/* Step 1: City Selector */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      1. Select Target City
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {CITY_CLUSTERS.map(c => {
                        const isSelected = scraperCity.toLowerCase() === c.city.toLowerCase();
                        return (
                          <button
                            key={c.city}
                            type="button"
                            onClick={() => {
                              setScraperCity(c.city);
                              setScraperCluster(c.clusters[0].name);
                            }}
                            className={cn(
                              "p-3 rounded-xl border text-left transition-all flex flex-col justify-between",
                              isSelected 
                                ? "bg-primary/20 border-primary text-white shadow-md shadow-primary/20" 
                                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                            )}
                          >
                            <span className="font-bold text-xs block text-white">{c.city}</span>
                            <span className="text-[10px] text-slate-500 mt-1">{c.clusters.length} Student Clusters</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Locality / College Cluster Selector */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      2. Target University / Locality Cluster in {scraperCity}
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(CITY_CLUSTERS.find(c => c.city.toLowerCase() === scraperCity.toLowerCase())?.clusters || []).map(cl => {
                        const isSelected = scraperCluster === cl.name;
                        return (
                          <div
                            key={cl.name}
                            onClick={() => setScraperCluster(cl.name)}
                            className={cn(
                              "p-3.5 rounded-xl border cursor-pointer transition-all text-xs space-y-1.5",
                              isSelected 
                                ? "bg-slate-800 border-primary text-white shadow-md ring-1 ring-primary" 
                                : "bg-slate-950/80 border-slate-800/80 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white">{cl.name}</span>
                              <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                                ₹{cl.priceRange.min.toLocaleString()} - ₹{cl.priceRange.max.toLocaleString()}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-2">{cl.description}</p>
                            <div className="flex flex-wrap gap-1 pt-1">
                              {cl.landmarks.map((lm, idx) => (
                                <span key={idx} className="bg-slate-900 text-slate-400 text-[10px] px-1.5 py-0.5 rounded border border-slate-800">
                                  📍 {lm.name} ({lm.distance})
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 3: Filters (Category, Gender, Batch Size) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
                    
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-300">Category Type</Label>
                      <select
                        value={scraperCategory}
                        onChange={e => setScraperCategory(e.target.value as any)}
                        className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs px-3 focus:ring-primary focus:outline-none"
                      >
                        <option value="all">All (Hostels + PGs)</option>
                        <option value="Hostel">Hostels Only</option>
                        <option value="PG">PGs Only</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-300">Target Gender</Label>
                      <select
                        value={scraperGender}
                        onChange={e => setScraperGender(e.target.value as any)}
                        className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs px-3 focus:ring-primary focus:outline-none"
                      >
                        <option value="all">All (Boys, Girls & Co-ed)</option>
                        <option value="Boys">Boys Only</option>
                        <option value="Girls">Girls Only</option>
                        <option value="Co-ed">Co-ed Only</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-300">Batch Discovery Count</Label>
                      <select
                        value={scraperCount}
                        onChange={e => setScraperCount(Number(e.target.value))}
                        className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs px-3 focus:ring-primary focus:outline-none"
                      >
                        <option value={5}>5 Properties (Fast)</option>
                        <option value={10}>10 Properties (Standard)</option>
                        <option value={20}>20 Properties (Dense Hub)</option>
                        <option value={30}>30 Properties (Full Coverage)</option>
                      </select>
                    </div>

                  </div>

                </CardContent>

                <CardFooter className="bg-slate-950/80 border-t border-slate-800 p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <p className="text-[11px] text-slate-500">
                    💡 Generates clean photo sets, realistic pricing tiers, amenities, and landmark proximities.
                  </p>
                  
                  <Button
                    onClick={handleRunCityDiscovery}
                    disabled={isDiscovering}
                    className="w-full sm:w-auto h-10 px-6 font-bold text-xs bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30"
                  >
                    {isDiscovering ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4 text-amber-300" />
                    )}
                    {isDiscovering ? 'Discovering Properties...' : `🚀 Discover ${scraperCount} Properties in ${scraperCity}`}
                  </Button>
                </CardFooter>
              </Card>

              {/* ============================================================= */}
              {/* DISCOVERED PROPERTIES PREVIEW GRID                            */}
              {/* ============================================================= */}
              {discoveredProperties.length > 0 && (
                <div className="space-y-4 pt-2">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <span>Discovered Properties Preview</span>
                        <Badge className="bg-primary text-white text-xs">
                          {discoveredProperties.length} Ready
                        </Badge>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Targeting: <strong className="text-slate-200">{scraperCity}</strong> — {scraperCluster}
                      </p>
                    </div>

                    <Button
                      onClick={handleIngestDiscoveredProperties}
                      disabled={isIngesting}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold h-10 px-5 shadow-lg shadow-emerald-950"
                    >
                      {isIngesting ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      ⚡ Publish All ({discoveredProperties.length}) to Live Database
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {discoveredProperties.map((p, idx) => (
                      <Card key={idx} className="bg-slate-900 border-slate-800 text-slate-100 overflow-hidden shadow-xl flex flex-col justify-between">
                        <div>
                          <div className="relative h-44 w-full bg-slate-800">
                            <Image
                              src={p.image || '/placeholder.jpg'}
                              alt={p.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                            <div className="absolute top-2 left-2 flex gap-1.5">
                              <Badge className="bg-slate-950/90 text-white border border-slate-700 text-[10px] font-bold">
                                {p.type} • {p.category}
                              </Badge>
                            </div>
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                                ⭐ {p.rating} ({p.reviews})
                              </Badge>
                            </div>
                          </div>

                          <CardContent className="p-4 space-y-2.5">
                            <div>
                              <h3 className="font-bold text-sm text-white truncate" title={p.title}>{p.title}</h3>
                              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                                <span className="truncate">{p.location}, {p.city}</span>
                              </p>
                            </div>

                            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                              {p.description}
                            </p>

                            {/* Room Options */}
                            <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800/80 space-y-1">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sharing Tiers</p>
                              <div className="flex flex-wrap gap-2 text-xs font-mono">
                                {p.roomOptions?.map((ro, rIdx) => (
                                  <span key={rIdx} className="text-slate-300">
                                    <strong className="text-primary">{ro.occupancy}:</strong> ₹{ro.price.toLocaleString()}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Amenities */}
                            <div className="flex flex-wrap gap-1 pt-1">
                              {p.amenities?.slice(0, 5).map((am, aIdx) => (
                                <span key={aIdx} className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.5 rounded border border-slate-700">
                                  {am}
                                </span>
                              ))}
                              {(p.amenities?.length || 0) > 5 && (
                                <span className="text-[10px] text-slate-500 px-1 py-0.5">
                                  +{p.amenities!.length - 5} more
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </div>

                        <CardFooter className="bg-slate-950/60 border-t border-slate-800/80 p-3 flex justify-between items-center text-[11px]">
                          <span className="text-emerald-400 font-bold">✓ ₹0 Commission</span>
                          <span className="text-slate-500 font-mono text-[10px]">ID: {p.id?.substring(0, 16)}</span>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>

                </div>
              )}

              {/* CSV Upload Dialog */}
              {showCsvModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <Card className="max-w-lg w-full bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
                    <CardHeader className="pb-3 border-b border-slate-800">
                      <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                        <Download className="h-4 w-4 text-primary" /> Import Scraped CSV / JSON Export
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-400">
                        Paste data exported from Google Maps, Outscraper, or Apify to bulk load into Hobo Livings.
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-4 space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-300 font-semibold">Paste CSV Text</Label>
                        <textarea
                          rows={8}
                          value={csvInputText}
                          onChange={e => setCsvInputText(e.target.value)}
                          placeholder="title, city, location, price, phone, image&#10;Stanza Living Knowledge Park, Greater Noida, Knowledge Park 2, 14000, 8920642742, https://...&#10;Shree Ram Boys PG, Noida, Sector 62, 12000, 8920642742, https://..."
                          className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:ring-primary focus:outline-none"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Supported columns: <code>title, city, location, price, phone, image</code>
                      </p>
                    </CardContent>

                    <CardFooter className="p-4 border-t border-slate-800 flex justify-between">
                      <Button variant="ghost" size="sm" onClick={() => setShowCsvModal(false)} className="text-xs text-slate-400">
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleParseCsvInput} className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold">
                        Parse & Load Properties
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}

            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW: BOOKINGS & ASSISTED VISITS PIPELINE                         */}
          {/* ================================================================= */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold font-headline text-white flex items-center gap-2.5">
                    <CalendarDays className="h-6 w-6 text-primary" />
                    Assisted Visit & Booking Pipeline
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage student site visits, 48h bed reservations, caretaker dispatches, and move-in closures.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleExportCSV('bookings')}
                    className="h-9 text-xs border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5 text-primary" /> Export CSV
                  </Button>
                </div>
              </div>

              {/* 5 KPI Stat Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                
                <Card className="bg-slate-900/80 border-slate-800 text-slate-100 shadow-lg">
                  <CardContent className="p-4 space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Total Leads</span>
                      <Users className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="text-2xl font-black font-headline text-white">{bookings.length}</div>
                    <p className="text-[10px] text-slate-500">Lifetime inquiries</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/80 border-slate-800 text-slate-100 shadow-lg">
                  <CardContent className="p-4 space-y-1">
                    <div className="flex items-center justify-between text-blue-400">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Visits Scheduled</span>
                      <Calendar className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="text-2xl font-black font-headline text-blue-400">{scheduledCount}</div>
                    <p className="text-[10px] text-slate-500">Passes generated</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/80 border-slate-800 text-slate-100 shadow-lg">
                  <CardContent className="p-4 space-y-1">
                    <div className="flex items-center justify-between text-amber-400">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Bed Held (48h)</span>
                      <Lock className="h-4 w-4 text-amber-400" />
                    </div>
                    <div className="text-2xl font-black font-headline text-amber-400">{bedHeldCount}</div>
                    <p className="text-[10px] text-slate-500">Zero-cost reservations</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/80 border-slate-800 text-slate-100 shadow-lg">
                  <CardContent className="p-4 space-y-1">
                    <div className="flex items-center justify-between text-purple-400">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Site Visited</span>
                      <CheckCircle2 className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="text-2xl font-black font-headline text-purple-400">{visitedCount}</div>
                    <p className="text-[10px] text-slate-500">Completed tours</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/80 border-slate-800 text-slate-100 shadow-lg">
                  <CardContent className="p-4 space-y-1">
                    <div className="flex items-center justify-between text-emerald-400">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Move-in Finalized</span>
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-black font-headline text-emerald-400">{finalizedCount}</div>
                    <p className="text-[10px] text-slate-500">Successful conversions</p>
                  </CardContent>
                </Card>

              </div>

              {/* Search & Filter Toolbar */}
              <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                
                {/* Search input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Search tenant name, phone, pass ID, property, city..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 h-9 text-xs bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-primary"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-2.5 text-[10px] text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Status Segment Pills */}
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {[
                    { id: 'all', label: 'All', count: bookings.length },
                    { id: 'Visit Scheduled', label: 'Scheduled', count: scheduledCount },
                    { id: 'Bed Held (48h)', label: 'Bed Held', count: bedHeldCount },
                    { id: 'Visited', label: 'Visited', count: visitedCount },
                    { id: 'Move-in Finalized', label: 'Finalized', count: finalizedCount },
                    { id: 'Cancelled', label: 'Cancelled', count: cancelledCount },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setStatusFilter(tab.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5",
                        statusFilter === tab.id
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-slate-950/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200"
                      )}
                    >
                      <span>{tab.label}</span>
                      <span className={cn(
                        "text-[10px] px-1 rounded-full font-bold",
                        statusFilter === tab.id ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                      )}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

              </div>

              {/* ============================================================= */}
              {/* BOOKINGS DATA TABLE                                           */}
              {/* ============================================================= */}
              <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                          <th className="py-3.5 px-4">Pass ID & Type</th>
                          <th className="py-3.5 px-4">Tenant / Student</th>
                          <th className="py-3.5 px-4">Property & Room</th>
                          <th className="py-3.5 px-4">Visit Slot & Move-in</th>
                          <th className="py-3.5 px-4">Rent (₹)</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-right">Concierge Actions</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-800/60">
                        {filteredBookings.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-slate-500">
                              <CalendarDays className="h-8 w-8 mx-auto text-slate-600 mb-2" />
                              <p className="text-sm font-semibold text-slate-400">No visits or bookings found</p>
                              <p className="text-xs text-slate-500 mt-1">Try clearing search filters or checking other pipeline stages.</p>
                            </td>
                          </tr>
                        ) : (
                          filteredBookings.map(b => {
                            const visitorPhoneClean = (b.tenantPhone || '8920642742').replace(/\D/g, '');
                            const whatsappTenantMsg = encodeURIComponent(
                              `Hi ${b.tenantName}! 👋 This is the Hobo Livings team regarding your scheduled visit for *${b.propertyTitle}* on *${b.visitDate || 'Tomorrow'} (${b.visitTimeSlot || 'Evening'})*.\n\n` +
                              `Pass ID: #${b.id}\n` +
                              `Directions: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.propertyTitle + ' ' + (b.propertyCity || 'Greater Noida'))}\n\n` +
                              `Please let us know if you need any assistance reaching the property!`
                            );
                            const whatsappTenantUrl = `https://wa.me/91${visitorPhoneClean}?text=${whatsappTenantMsg}`;

                            const passId = b.id || `visit-${b.propertyId}`;
                            const isHeld = b.bookingType === 'bed_hold';

                            return (
                              <tr key={passId} className="hover:bg-slate-800/40 transition-colors group">
                                
                                {/* 1. Pass ID & Booking Type */}
                                <td className="py-3.5 px-4 font-mono align-top">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-slate-200 text-xs truncate max-w-[110px]" title={passId}>
                                      #{passId.substring(0, 10)}...
                                    </span>
                                    <button 
                                      onClick={() => handleCopy(passId, passId)}
                                      className="text-slate-500 hover:text-primary transition-colors p-0.5 rounded"
                                      title="Copy full Pass ID"
                                    >
                                      {copiedId === passId ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                                    </button>
                                  </div>

                                  <div className="mt-1">
                                    {isHeld ? (
                                      <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px] font-sans font-semibold px-1.5 py-0.5">
                                        🔒 48h Bed Hold
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30 text-[10px] font-sans font-semibold px-1.5 py-0.5">
                                        🗓️ Free Site Visit
                                      </Badge>
                                    )}
                                  </div>
                                </td>

                                {/* 2. Tenant Info */}
                                <td className="py-3.5 px-4 align-top">
                                  <div className="flex items-start gap-2.5">
                                    <div className="h-7 w-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold text-xs shrink-0 mt-0.5">
                                      {(b.tenantName || 'T').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="space-y-0.5">
                                      <div className="font-bold text-white text-xs leading-tight">{b.tenantName}</div>
                                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                                        <Phone className="h-3 w-3 text-slate-500" />
                                        <a href={`tel:+91${b.tenantPhone}`} className="hover:text-primary hover:underline">
                                          +91 {b.tenantPhone || 'N/A'}
                                        </a>
                                      </div>
                                      {b.tenantCollegeOrWork && b.tenantCollegeOrWork !== 'Not specified' && (
                                        <div className="text-[10px] text-primary font-medium flex items-center gap-1 truncate max-w-[160px]" title={b.tenantCollegeOrWork}>
                                          <GraduationCap className="h-3 w-3 shrink-0" />
                                          <span className="truncate">{b.tenantCollegeOrWork}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* 3. Property & Room */}
                                <td className="py-3.5 px-4 align-top max-w-[200px]">
                                  <div className="font-semibold text-slate-200 text-xs truncate" title={b.propertyTitle}>
                                    {b.propertyTitle}
                                  </div>
                                  <div className="text-[11px] text-slate-400 flex items-center gap-1 truncate mt-0.5">
                                    <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                                    <span className="truncate">{b.propertyLocation || b.propertyCity || 'Greater Noida'}</span>
                                  </div>
                                  <div className="mt-1">
                                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-medium border border-slate-700">
                                      {b.occupancy} Sharing
                                    </span>
                                  </div>
                                </td>

                                {/* 4. Visit Slot & Move In */}
                                <td className="py-3.5 px-4 align-top">
                                  <div className="font-semibold text-slate-200 text-xs flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-primary" />
                                    <span>{b.visitDate || 'Tomorrow'}</span>
                                  </div>
                                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                    <Clock className="h-3 w-3 text-slate-500" />
                                    <span>{b.visitTimeSlot || 'Evening'}</span>
                                  </div>
                                  {b.moveInTimeline && (
                                    <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                                      Move-in: {b.moveInTimeline}
                                    </div>
                                  )}
                                  {b.specialRequests && (
                                    <div className="text-[10px] text-slate-400 italic mt-0.5 truncate max-w-[150px]" title={b.specialRequests}>
                                      "{b.specialRequests}"
                                    </div>
                                  )}
                                </td>

                                {/* 5. Rent Amount */}
                                <td className="py-3.5 px-4 align-top font-mono">
                                  <div className="font-black text-sm text-white">₹{b.price?.toLocaleString()}</div>
                                  <div className="text-[10px] text-emerald-400 font-bold mt-0.5">✓ ₹0 Commission</div>
                                </td>

                                {/* 6. Status Badge */}
                                <td className="py-3.5 px-4 align-top">
                                  <Badge 
                                    className={cn(
                                      "text-[10px] font-semibold border px-2 py-0.5",
                                      b.status === 'Move-in Finalized'
                                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                        : b.status === 'Visited'
                                        ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                                        : b.status === 'Bed Held (48h)'
                                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                        : b.status === 'Visit Scheduled'
                                        ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                                        : "bg-slate-800 text-slate-400 border-slate-700"
                                    )}
                                  >
                                    {b.status}
                                  </Badge>
                                </td>

                                {/* 7. Concierge Actions */}
                                <td className="py-3.5 px-4 align-top text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    
                                    {/* 1-Click WhatsApp Button */}
                                    <Button
                                      asChild
                                      size="sm"
                                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] h-7 px-2.5 font-semibold shadow-md"
                                      title="Open verified WhatsApp chat with student"
                                    >
                                      <a href={whatsappTenantUrl} target="_blank" rel="noopener noreferrer">
                                        <MessageCircle className="h-3.5 w-3.5 mr-1" /> WhatsApp
                                      </a>
                                    </Button>

                                    {/* Quick Status Dropdown Menu */}
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="h-7 px-2 border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                                        >
                                          <MoreVertical className="h-3.5 w-3.5" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      
                                      <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200 text-xs">
                                        <DropdownMenuLabel className="text-[10px] text-slate-400 uppercase tracking-wider">
                                          Update Visit Status
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-slate-800" />
                                        
                                        {b.status !== 'Visited' && (
                                          <DropdownMenuItem 
                                            onClick={() => updateBookingStatus(passId, 'Visited')}
                                            className="hover:bg-slate-800 cursor-pointer"
                                          >
                                            <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-purple-400" />
                                            Mark as Site Visited
                                          </DropdownMenuItem>
                                        )}

                                        {b.status !== 'Move-in Finalized' && (
                                          <DropdownMenuItem 
                                            onClick={() => updateBookingStatus(passId, 'Move-in Finalized')}
                                            className="hover:bg-slate-800 cursor-pointer text-emerald-400 font-semibold"
                                          >
                                            <Sparkles className="mr-2 h-3.5 w-3.5" />
                                            Finalize Move-In (Deal Won)
                                          </DropdownMenuItem>
                                        )}

                                        {b.status !== 'Visit Scheduled' && (
                                          <DropdownMenuItem 
                                            onClick={() => updateBookingStatus(passId, 'Visit Scheduled')}
                                            className="hover:bg-slate-800 cursor-pointer text-blue-400"
                                          >
                                            <Calendar className="mr-2 h-3.5 w-3.5" />
                                            Set to Scheduled
                                          </DropdownMenuItem>
                                        )}

                                        <DropdownMenuSeparator className="bg-slate-800" />

                                        {b.status !== 'Cancelled' && (
                                          <DropdownMenuItem 
                                            onClick={() => updateBookingStatus(passId, 'Cancelled')}
                                            className="hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                                          >
                                            <XCircle className="mr-2 h-3.5 w-3.5" />
                                            Cancel Booking
                                          </DropdownMenuItem>
                                        )}
                                      </DropdownMenuContent>
                                    </DropdownMenu>

                                  </div>
                                </td>

                              </tr>
                            );
                          })
                        )}
                      </tbody>

                    </table>
                  </div>
                </CardContent>
              </Card>

            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW: OVERVIEW DASHBOARD & CHARTS                                 */}
          {/* ================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <h1 className="text-2xl font-bold font-headline text-white">Console Overview & Metrics</h1>
                <p className="text-xs text-slate-400">Aggregated performance indicators and activity growth.</p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-slate-900 border-slate-800 text-slate-100">
                  <CardContent className="p-4 space-y-1">
                    <div className="text-xs text-slate-400 font-semibold uppercase">Total Users</div>
                    <div className="text-2xl font-bold text-white">{users.length}</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800 text-slate-100">
                  <CardContent className="p-4 space-y-1">
                    <div className="text-xs text-slate-400 font-semibold uppercase">Active Listings</div>
                    <div className="text-2xl font-bold text-sky-400">{properties.length}</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800 text-slate-100">
                  <CardContent className="p-4 space-y-1">
                    <div className="text-xs text-slate-400 font-semibold uppercase">Total Visits & Leads</div>
                    <div className="text-2xl font-bold text-primary">{bookings.length}</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800 text-slate-100">
                  <CardContent className="p-4 space-y-1">
                    <div className="text-xs text-slate-400 font-semibold uppercase">Pipeline Value</div>
                    <div className="text-2xl font-bold text-emerald-400">₹{totalPipelineValue.toLocaleString()}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Chart */}
              <Card className="bg-slate-900 border-slate-800 text-slate-100">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-white">Weekly Visit Inquiries & Bed Holds</CardTitle>
                  <CardDescription className="text-xs text-slate-400">Lead generation activity over past 7 days</CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                      <Bar dataKey="visits" name="Visits Scheduled" fill="#ff4d6d" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="holds" name="48h Bed Holds" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW: PROPERTIES MODERATION                                       */}
          {/* ================================================================= */}
          {activeTab === 'properties' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div>
                  <h1 className="text-2xl font-bold font-headline text-white">Property Listings Moderation</h1>
                  <p className="text-xs text-slate-400">Review landlord submissions, room categories, and photos.</p>
                </div>
                <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs">
                  <Link href="/list-your-property">
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Property
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties.map(p => (
                  <Card key={p.id} className="bg-slate-900 border-slate-800 text-slate-100 overflow-hidden shadow-lg">
                    <div className="relative h-44 w-full bg-slate-800">
                      <Image 
                        src={p.image || (p.images && p.images[0]) || '/placeholder.jpg'} 
                        alt={p.title} 
                        fill 
                        unoptimized
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-slate-950/80 text-emerald-400 border border-emerald-500/40 text-[10px]">
                        {p.status || 'approved'}
                      </Badge>
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <h3 className="font-bold text-sm text-white truncate">{p.title}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-primary" /> {p.location || p.city}
                      </p>
                      <div className="flex justify-between items-center pt-2 text-xs font-mono font-bold">
                        <span className="text-primary">₹{p.price?.toLocaleString()}/mo</span>
                        <span className="text-slate-400 text-[10px]">{p.type} • {p.category}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW: OWNER KYC                                                   */}
          {/* ================================================================= */}
          {activeTab === 'kyc' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <h1 className="text-2xl font-bold font-headline text-white">Landlord KYC Verifications</h1>
                <p className="text-xs text-slate-400">Approve government IDs, property ownership papers, and contact info.</p>
              </div>

              <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
                <CardContent className="p-0">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[10px] uppercase font-semibold">
                        <th className="p-4">Owner Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">KYC Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {users.filter(u => u.roles?.includes('landlord') || u.activeRole === 'landlord').map(u => (
                        <tr key={u.uid} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 font-bold text-white">{u.name || 'Property Owner'}</td>
                          <td className="p-4 text-slate-400 font-mono">{u.email}</td>
                          <td className="p-4 text-slate-400 font-mono">{u.phone || '+91 98765 43210'}</td>
                          <td className="p-4">
                            <Badge className={cn(
                              "text-[10px]",
                              u.landlordKycStatus === 'verified' ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                            )}>
                              {u.landlordKycStatus || 'pending'}
                            </Badge>
                          </td>
                          <td className="p-4 text-right">
                            <Button size="sm" variant="outline" className="h-7 text-xs border-slate-700 bg-slate-800 text-slate-200">
                              Verify Documents
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW: USER DIRECTORY                                              */}
          {/* ================================================================= */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div>
                  <h1 className="text-2xl font-bold font-headline text-white">Registered Users Directory</h1>
                  <p className="text-xs text-slate-400">Total {users.length} accounts registered on the platform.</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleExportCSV('users')} className="h-8 text-xs border-slate-700 bg-slate-800">
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Export Users
                </Button>
              </div>

              <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
                <CardContent className="p-0">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[10px] uppercase font-semibold">
                        <th className="p-4">User</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Registered Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {users.map(u => (
                        <tr key={u.uid} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 font-bold text-white">{u.name || 'User'}</td>
                          <td className="p-4 text-slate-400 font-mono">{u.email}</td>
                          <td className="p-4">
                            <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[10px]">
                              {u.activeRole || 'tenant'}
                            </Badge>
                          </td>
                          <td className="p-4 text-slate-500 text-[11px]">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW: SUPPORT TICKETS                                             */}
          {/* ================================================================= */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <h1 className="text-2xl font-bold font-headline text-white">Student & Host Support Desk</h1>
                <p className="text-xs text-slate-400">Inbound inquiries and ticket escalations.</p>
              </div>

              <div className="space-y-3">
                {tickets.map(t => (
                  <Card key={t.id} className="bg-slate-900 border-slate-800 text-slate-100 p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm text-white">{t.subject}</h3>
                        <p className="text-xs text-slate-400">From: {t.userEmail}</p>
                      </div>
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
                        {t.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
                      {t.message}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW: MASTER SETTINGS                                             */}
          {/* ================================================================= */}
          {activeTab === 'masterdata' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <h1 className="text-2xl font-bold font-headline text-white">Master Data & Configurations</h1>
                <p className="text-xs text-slate-400">Configure serviceable cities, amenities, and seed mock properties.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-800 text-slate-100 p-4 space-y-4">
                  <h3 className="font-bold text-sm text-white">Covered Cities</h3>
                  <div className="flex flex-wrap gap-2">
                    {cities.map((c, i) => (
                      <Badge key={i} className="bg-slate-800 text-slate-200 border-slate-700 text-xs py-1 px-2.5">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </Card>

                <Card className="bg-slate-900 border-slate-800 text-slate-100 p-4 space-y-4">
                  <h3 className="font-bold text-sm text-white">Database Utilities</h3>
                  <p className="text-xs text-slate-400">Reset and re-populate dummy properties across Delhi NCR.</p>
                  <Button 
                    onClick={handleSeedDatabase} 
                    disabled={loadingAction === 'seeding'} 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-10"
                  >
                    <RefreshCw className={cn("mr-2 h-4 w-4", loadingAction === 'seeding' && "animate-spin")} />
                    Re-seed All 40+ Hostels & PGs in Firestore
                  </Button>
                </Card>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW: AUDIT LOGS                                                  */}
          {/* ================================================================= */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <h1 className="text-2xl font-bold font-headline text-white">Security & Operations Audit Trail</h1>
                <p className="text-xs text-slate-400">Immutable ledger of administrative actions and moderation events.</p>
              </div>

              <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
                <CardContent className="p-0">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[10px] uppercase font-semibold">
                        <th className="p-4">Timestamp</th>
                        <th className="p-4">Admin</th>
                        <th className="p-4">Action Summary</th>
                        <th className="p-4">Target Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {auditLogs.map(l => (
                        <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 text-slate-400">{new Date(l.timestamp).toLocaleString()}</td>
                          <td className="p-4 text-primary">{l.adminEmail}</td>
                          <td className="p-4 text-slate-200">{l.action}</td>
                          <td className="p-4">
                            <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[10px]">
                              {l.targetType}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
