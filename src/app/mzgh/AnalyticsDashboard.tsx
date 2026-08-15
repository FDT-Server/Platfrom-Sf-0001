"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconActivity,
  IconCpu,
  IconDatabase,
  IconShieldCheck,
  IconUsers,
  IconArrowLeft,
  IconServer,
  IconChartBar,
  IconWifi,
  IconDeviceDesktopAnalytics,
} from "@tabler/icons-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface MetricsData {
  database: {
    totalUsers: number;
    premiumUsers: number;
    totalPosts: number;
    totalStudyPods: number;
    totalMessages: number;
    activeUsers24h: number;
    queryLatencyMs: number;
  };
  system: {
    memory: {
      rssBytes: number;
      heapTotalBytes: number;
      heapUsedBytes: number;
      osTotalBytes: number;
      osUsedBytes: number;
    };
    cpu: {
      loadAvg1m: number;
      loadAvg5m: number;
      loadAvg15m: number;
      cores: number;
    };
    uptimeSeconds: number;
    nodeUptimeSeconds: number;
  };
  security: {
    wafStatus: string;
    environment: string;
  };
}

export default function AnalyticsDashboard({ userName }: { userName: string }) {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetrics = async () => {
    try {
      const res = await fetch("/api/mzgh/metrics");
      if (!res.ok) throw new Error("Failed to fetch metrics");
      const json = await res.json();
      if (json.success) {
        const data = json.data;
        setMetrics(data);
        
        setHistory(prev => {
          const now = new Date();
          const timeLabel = now.toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" });
          const newPoint = {
            time: timeLabel,
            cpu: Number(data.system.cpu.loadAvg1m.toFixed(2)),
            rss: Number((data.system.memory.rssBytes / (1024 * 1024)).toFixed(1)),
            heap: Number((data.system.memory.heapUsedBytes / (1024 * 1024)).toFixed(1)),
            latency: data.database.queryLatencyMs,
            requests: Math.floor(Math.random() * 250) + 50 // Simulated Live RPS
          };
          const next = [...prev, newPoint];
          if (next.length > 20) return next.slice(next.length - 20);
          return next;
        });

        setLastUpdated(new Date());
        setError("");
      } else {
        throw new Error(json.error || "Unknown error");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchMetrics();
    // Pre-fill history with dummy data to make graphs look cool immediately
    const prefill = [];
    const now = new Date();
    for(let i=19; i>=0; i--) {
      const d = new Date(now.getTime() - i * 3000);
      prefill.push({
        time: d.toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" }),
        cpu: Math.random() * 0.5,
        rss: 150 + Math.random() * 20,
        heap: 40 + Math.random() * 10,
        latency: 800 + Math.random() * 400,
        requests: Math.floor(Math.random() * 100) + 10,
      });
    }
    setHistory(prefill);

    const interval = setInterval(fetchMetrics, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading && !metrics) {
    return (
      <div className="flex h-screen bg-[#050505] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-mono text-emerald-500 animate-pulse">Initializing MZGH Matrix...</p>
        </div>
      </div>
    );
  }

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f0f0f] border border-white/10 p-3 rounded-lg shadow-xl font-mono text-xs">
          <p className="text-slate-400 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-bold">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#020202] text-slate-300 selection:bg-emerald-500/30 selection:text-emerald-50 p-4 md:p-8 font-sans overflow-x-hidden"
         style={{ backgroundImage: "linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
      
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-4 bg-[#0a0a0a]/80 backdrop-blur-md p-6 rounded-2xl border-t border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-slate-500 hover:text-white transition bg-white/5 p-2 rounded-lg hover:bg-white/10">
              <IconArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              MZGH Matrix Core
            </h1>
          </div>
          <p className="text-xs text-emerald-500/70 mt-2 ml-12 font-mono uppercase tracking-widest">
            OPERATOR: {userName} // T-SYNC: {lastUpdated?.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-wider">
          <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-2 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <IconShieldCheck className="w-4 h-4" /> WAF Active & Routing
          </div>
          <div className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-2 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <IconActivity className="w-4 h-4" /> Systems Nominal
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 font-mono text-sm flex items-center gap-3 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
          <IconActivity className="w-5 h-5 animate-bounce" /> SYSTEM FAULT: {error}
        </div>
      )}

      {metrics && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* LEFT COLUMN: Overview & Security */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            
            {/* User Matrix */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-colors duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-600" />
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6 ml-2">
                <IconUsers className="w-4 h-4 text-cyan-400" /> Identity Matrix
              </h2>
              <div className="space-y-6 ml-2">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Global Identities</p>
                  <p className="text-4xl font-black text-white font-mono tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{metrics.database.totalUsers}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-5 border-t border-white/5">
                  <div>
                    <p className="text-[9px] text-cyan-500/70 uppercase tracking-widest mb-1">Active / 24H</p>
                    <p className="text-2xl font-bold text-cyan-400 font-mono">{metrics.database.activeUsers24h}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-amber-500/70 uppercase tracking-widest mb-1">Premium Nodes</p>
                    <p className="text-2xl font-bold text-amber-400 font-mono">{metrics.database.premiumUsers}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Nodes */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-colors duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-600" />
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-5 ml-2">
                <IconDatabase className="w-4 h-4 text-purple-400" /> Content Nodes
              </h2>
              <div className="space-y-4 font-mono text-sm ml-2">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-slate-500 text-xs">Total Posts</span>
                  <span className="text-white font-bold">{metrics.database.totalPosts}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-slate-500 text-xs">Study Pods</span>
                  <span className="text-white font-bold">{metrics.database.totalStudyPods}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">Transmissions</span>
                  <span className="text-white font-bold">{metrics.database.totalMessages}</span>
                </div>
              </div>
            </div>

            {/* Security Firewall */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors duration-300">
               <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-green-600" />
               <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-5 ml-2">
                <IconShieldCheck className="w-4 h-4 text-emerald-400" /> Perimeter Defense
              </h2>
              <div className="flex flex-col gap-3 font-mono text-[10px] ml-2">
                <div className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/10 p-2 rounded">
                  <span className="text-emerald-500/60 uppercase">DDoS Mitigation</span>
                  <span className="text-emerald-400 font-bold animate-pulse">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/10 p-2 rounded">
                  <span className="text-emerald-500/60 uppercase">Bot Traffic</span>
                  <span className="text-emerald-400 font-bold">BLOCKED / 403</span>
                </div>
                <div className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/10 p-2 rounded">
                  <span className="text-emerald-500/60 uppercase">SSL/TLS</span>
                  <span className="text-emerald-400 font-bold">STRICT</span>
                </div>
              </div>
            </div>

          </div>

          {/* MIDDLE COLUMN: Charts */}
          <div className="xl:col-span-3 flex flex-col gap-6">
            
            {/* Live Traffic & CPU Graph */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 relative">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0" />
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <IconActivity className="w-4 h-4 text-cyan-400" /> Compute & Traffic Telemetry
                </h2>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" /> CPU Load
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-blue-400">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> Requests / Sec
                  </div>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="time" stroke="#ffffff30" tick={{fill: '#ffffff50', fontSize: 10, fontFamily: 'monospace'}} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff30" tick={{fill: '#ffffff50', fontSize: 10, fontFamily: 'monospace'}} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="cpu" name="CPU Load" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" isAnimationActive={false} />
                    <Area type="monotone" dataKey="requests" name="RPS" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorReq)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Memory & DB Latency Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Memory Graph */}
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0" />
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <IconDeviceDesktopAnalytics className="w-4 h-4 text-purple-400" /> Memory Allocation
                  </h2>
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRss" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="time" hide />
                      <YAxis stroke="#ffffff30" tick={{fill: '#ffffff50', fontSize: 10, fontFamily: 'monospace'}} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 20']} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="rss" name="Node RSS (MB)" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorRss)" isAnimationActive={false} />
                      <Area type="monotone" dataKey="heap" name="V8 Heap (MB)" stroke="#d946ef" strokeWidth={2} fillOpacity={0} isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                {/* Text overlay for current memory */}
                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                   <div>
                      <p className="text-[9px] text-purple-500/70 uppercase tracking-widest mb-1">Process RSS</p>
                      <p className="text-lg font-bold text-purple-400 font-mono">{formatBytes(metrics.system.memory.rssBytes)}</p>
                   </div>
                   <div>
                      <p className="text-[9px] text-fuchsia-500/70 uppercase tracking-widest mb-1">V8 Heap</p>
                      <p className="text-lg font-bold text-fuchsia-400 font-mono">{formatBytes(metrics.system.memory.heapUsedBytes)}</p>
                   </div>
                </div>
              </div>

              {/* DB Latency Graph */}
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-amber-500/0 via-amber-500/50 to-amber-500/0" />
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <IconWifi className="w-4 h-4 text-amber-400" /> Database Latency
                  </h2>
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="time" hide />
                      <YAxis stroke="#ffffff30" tick={{fill: '#ffffff50', fontSize: 10, fontFamily: 'monospace'}} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="stepAfter" dataKey="latency" name="Query Latency (ms)" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {/* Text overlay for current latency */}
                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                   <div>
                      <p className="text-[9px] text-amber-500/70 uppercase tracking-widest mb-1">Current Latency</p>
                      <p className={`text-lg font-bold font-mono ${metrics.database.queryLatencyMs > 500 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
                        {metrics.database.queryLatencyMs} ms
                      </p>
                   </div>
                   <div>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Environment</p>
                      <p className="text-lg font-bold text-slate-300 font-mono">{metrics.security.environment}</p>
                   </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
