import { useState } from 'react'; 
import authService from '../services/authService'; 
import { Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

const ForgotPassword = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { success, error } = useNotification(); 

const forgotPasswordMutation = async (data) =>{
  try{
    const response = await authService.forgotPassword(data); 
  if(response.success){
    success('Password reset link sent! Check your email.')
  }else{
    error('Failed to send reset link')
  }
  }catch(e){ 
    error(e.response?.data?.error || 'Failed to send reset link');
  } 

}

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailOrUsername.trim()) {
      alert('Please enter your email or username');
      return;
    }
    forgotPasswordMutation(emailOrUsername);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Check Your Email</h2>
            <p className="mt-2 text-gray-600">
              If an account exists with the provided email/username, we've sent a password reset link.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setSubmitted(false)}
                className="text-blue-600 hover:text-blue-500"
              >
                try again
              </button>
            </p>
            <div className="mt-6">
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
          <p className="mt-2 text-gray-600">
            Enter your email or username and we'll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700">
              Email or Username
            </label>
            <input
              id="emailOrUsername"
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="admin@company.com or admin"
              required
            />
          </div>

          <button
            type="submit"
            // disabled={forgotPasswordMutation.isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Send Reset Link
            {/* {forgotPasswordMutation.isLoading ? 'Sending...' : 'Send Reset Link'} */}
          </button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              ← Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;