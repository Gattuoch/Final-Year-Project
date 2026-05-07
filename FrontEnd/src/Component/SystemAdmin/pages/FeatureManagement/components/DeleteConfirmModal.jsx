import { Button } from "../../../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../../ui/dialog";
import { Trash2 } from "lucide-react";
import { useLanguage } from "../../../../../context/LanguageContext";

export function DeleteConfirmModal({ itemToDelete, setItemToDelete, onConfirm, isSubmitting }) {
  const { t } = useLanguage();

  return (
    <Dialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            {t('features.messages.delete')} {
              itemToDelete?.type === 'flag' ? t('features.flags.title') : 
              itemToDelete?.type === 'abtest' ? t('features.abTests.title') : 
              t('features.updates.title')
            }
          </DialogTitle>
          <DialogDescription className="py-4">
            {t('features.messages.deleteConfirm', { name: itemToDelete?.name || itemToDelete?.version })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => setItemToDelete(null)} disabled={isSubmitting} className="cursor-pointer">
            {t('features.messages.cancel')}
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={onConfirm} 
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            {isSubmitting ? t('features.messages.deleting') : t('features.messages.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
