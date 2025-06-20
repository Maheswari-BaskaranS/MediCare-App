
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Pill, Calendar, Users, TrendingUp } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="pt-8 pb-12">
          <div className="flex justify-between items-center">
            <div className="text-3xl font-bold text-blue-600">MediCare </div>
            <div className="space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center py-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Never Miss Your <span className="text-blue-600">Medication</span> Again
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track your medications, monitor adherence, and stay connected with your care team.
            Simple, secure, and designed for better health outcomes.
          </p>
          <div className="space-x-4">
            <Link to="/signup">
              <Button size="lg" className="px-8">Start Free Today</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="px-8">Sign In</Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Pill className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Medication Tracking</h3>
            <p className="text-gray-600">Easy medication management with reminders and scheduling</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Daily Tracking</h3>
            <p className="text-gray-600">Mark medications as taken and track your daily progress</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Care Team</h3>
            <p className="text-gray-600">Share progress with family and healthcare providers</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Adherence Reports</h3>
            <p className="text-gray-600">Visual insights into your medication adherence patterns</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
