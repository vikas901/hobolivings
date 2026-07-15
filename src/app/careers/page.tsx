'use client';

import { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, MapPin, Users, Heart, Sparkles, Send, CheckCircle2 } from 'lucide-react';

export default function CareersPage() {
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Operations', resume: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.resume) {
      toast({ variant: 'destructive', title: 'Required Fields', description: 'Please fill in name, email, and link your resume.' });
      return;
    }
    setFormSubmitted(true);
    toast({ title: 'Application Received! 🚀', description: 'Our recruitment desk will review and contact you shortly.' });
  };

  const jobOpenings = [
    { title: 'Operations Executive', dept: 'Operations', loc: 'Noida Sector 62', type: 'Full-time', pay: '₹3.6 - ₹4.8 LPA' },
    { title: 'Junior Frontend Developer', dept: 'Technology', loc: 'Remote', type: 'Full-time', pay: '₹6 - ₹8 LPA' },
    { title: 'Customer Support Specialist', dept: 'Support', loc: 'Greater Noida', type: 'Full-time', pay: '₹2.8 - ₹3.6 LPA' }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-secondary/20 py-20 px-4 text-center overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-primary/5 to-pink-500/5"></div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <Badge className="bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider px-3 py-1">Careers at Hobo</Badge>
          <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tight">
            Build the Future of <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-rose-500 via-pink-600 to-primary bg-clip-text text-transparent">Co-Living & Housing</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Join a fast-growing accommodation startup focused on building premium, safe, and tech-driven living standards for youth across India.
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="container py-16 px-4 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="font-headline text-3xl font-bold">Why Hobo Livings?</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Our Cultural Philosophy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Empowered Teams", desc: "We support autonomy. Every employee gets ownership of their projects and room to make impactful decisions.", icon: <Users className="h-6 w-6 text-primary" /> },
            { title: "Youth First", desc: "We design spaces for students and professionals. Our solutions are high-tech, welcoming, and affordable.", icon: <Heart className="h-6 w-6 text-rose-500" /> },
            { title: "Rapid Innovation", desc: "Iterate fast, solve complex rental loops, and build scalable technologies that modernize properties management.", icon: <Sparkles className="h-6 w-6 text-amber-500" /> }
          ].map((val, idx) => (
            <Card key={idx} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="space-y-3 pb-3">
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center border">
                  {val.icon}
                </div>
                <CardTitle className="text-lg font-headline font-bold">{val.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">{val.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Split Open Positions & Form */}
      <section className="bg-secondary/10 py-16 border-y">
        <div className="container px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Active Job Openings */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-headline text-2xl font-bold">Active Openings</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Review available listings. Submit details on the form to pitch your skills.
              </p>
            </div>

            <div className="space-y-4">
              {jobOpenings.map((job, idx) => (
                <Card key={idx} className="border shadow-sm hover:border-primary/20 transition-colors">
                  <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0">
                    <div className="space-y-1">
                      <h3 className="font-headline font-bold text-sm text-foreground">{job.title}</h3>
                      <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {job.dept}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.loc}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px] py-0.5 px-2">
                      {job.type}
                    </Badge>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <p className="text-xs font-semibold text-primary">Compensation: {job.pay}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Dynamic Application Card */}
          <div>
            {!formSubmitted ? (
              <Card className="border shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-headline font-bold">Quick Application Form</CardTitle>
                  <CardDescription>
                    Pitch your application to our recruitment desk instantly.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="app-name" className="text-xs font-semibold">Full Name *</Label>
                        <Input 
                          id="app-name" 
                          placeholder="John Doe" 
                          value={formData.name}
                          onChange={e=>setFormData({...formData, name: e.target.value})}
                          required 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="app-email" className="text-xs font-semibold">Email Address *</Label>
                        <Input 
                          id="app-email" 
                          type="email" 
                          placeholder="john@example.com" 
                          value={formData.email}
                          onChange={e=>setFormData({...formData, email: e.target.value})}
                          required 
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="app-role" className="text-xs font-semibold">Target Department *</Label>
                      <select 
                        id="app-role" 
                        value={formData.role}
                        onChange={e=>setFormData({...formData, role: e.target.value})}
                        className="w-full bg-background border rounded-lg p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Operations">Operations</option>
                        <option value="Technology">Technology & Frontend Development</option>
                        <option value="Support">Customer Service Desk</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="app-resume" className="text-xs font-semibold">Resume PDF URL *</Label>
                      <Input 
                        id="app-resume" 
                        placeholder="Google Drive, Dropbox, or PDF link" 
                        value={formData.resume}
                        onChange={e=>setFormData({...formData, resume: e.target.value})}
                        required 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="app-msg" className="text-xs font-semibold">Cover Note</Label>
                      <Textarea 
                        id="app-msg" 
                        placeholder="Tell us briefly why you would be a great fit at Hobo Livings..." 
                        rows={3}
                        value={formData.message}
                        onChange={e=>setFormData({...formData, message: e.target.value})}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4 flex justify-end">
                    <Button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-1.5 font-semibold text-xs py-5">
                      <Send className="h-4.5 w-4.5" /> Submit Pitch
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            ) : (
              <Card className="border border-green-200 bg-green-50/50 shadow-md p-6 text-center space-y-4">
                <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-headline font-bold text-green-900">Application Submitted!</h3>
                  <p className="text-xs text-green-700 leading-relaxed max-w-md mx-auto">
                    Thanks for applying, {formData.name}. Our recruitment desks at Noida will review your resume links and schedule dynamic interview rollouts shortly.
                  </p>
                </div>
                <Button variant="outline" className="text-xs" onClick={() => setFormSubmitted(false)}>
                  Submit Another Role
                </Button>
              </Card>
            )}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
