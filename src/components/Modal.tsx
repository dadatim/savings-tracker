import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface ModalProps {
  labelledBy: string; // id of the heading that titles the dialog
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ labelledBy, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Open as a modal on mount (the guard avoids a double-open in React StrictMode)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        e.preventDefault(); // the parent unmounts it
        onClose();
      }}
      onClick={(e) => {
        // A click on the backdrop lands on the <dialog> element itself
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </dialog>
  );
}
