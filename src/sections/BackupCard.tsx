import { useRef, useState } from 'react';
import { Database, Download, Upload, FileSpreadsheet } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import {
  exportToJSON,
  importFromJSON,
  exportToCSV,
  downloadFile,
} from '@/data/storage';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function BackupCard() {
  const { data, reloadData } = useData();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const allTransactions = Object.values(data).flat();

  const handleSave = () => {
    try {
      const json = exportToJSON(data);
      const today = new Date().toISOString().split('T')[0];
      downloadFile(json, `masjid-finance-backup-${today}.json`, 'application/json');
      showToast('تم حفظ البيانات بنجاح', 'success');
    } catch {
      showToast('حدث خطأ أثناء حفظ البيانات', 'error');
    }
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setShowRestoreConfirm(true);
    // Reset input
    e.target.value = '';
  };

  const handleRestoreConfirm = () => {
    if (!pendingFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        importFromJSON(content);
        reloadData();
        showToast('تم استعادة البيانات بنجاح', 'success');
      } catch {
        showToast('ملف غير صالح', 'error');
      }
    };
    reader.readAsText(pendingFile);
    setShowRestoreConfirm(false);
    setPendingFile(null);
  };

  const handleExportCSV = () => {
    try {
      const csv = exportToCSV(allTransactions);
      const today = new Date().toISOString().split('T')[0];
      downloadFile(csv, `masjid-transactions-${today}.csv`, 'text/csv;charset=utf-8;');
      showToast('تم تصدير CSV بنجاح', 'success');
    } catch {
      showToast('حدث خطأ أثناء تصدير CSV', 'error');
    }
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Database className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-arabic font-bold text-lg text-slate-900">النسخ الاحتياطي</h3>
        </div>
        <p className="font-latin text-sm text-slate-500 mb-5">
          احفظ بياناتك أو استعدها من ملف محلي
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            className="h-11 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-arabic text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            حفظ البيانات
          </button>

          <button
            onClick={handleRestoreClick}
            className="h-11 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-arabic text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Upload className="w-4 h-4" />
            استعادة البيانات
          </button>

          <button
            onClick={handleExportCSV}
            className="h-11 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-arabic text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            تصدير CSV
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <ConfirmDialog
        isOpen={showRestoreConfirm}
        title="تأكيد الاستعادة"
        message="سيستبدل هذا الإجراء جميع البيانات الحالية. هل أنت متأكد؟"
        onConfirm={handleRestoreConfirm}
        onCancel={() => {
          setShowRestoreConfirm(false);
          setPendingFile(null);
        }}
        confirmText="استعادة"
        cancelText="إلغاء"
      />
    </>
  );
}
