
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMedications } from '@/hooks/useMedications';
import { useToast } from '@/hooks/use-toast';
import { Medication } from '@/types/medication';

interface MedicationFormProps {
  medication?: Medication;
  onSuccess: () => void;
  onCancel: () => void;
}

const MedicationForm = ({ medication, onSuccess, onCancel }: MedicationFormProps) => {
  const [name, setName] = useState(medication?.name || '');
  const [dosage, setDosage] = useState(medication?.dosage || '');
  const [frequency, setFrequency] = useState(medication?.frequency || '');
  const [loading, setLoading] = useState(false);
  
  const { addMedication, updateMedication } = useMedications();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !dosage || !frequency) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const medicationData = { name, dosage, frequency };
      
      if (medication) {
        await updateMedication(medication.id, medicationData);
        toast({
          title: "Success",
          description: "Medication updated successfully",
        });
      } else {
        await addMedication(medicationData);
        toast({
          title: "Success",
          description: "Medication added successfully",
        });
      }
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${medication ? 'update' : 'add'} medication`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Medication Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Aspirin, Lisinopril"
          required
        />
      </div>

      <div>
        <Label htmlFor="dosage">Dosage</Label>
        <Input
          id="dosage"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          placeholder="e.g., 50mg, 1 tablet"
          required
        />
      </div>

      <div>
        <Label htmlFor="frequency">Frequency</Label>
        <Select value={frequency} onValueChange={setFrequency} required>
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Once daily">Once daily</SelectItem>
            <SelectItem value="Twice daily">Twice daily</SelectItem>
            <SelectItem value="Three times daily">Three times daily</SelectItem>
            <SelectItem value="Four times daily">Four times daily</SelectItem>
            <SelectItem value="As needed">As needed</SelectItem>
            <SelectItem value="Weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saving...' : medication ? 'Update Medication' : 'Add Medication'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default MedicationForm;
