import { Button } from "../../../ui/button";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../../ui/dialog";
import { useLanguage } from "../../../../../context/LanguageContext";

export function CreateUpdateModal({ isOpen, onOpenChange, newUpdateRecord, setNewUpdateRecord, onSubmit, isSubmitting }) {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('features.updates.createBtn', 'Create New Update')}</DialogTitle>
          <DialogDescription>
            Manually add a new system update or patch record to the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="upd-version">{t('features.updates.table.version')}</Label>
            <Input
              id="upd-version"
              placeholder="e.g. v1.2.4"
              value={newUpdateRecord.version}
              onChange={(e) => setNewUpdateRecord({ ...newUpdateRecord, version: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="upd-desc">{t('features.updates.table.desc')}</Label>
            <Textarea
              id="upd-desc"
              placeholder="Describe what's new in this version..."
              value={newUpdateRecord.description}
              onChange={(e) => setNewUpdateRecord({ ...newUpdateRecord, description: e.target.value })}
              required
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
              {t('features.messages.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? t('features.messages.creating') : t('features.messages.createUpdate')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditUpdateModal({ editingUpdate, setEditingUpdate, onSubmit, isSubmitting }) {
  const { t } = useLanguage();

  return (
    <Dialog open={!!editingUpdate} onOpenChange={(open) => !open && setEditingUpdate(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('features.messages.edit')} {t('features.updates.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('features.updates.table.version')}</Label>
            <Input
              value={editingUpdate?.version || ""}
              onChange={(e) => setEditingUpdate({ ...editingUpdate, version: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>{t('features.updates.table.desc')}</Label>
            <Textarea
              value={editingUpdate?.description || ""}
              onChange={(e) => setEditingUpdate({ ...editingUpdate, description: e.target.value })}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditingUpdate(null)} className="cursor-pointer">
              {t('features.messages.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? t('features.messages.saving') : t('features.messages.saveChanges')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
