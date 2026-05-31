function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
        <div>
          <h3 className="font-bold text-gray-900 text-base">⚠️ {title}</h3>
          <p className="text-sm text-gray-500 mt-1">{message}</p>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;