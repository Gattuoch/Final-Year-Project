import { Button } from "../../../ui/button";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../../ui/dialog";
import { useLanguage } from "../../../../../context/LanguageContext";

export function CreateABTestModal({ isOpen, onOpenChange, newABTest, setNewABTest, onSubmit, isSubmitting }) {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('features.abTests.newBtn')}</DialogTitle>
          <DialogDescription>
            Set up a new A/B experiment to validate improvements.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="testName">Test Name</Label>
            <Input
              id="testName"
              placeholder="e.g. New Checkout Flow"
              value={newABTest.name}
              onChange={(e) => setNewABTest({ ...newABTest, name: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="variant">Variants</Label>
              <Input
                id="variant"
                placeholder="e.g. A/B or A/B/C"
                value={newABTest.variant}
                onChange={(e) => setNewABTest({ ...newABTest, variant: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="traffic">Traffic Split</Label>
              <Input
                id="traffic"
                placeholder="e.g. 50/50 or 33/33/34"
                value={newABTest.traffic}
                onChange={(e) => setNewABTest({ ...newABTest, traffic: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="metric">Primary Metric</Label>
            <Input
              id="metric"
              placeholder="e.g. Conversion Rate"
              value={newABTest.metric}
              onChange={(e) => setNewABTest({ ...newABTest, metric: e.target.value })}
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
              {t('features.messages.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? t('features.messages.creating') : t('features.messages.startTest')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditABTestModal({ editingABTest, setEditingABTest, onSubmit, isSubmitting }) {
  const { t } = useLanguage();

  return (
    <Dialog open={!!editingABTest} onOpenChange={(open) => !open && setEditingABTest(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('features.messages.edit')} {t('features.abTests.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('features.abTests.table.name')}</Label>
            <Input
              value={editingABTest?.name || ""}
              onChange={(e) => setEditingABTest({ ...editingABTest, name: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('features.abTests.table.variants')}</Label>
              <Input
                value={editingABTest?.variant || ""}
                onChange={(e) => setEditingABTest({ ...editingABTest, variant: e.target.value })}
                placeholder="e.g. A/B"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('features.abTests.table.traffic')}</Label>
              <Input
                value={editingABTest?.traffic || ""}
                onChange={(e) => setEditingABTest({ ...editingABTest, traffic: e.target.value })}
                placeholder="e.g. 50/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('features.abTests.table.metric')}</Label>
            <Input
              value={editingABTest?.metric || ""}
              onChange={(e) => setEditingABTest({ ...editingABTest, metric: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditingABTest(null)} className="cursor-pointer">
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
