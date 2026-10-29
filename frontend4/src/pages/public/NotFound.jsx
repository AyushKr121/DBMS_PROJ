import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page not found');
  const { user } = useAuth();
  return (
    <div className="container page-public">
      <EmptyState
        icon="alert"
        title="This page does not exist"
        text="The link may be old or mistyped."
        action={<Button to={user ? `/${user.role}` : '/'}>{user ? 'Go to my dashboard' : 'Go to the home page'}</Button>}
      />
    </div>
  );
}
