import {
  Link,
  useSearchParams,
  Form,
  useTransition as useNavigation,
  useActionData,
} from '@remix-run/react';
import { FaLock, FaUserPlus } from 'react-icons/fa';
import type { ICredentials } from '~/components/expenses/interfaces';

function AuthForm() {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const validationErrors = useActionData<ICredentials>();

  const authMode = searchParams.get('mode') || 'login';
  const isAuthModeLogin = authMode === 'login';

  const submitBtnCaption = isAuthModeLogin ? 'Login' : 'Create User';
  const toggleBtnCaption = isAuthModeLogin
    ? 'Create a new user'
    : 'Log in with existing  user';
  const paramsCaptionTo = isAuthModeLogin ? '?mode=signup' : '?mode=login';

  const isSubmitting = navigation.state !== 'idle';

  return (
    <Form method="post" className="form" id="auth-form">
      <div className="icon-img">
        {isAuthModeLogin ? <FaLock /> : <FaUserPlus />}
      </div>
      <p>
        <label htmlFor="email">Email Address</label>
        <input type="email" id="email" name="email" required />
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" minLength={7} />
      </p>
      {validationErrors && 
         <ul>
          {Object.values(validationErrors).map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      }
      <div className="form-actions">
        <button disabled={isSubmitting}>
          {isSubmitting ? 'Authenticating...' : submitBtnCaption}
        </button>
        <Link to={paramsCaptionTo}>{toggleBtnCaption}</Link>
      </div>
    </Form>
  );
}

export default AuthForm;
