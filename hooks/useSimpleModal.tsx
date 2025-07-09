import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';

interface ModalConfig {
  title?: string;
  message?: string;
  buttonText?: string;
  onConfirm?: () => void;
}

interface UseSimpleModalReturn {
  showModal: (config: ModalConfig) => void;
  hideModal: () => void;
  Modal: React.ComponentType;
}

export function useSimpleModal(): UseSimpleModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ModalConfig>({});

  const showModal = useCallback((modalConfig: ModalConfig) => {
    setConfig(modalConfig);
    setIsOpen(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsOpen(false);
    setConfig({});
  }, []);

  const handleConfirm = useCallback(() => {
    config.onConfirm?.();
    hideModal();
  }, [config.onConfirm, hideModal]);

  const Modal = useCallback(
    () => (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{config.title || 'Notification'}</DialogTitle>
            {config.message && <DialogDescription>{config.message}</DialogDescription>}
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={handleConfirm}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {config.buttonText || 'OK'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
    [isOpen, config, handleConfirm]
  );

  return {
    showModal,
    hideModal,
    Modal,
  };
}
