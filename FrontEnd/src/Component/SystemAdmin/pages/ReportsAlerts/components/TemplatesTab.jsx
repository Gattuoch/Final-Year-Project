import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { FilePlus, Edit, Trash2, Send } from "lucide-react";

export function TemplatesTab({
  isLoading,
  alertTemplates,
  setCreateTemplateDialogOpen,
  setEditingTemplate,
  handleDeleteAlertTemplate,
  handleUseTemplate
}) {
  return (
    <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Pre-Approved Alert Templates</h2>
            <p className="text-xs sm:text-sm text-gray-500">Quick-send common notifications</p>
          </div>
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700" onClick={() => setCreateTemplateDialogOpen(true)}>
            <FilePlus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>

        <div className="space-y-3">
          {alertTemplates.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed rounded-lg">
              {isLoading ? "Loading templates..." : "No alert templates found."}
            </div>
          ) : alertTemplates.map((tmpl) => (
            <div key={tmpl._id} className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-800">{tmpl.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2 sm:line-clamp-none">
                    "{tmpl.message}"
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-3 text-blue-600 border-blue-100 hover:bg-blue-50"
                    onClick={() => handleUseTemplate(tmpl)}
                  >
                    <Send className="w-3 h-3 mr-1.5" />
                    <span className="hidden sm:inline">Use</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-gray-500 border-gray-100 hover:bg-gray-100"
                    onClick={() => setEditingTemplate(tmpl)}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-red-500 border-red-100 hover:bg-red-50"
                    onClick={() => handleDeleteAlertTemplate(tmpl._id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
