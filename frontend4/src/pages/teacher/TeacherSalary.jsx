import { useAuth } from '@/context/AuthContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import PageHeader from '@/components/ui/PageHeader';
import SalaryStatus from '@/components/finance/SalaryStatus';

export default function TeacherSalary() {
  useDocumentTitle('Salary status');
  const { user } = useAuth();
  return (
    <>
      <PageHeader title="Salary status" subtitle="For each month: whether you were paid, how much, and the reference number to quote at the office." />
      <SalaryStatus role="teacher" id={user.id} />
    </>
  );
}
