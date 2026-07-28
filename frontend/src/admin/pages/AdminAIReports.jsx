import React, { useState, useEffect } from 'react';
import { ClipboardCheck, ShieldAlert, Award, FileText, CheckCircle, RefreshCw, UserCheck } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import adminService from '../../services/adminService';
import { DataTable, Button, Modal, Badge } from '../../components/ui';

export const AdminAIReports = () => {
  const [reports, setReports] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Assign Expert state
  const [assigningReport, setAssigningReport] = useState(null);
  const [selectedExpertName, setSelectedExpertName] = useState('Dr. Amit Patel');
  
  // View Report state
  const [viewReport, setViewReport] = useState(null);

  const fetchAIReports = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAIReports();
      if (data) {
        setReports(data.reports || []);
        setHistory(data.history || []);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching AI reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIReports();
  }, []);

  const handleAssign = async () => {
    try {
      await adminService.assignExpert(assigningReport._id || assigningReport.id, selectedExpertName);
      setAssigningReport(null);
      fetchAIReports();
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      await adminService.verifyAIReport(id, status);
      setViewReport(null);
      fetchAIReports();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      key: 'cropName',
      label: 'Crop Name',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-border">
            <img src={row.leafImage || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=60'} alt={val} className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="font-bold text-white block">{val}</span>
            <span className="text-[10px] text-gray-500 block">Farmer: {row.farmerName}</span>
          </div>
        </div>
      )
    },
    { key: 'disease', label: 'AI Diagnosis', sortable: true },
    {
      key: 'confidence',
      label: 'Confidence',
      sortable: true,
      render: (val) => (
        <span className={`font-bold ${val >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
          {val}%
        </span>
      )
    },
    {
      key: 'severity',
      label: 'Severity',
      sortable: true,
      render: (val) => (
        <Badge className={
          val === 'Critical' || val === 'Severe' 
            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        }>
          {val}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => (
        <Badge className={
          val === 'Approved' 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
            : (val === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20')
        }>
          {val}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-border text-gray-400 hover:text-white rounded-lg text-xs"
            onClick={() => setViewReport(row)}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Details</span>
          </Button>
          {row.status === 'Pending' && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold"
              onClick={() => setAssigningReport(row)}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Assign Expert</span>
            </Button>
          )}
        </div>
      )
    }
  ];

  const historyColumns = [
    { key: 'expertName', label: 'Expert Name', sortable: true },
    {
      key: 'reviewTime',
      label: 'Review Date',
      sortable: true,
      render: (val) => new Date(val).toLocaleString()
    },
    { key: 'previousStatus', label: 'Previous Status' },
    {
      key: 'currentStatus',
      label: 'Updated Status',
      render: (val) => (
        <Badge className={val === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}>
          {val}
        </Badge>
      )
    }
  ];

  const COLORS = ['#22C55E', '#3B82F6', '#EAB308', '#A855F7'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-white tracking-tight flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-indigo-400" />
            AI Diagnostics Oversight
          </h1>
          <p className="text-gray-400 text-xs mt-1">Audit crop disease scans, verify model accuracy, and assign agronomist reviews.</p>
        </div>
        <Button variant="outline" className="border-border text-gray-400 hover:text-white" onClick={fetchAIReports}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Analytics Visualization charts */}
      {!loading && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Crop distribution */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white font-display mb-4">Diagnosis crop distribution</h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.cropDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.cropDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: 'rgba(255,255,255,0.08)' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Disease Stats */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white font-display mb-4">Leaf Disease Statistics</h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.diseaseDistribution}>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={10} />
                  <YAxis stroke="#6b7280" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: 'rgba(255,255,255,0.08)' }} />
                  <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]}>
                    {stats.diseaseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Main List */}
      <div className="bg-card/30 border border-border/80 rounded-3xl p-6 backdrop-blur-md">
        <div className="pb-4 border-b border-border/50 mb-4">
          <h3 className="text-base font-bold font-display text-white">AI Crop Scans Queue</h3>
        </div>
        <DataTable
          columns={columns}
          data={reports}
          isLoading={loading}
          emptyMessage="No AI diagnosis reports registered"
          defaultPageSize={5}
        />
      </div>

      {/* Review History Audit Log */}
      <div className="bg-card/30 border border-border/80 rounded-3xl p-6 backdrop-blur-md">
        <div className="pb-4 border-b border-border/50 mb-4">
          <h3 className="text-base font-bold font-display text-white">Expert Audit & Review History</h3>
          <p className="text-gray-400 text-[10px] mt-0.5">Logs of agronomy experts overrides and ticket status updates.</p>
        </div>
        <DataTable
          columns={historyColumns}
          data={history}
          isLoading={loading}
          emptyMessage="No historical override logs found"
          defaultPageSize={5}
        />
      </div>

      {/* ASSIGN EXPERT MODAL */}
      <Modal
        isOpen={!!assigningReport}
        onClose={() => setAssigningReport(null)}
        title="Assign Expert Agronomist"
      >
        {assigningReport && (
          <div className="space-y-4 text-xs">
            <p className="text-gray-400 leading-normal">
              Assign a certified agriculture expert to audit the AI diagnosis for <strong>{assigningReport.cropName}</strong> (scan details: <em>{assigningReport.disease}</em>).
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Select Expert</label>
              <select
                value={selectedExpertName}
                onChange={(e) => setSelectedExpertName(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl text-sm py-2 px-3 text-text focus:outline-none focus:border-primary/50"
              >
                <option value="Dr. Amit Patel">Dr. Amit Patel (PhD Agronomy)</option>
                <option value="Dr. Anita Verma">Dr. Anita Verma (M.Sc. Plant Pathology)</option>
                <option value="Expert Vikram Lal">Expert Vikram Lal (Soil Analyst)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
              <Button variant="outline" onClick={() => setAssigningReport(null)}>Cancel</Button>
              <Button onClick={handleAssign}>Assign Expert</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* DETAILS VIEW MODAL */}
      <Modal
        isOpen={!!viewReport}
        onClose={() => setViewReport(null)}
        title="Diagnostic Ticket Audit"
      >
        {viewReport && (
          <div className="space-y-4 text-xs">
            <div className="flex gap-4 pb-4 border-b border-border/40">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-border">
                <img src={viewReport.leafImage} alt={viewReport.cropName} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">{viewReport.cropName} - {viewReport.disease}</h3>
                <span className="text-gray-500 block font-medium mt-0.5">Scan registered by {viewReport.farmerName}</span>
                <span className="text-gray-500 font-mono block mt-0.5">ID: {viewReport._id}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">Diagnosis Confidence</span>
                <span className={`text-sm font-bold ${viewReport.confidence >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>{viewReport.confidence}% Accuracy</span>
              </div>
              <div>
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">Infection Severity</span>
                <span className="text-white text-sm font-bold">{viewReport.severity}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px]">Model Recommendation</span>
              <p className="p-3 bg-surface border border-border/40 rounded-xl text-text/80 leading-relaxed font-medium">
                {viewReport.aiRecommendation}
              </p>
            </div>

            {viewReport.expertFeedback && (
              <div className="space-y-1">
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px]">Agronomist Audit Remarks</span>
                <p className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-indigo-300 leading-relaxed font-medium">
                  {viewReport.expertFeedback}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
              <div className="flex gap-2 mr-auto">
                {viewReport.status === 'Pending' && (
                  <>
                    <Button
                      className="bg-emerald-500 hover:bg-emerald-600 text-white border-transparent"
                      onClick={() => handleVerify(viewReport._id, 'Approved')}
                    >
                      Approve Scan
                    </Button>
                    <Button
                      className="bg-rose-500 hover:bg-rose-600 text-white border-transparent"
                      onClick={() => handleVerify(viewReport._id, 'Rejected')}
                    >
                      Reject Scan
                    </Button>
                  </>
                )}
              </div>
              <Button variant="outline" onClick={() => setViewReport(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminAIReports;
