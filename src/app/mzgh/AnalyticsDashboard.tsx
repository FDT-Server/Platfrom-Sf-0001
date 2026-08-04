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
} from "@tabler/icons-react";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetrics = async () => {
    try {
      const res = await fetch("/api/mzgh/metrics");
      if (!res.ok) throw new Error("Failed to fetch metrics");
      const json = await res.json();
      if (json.success) {
        setMetrics(json.data);
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
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 3000); // Poll every 3 seconds for live effect
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  if (loading && !metrics) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-mono text-cyan-500">Initializing MZGH Interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 font-sans">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-slate-500 hover:text-white transition">
              <IconArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              MZGH Live Analytics
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1 ml-8 font-mono">
            Welcome back, {userName} | {lastUpdated?.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-md flex items-center gap-2">
            <IconShieldCheck className="w-4 h-4" />
            WAF Active
          </div>
          <div className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded-md flex items-center gap-2">
            <IconActivity className="w-4 h-4" />
            System OK
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 font-mono text-sm">
          Error: {error}
        </div>
      )}

      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Traffic & Database */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-6">
                <IconUsers className="w-4 h-4 text-cyan-400" />
                User Base
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Total Registered Users</p>
                  <p className="text-4xl font-light text-white font-mono tracking-tight">{metrics.database.totalUsers}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Active (24h)</p>
                    <p className="text-xl font-medium text-emerald-400 font-mono">{metrics.database.activeUsers24h}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Premium</p>
                    <p className="text-xl font-medium text-amber-400 font-mono">{metrics.database.premiumUsers}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-6">
                <IconChartBar className="w-4 h-4 text-purple-400" />
                Content Metrics
              </h2>
              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-slate-400">Total Posts</span>
                  <span className="text-white">{metrics.database.totalPosts}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-slate-400">Study Pods</span>
                  <span className="text-white">{metrics.database.totalStudyPods}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Chat Messages</span>
                  <span className="text-white">{metrics.database.totalMessages}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 & 3: Server Performance */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 h-full relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-6">
                <IconServer className="w-4 h-4 text-emerald-400" />
                Live Performance
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Memory Metrics */}
                <div>
                  <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <IconDatabase className="w-3.5 h-3.5" /> Memory Consumption
                  </h3>
                  <div className="space-y-5 font-mono">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Node RSS (Process)</span>
                        <span className="text-white">{formatBytes(metrics.system.memory.rssBytes)}</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1.5">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, (metrics.system.memory.rssBytes / (1024 * 1024 * 1024)) * 100)}%` }} 
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">V8 Heap Used</span>
                        <span className="text-white">{formatBytes(metrics.system.memory.heapUsedBytes)} / {formatBytes(metrics.system.memory.heapTotalBytes)}</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1.5">
                        <div 
                          className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: `${(metrics.system.memory.heapUsedBytes / metrics.system.memory.heapTotalBytes) * 100}%` }} 
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">OS Memory</span>
                        <span className="text-white">{formatBytes(metrics.system.memory.osUsedBytes)} / {formatBytes(metrics.system.memory.osTotalBytes)}</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1.5">
                        <div 
                          className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: `${(metrics.system.memory.osUsedBytes / metrics.system.memory.osTotalBytes) * 100}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* CPU & DB Metrics */}
                <div>
                  <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <IconCpu className="w-3.5 h-3.5" /> Processor & Database
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">CPU Load (1m)</p>
                      <p className="text-xl font-mono text-white">{metrics.system.cpu.loadAvg1m.toFixed(2)}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">DB Latency</p>
                      <p className={`text-xl font-mono ${metrics.database.queryLatencyMs < 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {metrics.database.queryLatencyMs}ms
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs font-mono">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-500">Node Environment</span>
                      <span className="text-cyan-400">{metrics.security.environment}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-500">System Uptime</span>
                      <span className="text-white">{formatUptime(metrics.system.uptimeSeconds)}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-500">Process Uptime</span>
                      <span className="text-white">{formatUptime(metrics.system.nodeUptimeSeconds)}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-500">CPU Cores</span>
                      <span className="text-white">{metrics.system.cpu.cores} logical cores</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
               <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
                <IconShieldCheck className="w-4 h-4 text-blue-400" />
                Security Gateway
              </h2>
              <div className="flex flex-wrap gap-2 font-mono text-[10px]">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded">DDoS Protection: ON</span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded">Bot Mitigation: ACTIVE</span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded">SSL/TLS: ENFORCED</span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded">Proxy Blocks: ENABLED</span>
              </div>
              <p className="text-xs text-slate-500 mt-4 leading-relaxed max-w-2xl">
                The platform is currently operating behind the Cloudflare Web Application Firewall. Common malicious bot patterns (e.g. sqlmap, nikto, headlesschrome) are actively being routed to 403 blocks.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
