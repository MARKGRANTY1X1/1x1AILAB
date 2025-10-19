import { useState, useEffect, useCallback, useRef } from 'react';
import { ChartDataPoint, AppSettings, LogLevel, LogEntry } from '../types';
import * as backendAPI from '../services/electronAPI';
import dayjs from 'dayjs';

const MAX_CHART_POINTS = 60; // 5 minutes of data at 5s intervals
const MAX_LOG_ENTRIES = 200;

// Regex patterns to parse output from common miners
const HASHRATE_REGEX = /(?:total|speed)\s+(?:(\d+\.\d+)\s*([a-zA-Z]?H\/s))/i;
const ACCEPTED_SHARE_REGEX = /(?:accepted|share accepted)/i;
const REJECTED_SHARE_REGEX = /(?:rejected|share rejected)/i;


const parseHashrate = (text: string): number | null => {
    const match = text.match(HASHRATE_REGEX);
    if (!match) return null;

    let hashrate = parseFloat(match[1]);
    const unit = match[2].toLowerCase();

    if (unit.startsWith('kh/s')) hashrate *= 1000;
    if (unit.startsWith('mh/s')) hashrate *= 1000 * 1000;
    if (unit.startsWith('gh/s')) hashrate *= 1000 * 1000 * 1000;
    
    // Convert to MH/s for consistency in the UI
    return hashrate / (1000 * 1000);
};

export const useMinerManager = () => {
  const [isStarting, setIsStarting] = useState(false);
  const [isMining, setIsMining] = useState(false);
  const [miningLogs, setMiningLogs] = useState<LogEntry[]>([]);
  const [hashrate, setHashrate] = useState(0);
  const [acceptedShares, setAcceptedShares] = useState(0);
  const [rejectedShares, setRejectedShares] = useState(0);
  const [miningChartData, setMiningChartData] = useState<ChartDataPoint[]>([]);
  
  const stopListenerRef = useRef<(() => void) | null>(null);

  const addLog = useCallback((message: string, level: LogLevel) => {
    const newLog: LogEntry = {
      timestamp: dayjs().format('HH:mm:ss'),
      message,
      level,
    };
    setMiningLogs(prev => [newLog, ...prev].slice(0, MAX_LOG_ENTRIES));
  }, []);

  const updateChart = useCallback((currentHashrate: number) => {
    setMiningChartData(prev => {
      const newPoint = {
        time: dayjs().format('HH:mm:ss'),
        hashrate: currentHashrate,
      };
      const new_data = [...prev, newPoint];
      if (new_data.length > MAX_CHART_POINTS) {
        return new_data.slice(new_data.length - MAX_CHART_POINTS);
      }
      return new_data;
    });
  }, []);

  const processMinerOutput = useCallback((data: string) => {
    addLog(data, LogLevel.RAW);

    // Parse for hashrate
    const newHashrate = parseHashrate(data);
    if (newHashrate !== null) {
      setHashrate(newHashrate);
      updateChart(newHashrate);
    }
    
    // Parse for accepted shares
    if (ACCEPTED_SHARE_REGEX.test(data)) {
        setAcceptedShares(prev => {
            const newCount = prev + 1;
            addLog(`Share accepted! (${newCount})`, LogLevel.SUCCESS);
            return newCount;
        });
    }
    
    // Parse for rejected shares
    if (REJECTED_SHARE_REGEX.test(data)) {
        setRejectedShares(prev => {
            const newCount = prev + 1;
            addLog(`Share rejected. (${newCount})`, LogLevel.ERROR);
            return newCount;
        });
    }

  }, [addLog, updateChart]);


  const startMining = useCallback(async (minerPath: string, command: string) => {
    if (isMining || isStarting) return false;

    setIsStarting(true);
    setMiningLogs([]);
    addLog('Starting miner...', LogLevel.INFO);

    const success = await backendAPI.startMinerProcess(minerPath, command);

    if (success) {
      stopListenerRef.current = backendAPI.onMinerOutput(processMinerOutput);
      
      backendAPI.onMinerExit((code) => {
          addLog(`Miner process exited with code ${code}.`, LogLevel.ERROR);
          setIsMining(false);
          setIsStarting(false);
          setHashrate(0);
      });

      // Give the miner a few seconds to initialize before officially setting the state to 'mining'
      setTimeout(() => {
        setIsMining(true);
        setIsStarting(false);
        addLog('Miner process started successfully. Waiting for output...', LogLevel.SUCCESS);
      }, 3000);
      
      // Reset stats
      setAcceptedShares(0);
      setRejectedShares(0);
      setMiningChartData([]);
      
      return true;
    } else {
      addLog('Failed to start miner process. Check miner path and command line arguments.', LogLevel.ERROR);
      setIsStarting(false);
      return false;
    }
  }, [isMining, isStarting, addLog, processMinerOutput]);

  const stopMining = useCallback(async () => {
    if (!isMining && !isStarting) return;
    
    addLog('Stopping miner...', LogLevel.INFO);
    await backendAPI.stopMinerProcess();
    
    if (stopListenerRef.current) {
        stopListenerRef.current();
        stopListenerRef.current = null;
    }

    setIsMining(false);
    setIsStarting(false);
    setHashrate(0);
    addLog('Miner stopped.', LogLevel.WARN);
  }, [isMining, isStarting, addLog]);

  return {
    isStarting,
    isMining,
    miningLogs,
    startMining,
    stopMining,
    hashrate,
    acceptedShares,
    rejectedShares,
    miningChartData,
  };
};