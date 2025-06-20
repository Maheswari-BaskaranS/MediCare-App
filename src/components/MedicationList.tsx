
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useMedications } from '@/hooks/useMedications';
import { useToast } from '@/hooks/use-toast';
import MedicationForm from './MedicationForm';
import { Medication } from '@/types/medication';
import { Edit, Trash2, Pill } from 'lucide-react';

const MedicationList = () => {
  const { medications, deleteMedication } = useMedications();
  const { toast } = useToast();
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [deletingMedication, setDeletingMedication] = useState<Medication | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (medication: Medication) => {
    setLoading(true);
    try {
      await deleteMedication(medication.id);
      toast({
        title: "Success",
        description: "Medication deleted successfully",
      });
      setDeletingMedication(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete medication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (medications.length === 0) {
    return (
      <div className="text-center py-12">
        <Pill className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No medications yet</h3>
        <p className="text-gray-600 mb-6">Add your first medication to get started with tracking</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {medications.map((medication) => (
          <div key={medication.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Pill className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{medication.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary">{medication.dosage}</Badge>
                  <Badge variant="outline">{medication.frequency}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingMedication(medication)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingMedication(medication)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingMedication} onOpenChange={() => setEditingMedication(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Medication</DialogTitle>
            <DialogDescription>
              Update the details for {editingMedication?.name}
            </DialogDescription>
          </DialogHeader>
          {editingMedication && (
            <MedicationForm
              medication={editingMedication}
              onSuccess={() => setEditingMedication(null)}
              onCancel={() => setEditingMedication(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingMedication} onOpenChange={() => setDeletingMedication(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medication</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingMedication?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingMedication && handleDelete(deletingMedication)}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MedicationList;
