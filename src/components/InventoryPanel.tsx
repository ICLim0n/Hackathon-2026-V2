import React, { useState } from 'react';
import { Inventory } from '../game/Inventory';
import { Item } from '../game/Item';
import {
  Briefcase,
  Flashlight,
  Binary,
  BookOpen,
  FileEdit,
  Headphones,
  KeyRound,
  ShieldCheck,
  Search,
  Sparkles,
  ChevronRight,
  Info,
} from 'lucide-react';
import { sound } from '../game/audio';
import { ToolModal } from './ToolModal';

interface InventoryPanelProps {
  inventory: Inventory;
  currentRoomId: number;
}

export const InventoryPanel: React.FC<InventoryPanelProps> = ({ inventory, currentRoomId }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const items = inventory.getItems();

  const getItemIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flashlight':
        return <Flashlight className="w-5 h-5 text-purple-400" />;
      case 'Binary':
        return <Binary className="w-5 h-5 text-cyan-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-amber-400" />;
      case 'FileEdit':
        return <FileEdit className="w-5 h-5 text-emerald-400" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5 text-rose-400" />;
      case 'KeyRound':
        return <KeyRound className="w-5 h-5 text-yellow-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-blue-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <>
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 shadow-md">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
              OPERATIVE INVENTORY & TOOLS
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-400">
            {items.length} {items.length === 1 ? 'ITEM' : 'ITEMS'}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-slate-500 font-mono text-xs italic">
              No tools collected yet. Search the room objects to locate helpful infiltration gear!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {items.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  sound.playClick();
                  setSelectedItem(item);
                }}
                className="group flex items-start gap-3 p-2.5 rounded bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-600/70 cursor-pointer transition shadow-xs"
              >
                <div className="p-2 rounded bg-slate-950 border border-slate-800 group-hover:border-cyan-500/50 shrink-0">
                  {getItemIcon(item.iconName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono text-xs font-bold text-slate-200 group-hover:text-cyan-300 truncate">
                      {item.name}
                    </h4>
                    <span className="text-[9px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition flex items-center">
                      USE <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3 text-cyan-500" /> Click item to inspect or activate tool assist
          </span>
          <span className="text-slate-400">TOOLS OPTIONAL</span>
        </div>
      </div>

      {/* Tool Assistant Modal */}
      {selectedItem && (
        <ToolModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          currentRoomId={currentRoomId}
        />
      )}
    </>
  );
};
