import React, { useRef, useEffect } from 'react';
import { LogEntry, LogLevel } from '../types';

interface LogsConsoleProps {
  logs: LogEntry[];
}

const getLogLevelInfo = (level: LogLevel): { text: string; color: string } => {
  switch (level) {
    case LogLevel.SUCCESS:
      return { text: 'SUCCESS', color: 'text-green-400' };
    case LogLevel.WARN:
      return { text: 'WARN', color: 'text-yellow-400' };
    case LogLevel.ERROR:
      return { text: 'ERROR', color: 'text-red-400' };
    case LogLevel.INFO:
      return { text: 'INFO', color: 'text-blue-400' };
    case LogLevel.RAW:
    default:
        return { text: '', color: ''};
  }
};

const LogsConsole: React.FC<LogsConsoleProps> = ({ logs }) => {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div
      ref={consoleRef}
      className="h-64 bg-gray-900 dark:bg-black rounded-lg p-4 overflow-y-auto font-mono text-xs text-gray-300 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
    >
      <div className="flex flex-col-reverse">
        {logs && logs.length > 0 ? (
          logs.map((log, index) => {
            const levelInfo = getLogLevelInfo(log.level);
            if (log.level === LogLevel.RAW) {
                return <p key={index} className="whitespace-pre-wrap">{log.message}</p>
            }
            return (
              <p key={index} className="whitespace-pre-wrap">
                <span className="text-gray-500 mr-2">{`[${log.timestamp}]`}</span>
                <span className={`${levelInfo.color} font-bold mr-2`}>{`[${levelInfo.text}]`}</span>
                <span>{log.message}</span>
              </p>
            );
          })
        ) : (
          <p className="text-gray-500">Miner logs will appear here once you start mining...</p>
        )}
      </div>
    </div>
  );
};

export default LogsConsole;