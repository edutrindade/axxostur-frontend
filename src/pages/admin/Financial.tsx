const Financial = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Financial</h1>
          <p className="text-slate-600 mt-2">Manage financial operations and accounting</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-2">Payables</h3>
          <p className="text-slate-600 text-sm">Accounts payable management</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-2">Receivables</h3>
          <p className="text-slate-600 text-sm">Accounts receivable management</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-2">Cash Control</h3>
          <p className="text-slate-600 text-sm">Cash flow and control</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
        <p className="text-slate-600">Financial management page coming soon...</p>
      </div>
    </div>
  );
};

export default Financial;
