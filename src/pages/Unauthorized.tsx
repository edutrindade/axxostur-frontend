import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
              <Icon name="alert" size={40} className="text-red-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white">Access Denied</h1>
          <p className="text-slate-300 text-lg">You don't have permission to access this page. Contact your administrator if you believe this is an error.</p>
        </div>

        <Link to="/">
          <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
