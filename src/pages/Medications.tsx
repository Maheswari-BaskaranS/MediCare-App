
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import MedicationForm from '@/components/MedicationForm';
import MedicationList from '@/components/MedicationList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

const Medications = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Medications</h1>
            <p className="text-gray-600 mt-2">Manage your medication list and dosages</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Medication</DialogTitle>
                <DialogDescription>
                  Enter the details for your new medication
                </DialogDescription>
              </DialogHeader>
              <MedicationForm
                onSuccess={() => setIsAddDialogOpen(false)}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Medications</CardTitle>
            <CardDescription>
              All your current medications and their details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MedicationList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Medications;
