import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardPage from '@/components/DashboardPage';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardPage />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
