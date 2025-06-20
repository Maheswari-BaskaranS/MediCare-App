
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useMedications } from '@/hooks/useMedications';
import { Pill, Calendar, TrendingUp, Plus, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { medications, markMedicationTaken, getMedicationsTakenToday } = useMedications();
  const { toast } = useToast();
  const [takingMedication, setTakingMedication] = useState<string | null>(null);

  const todayDate = new Date().toISOString().split('T')[0];
  const medicationsTakenToday = getMedicationsTakenToday();
  const adherenceRate = medications.length > 0 ? Math.round((medicationsTakenToday.length / medications.length) * 100) : 0;

  const handleMarkTaken = async (medicationId: string) => {
    setTakingMedication(medicationId);
    try {
      await markMedicationTaken(medicationId);
      toast({
        title: "Success",
        description: "Medication marked as taken",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark medication as taken",
        variant: "destructive",
      });
    } finally {
      setTakingMedication(null);
    }
  };

  const isMedicationTakenToday = (medicationId: string) => {
    return medicationsTakenToday.some(taken => taken.medicationId === medicationId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">Here's your medication overview for today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Adherence</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adherenceRate}%</div>
              <Progress value={adherenceRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {medicationsTakenToday.length} of {medications.length} medications taken
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Medications</CardTitle>
              <Pill className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{medications.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Active prescriptions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Date</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Medications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Today's Medications</CardTitle>
                  <CardDescription>Mark medications as taken for {new Date().toLocaleDateString()}</CardDescription>
                </div>
                <Link to="/medications">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {medications.length === 0 ? (
                <div className="text-center py-8">
                  <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No medications added yet</p>
                  <Link to="/medications">
                    <Button>Add Your First Medication</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {medications.map((medication) => {
                    const isTaken = isMedicationTakenToday(medication.id);
                    return (
                      <div
                        key={medication.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          isTaken ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isTaken ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            <Pill className={`h-5 w-5 ${
                              isTaken ? 'text-green-600' : 'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{medication.name}</h3>
                            <p className="text-sm text-gray-600">
                              {medication.dosage} • {medication.frequency}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isTaken ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <Check className="h-3 w-3 mr-1" />
                              Taken
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleMarkTaken(medication.id)}
                              disabled={takingMedication === medication.id}
                            >
                              {takingMedication === medication.id ? 'Marking...' : 'Mark Taken'}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your medication tracking history</CardDescription>
            </CardHeader>
            <CardContent>
              {medicationsTakenToday.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No medications taken today</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {medicationsTakenToday.map((taken) => {
                    const medication = medications.find(m => m.id === taken.medicationId);
                    return (
                      <div key={`${taken.medicationId}-${taken.takenAt}`} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{medication?.name}</p>
                          <p className="text-sm text-gray-600">
                            Taken at {new Date(taken.takenAt).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit',
                              hour12: true 
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
