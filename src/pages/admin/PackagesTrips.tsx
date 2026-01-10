const PackagesTrips = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Packages & Trips</h1>
          <p className="text-slate-600 mt-2">Manage travel packages and scheduled trips</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-2">Packages</h3>
          <p className="text-slate-600 text-sm">Create and manage travel packages</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-2">Trips</h3>
          <p className="text-slate-600 text-sm">Schedule and manage trips from packages</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
        <p className="text-slate-600">Packages and trips management page coming soon...</p>
      </div>
    </div>
  );
};

export default PackagesTrips;
