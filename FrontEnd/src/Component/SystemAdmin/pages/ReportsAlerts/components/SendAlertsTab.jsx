import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Textarea } from "../../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { Bell, Mail, MessageSquare } from "lucide-react";

export function SendAlertsTab({
  alertTitle,
  setAlertTitle,
  alertMessage,
  setAlertMessage,
  alertRecipients,
  setAlertRecipients,
  deliveryMethods,
  setDeliveryMethods,
  handleSendAlert
}) {
  const toggleMethod = (method) => {
    setDeliveryMethods(prev => ({ ...prev, [method]: !prev[method] }));
  };

  return (
    <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Send System Alert</h2>
            <p className="text-xs sm:text-sm text-gray-500">Notify users about maintenance, features, or policy changes</p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <Label htmlFor="alert-title" className="text-sm sm:text-base">Alert Title</Label>
            <Input
              id="alert-title"
              placeholder="Enter alert title..."
              value={alertTitle}
              onChange={(e) => setAlertTitle(e.target.value)}
              className="mt-1 text-sm"
            />
          </div>

          <div>
            <Label htmlFor="alert-message" className="text-sm sm:text-base">Message</Label>
            <Textarea
              id="alert-message"
              placeholder="Enter your message..."
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              rows={5}
              className="mt-1 text-sm"
            />
          </div>

          <div>
            <Label htmlFor="recipients" className="text-sm sm:text-base">Recipients</Label>
            <Select value={alertRecipients} onValueChange={setAlertRecipients}>
              <SelectTrigger id="recipients" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="campers">Campers Only</SelectItem>
                <SelectItem value="managers">Camp Managers Only</SelectItem>
                <SelectItem value="active">Active Users Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm sm:text-base">Delivery Methods</Label>
            <div className="flex flex-wrap gap-4 sm:gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={deliveryMethods.email} 
                  onChange={() => toggleMethod('email')}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" 
                />
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Email</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={deliveryMethods.sms} 
                  onChange={() => toggleMethod('sms')}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" 
                />
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">SMS</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={deliveryMethods.inApp} 
                  onChange={() => toggleMethod('inApp')}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" 
                />
                <Bell className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">In-App</span>
              </label>
            </div>
          </div>

          <div className="pt-2 sm:pt-4">
            <Button 
              onClick={handleSendAlert} 
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700"
              disabled={!alertTitle || !alertMessage || !Object.values(deliveryMethods).some(v => v)}
            >
              Send Alert
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
