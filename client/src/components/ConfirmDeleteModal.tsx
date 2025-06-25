type ConfirmDeleteModalProps = {
  movieTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 *
 * @param param0 { movieTitle, onConfirm, onCancel }
 * @description A modal component that confirms the deletion of a movie.
 * @returns JSX element representing the confirmation modal.
 */
const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  movieTitle,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-slate-700/25 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[500px] relative border border-red-700">
        <h2 className="text-xl font-semibold mb-4 text-red-500">
          Confirm Removal
        </h2>

        <p className="text-gray-800 mb-6 text-sm">
          Are you sure you want to remove <strong>{movieTitle}</strong> from
          your dashboard?
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="text-sm text-gray-600 hover:underline cursor-pointer transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded text-sm cursor-pointer transition duration-200"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
