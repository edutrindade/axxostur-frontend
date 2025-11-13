interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay = ({ message = "Carregando..." }: LoadingOverlayProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4 max-w-sm mx-4">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-lg font-medium text-slate-700">{message}</p>
      </div>
    </div>
  );
};
