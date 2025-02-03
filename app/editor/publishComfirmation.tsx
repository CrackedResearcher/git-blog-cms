import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PublishConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const PublishConfirmation: React.FC<PublishConfirmationProps> = ({
  open,
  onOpenChange,
  onConfirm,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[465px] border border-gray-600">
        <DialogHeader>
          <DialogTitle>Wanna publish this?</DialogTitle>
          <DialogDescription>
            Are you sure you want to publish this article? This action will make
            your content publicly available on your blog.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" className="mt-3" onClick={handleConfirm}>
            yes, publish now!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PublishConfirmation;
