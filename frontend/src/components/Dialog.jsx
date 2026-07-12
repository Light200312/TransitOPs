
import React, { createContext, useContext, useEffect } from 'react';
import { X } from 'lucide-react';

const DialogContext = createContext({ open: false, onOpenChange: () => {} });

export function Dialog({ open, defaultOpen = false, onOpenChange, children }) {
  const isOpen = open ?? defaultOpen;
  return (
    <DialogContext.Provider value={{ open: isOpen, onOpenChange: onOpenChange ?? (() => {}) }}>
      {children}
    </DialogContext.Provider>);

}

export function DialogContent({ children, showCloseButton = true }) {
  const { open, onOpenChange } = useContext(DialogContext);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button
        className="absolute inset-0 bg-black/70"
        onClick={() => onOpenChange(false)}
        aria-label="Close dialog" />
      
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-lg rounded-lg border border-[#343438] bg-[#1a1a1c] p-5 text-[#edeae3] shadow-2xl">
        
        {showCloseButton &&
        <button
          className="absolute right-4 top-4 rounded p-1 text-zinc-500 hover:bg-[#27272a] hover:text-zinc-200"
          onClick={() => onOpenChange(false)}
          aria-label="Close dialog">
          
            <X className="h-4 w-4" />
          </button>
        }
        {children}
      </div>
    </div>);

}

export function DialogHeader({ children }) {
  return <div className="space-y-1.5">{children}</div>;
}

export function DialogFooter({ children }) {
  return <div className="mt-6 flex flex-wrap justify-end gap-2">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-base font-semibold">{children}</h2>;
}

export function DialogDescription({ children }) {
  return <p className="text-xs leading-5 text-zinc-500">{children}</p>;
}

export function DialogTrigger({ children }) {
  const { onOpenChange } = useContext(DialogContext);
  return React.cloneElement(children, {
    onClick: (event) => {
      children.props.onClick?.(event);
      onOpenChange(true);
    }
  });
}

export function DialogClose({ children }) {
  const { onOpenChange } = useContext(DialogContext);
  return React.cloneElement(children, {
    onClick: (event) => {
      children.props.onClick?.(event);
      onOpenChange(false);
    }
  });
}