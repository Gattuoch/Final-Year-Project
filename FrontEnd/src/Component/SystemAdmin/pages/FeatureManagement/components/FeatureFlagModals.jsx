import { Button } from "../../../ui/button";
import { Switch } from "../../../ui/switch";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../../ui/dialog";
import { useLanguage } from "../../../../../context/LanguageContext";

export function CreateFeatureFlagModal({ isOpen, onOpenChange, newFlag, setNewFlag, onSubmit, isSubmitting }) {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('features.flags.createBtn')}</DialogTitle>
          <DialogDescription>
            {t('features.flags.modalDesc') || "Add a new feature flag to toggle functionality in the app."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('features.flags.tableName') || "Name"}</Label>
            <Input
              id="name"
              placeholder="e.g. Dark Mode"
              value={newFlag.name}
              onChange={(e) => setNewFlag({ ...newFlag, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t('features.flags.tableDesc') || "Description"}</Label>
            <Textarea
              id="description"
              placeholder="Briefly describe what this feature does..."
              value={newFlag.description}
              onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="enabled"
              checked={newFlag.enabled}
              onCheckedChange={(checked) => setNewFlag({ ...newFlag, enabled: checked })}
            />
            <Label htmlFor="enabled">{t('features.flags.enabled')}</Label>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
              {t('features.messages.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? t('features.messages.creating') : t('features.messages.createFlag')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditFeatureFlagModal({ editingFlag, setEditingFlag, onSubmit, isSubmitting }) {
  const { t } = useLanguage();

  return (
    <Dialog open={!!editingFlag} onOpenChange={(open) => !open && setEditingFlag(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('features.messages.edit')} {t('features.flags.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-flag-name">{t('features.flags.tableName') || "Name"}</Label>
            <Input
              id="edit-flag-name"
              value={editingFlag?.name || ""}
              onChange={(e) => setEditingFlag({ ...editingFlag, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-flag-desc">{t('features.flags.tableDesc') || "Description"}</Label>
            <Textarea
              id="edit-flag-desc"
              value={editingFlag?.description || ""}
              onChange={(e) => setEditingFlag({ ...editingFlag, description: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditingFlag(null)} className="cursor-pointer">
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
