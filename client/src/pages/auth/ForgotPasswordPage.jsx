import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col gap-4 text-center">
      <p className="text-text-secondary text-sm">
        Please contact support or your IT manager to trigger a password reset sequence.
      </p>
      <Link to="/login" className="btn-secondary w-full">
        Back to Sign In
      </Link>
    </div>
  );
}
