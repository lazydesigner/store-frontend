import React, { useState, useEffect } from 'react';
import { Save, Building, FileText, Bell, Shield, Database, CheckCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { useNotification } from '../context/NotificationContext';
import settingsService from '../services/settingsService';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const { success, error } = useNotification();

  const tabs = [
    { id: 'company', name: 'Company Info', icon: Building },
    { id: 'invoice', name: 'Invoice Settings', icon: FileText },
    // { id: 'notifications', name: 'Notifications', icon: Bell },
    // { id: 'security', name: 'Security', icon: Shield },
    // { id: 'backup', name: 'Backup & Data', icon: Database }
  ];

  // Form states
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    gstin: '',
    pan: '',
    cin: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: ''
  });

  const [invoiceSettings, setInvoiceSettings] = useState({
    invoicePrefix: '',
    proformaPrefix: '',
    startingNumber: '',
    fyFormat: '',
    defaultTaxRate: '',
    taxType: '',
    footerNote: '',
    showLogo: true,
    showQR: true,
    showTerms: true
  });

  const [smsSettings, setSmsSettings] = useState({
    apiKey: '',
    senderId: 'STORE',
    orderConfirmation: true,
    outForDelivery: true,
    delivered: true,
    paymentReceived: false
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'email@gmail.com',
    smtpPassword: '',
    invoiceGeneration: true,
    paymentReminders: true,
    lowStockAlerts: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    minPasswordLength: '8',
    passwordExpiry: '90',
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: false,
    enable2FA: false
  });

  useEffect(() => {
    LoadData()
  }, [])

  const LoadData = async () => {
    const [companyData, invoiceData, smsData, emailData] = await Promise.all([
      settingsService.getSettings('company'),
      settingsService.getSettings('invoice'),
      settingsService.getSettings('sms'),
      settingsService.getSettings('email'),
    ])

    //console.log(smsData)

    setCompanyInfo(() => ({
      name: companyData.settings.company_name,
      gstin: companyData.settings.company_gstin,
      pan: companyData.settings.company_pan,
      cin: companyData.settings.company_cin,
      address1: companyData.settings.company_address1,
      address2: companyData.settings.company_address2,
      city: companyData.settings.company_city,
      state: companyData.settings.company_state,
      pincode: companyData.settings.company_pincode,
      phone: companyData.settings.company_phone,
      email: companyData.settings.company_email
    }))

    setInvoiceSettings(() => ({
      invoicePrefix: invoiceData.settings.invoice_prefix,
      proformaPrefix: invoiceData.settings.proforma_prefix,
      startingNumber: invoiceData.settings.starting_number,
      fyFormat: invoiceData.settings.fy_format,
      defaultTaxRate: invoiceData.settings.default_tax_rate,
      taxType: invoiceData.settings.tax_type,
      footerNote: invoiceData.settings.footer_note,
      showLogo: invoiceData.settings.show_logo,
      showQR: invoiceData.settings.show_qr,
      showTerms: invoiceData.settings.show_terms
    }))

    setSmsSettings(() => ({
      apiKey: smsData.settings.sms_api_key,
      senderId: smsData.settings.sms_sender_id,
      orderConfirmation: smsData.settings.sms_order_confirmation,
      outForDelivery: smsData.settings.sms_out_for_delivery,
      delivered: smsData.settings.sms_delivered,
      paymentReceived: smsData.settings.sms_payment_received
    }))

    setEmailSettings(() => ({
      smtpHost: emailData.settings.smtp_host,
      smtpPort: emailData.settings.smtp_port,
      smtpUsername: emailData.settings.smtp_username,
      smtpPassword: emailData.settings.smtp_password,
      invoiceGeneration: emailData.settings.email_invoice_generation,
      paymentReminders: emailData.settings.email_payment_reminders,
      lowStockAlerts: emailData.settings.email_low_stock_alerts
    }))

  }

  const handleSave = async (section) => {
    setLoading(true);
    try {
      // Simulate API call

      if (section == 'Company') {
        await settingsService.updateCompanySettings(companyInfo)
      }
      if (section == 'Invoice') {
        await settingsService.updateInvoiceSettings(invoiceSettings)
      }
      if (section == 'SMS') {
        await settingsService.updateSmsSettings(smsSettings)
      }
      if (section == 'Email') {
        await settingsService.updateEmailSettings(emailSettings)
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      success(`${section} settings saved successfully`);
    } catch (error) {
      error(`Failed To save ${section} settings`)
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      success('Backup created successfully');
    } catch (error) {
      console.error('Backup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    try {
      success(`Exporting ${type}...`);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const testmyEmail = async (email) => {
    const test = await settingsService.testEmailSettings(email)
    //console.log(test)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your store configuration</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Company Info Tab */}
      {activeTab === 'company' && (
        <Card title="Company Information">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
              />
              <Input
                label="GSTIN"
                value={companyInfo.gstin}
                onChange={(e) => setCompanyInfo({ ...companyInfo, gstin: e.target.value })}
              />
              <Input
                label="PAN Number"
                value={companyInfo.pan}
                onChange={(e) => setCompanyInfo({ ...companyInfo, pan: e.target.value })}
              />
              <Input
                label="CIN"
                value={companyInfo.cin}
                onChange={(e) => setCompanyInfo({ ...companyInfo, cin: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Address Line 1"
                value={companyInfo.address1}
                onChange={(e) => setCompanyInfo({ ...companyInfo, address1: e.target.value })}
              />
              <Input
                label="Address Line 2"
                value={companyInfo.address2}
                onChange={(e) => setCompanyInfo({ ...companyInfo, address2: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                value={companyInfo.city}
                onChange={(e) => setCompanyInfo({ ...companyInfo, city: e.target.value })}
              />
              <Input
                label="State"
                value={companyInfo.state}
                onChange={(e) => setCompanyInfo({ ...companyInfo, state: e.target.value })}
              />
              <Input
                label="PIN Code"
                value={companyInfo.pincode}
                onChange={(e) => setCompanyInfo({ ...companyInfo, pincode: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone"
                value={companyInfo.phone}
                onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={companyInfo.email}
                onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button icon={Save} loading={loading} onClick={() => handleSave('Company')}>
                Save Company Info
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Invoice Settings Tab */}
      {activeTab === 'invoice' && (
        <Card title="Invoice Configuration">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Invoice Prefix"
                value={invoiceSettings.invoicePrefix}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, invoicePrefix: e.target.value })}
              />
              <Input
                label="Proforma Prefix"
                value={invoiceSettings.proformaPrefix}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, proformaPrefix: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Starting Number"
                type="text"
                value={invoiceSettings.startingNumber}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, startingNumber: e.target.value })}
              />
              <Select
                label="Financial Year Format"
                value={invoiceSettings.fyFormat}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, fyFormat: e.target.value })}
                options={[
                  { value: 'yyyy-yy', label: '2025-26' },
                  { value: 'yyyy', label: '2025' }
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Default Tax Rate (%)"
                type="text"
                value={invoiceSettings.defaultTaxRate}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, defaultTaxRate: e.target.value })}
              />
              <Select
                label="Tax Type"
                value={invoiceSettings.taxType}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, taxType: e.target.value })}
                options={[
                  { value: 'gst', label: 'GST (CGST + SGST)' },
                  { value: 'igst', label: 'IGST' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Footer Note
              </label>
              <textarea
                rows={3}
                value={invoiceSettings.footerNote}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, footerNote: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              {[
                { key: 'showLogo', label: 'Show company logo on invoice' },
                { key: 'showQR', label: 'Show payment QR code' },
                { key: 'showTerms', label: 'Show terms & conditions' }
              ].map((item) => (
                <label key={item.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={invoiceSettings[item.key]}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, [item.key]: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Button icon={Save} loading={loading} onClick={() => handleSave('Invoice')}>
                Save Invoice Settings
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <Card title="SMS Notifications">
            <div className="space-y-4">
              <Input
                label="SMS Provider API Key"
                type="password"
                value={smsSettings.apiKey}
                onChange={(e) => setSmsSettings({ ...smsSettings, apiKey: e.target.value })}
              />
              <Input
                label="Sender ID"
                value={smsSettings.senderId}
                onChange={(e) => setSmsSettings({ ...smsSettings, senderId: e.target.value })}
              />

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Send SMS for:</p>
                {[
                  { key: 'orderConfirmation', label: 'Order confirmation' },
                  { key: 'outForDelivery', label: 'Out for delivery (with OTP)' },
                  { key: 'delivered', label: 'Order delivered' },
                  { key: 'paymentReceived', label: 'Payment received' }
                ].map((item) => (
                  <label key={item.key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={smsSettings[item.key]}
                      onChange={(e) => setSmsSettings({ ...smsSettings, [item.key]: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <Button icon={Save} loading={loading} onClick={() => handleSave('SMS')}>
                  Save SMS Settings
                </Button>
              </div>
            </div>
          </Card>

          <Card title="Email Notifications">
            <div className="space-y-4">
              <Input
                label="SMTP Host"
                value={emailSettings.smtpHost}
                onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
              />
              <Input
                label="SMTP Port"
                type="number"
                value={emailSettings.smtpPort}
                onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
              />
              <Input
                label="SMTP Username"
                value={emailSettings.smtpUsername}
                onChange={(e) => setEmailSettings({ ...emailSettings, smtpUsername: e.target.value })}
              />
              <Input
                label="SMTP Password"
                type="password"
                value={emailSettings.smtpPassword}
                onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
              />

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Send email for:</p>
                {[
                  { key: 'invoiceGeneration', label: 'Invoice generation' },
                  { key: 'paymentReminders', label: 'Payment reminders' },
                  { key: 'lowStockAlerts', label: 'Low stock alerts' }
                ].map((item) => (
                  <label key={item.key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={emailSettings[item.key]}
                      onChange={(e) => setEmailSettings({ ...emailSettings, [item.key]: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>

              <div className="mt-6 p-4 border rounded" >
                <h3>Test Email Configuration </h3>
                < div className="flex mt-3 gap-2 items-center" >
                  <Input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@example.com"
                  />
                  <div class="mb-4 ">
                    <Button
                      onClick={() => testmyEmail(testEmail)}
                    >
                      Send Test Email
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button icon={Save} loading={loading} onClick={() => handleSave('Email')}>
                  Save Email Settings
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card title="Password Policy">
            <div className="space-y-4">
              <Input
                label="Minimum Password Length"
                type="number"
                value={securitySettings.minPasswordLength}
                onChange={(e) => setSecuritySettings({ ...securitySettings, minPasswordLength: e.target.value })}
              />
              <Input
                label="Password Expiry (Days)"
                type="number"
                value={securitySettings.passwordExpiry}
                onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: e.target.value })}
              />

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
                {[
                  { key: 'requireUppercase', label: 'Require uppercase letter' },
                  { key: 'requireLowercase', label: 'Require lowercase letter' },
                  { key: 'requireNumber', label: 'Require number' },
                  { key: 'requireSpecial', label: 'Require special character' }
                ].map((item) => (
                  <label key={item.key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={securitySettings[item.key]}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, [item.key]: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <Button icon={Save} loading={loading} onClick={() => handleSave('Security')}>
                  Save Security Settings
                </Button>
              </div>
            </div>
          </Card>

          <Card title="Two-Factor Authentication">
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Enable 2FA for enhanced security. Users will need to enter a code from their authenticator app.
                </p>
              </div>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={securitySettings.enable2FA}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, enable2FA: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Enable 2FA for all users</span>
              </label>

              <div className="flex justify-end pt-4">
                <Button icon={Save} loading={loading} onClick={() => handleSave('2FA')}>
                  Save 2FA Settings
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Backup Tab */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <Card title="Database Backup">
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
                <CheckCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Last backup</p>
                  <p className="text-sm text-yellow-800">November 03, 2025 at 02:00 AM</p>
                </div>
              </div>

              <Select
                label="Automatic Backup Frequency"
                options={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' }
                ]}
                value="daily"
              />

              <Input
                label="Backup Retention (Days)"
                type="number"
                value="30"
              />

              <div className="flex space-x-3 pt-4">
                <Button variant="outline">Download Latest Backup</Button>
                <Button loading={loading} onClick={handleBackup}>
                  Create Backup Now
                </Button>
              </div>
            </div>
          </Card>

          <Card title="Data Export">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Export all your data for compliance or migration purposes.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" fullWidth onClick={() => handleExport('Products')}>
                  Export All Products
                </Button>
                <Button variant="outline" fullWidth onClick={() => handleExport('Customers')}>
                  Export All Customers
                </Button>
                <Button variant="outline" fullWidth onClick={() => handleExport('Sales')}>
                  Export All Sales
                </Button>
                <Button variant="outline" fullWidth onClick={() => handleExport('Employees')}>
                  Export All Employees
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Settings;




