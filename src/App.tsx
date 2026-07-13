/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Login from './Login';
import { 
  Home, 
  Megaphone, 
  ShoppingBag, 
  Package, 
  ClipboardList, 
  GraduationCap, 
  BarChart3, 
  UserPlus, 
  Leaf, 
  ShoppingCart, 
  Eye, 
  Briefcase, 
  CheckSquare,
  Search,
  RotateCcw,
  LayoutList,
  LayoutGrid,
  ChevronDown,
  Bell,
  Grid,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  ExternalLink,
  Copy,
  ArrowLeft,
  Info,
  History,
  Store,
  FileText,
  Edit3,
  Settings,
  User,
  Users,
  MessageCircle,
  Calendar,
  Check,
  ThumbsUp,
  Share2,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  Wallet,
  LogIn,
  ArrowUpDown,
  Trash2,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type ActivityStatus = '进行中' | '草稿' | '已结束' | '已暂停' | '已中止' | '未开始';
type ParticipationStatus = '待参与' | '已拒绝' | '已参与';
type IncentiveMode = '及时豆' | '延时豆';
type IncentiveType = '建档' | '检测' | '回访';

interface Activity {
  id: string;
  name: string;
  manufacturer: string;
  manufacturerCode: string;
  status: ActivityStatus;
  participationStatus: ParticipationStatus;
  startTime: string;
  endTime: string;
  incentiveType: IncentiveType;
  incentiveMode: IncentiveMode;
  varietyCount?: number;
  rejectReason?: string;
  rejectTime?: string;
}

// --- Mock Data ---

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: '1',
    name: '短信推广活动素管顿宽恙',
    manufacturer: '易采',
    manufacturerCode: 'SP4867',
    status: '未开始',
    participationStatus: '待参与',
    startTime: '2026-03-18',
    endTime: '2026-03-20',
    incentiveType: '建档',
    incentiveMode: '及时豆',
  },
  {
    id: '2',
    name: '短信推广活动苦淳载矢芋',
    manufacturer: '易采',
    manufacturerCode: 'SP4867',
    status: '进行中',
    participationStatus: '待参与',
    startTime: '2026-03-18',
    endTime: '2026-03-20',
    incentiveType: '检测',
    incentiveMode: '及时豆',
  },
  {
    id: '3',
    name: '短信推广活动贬窗尸顿熊',
    manufacturer: '易采',
    manufacturerCode: 'SP4867',
    status: '未开始',
    participationStatus: '待参与',
    startTime: '2026-03-18',
    endTime: '2026-03-20',
    incentiveType: '回访',
    incentiveMode: '及时豆',
  },
  {
    id: '4',
    name: '发券活动1773813386305',
    manufacturer: '易采',
    manufacturerCode: 'SP4867',
    status: '未开始',
    participationStatus: '待参与',
    startTime: '2026-03-20',
    endTime: '2026-03-20',
    incentiveType: '建档',
    incentiveMode: '及时豆',
  },
  {
    id: '5',
    name: '发券活动1773813379506',
    manufacturer: '易采',
    manufacturerCode: 'SP4867',
    status: '未开始',
    participationStatus: '待参与',
    startTime: '2026-03-20',
    endTime: '2026-03-20',
    incentiveType: '检测',
    incentiveMode: '及时豆',
  },
  {
    id: '6',
    name: '积分记账活动9688247638',
    manufacturer: '易采',
    manufacturerCode: 'SP4867',
    status: '未开始',
    participationStatus: '待参与',
    startTime: '2026-03-19',
    endTime: '2026-03-20',
    incentiveType: '回访',
    incentiveMode: '延时豆',
    varietyCount: 2,
  },
  {
    id: '7',
    name: '慢病管理回访活动-春季关怀',
    manufacturer: '海典医药',
    manufacturerCode: 'HD001',
    status: '进行中',
    participationStatus: '待参与',
    startTime: '2026-03-15',
    endTime: '2026-04-15',
    incentiveType: '回访',
    incentiveMode: '及时豆',
  },
  {
    id: '8',
    name: '糖尿病检测专项活动',
    manufacturer: '诺和诺德',
    manufacturerCode: 'NN882',
    status: '草稿',
    participationStatus: '待参与',
    startTime: '2026-04-01',
    endTime: '2026-04-30',
    incentiveType: '检测',
    incentiveMode: '延时豆',
  }
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`flex flex-col items-center py-3 cursor-pointer transition-colors ${active ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
  >
    <Icon size={20} />
    <span className="text-[10px] mt-1 font-medium">{label}</span>
  </div>
);

const SubmenuItem = ({ label, active = false, onClick, hasChildren = false, expanded = false }: { label: string, active?: boolean, onClick?: () => void, hasChildren?: boolean, expanded?: boolean }) => (
  <div className="flex flex-col">
    <div 
      onClick={onClick}
      className={`px-4 py-2.5 text-sm cursor-pointer flex justify-between items-center transition-colors ${active ? 'text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
    >
      <span>{label}</span>
      {hasChildren && (
        <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
      )}
    </div>
  </div>
);

const ChildMenuItem = ({ label, active = false, onClick }: { label: string, active?: boolean, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`pl-8 pr-4 py-2 text-xs cursor-pointer transition-colors ${active ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-500 hover:text-blue-500 hover:bg-gray-50'}`}
  >
    {label}
  </div>
);

const TabItem = ({ label, active = false, onClick }: { label: string, active?: boolean, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className={`px-4 py-2 text-sm cursor-pointer border-b-2 transition-all ${active ? 'text-orange-500 border-orange-500 font-medium' : 'text-gray-600 border-transparent hover:text-orange-400'}`}
  >
    {label}
  </div>
);

// --- Pagination Component ---

const Pagination = ({ total, pageSize = 5, currentPage, onPageChange }: { total: number, pageSize?: number, currentPage: number, onPageChange: (page: number) => void }) => {
  const totalPages = Math.ceil(total / pageSize);
  
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-4 flex items-center justify-between text-[11px] text-gray-500 px-4 py-3 border-t border-gray-100 bg-white">
      <div className="flex items-center space-x-1">
        <span>共</span>
        <span className="font-medium text-gray-700">{total}</span>
        <span>条</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <button 
          className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={14} />
        </button>
        
        {pageNumbers.map((page) => (
          <button 
            key={page}
            className={`w-7 h-7 flex items-center justify-center rounded-md font-medium transition-colors ${currentPage === page ? 'bg-blue-600 text-white shadow-sm shadow-blue-200' : 'border border-gray-200 hover:bg-gray-50 text-gray-600'}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        
        <button 
          className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={14} />
        </button>
        
        <div className="flex items-center ml-2 space-x-2">
          <select className="border border-gray-200 rounded-md px-2 py-1 bg-white outline-none focus:border-blue-400 transition-colors cursor-pointer">
            <option>{pageSize}条/页</option>
          </select>
          <div className="flex items-center space-x-1">
            <span>跳转至</span>
            <input 
              type="text" 
              className="w-9 border border-gray-200 rounded-md px-1 py-1 text-center outline-none focus:border-blue-400 transition-colors" 
              value={currentPage} 
              onChange={(e) => {
                const p = parseInt(e.target.value);
                if (!isNaN(p) && p >= 1 && p <= totalPages) onPageChange(p);
              }}
            />
            <span>页</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Reusable Table Filter Component ---
const GenericTableFilter = ({ 
  initialTimeField, 
  initialStartDate, 
  initialEndDate,
  onQuery,
  onReset
}: {
  initialTimeField: string,
  initialStartDate: string,
  initialEndDate: string,
  onQuery: (data: { timeField: string, startDate: string, endDate: string }) => void,
  onReset: () => void
}) => {
  const [localTimeField, setLocalTimeField] = useState(initialTimeField);
  const [localStartDate, setLocalStartDate] = useState(initialStartDate);
  const [localEndDate, setLocalEndDate] = useState(initialEndDate);
  const [showTimeFieldDropdown, setShowTimeFieldDropdown] = useState(false);

  const timeFields = [
    '订单创建时间',
    '奖励生成时间',
    '账户中心创建时间',
    '账户中心入账时间',
    '账户中心出账时间'
  ];

  // Sync with initial values when they change (e.g. on reset)
  useEffect(() => {
    setLocalTimeField(initialTimeField);
    setLocalStartDate(initialStartDate);
    setLocalEndDate(initialEndDate);
  }, [initialTimeField, initialStartDate, initialEndDate]);

  const handleQuery = () => {
    onQuery({
      timeField: localTimeField,
      startDate: localStartDate,
      endDate: localEndDate
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-6 mb-4">
      <div className="flex items-center space-x-3 relative">
        <div className="relative">
          <button 
            onClick={() => setShowTimeFieldDropdown(!showTimeFieldDropdown)}
            className={`flex items-center justify-between px-3 py-1.5 min-w-[120px] text-sm border rounded-lg transition-all ${
              showTimeFieldDropdown ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'
            } bg-white text-gray-700`}
          >
            <span>{localTimeField}</span>
            {showTimeFieldDropdown ? (
              <ChevronLeft size={16} className="rotate-90 text-blue-500 ml-2" />
            ) : (
              <ChevronDown size={16} className="text-gray-400 ml-2" />
            )}
          </button>

          {showTimeFieldDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-xl z-50 py-1">
              {timeFields.map((field) => (
                <button
                  key={field}
                  onClick={() => {
                    setLocalTimeField(field);
                    setShowTimeFieldDropdown(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <span>{field}</span>
                  {localTimeField === field && <Check size={14} className="text-blue-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-600">时间范围:</span>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="date" 
              value={localStartDate}
              onChange={(e) => setLocalStartDate(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50/50"
            />
          </div>
          <span className="text-gray-400">-</span>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="date" 
              value={localEndDate}
              onChange={(e) => setLocalEndDate(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50/50"
            />
          </div>
        </div>
        <span className="text-[10px] text-orange-400">* 最长可选择一年</span>
      </div>

      <div className="flex items-center space-x-2 ml-auto">
        <button 
          onClick={handleQuery}
          className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center"
        >
          <Search size={14} className="mr-1.5" />
          查询
        </button>
        <button 
          onClick={onReset}
          className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center"
        >
          <RotateCcw size={14} className="mr-1.5" />
          重置
        </button>
      </div>
    </div>
  );
};

// --- Variety Dimension View Component ---

const VarietyDimensionView = ({ onActivityClick }: { onActivityClick?: (id: string) => void }) => {
  const [trendMetric, setTrendMetric] = useState('按销售金额');
  const [trendComparison, setTrendComparison] = useState('同比');
  const [show3AModal, setShow3AModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  
  const topSellingRef = useRef<HTMLDivElement>(null);
  const nonSellingRef = useRef<HTMLDivElement>(null);

  const threeAProducts = [
    { name: '感冒灵颗粒', code: '6901234567890', batchNumber: '20240401', tag: '3A', qty: '4159', sales: '41174.1', gp: '12352.2', gpr: '30.00%', incentiveQty: '3800', incentiveSales: '38000' },
    { name: '阿莫西林胶囊', code: '6901234567891', batchNumber: '20240315', tag: '3A', qty: '3200', sales: '32000.0', gp: '9600.0', gpr: '30.00%', incentiveQty: '3000', incentiveSales: '30000' },
    { name: '板蓝根颗粒', code: '6901234567892', batchNumber: '20240405', tag: '3A', qty: '2800', sales: '28000.0', gp: '8400.0', gpr: '30.00%', incentiveQty: '2500', incentiveSales: '25000' },
    { name: '布洛芬缓释胶囊', code: '6901234567893', batchNumber: '20240210', tag: '3A', qty: '2500', sales: '25000.0', gp: '7500.0', gpr: '30.00%', incentiveQty: '2200', incentiveSales: '22000' },
    { name: '小儿氨酚黄那敏颗粒', code: '6901234567894', batchNumber: '20240412', tag: '3A', qty: '2100', sales: '21000.0', gp: '6300.0', gpr: '30.00%', incentiveQty: '1800', incentiveSales: '18000' },
    { name: '维C银翘片', code: '6901234567895', batchNumber: '20240320', tag: '3A', qty: '1900', sales: '19000.0', gp: '5700.0', gpr: '30.00%', incentiveQty: '1600', incentiveSales: '16000' },
    { name: '复方草珊瑚含片', code: '6901234567896', batchNumber: '20240115', tag: '3A', qty: '1700', sales: '17000.0', gp: '5100.0', gpr: '30.00%', incentiveQty: '1400', incentiveSales: '14000' },
    { name: '牛黄解毒片', code: '6901234567897', batchNumber: '20240205', tag: '3A', qty: '1500', sales: '15000.0', gp: '4500.0', gpr: '30.00%', incentiveQty: '1200', incentiveSales: '12000' },
    { name: '清开灵颗粒', code: '6901234567898', batchNumber: '20240310', tag: '3A', qty: '1300', sales: '13000.0', gp: '3900.0', gpr: '30.00%', incentiveQty: '1000', incentiveSales: '10000' },
    { name: '京都念慈菴蜜炼川贝枇杷膏', code: '6901234567899', batchNumber: '20240220', tag: '3A', qty: '1100', sales: '11000.0', gp: '3300.0', gpr: '30.00%', incentiveQty: '800', incentiveSales: '8000' },
  ];

  const stats = [
    { label: '四季蝉活动品销售额', value: '117.42万', subValue: '146个商品', trend: '-26.55%', isUp: false, icon: <BarChart3 className="text-blue-500" size={20} /> },
    { label: '动销商品数', value: '120', subValue: '动销率 82.19%', trend: '+5.2%', isUp: true, icon: <ShoppingBag className="text-orange-500" size={20} />, clickable: true },
    { label: '未动销商品数', value: '26', subValue: '需关注', trend: '-12.5%', isUp: false, icon: <Package className="text-gray-400" size={20} />, clickable: true },
    { label: '3A商品数', value: '50', subValue: '占比 34.25%', trend: '+2.1%', isUp: true, icon: <GraduationCap className="text-purple-500" size={20} />, clickable: true },
    { label: '3A商品销售额', value: '45.2万', subValue: '占比 12.5%', trend: '+15.8%', isUp: true, icon: <Wallet className="text-pink-500" size={20} />, clickable: true },
  ];

  const topSelling = [
    { name: '感冒灵颗粒', code: '6901234567890', batchNumber: '20240401', manufacturer: '华润三九医药股份有限公司', qty: '4159', sales: '41174.1元', gp: '12352.2元', gpr: '30.00%', incentiveQty: '3800', incentiveSales: '38000元', tag3A: '3A' },
    { name: '阿莫西林胶囊', code: '6901234567891', batchNumber: '20240315', manufacturer: '华北制药股份有限公司', qty: '3200', sales: '32000.0元', gp: '9600.0元', gpr: '30.00%', incentiveQty: '3000', incentiveSales: '30000元', tag3A: '3A' },
    { name: '板蓝根颗粒', code: '6901234567892', batchNumber: '20240405', manufacturer: '太极集团重庆涪陵制药厂', qty: '2800', sales: '28000.0元', gp: '8400.0元', gpr: '30.00%', incentiveQty: '2500', incentiveSales: '25000元', tag3A: '-' },
    { name: '布洛芬缓释胶囊', code: '6901234567893', batchNumber: '20240210', manufacturer: '中美天津史克制药有限公司', qty: '2500', sales: '25000.0元', gp: '7500.0元', gpr: '30.00%', incentiveQty: '2200', incentiveSales: '22000元', tag3A: '3A' },
    { name: '小儿氨酚黄那敏颗粒', code: '6901234567894', batchNumber: '20240412', manufacturer: '华润三九医药股份有限公司', qty: '2100', sales: '21000.0元', gp: '6300.0元', gpr: '30.00%', incentiveQty: '1800', incentiveSales: '18000元', tag3A: '-' },
    { name: '维C银翘片', code: '6901234567895', batchNumber: '20240320', manufacturer: '贵州百灵企业集团制药股份有限公司', qty: '1900', sales: '19000.0元', gp: '5700.0元', gpr: '30.00%', incentiveQty: '1600', incentiveSales: '16000元', tag3A: '3A' },
    { name: '复方草珊瑚含片', code: '6901234567896', batchNumber: '20240115', manufacturer: '江中药业股份有限公司', qty: '1700', sales: '17000.0元', gp: '5100.0元', gpr: '30.00%', incentiveQty: '1400', incentiveSales: '14000元', tag3A: '-' },
    { name: '牛黄解毒片', code: '6901234567897', batchNumber: '20240205', manufacturer: '同仁堂', qty: '1500', sales: '15000.0元', gp: '4500.0元', gpr: '30.00%', incentiveQty: '1200', incentiveSales: '12000元', tag3A: '3A' },
    { name: '清开灵颗粒', code: '6901234567898', batchNumber: '20240310', manufacturer: '广州白云山医药集团股份有限公司', qty: '1300', sales: '13000.0元', gp: '3900.0元', gpr: '30.00%', incentiveQty: '1000', incentiveSales: '10000元', tag3A: '-' },
    { name: '京都念慈菴蜜炼川贝枇杷膏', code: '6901234567899', batchNumber: '20240220', manufacturer: '京都念慈菴总厂有限公司', qty: '1100', sales: '11000.0元', gp: '3300.0元', gpr: '30.00%', incentiveQty: '800', incentiveSales: '8000元', tag3A: '3A' },
  ];

  const nonSelling = [
    { 
      name: '健胃消食片', 
      code: '6901234567890', 
      batchNumber: '20240105', 
      category: '消化系统', 
      activities: [
        { id: 'ACT001', name: '夏季清爽活动' },
        { id: 'ACT101', name: '全场通用直提' }
      ],
      manufacturer: '江中药业股份有限公司', 
      reward: '及时豆',
      tag3A: '3A'
    },
    { 
      name: '维生素C泡腾片', 
      code: '6901234567891', 
      batchNumber: '20240212', 
      category: '营养补充', 
      activities: [{ id: 'ACT002', name: '健康季补贴' }],
      manufacturer: '拜耳医药保健有限公司', 
      reward: '及时豆',
      tag3A: '3A'
    },
    { 
      name: '藿香正气水', 
      code: '6901234567892', 
      batchNumber: '20240318', 
      category: '暑湿感冒', 
      activities: [{ id: 'ACT003', name: '清凉一夏' }],
      manufacturer: '太极集团重庆涪陵制药厂', 
      reward: '及时豆',
      tag3A: '-'
    },
    { 
      name: '阿莫西林胶囊', 
      code: '6901234567893', 
      batchNumber: '20240120', 
      category: '抗生素', 
      activities: [
        { id: 'ACT004', name: '秋季流感季' },
        { id: 'ACT104', name: '处方特惠专区' }
      ],
      manufacturer: '华北制药股份有限公司', 
      reward: '及时豆',
      tag3A: '3A'
    },
    { 
      name: '感冒灵颗粒', 
      code: '6901234567894', 
      batchNumber: '20240225', 
      category: '感冒用药', 
      activities: [{ id: 'ACT005', name: '家庭常备药' }],
      manufacturer: '华润三九医药股份有限公司', 
      reward: '及时豆',
      tag3A: '-'
    },
    { 
      name: '小柴胡颗粒', 
      code: '6901234567895', 
      batchNumber: '20240310', 
      category: '清热解毒', 
      activities: [{ id: 'ACT006', name: '春季惠民' }],
      manufacturer: '广州白云山医药集团股份有限公司', 
      reward: '延时豆',
      tag3A: '3A'
    },
    { 
      name: '银黄颗粒', 
      code: '6901234567896', 
      batchNumber: '20240115', 
      category: '呼吸系统', 
      activities: [
        { id: 'ACT007', name: '健康大礼包' },
        { id: 'ACT107', name: '社区健康季' }
      ],
      manufacturer: '葵花药业集团股份有限公司', 
      reward: '及时豆',
      tag3A: '-'
    },
    { 
      name: '蒲地蓝消炎片', 
      code: '6901234567897', 
      batchNumber: '20240205', 
      category: '抗炎', 
      activities: [{ id: 'ACT008', name: '关爱呼吸健康' }],
      manufacturer: '济川药业集团有限公司', 
      reward: '及时豆',
      tag3A: '3A'
    },
    { 
      name: '感冒止咳颗粒', 
      code: '6901234567898', 
      batchNumber: '20240320', 
      category: '感冒用药', 
      activities: [{ id: 'ACT009', name: '季末大促' }],
      manufacturer: '四川太极药业', 
      reward: '及时豆',
      tag3A: '-'
    },
    { 
      name: '复方感冒灵片', 
      code: '6901234567899', 
      batchNumber: '20240125', 
      category: '感冒用药', 
      activities: [{ id: 'ACT010', name: '品牌盛典' }],
      manufacturer: '三九医药', 
      reward: '及时豆',
      tag3A: '3A'
    },
  ];

  const risingStars = [
    { name: '燕窝(白燕窝)', code: '6901234560001', manufacturer: '厦门燕安居连锁有限公司', currentSales: '4000.00', prevSales: '800.00', currentGP: '1200.00', prevGP: '240.00', yoy: '400.00%', mom: '350.00%', tag3A: '3A' },
    { name: '虫草清肺胶囊', code: '6901234560002', manufacturer: '吉林省通化博祥药业股份有限公司', currentSales: '3249.60', prevSales: '764.68', currentGP: '974.88', prevGP: '229.40', yoy: '324.96%', mom: '280.50%', tag3A: '3A' },
    { name: '燕窝', code: '6901234560003', manufacturer: '同仁堂', currentSales: '2400.00', prevSales: '1000.00', currentGP: '720.00', prevGP: '300.00', yoy: '140.00%', mom: '120.00%', tag3A: '3A' },
    { name: '灵芝孢子粉', code: '6901234560004', manufacturer: '寿仙谷', currentSales: '1985.00', prevSales: '1000.00', currentGP: '595.50', prevGP: '300.00', yoy: '98.50%', mom: '85.00%', tag3A: '-' },
    { name: '复方阿胶浆', code: '6901234560005', manufacturer: '东阿阿胶股份有限公司', currentSales: '1852.00', prevSales: '1000.00', currentGP: '555.60', prevGP: '300.00', yoy: '85.20%', mom: '75.00%', tag3A: '3A' },
    { name: '安神补脑液', code: '6901234560006', manufacturer: '敖东', currentSales: '1724.00', prevSales: '1000.00', currentGP: '517.20', prevGP: '300.00', yoy: '72.40%', mom: '65.00%', tag3A: '-' },
    { name: '补中益气丸', code: '6901234560007', manufacturer: '仲景宛西制药', currentSales: '1651.50', prevSales: '1000.00', currentGP: '495.45', prevGP: '300.00', yoy: '65.15%', mom: '58.00%', tag3A: '-' },
    { name: '参术儿康糖浆', code: '6901234560008', manufacturer: '雷允上', currentSales: '1589.00', prevSales: '1000.00', currentGP: '476.70', prevGP: '300.00', yoy: '58.90%', mom: '50.00%', tag3A: '3A' },
    { name: '小金胶囊', code: '6901234560009', manufacturer: '健民集团', currentSales: '1523.00', prevSales: '1000.00', currentGP: '456.90', prevGP: '300.00', yoy: '52.30%', mom: '45.00%', tag3A: '-' },
    { name: '逍遥丸', code: '6901234560010', manufacturer: '北京同仁堂', currentSales: '1481.00', prevSales: '1000.00', currentGP: '444.30', prevGP: '300.00', yoy: '48.10%', mom: '40.00%', tag3A: '3A' },
  ];

  const fallingStars = [
    { name: '健脾八珍糕', code: '6901234561001', manufacturer: '北京同仁堂', currentSales: '6.30', prevSales: '1000.00', currentGP: '1.89', prevGP: '300.00', yoy: '-99.37%', mom: '-98.00%', tag3A: '3A' },
    { name: '阿莫西林克拉维酸钾干混悬剂', code: '6901234561002', manufacturer: '先声药业', currentSales: '19.20', prevSales: '1000.00', currentGP: '5.76', prevGP: '300.00', yoy: '-98.08%', mom: '-97.00%', tag3A: '3A' },
    { name: '他达拉非片(仁和)', code: '6901234561003', manufacturer: '仁和药业', currentSales: '85.30', prevSales: '1000.00', currentGP: '25.59', prevGP: '300.00', yoy: '-91.47%', mom: '-90.00%', tag3A: '3A' },
    { name: '六味地黄丸', code: '6901234561004', manufacturer: '仲景宛西制药', currentSales: '148.00', prevSales: '1000.00', currentGP: '44.40', prevGP: '300.00', yoy: '-85.20%', mom: '-82.00%', tag3A: '-' },
    { name: '知柏地黄丸', code: '6901234561005', manufacturer: '北京同仁堂', currentSales: '216.00', prevSales: '1000.00', currentGP: '64.80', prevGP: '300.00', yoy: '-78.40%', mom: '-75.00%', tag3A: '-' },
    { name: '归脾丸', code: '6901234561006', manufacturer: '九芝堂', currentSales: '278.50', prevSales: '1000.00', currentGP: '83.55', prevGP: '300.00', yoy: '-72.15%', mom: '-70.00%', tag3A: '-' },
    { name: '右旋糖酐铁口服液', code: '6901234561007', manufacturer: '哈药六厂', currentSales: '341.00', prevSales: '1000.00', currentGP: '102.30', prevGP: '300.00', yoy: '-65.90%', mom: '-62.00%', tag3A: '3A' },
    { name: '多维元素片', code: '6901234561008', manufacturer: '惠氏', currentSales: '417.00', prevSales: '1000.00', currentGP: '125.10', prevGP: '300.00', yoy: '-58.30%', mom: '-55.00%', tag3A: '-' },
    { name: '葡萄糖酸钙口服溶液', code: '6901234561009', manufacturer: '三精制药', currentSales: '479.00', prevSales: '1000.00', currentGP: '143.70', prevGP: '300.00', yoy: '-52.10%', mom: '-50.00%', tag3A: '-' },
    { name: '维生素AD滴剂', code: '6901234561010', manufacturer: '伊可新', currentSales: '545.00', prevSales: '1000.00', currentGP: '163.50', prevGP: '300.00', yoy: '-45.50%', mom: '-42.00%', tag3A: '3A' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 space-y-4 bg-gray-50 min-h-full"
    >
      {/* Module Title */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-bold text-gray-800">品种维度</h2>
          <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors shadow-sm">
            <Download size={12} className="mr-1.5" />
            导出所有数据
          </button>
        </div>
        <div className="text-xs text-gray-400">数据更新时间: 2026-03-18 08:31</div>
      </div>

      {/* Global stats and tables below */}
      <div className="grid grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            onClick={() => {
              if (stat.label === '动销商品数') {
                topSellingRef.current?.scrollIntoView({ behavior: 'smooth' });
              } else if (stat.label === '未动销商品数') {
                nonSellingRef.current?.scrollIntoView({ behavior: 'smooth' });
              } else if (stat.clickable) {
                setModalTitle(stat.label);
                setShow3AModal(true);
              }
            }}
            className={`bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-all ${stat.clickable ? 'cursor-pointer hover:shadow-md hover:border-blue-200 ring-offset-2 hover:ring-2 ring-blue-100' : 'hover:shadow-md'}`}
          >
            <div className="flex justify-between items-start">
              <div className="p-2 bg-gray-50 rounded-lg">{stat.icon}</div>
              <div className={`text-xs font-medium flex items-center ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend}
                {stat.isUp ? <ChevronDown size={12} className="rotate-180 ml-0.5" /> : <ChevronDown size={12} className="ml-0.5" />}
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1 flex justify-between">
                <span>{stat.label}</span>
                <span>{stat.subValue}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trends side by side */}
      <div className="grid grid-cols-2 gap-4">
        {/* Rising Trend */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[480px]">
          <div className="px-4 py-3 border-b border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-1.5 h-4 bg-green-500 rounded-full mr-2"></div>
                <h3 className="font-bold text-gray-700 text-sm">销售趋势上升榜</h3>
              </div>
              <button className="text-blue-600 hover:text-blue-700">
                <Download size={14} />
              </button>
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <div className="flex bg-gray-100 p-0.5 rounded text-[10px] flex-1">
                {['按销售金额', '按毛利额'].map(m => (
                  <button 
                    key={m}
                    onClick={() => setTrendMetric(m)}
                    className={`flex-1 py-1 rounded transition-all ${trendMetric === m ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-gray-500'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <div className="flex bg-gray-100 p-0.5 rounded text-[10px] w-24">
                {['同比', '环比'].map(c => (
                  <button 
                    key={c}
                    onClick={() => setTrendComparison(c)}
                    className={`flex-1 py-1 rounded transition-all ${trendComparison === c ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-gray-500'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-0 overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-left text-xs min-w-[1000px]">
              <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0 z-10">
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2 w-10 text-center">排名</th>
                  <th className="px-3 py-2 min-w-[120px]">商品名称</th>
                  <th className="px-3 py-2">商品编码</th>
                  <th className="px-3 py-2 text-center">3A标识</th>
                  <th className="px-3 py-2 min-w-[150px]">生产厂家</th>
                  <th className="px-3 py-2">本期销售</th>
                  <th className="px-3 py-2">上期销售</th>
                  <th className="px-3 py-2">本期毛利</th>
                  <th className="px-3 py-2">上期毛利</th>
                  <th className="px-3 py-2 font-bold text-green-600">{trendComparison === '同比' ? '同比比例' : '环比比例'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {risingStars.map((star, idx) => (
                  <tr key={idx} className="hover:bg-green-50/50 transition-colors group">
                    <td className="px-3 py-2.5 text-center">
                      <span className={`w-5 h-5 flex items-center justify-center rounded text-[10px] mx-auto ${idx < 3 ? 'bg-green-100 text-green-700 font-bold' : 'bg-gray-100 text-gray-500'}`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-medium text-gray-700 truncate max-w-[120px]" title={star.name}>{star.name}</td>
                    <td className="px-3 py-2.5 text-gray-400 font-mono text-[10px]">{star.code}</td>
                    <td className="px-3 py-2.5 text-center">
                      {star.tag3A === '3A' ? (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-100 rounded">
                          3A
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-gray-500 truncate max-w-[150px]" title={star.manufacturer}>{star.manufacturer}</td>
                    <td className="px-3 py-2.5 text-gray-600 font-medium">¥{star.currentSales}</td>
                    <td className="px-3 py-2.5 text-gray-400">¥{star.prevSales}</td>
                    <td className="px-3 py-2.5 text-gray-600 font-medium">¥{star.currentGP}</td>
                    <td className="px-3 py-2.5 text-gray-400">¥{star.prevGP}</td>
                    <td className="px-3 py-2.5 font-bold text-green-600">+{trendComparison === '同比' ? star.yoy : star.mom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Falling Trend */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[480px]">
          <div className="px-4 py-3 border-b border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-1.5 h-4 bg-red-500 rounded-full mr-2"></div>
                <h3 className="font-bold text-gray-700 text-sm">销售趋势下降榜</h3>
              </div>
              <button className="text-blue-600 hover:text-blue-700">
                <Download size={14} />
              </button>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="flex bg-gray-100 p-0.5 rounded text-[10px] flex-1">
                {['按销售金额', '按毛利额'].map(m => (
                  <button 
                    key={m}
                    onClick={() => setTrendMetric(m)}
                    className={`flex-1 py-1 rounded transition-all ${trendMetric === m ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-gray-500'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <div className="flex bg-gray-100 p-0.5 rounded text-[10px] w-24">
                {['同比', '环比'].map(c => (
                  <button 
                    key={c}
                    onClick={() => setTrendComparison(c)}
                    className={`flex-1 py-1 rounded transition-all ${trendComparison === c ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-gray-500'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-0 overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-left text-xs min-w-[1000px]">
              <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0 z-10">
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2 w-10 text-center">排名</th>
                  <th className="px-3 py-2 min-w-[120px]">商品名称</th>
                  <th className="px-3 py-2">商品编码</th>
                  <th className="px-3 py-2 text-center">3A标识</th>
                  <th className="px-3 py-2 min-w-[150px]">生产厂家</th>
                  <th className="px-3 py-2">本期销售</th>
                  <th className="px-3 py-2">上期销售</th>
                  <th className="px-3 py-2">本期毛利</th>
                  <th className="px-3 py-2">上期毛利</th>
                  <th className="px-3 py-2 font-bold text-red-600">{trendComparison === '同比' ? '同比比例' : '环比比例'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {fallingStars.map((star, idx) => (
                  <tr key={idx} className="hover:bg-red-50/50 transition-colors group">
                    <td className="px-3 py-2.5 text-center">
                      <span className={`w-5 h-5 flex items-center justify-center rounded text-[10px] mx-auto ${idx < 3 ? 'bg-red-100 text-red-700 font-bold' : 'bg-gray-100 text-gray-500'}`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-medium text-gray-700 truncate max-w-[120px]" title={star.name}>{star.name}</td>
                    <td className="px-3 py-2.5 text-gray-400 font-mono text-[10px]">{star.code}</td>
                    <td className="px-3 py-2.5 text-center">
                      {star.tag3A === '3A' ? (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-100 rounded">
                          3A
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-gray-500 truncate max-w-[150px]" title={star.manufacturer}>{star.manufacturer}</td>
                    <td className="px-3 py-2.5 text-gray-600 font-medium">¥{star.currentSales}</td>
                    <td className="px-3 py-2.5 text-gray-400">¥{star.prevSales}</td>
                    <td className="px-3 py-2.5 text-gray-600 font-medium">¥{star.currentGP}</td>
                    <td className="px-3 py-2.5 text-gray-400">¥{star.prevGP}</td>
                    <td className="px-3 py-2.5 font-bold text-red-600">{trendComparison === '同比' ? star.yoy : star.mom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Selling - Moved to full width row */}
      <div ref={topSellingRef} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden scroll-mt-20">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-700 flex items-center">
            <BarChart3 size={16} className="mr-2 text-blue-500" />
            动销商品前十名
          </h3>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-400">11月数据统计</span>
            <button className="flex items-center px-2 py-1 border border-blue-200 text-blue-600 rounded text-[10px] hover:bg-blue-50 transition-colors">
              <Download size={10} className="mr-1" />
              导出
            </button>
          </div>
        </div>
        <div className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2 font-medium min-w-[120px]">商品名称</th>
                <th className="px-4 py-2 font-medium text-center">3A标识</th>
                <th className="px-4 py-2 font-medium">商品编码</th>
                <th className="px-4 py-2 font-medium">商品批号</th>
                <th className="px-4 py-2 font-medium min-w-[150px]">生产厂家</th>
                <th className="px-4 py-2 font-medium">
                  <div className="flex items-center cursor-pointer hover:text-blue-600 transition-colors">
                    销售数量(盒)
                    <ArrowUpDown size={10} className="ml-1 opacity-70" />
                  </div>
                </th>
                <th className="px-4 py-2 font-medium">
                  <div className="flex items-center cursor-pointer hover:text-blue-600 transition-colors">
                    销售金额
                    <ArrowUpDown size={10} className="ml-1 opacity-70" />
                  </div>
                </th>
                <th className="px-4 py-2 font-medium">
                  <div className="flex items-center cursor-pointer hover:text-blue-600 transition-colors">
                    毛利额
                    <ArrowUpDown size={10} className="ml-1 opacity-70" />
                  </div>
                </th>
                <th className="px-4 py-2 font-medium">
                  <div className="flex items-center cursor-pointer hover:text-blue-600 transition-colors">
                    毛利率
                    <ArrowUpDown size={10} className="ml-1 opacity-70" />
                  </div>
                </th>
                <th className="px-4 py-2 font-medium">
                  <div className="flex items-center cursor-pointer hover:text-blue-600 transition-colors">
                    激励销售数量(盒)
                    <ArrowUpDown size={10} className="ml-1 opacity-70" />
                  </div>
                </th>
                <th className="px-4 py-2 font-medium">
                  <div className="flex items-center cursor-pointer hover:text-blue-600 transition-colors">
                    激励销售金额
                    <ArrowUpDown size={10} className="ml-1 opacity-70" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topSelling.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors text-xs">
                  <td className="px-4 py-3 font-medium text-gray-700 truncate max-w-[120px]" title={item.name}>{item.name}</td>
                  <td className="px-4 py-3 text-center">
                    {item.tag3A === '3A' ? (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-100 rounded">
                        3A
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-[10px]">{item.code}</td>
                  <td className="px-4 py-3 text-blue-400 bg-blue-50/50 px-1 rounded inline-block my-2 mx-4">{item.batchNumber}</td>
                  <td className="px-4 py-3 text-gray-500 truncate max-w-[150px]" title={item.manufacturer}>{item.manufacturer}</td>
                  <td className="px-4 py-3 text-gray-600">{item.qty}</td>
                  <td className="px-4 py-3 text-blue-600 font-medium">{item.sales}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">{item.gp}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">{item.gpr}</td>
                  <td className="px-4 py-3 text-gray-600">{item.incentiveQty}</td>
                  <td className="px-4 py-3 text-orange-600 font-medium">{item.incentiveSales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Non-Selling List */}
      <div ref={nonSellingRef} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden scroll-mt-20">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h3 className="font-bold text-gray-700 flex items-center">
              <Package size={16} className="mr-2 text-gray-400" />
              未动销商品列表 (26个)
            </h3>
            <button className="flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] hover:bg-gray-200 transition-colors">
              <Download size={10} className="mr-1" />
              导出全部
            </button>
          </div>
          <button className="text-xs text-blue-600 hover:underline">查看全部</button>
        </div>
        <div className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2 font-medium min-w-[120px]">商品名称</th>
                <th className="px-4 py-2 font-medium text-center">3A标识</th>
                <th className="px-4 py-2 font-medium">商品编码</th>
                <th className="px-4 py-2 font-medium">商品批号</th>
                <th className="px-4 py-2 font-medium min-w-[150px]">生产厂家</th>
                <th className="px-4 py-2 font-medium">所属品类</th>
                <th className="px-4 py-2 font-medium">配置活动ID</th>
                <th className="px-4 py-2 font-medium">活动名称</th>
                <th className="px-4 py-2 font-medium">奖励内容</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {nonSelling.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors text-xs">
                  <td className="px-4 py-3 font-medium text-gray-700 truncate max-w-[120px]" title={item.name}>{item.name}</td>
                  <td className="px-4 py-3 text-center">
                    {item.tag3A === '3A' ? (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-100 rounded">
                        3A
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-[10px]">{item.code}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] text-blue-400 bg-blue-50 px-1 rounded inline-block my-1">
                      {item.batchNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 truncate max-w-[150px]" title={item.manufacturer}>{item.manufacturer}</td>
                  <td className="px-4 py-3 text-gray-600">{item.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col space-y-1">
                      {item.activities.map((act, actIdx) => (
                        <button 
                          key={actIdx}
                          onClick={() => onActivityClick?.(act.id)}
                          className="text-gray-500 font-mono text-[10px] hover:text-blue-600 hover:underline text-left block"
                        >
                          {act.id}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col space-y-1">
                      {item.activities.map((act, actIdx) => (
                        <button 
                          key={actIdx}
                          onClick={() => onActivityClick?.(act.id)}
                          className="text-blue-600 hover:underline text-left text-xs line-clamp-1"
                        >
                          {act.name}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-center justify-center">
                      <div 
                        className={`w-5 h-4 mb-0.5 rounded-full shadow-sm ${item.reward === '延时豆' ? 'bg-[#9FEF70]' : 'bg-[#FECB45]'} rotate-[-20deg]`}
                        style={{ filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.1))' }}
                      />
                      <span className="text-[12px] text-gray-700">{item.reward}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{item.manufacturer}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination total={4120} currentPage={1} onPageChange={(p) => console.log(p)} />
        </div>
      </div>

      {/* 3A Details Modal */}
      <AnimatePresence>
        {show3AModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{modalTitle} 明细</h3>
                    <p className="text-xs text-gray-400">统计范围：四季蝉活动品种</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => {
                      alert('正在生成列表数据...');
                      setTimeout(() => alert('下载成功！'), 1000);
                    }}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Download size={14} className="mr-2" />
                    下载列表数据
                  </button>
                  <button 
                    onClick={() => setShow3AModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-0 scrollbar-hide">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider sticky top-0 z-10">
                    <tr className="border-b border-gray-100">
                      <th className="px-6 py-4 font-medium min-w-[240px]">商品信息</th>
                      <th className="px-6 py-4 font-medium text-right">销售数量</th>
                      <th className="px-6 py-4 font-medium text-right">销售金额</th>
                      <th className="px-6 py-4 font-medium text-right">毛利额</th>
                      <th className="px-6 py-4 font-medium text-right">毛利率</th>
                      <th className="px-6 py-4 font-medium text-right">激励销售数量</th>
                      <th className="px-6 py-4 font-medium text-right">激励销售金额</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {threeAProducts.map((item, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-1">
                            <div className="font-bold text-gray-800 text-sm flex items-center">
                              {item.name}
                              {item.tag === '3A' && (
                                <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold text-purple-600 bg-purple-50 border border-purple-100 rounded">
                                  3A
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 text-[10px]">
                              <span className="text-gray-400">编码: {item.code}</span>
                              <span className="text-blue-400 bg-blue-50 px-1.5 rounded">{item.batchNumber}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-gray-700">{item.qty}</td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-900 text-sm">¥{parseFloat(item.sales).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-gray-600">¥{parseFloat(item.gp).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-medium text-green-600">{item.gpr}</td>
                        <td className="px-6 py-4 text-right text-gray-700">{item.incentiveQty}</td>
                        <td className="px-6 py-4 text-right font-semibold text-blue-600">¥{parseFloat(item.incentiveSales).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <div className="text-xs text-gray-400">
                  共显示 {threeAProducts.length} 条数据
                </div>
                <button 
                  onClick={() => setShow3AModal(false)}
                  className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-white transition-colors"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- My Activities View Component ---

// --- Activity Detail View Component ---

const ActivityDetailView = ({ id, onBack }: { id: string; onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState('活动政策');
  const [activePolicyTab, setActivePolicyTab] = useState('单品销售激励');

  const activity = INITIAL_ACTIVITIES.find(a => a.id === id);

  const activityData = {
    id: activity?.id || id,
    name: activity?.name || '自动化代建-及时豆1773811889',
    status: activity?.status || '进行中',
    source: '代建',
    manufacturer: activity?.manufacturer || '小姆供应商',
    timeRange: activity ? `${activity.startTime} 至 ${activity.endTime}` : '2026-03-18 至 2026-03-19',
    releaseTime: '2026-03-18 13:31:34',
    participationTime: '2026-03-18 13:31:34',
    deductionMode: '激励扣连锁 服务费扣连锁',
    incentiveCalc: activity?.incentiveMode === '及时豆' ? '按商品数量' : '按实付金额',
    incentiveDist: '按固定金额',
    earnedAmount: 0
  };

  const products = [
    {
      id: 'p1',
      name: '头孢（辅酶Q10胶囊）',
      specs: '1g*6粒',
      code: '009726',
      barcode: '6910728380619',
      image: 'https://picsum.photos/seed/medicine1/80/80'
    },
    {
      id: 'p2',
      name: '乌鸡白凤丸',
      specs: '6g/袋*10袋',
      code: '009722',
      barcode: '6910728380620',
      image: 'https://picsum.photos/seed/medicine2/80/80'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft size={18} className="mr-1" />
            <span className="text-sm">返回</span>
          </button>
          <div className="h-4 w-[1px] bg-gray-300"></div>
          <span className="text-sm font-medium text-gray-800">活动详情</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Activity Info Card */}
        <div className="bg-white p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-bold text-gray-900">{activityData.name}</h1>
                <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded">{activityData.status}</span>
                <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded">{activityData.source}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-x-8 gap-y-2 text-xs text-gray-500">
                <div>活动ID: <span className="text-gray-800">{activityData.id}</span></div>
                <div>活动厂家: <span className="text-gray-800">{activityData.manufacturer}</span></div>
                <div className="col-span-2">活动时间: <span className="text-gray-800">{activityData.timeRange}</span></div>
                <div>发布时间: <span className="text-gray-800">{activityData.releaseTime}</span></div>
                <div>参与时间: <span className="text-gray-800">{activityData.participationTime}</span></div>
                <div>扣费模式: <span className="text-gray-800">{activityData.deductionMode}</span></div>
                <div>激励计算: <span className="text-gray-800">{activityData.incentiveCalc}</span></div>
                <div>激励发放: <span className="text-gray-800">{activityData.incentiveDist}</span></div>
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">获得激励金额</span>
                  <span className="text-lg font-bold text-orange-600 ml-2">{activityData.earnedAmount} 元</span>
                </div>
                <button className="text-blue-600 text-xs flex items-center hover:underline">
                  查看收入明细
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <button className="border border-blue-600 text-blue-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors">
              更多操作
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white px-4 border-b border-gray-200 flex items-center sticky top-0 z-10">
          {['活动政策', '动销效果', '执行情况', '活动门店', '历史记录'].map(tab => (
            <React.Fragment key={tab}>
              <TabItem 
                label={tab} 
                active={activeTab === tab} 
                onClick={() => setActiveTab(tab)} 
              />
            </React.Fragment>
          ))}
        </div>

        <div className="p-4 space-y-4">
          {/* Policy Priority Banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start space-x-3">
            <Info size={18} className="text-blue-600 mt-0.5 shrink-0" />
            <div className="space-y-3 flex-1">
              <p className="text-xs text-blue-800">
                *当同一个商品在不同活动中设置了不同的激励政策时，我们将按照以下优先级进行奖励发放（激励退还将按照此优先级反向进行）：
              </p>
              <div className="flex items-center space-x-2">
                {[
                  { title: '固定组合关联', sub: '关联销售激励' },
                  { title: '高频带低频关联', sub: '关联销售激励' },
                  { title: '高频带系列关联', sub: '关联销售激励' },
                  { title: '系列关联-任意组合', sub: '关联销售激励' },
                  { title: '疗程销售激励', sub: '' },
                  { title: '单品销售奖励', sub: '有阶梯/无阶梯' }
                ].map((step, idx, arr) => (
                  <React.Fragment key={idx}>
                    <div className="flex flex-col items-center">
                      <div className="bg-white border border-blue-200 rounded px-3 py-1.5 text-center min-w-[100px]">
                        <div className="text-[10px] font-bold text-gray-700">{step.title}</div>
                        {step.sub && <div className="text-[9px] text-gray-400">{step.sub}</div>}
                      </div>
                    </div>
                    {idx < arr.length - 1 && <ChevronRight size={14} className="text-blue-300" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Products Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-gray-800">活动商品 <span className="text-gray-400 font-normal ml-1">(2个有效商品)</span></h2>
              <div className="flex items-center space-x-3">
                <div className="flex">
                  <select className="border border-gray-200 rounded-l px-2 py-1.5 text-xs bg-gray-50 outline-none w-24">
                    <option>商品编码</option>
                  </select>
                  <input type="text" placeholder="请输入商品编码" className="border-y border-r border-gray-200 rounded-r px-3 py-1.5 text-xs outline-none w-48 focus:ring-1 focus:ring-blue-400" />
                </div>
                <button className="bg-blue-600 text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-blue-700">查询</button>
                <button className="border border-gray-200 text-gray-600 px-4 py-1.5 rounded text-xs font-medium hover:bg-gray-50">重置</button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {products.map(product => (
                <div key={product.id} className="border border-gray-100 rounded-lg p-3 flex space-x-3 relative group hover:border-blue-200 transition-colors">
                  <img src={product.image} alt={product.name} className="w-16 h-16 rounded object-cover border border-gray-50" referrerPolicy="no-referrer" />
                  <div className="flex-1 space-y-1">
                    <div className="text-xs font-bold text-gray-800 line-clamp-1">{product.name}</div>
                    <div className="text-[10px] text-gray-400">规格：{product.specs}</div>
                    <div className="text-[10px] text-gray-400">商品编码：{product.code}</div>
                    <button className="text-red-600 text-[10px] flex items-center hover:underline pt-1">
                      <X size={12} className="mr-0.5" />
                      停止政策
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Policy Details Section */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-white px-4 border-b border-gray-200 flex items-center">
              {['单品销售激励', '疗程销售激励', '关联销售激励', '销售排行激励'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActivePolicyTab(tab)}
                  className={`px-6 py-3 text-xs font-medium transition-colors relative ${
                    activePolicyTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                  {activePolicyTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
              ))}
            </div>

            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <button className="text-blue-600 text-xs flex items-center hover:underline">
                  导出
                  <ChevronDown size={14} className="ml-1" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="flex">
                    <select className="border border-gray-200 rounded-l px-2 py-1.5 text-xs bg-gray-50 outline-none w-24">
                      <option>商品编码</option>
                    </select>
                    <input type="text" placeholder="请输入商品编码" className="border-y border-r border-gray-200 rounded-r px-3 py-1.5 text-xs outline-none w-48 focus:ring-1 focus:ring-blue-400" />
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-blue-700">查询</button>
                  <button className="border border-gray-200 text-gray-600 px-4 py-1.5 rounded text-xs font-medium hover:bg-gray-50">重置</button>
                </div>
              </div>

              <div className="border border-gray-100 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3">商品信息</th>
                      <th className="px-4 py-3">批号</th>
                      <th className="px-4 py-3">激励政策</th>
                      <th className="px-4 py-3">政策状态</th>
                      <th className="px-4 py-3">更新时间</th>
                      <th className="px-4 py-3">营销政策</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.slice(0, 1).map(product => (
                      <tr key={product.id}>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-3">
                            <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" referrerPolicy="no-referrer" />
                            <div className="space-y-0.5">
                              <div className="font-bold text-gray-800">{product.name}</div>
                              <div className="text-[10px] text-gray-400">规格：{product.specs}</div>
                              <div className="text-[10px] text-gray-400">条形码：{product.barcode}</div>
                              <div className="text-[10px] text-gray-400">商品编码：{product.code}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-600">全部批号</td>
                        <td className="px-4 py-4">
                          <div className="text-gray-700">每销售1件，激励 <span className="text-blue-600 font-bold">店员 1元</span> <span className="text-orange-600 font-bold">店长 2元</span> <span className="text-green-600 font-bold">区域经理 3元</span></div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-green-600">有效</span>
                        </td>
                        <td className="px-4 py-4 text-gray-500">2026-03-18 13:31:32</td>
                        <td className="px-4 py-4 text-gray-400">-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyActivitiesView = ({ onDetailClick, onCreateClick }: { onDetailClick: (id: string) => void, onCreateClick: () => void }) => {
  const [activeMainTab, setActiveMainTab] = useState('带金活动');
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  const myActivities = [
    {
      id: '1',
      name: '短信推广活动喇嘛糯往顶',
      status: '进行中',
      source: '厂家活动',
      timeRange: '2026-03-18 至 2026-03-20',
      manufacturer: '小姆供应商',
      manufacturerCode: 'SP4867',
      enterprise: '',
      releaseTime: '2026-03-18 13:54:44',
      releaseOperator: '666666_admin',
      participationTime: '2026-03-18 13:54:45',
      participationOperator: '666666_admin',
      actualEndTime: '--',
      varietyCount: 0,
      storeCount: 0,
      rewardContent: '及时豆',
      incentiveCalc: '按商品数量',
      incentiveDist: '按固定金额',
      baseType: '按实付金额',
      chainSettlement: '--'
    },
    {
      id: '2',
      name: '发券活动1773813280931',
      status: '未开始',
      source: '厂家活动',
      timeRange: '2026-03-19 至 2026-03-19',
      manufacturer: '小姆供应商',
      manufacturerCode: 'SP4867',
      enterprise: '',
      releaseTime: '2026-03-18 13:54:42',
      releaseOperator: '666666_admin',
      participationTime: '2026-03-18 13:54:43',
      participationOperator: '666666_admin',
      actualEndTime: '--',
      varietyCount: 0,
      storeCount: 1,
      rewardContent: '及时豆',
      incentiveCalc: '按商品数量',
      incentiveDist: '按固定金额',
      baseType: '按实付金额',
      chainSettlement: '--'
    },
    {
      id: '3',
      name: '自动化系列目标活动1773812024',
      status: '已结束',
      source: '代建',
      tag: '系列目标',
      timeRange: '2027-01-01 至 2027-12-31',
      manufacturer: '小姆供应商',
      manufacturerCode: 'SP4867',
      enterprise: '',
      releaseTime: '2026-03-18 13:33:48',
      releaseOperator: '666666_admin',
      participationTime: '2026-03-18 13:33:48',
      participationOperator: '666666_admin',
      actualEndTime: '2026-03-18 13:33:50',
      actualEndOperator: '666666_admin',
      varietyCount: 1,
      storeCount: 1549,
      rewardContent: '及时豆',
      incentiveCalc: '按商品数量',
      incentiveDist: '按固定金额',
      baseType: '按实付金额',
      chainSettlement: '--'
    },
    {
      id: '4',
      name: '自动化代建-及时豆1773811889',
      status: '进行中',
      source: '代建',
      timeRange: '2026-03-18 至 2026-03-18',
      manufacturer: '小姆供应商',
      manufacturerCode: 'SP4867',
      enterprise: '测试部专用集团企业 c_20',
      releaseTime: '2026-03-18 13:31:34',
      releaseOperator: '666666_admin',
      participationTime: '2026-03-18 13:31:34',
      participationOperator: '666666_admin',
      actualEndTime: '--',
      varietyCount: 2,
      storeCount: 1,
      rewardContent: '及时豆',
      incentiveCalc: '按商品数量',
      incentiveDist: '按固定金额',
      baseType: '按实付金额',
      chainSettlement: '--'
    },
    {
      id: '5',
      name: '自动化代建-延时豆1773811882',
      status: '进行中',
      source: '代建',
      timeRange: '2026-03-18 至 2026-03-18',
      manufacturer: '小姆供应商',
      manufacturerCode: 'SP4867',
      enterprise: '测试部专用集团企业 c_20',
      releaseTime: '2026-03-18 13:31:26',
      releaseOperator: '666666_admin',
      participationTime: '2026-03-18 13:31:26',
      participationOperator: '666666_admin',
      actualEndTime: '--',
      varietyCount: 1,
      storeCount: 1,
      rewardContent: '延时豆',
      incentiveCalc: '按商品数量',
      incentiveDist: '按固定金额',
      baseType: '按实付金额',
      chainSettlement: '--'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Tabs */}
      <div className="bg-white px-4 border-b border-gray-200 flex items-center">
        <TabItem label="带金活动" active={activeMainTab === '带金活动'} onClick={() => setActiveMainTab('带金活动')} />
        <TabItem label="合约购药" active={activeMainTab === '合约购药'} onClick={() => setActiveMainTab('合约购药')} />
        <TabItem label="慢病活动" active={activeMainTab === '慢病活动'} onClick={() => setActiveMainTab('慢病活动')} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {/* Filter Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="grid grid-cols-6 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">所属企业</label>
              <select className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm bg-white outline-none focus:ring-1 focus:ring-blue-400">
                <option>请选择</option>
              </select>
            </div>
            <div className="space-y-1 col-span-1">
              <label className="text-xs text-gray-500">活动商品</label>
              <div className="flex">
                <select className="border border-gray-200 rounded-l px-1 py-1.5 text-xs bg-gray-50 outline-none w-20">
                  <option>商品编码</option>
                </select>
                <input type="text" placeholder="请输入商品编码" className="flex-1 border-y border-r border-gray-200 rounded-r px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-400" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">活动名称</label>
              <input type="text" placeholder="请输入活动名称" className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-400" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">活动状态</label>
              <select className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm bg-white outline-none focus:ring-1 focus:ring-blue-400">
                <option>请选择</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">活动类型</label>
              <select className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm bg-white outline-none focus:ring-1 focus:ring-blue-400">
                <option>全部</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">活动厂家</label>
              <input type="text" placeholder="请输入活动厂家" className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-400" />
            </div>

            {isFilterExpanded && (
              <>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">奖励内容</label>
                  <select className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm bg-white outline-none focus:ring-1 focus:ring-blue-400">
                    <option>请选择</option>
                  </select>
                </div>
                <div className="space-y-1 col-span-1">
                  <label className="text-xs text-gray-500">开始时间</label>
                  <div className="flex items-center space-x-1">
                    <input type="date" className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                    <span className="text-gray-400">至</span>
                    <input type="date" className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">激励计算</label>
                  <select className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm bg-white outline-none focus:ring-1 focus:ring-blue-400">
                    <option>请选择</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">激励发放</label>
                  <select className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm bg-white outline-none focus:ring-1 focus:ring-blue-400">
                    <option>请选择</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">活动区域</label>
                  <select className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm bg-white outline-none focus:ring-1 focus:ring-blue-400">
                    <option>请选择活动区域</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">扣费模式</label>
                  <select className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm bg-white outline-none focus:ring-1 focus:ring-blue-400">
                    <option>请选择</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">目标名称</label>
                  <input type="text" placeholder="请输入目标名称" className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-400" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">审核状态</label>
                  <select className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm bg-white outline-none focus:ring-1 focus:ring-blue-400">
                    <option>请选择</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">订单来源</label>
                  <select className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm bg-white outline-none focus:ring-1 focus:ring-blue-400">
                    <option>请选择</option>
                  </select>
                </div>
              </>
            )}

            <div className="col-span-6 flex items-center justify-end space-x-3 pt-2">
              <button 
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className="text-blue-600 text-xs flex items-center hover:underline"
              >
                <RotateCcw size={14} className={`mr-1 transition-transform ${isFilterExpanded ? 'rotate-180' : ''}`} />
                {isFilterExpanded ? '折叠条件' : '展开条件'}
              </button>
              <button className="bg-blue-600 text-white px-6 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
                <Search size={14} className="mr-1.5" />
                查询
              </button>
              <button className="border border-gray-200 text-gray-600 px-6 py-1.5 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                重置
              </button>
              <div className="relative group">
                <button className="border border-blue-600 text-blue-600 px-6 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors flex items-center">
                  导出
                  <ChevronDown size={14} className="ml-1.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <button onClick={onCreateClick} className="bg-blue-600 text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-blue-700 transition-colors flex items-center shadow-sm">
              <Plus size={14} className="mr-1.5" />
              代厂家建活动
            </button>
            <button className="border border-blue-600 text-blue-600 px-4 py-1.5 rounded text-xs font-medium hover:bg-blue-50 transition-colors shadow-sm">
              批量修改活动时间
            </button>
          </div>
          <button className="border border-blue-600 text-blue-600 px-4 py-1.5 rounded text-xs font-medium hover:bg-blue-50 transition-colors flex items-center shadow-sm">
            <LayoutGrid size={14} className="mr-1.5" />
            活动检查
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">活动名称</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">活动厂家</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">所属企业</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">发布时间</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">参与时间</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">实际结束时间</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">品种数</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap text-center">参与门店数</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap text-center">奖励内容</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">激励计算</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">激励发放</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">基数类型</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">连锁结算</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap text-center sticky right-0 bg-gray-50 shadow-[-4px_0_8px_rgba(0,0,0,0.02)]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myActivities.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 min-w-[240px]">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white shrink-0">
                          <Megaphone size={16} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-800">{item.name}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                              item.status === '进行中' ? 'text-green-600 bg-green-50' : 
                              item.status === '未开始' ? 'text-blue-600 bg-blue-50' : 
                              'text-gray-500 bg-gray-100'
                            }`}>{item.status}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] text-red-600 bg-red-50">{item.source}</span>
                            {item.tag && <span className="px-1.5 py-0.5 rounded text-[10px] text-blue-600 bg-blue-50">{item.tag}</span>}
                          </div>
                          <div className="text-[10px] text-gray-400">活动时间: {item.timeRange}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-gray-700">{item.manufacturer}</div>
                      <div className="text-[10px] text-gray-400">{item.manufacturerCode}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-600 max-w-[150px] truncate">{item.enterprise || '--'}</td>
                    <td className="px-4 py-4">
                      <div className="text-gray-700">{item.releaseTime.split(' ')[0]} {item.releaseTime.split(' ')[1]}</div>
                      <div className="text-[10px] text-gray-400">操作人: {item.releaseOperator}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-gray-700">{item.participationTime.split(' ')[0]} {item.participationTime.split(' ')[1]}</div>
                      <div className="text-[10px] text-gray-400">操作人: {item.participationOperator}</div>
                    </td>
                    <td className="px-4 py-4">
                      {item.actualEndTime === '--' ? (
                        <span className="text-gray-400">--</span>
                      ) : (
                        <>
                          <div className="text-gray-700">{item.actualEndTime.split(' ')[0]} {item.actualEndTime.split(' ')[1]}</div>
                          <div className="text-[10px] text-gray-400">操作人: {item.actualEndOperator}</div>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-700 text-center">{item.varietyCount}</td>
                    <td className="px-4 py-4 text-gray-700 text-center">{item.storeCount}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          item.rewardContent === '及时豆' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                        }`}>
                          <Leaf size={12} />
                        </div>
                        <span className="text-[10px] text-gray-500">{item.rewardContent}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{item.incentiveCalc}</td>
                    <td className="px-4 py-4 text-gray-600">{item.incentiveDist}</td>
                    <td className="px-4 py-4 text-gray-600">{item.baseType}</td>
                    <td className="px-4 py-4 text-gray-600">{item.chainSettlement}</td>
                    <td className="px-4 py-4 sticky right-0 bg-white shadow-[-4px_0_8px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center justify-center space-x-3">
                        <button 
                          onClick={() => onDetailClick(item.id)}
                          className="text-blue-600 hover:underline"
                        >
                          详情
                        </button>
                        <button className="text-blue-600 hover:underline">复制</button>
                        <button className="text-blue-600 hover:underline flex items-center">
                          更多
                          <ChevronDown size={12} className="ml-0.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination total={12785} pageSize={10} currentPage={1} onPageChange={(p) => console.log(p)} />
        </div>
      </div>
    </div>
  );
};

const ActivityDimensionView = ({ onActivityClick }: { onActivityClick?: (id: string) => void }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const activityStats = [
    { title: '单品销售激励', total: 150, active: 120, color: 'blue' },
    { title: '单品疗程销售激励', total: 80, active: 60, color: 'orange' },
    { title: '关联销售激励', total: 45, active: 30, color: 'green' },
    { title: '组合目标达成激励', total: 60, active: 40, color: 'purple' },
    { title: '单品目标达成激励', total: 35, active: 20, color: 'pink' },
    { title: '系列目标达成激励', total: 25, active: 15, color: 'indigo' },
  ];

  const mockDetails = [
    { name: '感冒灵颗粒', code: '6901234567890', category: '感冒用药', activityId: 'ACT001', activityName: '夏季清爽活动', manufacturer: '华润三九医药股份有限公司', activityManufacturer: '小姆供应商', status: '有动销', tag3A: '3A' },
    { name: '阿莫西林胶囊', code: '6901234567891', category: '抗生素', activityId: 'ACT002', activityName: '健康季补贴', manufacturer: '华北制药股份有限公司', activityManufacturer: '华北制药', status: '有动销', tag3A: '3A' },
    { name: '板蓝根颗粒', code: '6901234567892', category: '感冒用药', activityId: 'ACT003', activityName: '清凉一夏', manufacturer: '太极集团重庆涪陵制药厂', activityManufacturer: '太极集团', status: '有动销', tag3A: '-' },
    { name: '布洛芬缓释胶囊', code: '6901234567893', category: '解热镇痛', activityId: 'ACT004', activityName: '秋季流感季', manufacturer: '中美天津史克制药有限公司', activityManufacturer: '中美史克', status: '无动销', tag3A: '3A' },
    { name: '小儿氨酚黄那敏颗粒', code: '6901234567894', category: '儿童用药', activityId: 'ACT005', activityName: '家庭常备药', manufacturer: '华润三九医药股份有限公司', activityManufacturer: '三九医药', status: '有动销', tag3A: '-' },
    { name: '维C银翘片', code: '6901234567895', category: '感冒用药', activityId: 'ACT006', activityName: '冬季呵护', manufacturer: '贵州百灵企业集团制药股份有限公司', activityManufacturer: '贵州百灵', status: '无动销', tag3A: '3A' },
  ];

  const openDetails = (title: string) => {
    setModalTitle(title);
    setShowDetailsModal(true);
  };

  return (
    <div className="p-4 space-y-4 bg-gray-50 min-h-full">
      <div className="grid grid-cols-3 gap-4">
        {activityStats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4">
              <h3 className="font-bold text-gray-700">{stat.title}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button 
                onClick={() => openDetails(`${stat.title} - 商品总数`)}
                className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                <div className="text-xs text-gray-400 mb-1 group-hover:text-blue-500">商品总数</div>
                <div className="text-xl font-bold text-gray-800 group-hover:text-blue-600">{stat.total}</div>
              </button>
              <button 
                onClick={() => openDetails(`${stat.title} - 动销商品`)}
                className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                <div className="text-xs text-gray-400 mb-1 group-hover:text-blue-500">动销商品</div>
                <div className="text-xl font-bold text-blue-600 group-hover:underline">{stat.active}</div>
              </button>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-50">
              <button 
                onClick={() => openDetails(`${stat.title} - 未动销商品`)}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer group"
              >
                未动销: <span className="text-red-400 font-medium group-hover:underline">{stat.total - stat.active}</span>
              </button>
              <button 
                onClick={() => openDetails(stat.title)}
                className="text-xs text-blue-600 hover:underline flex items-center"
              >
                查看明细 <ChevronRight size={12} className="ml-0.5" />
              </button>
            </div>
          </div>
        ))}
        
        {/* Ranking Incentive Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="font-bold text-gray-700">排名激励政策</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button 
                onClick={() => openDetails('排名激励政策 - 商品总数')}
                className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                <div className="text-xs text-gray-400 mb-1 group-hover:text-blue-500">商品总数</div>
                <div className="text-xl font-bold text-gray-800 group-hover:text-blue-600">40</div>
              </button>
              <button 
                onClick={() => openDetails('排名激励政策 - 动销商品')}
                className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                <div className="text-xs text-gray-400 mb-1 group-hover:text-blue-500">动销商品</div>
                <div className="text-xl font-bold text-blue-600 group-hover:underline">32</div>
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm group">
                <span className="text-gray-500 scale-90 origin-left">单品排名激励</span>
                <button 
                  onClick={() => openDetails('单品排名激励')}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  4个
                </button>
              </div>
              <div className="flex justify-between items-center text-sm group">
                <span className="text-gray-500 scale-90 origin-left">系列排名激励</span>
                <button 
                  onClick={() => openDetails('系列排名激励')}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  2个
                </button>
              </div>
              <div className="flex justify-between items-center text-sm group">
                <span className="text-gray-500 scale-90 origin-left">销售周排名激励</span>
                <button 
                  onClick={() => openDetails('销售周排名激励')}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  3个
                </button>
              </div>
              <div className="flex justify-between items-center text-sm group">
                <span className="text-gray-500 scale-90 origin-left">销售月排名激励</span>
                <button 
                  onClick={() => openDetails('销售月排名激励')}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  3个
                </button>
              </div>
              <div className="flex justify-between items-center text-sm group">
                <span className="text-gray-500 scale-90 origin-left">早鸟激励</span>
                <button 
                  onClick={() => openDetails('早鸟激励')}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  1个
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <button 
                onClick={() => openDetails('排名激励政策 - 未动销商品')}
                className="text-[10px] text-gray-400 hover:text-red-500 transition-colors cursor-pointer text-left group"
              >
                未动销: <span className="text-red-400 font-medium group-hover:underline">8</span>
              </button>
            </div>
            <button 
              onClick={() => openDetails('排名激励政策')}
              className="text-xs text-blue-600 hover:underline flex items-center"
            >
              查看明细 <ChevronRight size={12} className="ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[85vh] flex flex-col"
          >
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <FileText size={20} className="mr-2 text-blue-500" />
                  {modalTitle} - 活动明细
                </h3>
                <button className="flex items-center px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100 transition-colors border border-blue-200">
                  <Download size={12} className="mr-1" />
                  下载报表
                </button>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-4">商品名称</th>
                      <th className="px-4 py-4">商品编码</th>
                      <th className="px-4 py-4">生产厂家</th>
                      <th className="px-4 py-4">3A标识</th>
                      <th className="px-4 py-4">所属品类</th>
                      <th className="px-4 py-4">动销状态</th>
                      <th className="px-4 py-4">配置活动ID</th>
                      <th className="px-4 py-4">活动名称</th>
                      <th className="px-4 py-4">活动厂家</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockDetails.map((item, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-4 py-4 font-medium text-gray-800">{item.name}</td>
                        <td className="px-4 py-4 text-gray-600 font-mono text-xs">{item.code}</td>
                        <td className="px-4 py-4 text-gray-500 text-xs">{item.manufacturer}</td>
                        <td className="px-4 py-4 text-center">
                          {item.tag3A === '3A' ? (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-100 rounded">
                              3A
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-gray-600">{item.category}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            item.status === '有动销' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-500 font-mono text-xs">{item.activityId}</td>
                        <td className="px-4 py-4">
                          <button 
                            onClick={() => {
                              setShowDetailsModal(false);
                              onActivityClick?.(item.activityId);
                            }}
                            className="text-blue-600 hover:underline text-left font-medium"
                          >
                            {item.activityName}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-gray-500 text-xs">{item.activityManufacturer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50/50 rounded-b-xl">
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// --- Incentive Distribution View Component ---

const IncentiveDistributionView = ({ 
  onNavigateToDetails 
}: { 
  onNavigateToDetails?: (filters: { startDate: string, endDate: string, rewardType: string }) => void 
}) => {
  const overallStats = [
    { label: '总实发金额', value: '340,098.87元', date: '截止11月17日', icon: <BarChart3 className="text-blue-500" size={20} />, type: '' },
    { label: '及时豆实发金额', value: '11,421.37元', date: '截止11月17日', icon: <ShoppingBag className="text-orange-500" size={20} />, type: '及时豆' },
    { label: '延时豆实发金额', value: '328,677.5元', date: '截止11月17日', icon: <Leaf className="text-green-500" size={20} />, type: '延时豆' },
  ];

  const employeeTop3 = [
    { name: '王艳玲', code: 'EMP001', store: '团结大街一店', amount: '94.5' },
    { name: '常青', code: 'EMP042', store: '曲石大龙井店', amount: '93.3' },
    { name: '杨艳丽', code: 'EMP108', store: '秀峰店', amount: '75.6' },
  ];

  const storeTop3 = [
    { name: '团结大街一店', code: 'STR001', area: '华东大区', amount: '150.1' },
    { name: '曲石大龙井店', code: 'STR022', area: '西南大区', amount: '130.98' },
    { name: '秀峰店', code: 'STR085', area: '华南大区', amount: '130.95' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 space-y-4 bg-gray-50 min-h-full"
    >
      {/* Overall Status */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-700 flex items-center">
            <Grid size={16} className="mr-2 text-blue-500" />
            活动激励发放
          </h3>
          <span className="text-xs text-gray-400">截止日期: 2026-11-17</span>
        </div>
        <div className="p-4 grid grid-cols-3 gap-4">
          {overallStats.map((stat, idx) => (
            <div 
              key={idx} 
              onClick={() => onNavigateToDetails?.({ startDate: '', endDate: '', rewardType: stat.type })}
              className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 cursor-pointer hover:bg-white hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-1.5 bg-white rounded-lg shadow-sm group-hover:bg-blue-50 transition-colors">{stat.icon}</div>
                <span className="text-xs text-gray-500 group-hover:text-blue-600 font-medium transition-colors">{stat.label}</span>
              </div>
              <div className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{stat.value}</div>
              <div className="text-[10px] text-gray-400 mt-1 flex justify-between items-center">
                <span>{stat.date}</span>
                <span className="text-blue-500 opacity-0 group-hover:opacity-100 text-[9px] flex items-center transition-all">
                  查看明细 <ChevronRight size={10} className="ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Employee Incentive */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-700 flex items-center">
              <UserPlus size={16} className="mr-2 text-orange-500" />
              员工发放激励情况
            </h3>
            <span className="text-xs text-gray-400">共激励 1129 人</span>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
              <div className="text-sm text-orange-800">人均获得激励</div>
              <div className="text-xl font-bold text-orange-600">10.12 元</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">获得激励前三名</div>
              <div className="space-y-2">
                {employeeTop3.map((emp, idx) => (
                  <div key={idx} className="bg-gray-50 p-2 rounded-lg border border-gray-100 grid grid-cols-4 gap-2 text-[10px] items-center">
                    <div className="truncate"><span className="text-gray-400">姓名:</span> <span className="font-medium text-gray-700">{emp.name}</span></div>
                    <div><span className="text-gray-400">编码:</span> <span>{emp.code}</span></div>
                    <div className="truncate" title={emp.store}><span className="text-gray-400">门店:</span> <span>{emp.store}</span></div>
                    <div className="text-right font-bold text-orange-600">{emp.amount} 元</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">激励区间分布 (人均 10.12)</div>
              <div className="space-y-2">
                {[
                  { label: '上浮 30% 以上', count: 42, total: 1129 },
                  { label: '上浮 10% - 30%', count: 156, total: 1129 },
                  { label: '下浮 10% - 30%', count: 284, total: 1129 },
                  { label: '下浮 30% 以下', count: 112, total: 1129 },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="text-xs text-gray-600 w-20">{item.label}</div>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-400 rounded-full" 
                        style={{ width: `${(item.count / item.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-[10px] text-gray-400 w-12 text-right">{item.count}人</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Store Incentive */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-700 flex items-center">
              <Home size={16} className="mr-2 text-blue-500" />
              门店发放激励情况
            </h3>
            <span className="text-xs text-gray-400">共激励 442 家</span>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <div className="text-sm text-blue-800">店均获得激励</div>
              <div className="text-xl font-bold text-blue-600">25.86 元</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">获得激励前三名</div>
              <div className="space-y-2">
                {storeTop3.map((store, idx) => (
                  <div key={idx} className="bg-gray-50 p-2 rounded-lg border border-gray-100 grid grid-cols-4 gap-2 text-[10px] items-center">
                    <div className="truncate" title={store.name}><span className="text-gray-400">名称:</span> <span className="font-medium text-gray-700">{store.name}</span></div>
                    <div><span className="text-gray-400">编码:</span> <span>{store.code}</span></div>
                    <div className="truncate"><span className="text-gray-400">片区:</span> <span>{store.area}</span></div>
                    <div className="text-right font-bold text-blue-600">{store.amount} 元</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">激励区间分布 (店均 25.86)</div>
              <div className="space-y-2">
                {[
                  { label: '上浮 30% 以上', count: 28, total: 442 },
                  { label: '上浮 10% - 30%', count: 64, total: 442 },
                  { label: '下浮 10% - 30%', count: 112, total: 442 },
                  { label: '下浮 30% 以下', count: 45, total: 442 },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="text-xs text-gray-600 w-20">{item.label}</div>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-400 rounded-full" 
                        style={{ width: `${(item.count / item.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-[10px] text-gray-400 w-12 text-right">{item.count}家</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Home View Component (Tabs) ---

const OrderSharingManagementView = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  const mockData = [
    {
      id: '26050800020024220',
      employee: {
        name: '随**',
        code: '1503',
        store: '海典智慧药房双品汇店(直营)'
      },
      enterprise: '上海海典智慧药店',
      enterpriseCode: 'c_20',
      district: '西南大区',
      districtCode: '04816',
      sharingTime: '2026-05-20 00:05:34',
      score: 21,
      tag: '-',
      incentiveStatus: '有激励',
      rewardContent: '延时豆',
      rewardValue: 1.01,
      manufacturer: '小婷供应商',
      manufacturerCode: 'SP4867',
      tipper: 'z**',
      issueTime: '2026-05-20 00:08:50',
      hideReason: '-',
    },
    {
      id: '26042300020010890',
      employee: {
        name: '随**',
        code: '1503',
        store: '海典智慧药房双品汇店(直营)'
      },
      enterprise: '上海海典智慧药店',
      enterpriseCode: 'c_20',
      district: '西南大区',
      districtCode: '04816',
      sharingTime: '2026-05-19 23:58:23',
      score: 100,
      tag: '优',
      incentiveStatus: '无激励',
      rewardContent: '-',
      rewardValue: 0,
      manufacturer: '--',
      manufacturerCode: '',
      tipper: '-',
      issueTime: '-',
      hideReason: '测试数据',
    },
    {
      id: '26042300020008277',
      employee: {
        name: '随**',
        code: '1503',
        store: '海典智慧药房双品汇店(直营)'
      },
      enterprise: '上海海典智慧药店',
      enterpriseCode: 'c_20',
      district: '西南大区',
      districtCode: '04816',
      sharingTime: '2026-05-19 23:54:00',
      score: 97,
      tag: '优',
      incentiveStatus: '有激励',
      rewards: [
        { type: '及时豆', value: 6.86 },
        { type: '延时豆', value: 6.67 }
      ],
      totalReward: 13.53,
      manufacturer: '小婷供应商',
      manufacturerCode: 'SP4867',
      tipper: 'z**',
      issueTime: '2026-05-20 00:12:22',
      hideReason: '测试数据',
    },
    {
      id: '25121000020007884',
      employee: {
        name: 'z**',
        code: '318401',
        store: '海典智慧药房双品汇店(直营)'
      },
      enterprise: '上海海典智慧药店',
      enterpriseCode: 'c_20',
      district: '西南大区',
      districtCode: '04816',
      sharingTime: '2025-12-10 00:49:07',
      score: 13,
      tag: '-',
      incentiveStatus: '无激励',
      rewardContent: '-',
      rewardValue: 0,
      manufacturer: '--',
      manufacturerCode: '',
      tipper: '--',
      issueTime: '-',
      hideReason: '-',
    }
  ];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(mockData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* Filters Area */}
      <div className="p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="grid grid-cols-5 gap-y-4 gap-x-6">
          <div className="flex items-center space-x-2">
            <label className="text-[12px] text-gray-500 w-16 text-right shrink-0">所属企业</label>
            <select className="border border-gray-200 rounded px-2 py-1.5 text-xs flex-1 bg-white focus:ring-1 focus:ring-blue-400 outline-none">
              <option>请选择</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-[12px] text-gray-500 w-16 text-right shrink-0">所属片区</label>
            <div className="relative flex-1">
              <input type="text" placeholder="输入片区名称" className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs pr-10 focus:ring-1 focus:ring-blue-400 outline-none" />
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-[12px] text-gray-500 w-16 text-right shrink-0">员工</label>
            <div className="relative flex-1">
              <input type="text" placeholder="搜索员工编码或名称" className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs pr-10 focus:ring-1 focus:ring-blue-400 outline-none" />
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-[12px] text-gray-500 w-16 text-right shrink-0">所属机构</label>
            <input type="text" placeholder="输入机构/门店名称" className="border border-gray-200 rounded px-2 py-1.5 text-xs flex-1 focus:ring-1 focus:ring-blue-400 outline-none" />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-[12px] text-gray-500 w-16 text-right shrink-0">展示状态</label>
            <select className="border border-gray-200 rounded px-2 py-1.5 text-xs flex-1 bg-white focus:ring-1 focus:ring-blue-400 outline-none">
              <option>请选择</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-[12px] text-gray-500 w-16 text-right shrink-0">晒单标签</label>
            <select className="border border-gray-200 rounded px-2 py-1.5 text-xs flex-1 bg-white focus:ring-1 focus:ring-blue-400 outline-none">
              <option>请选择</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-[12px] text-gray-500 w-16 text-right shrink-0">激励状态</label>
            <select className="border border-gray-200 rounded px-2 py-1.5 text-xs flex-1 bg-white focus:ring-1 focus:ring-blue-400 outline-none">
              <option>请选择</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 col-span-1">
            <label className="text-[12px] text-gray-500 w-16 text-right shrink-0">激励厂家</label>
            <div className="flex space-x-1 flex-1">
              <select className="border border-gray-200 rounded px-2 py-1.5 text-xs w-24 bg-white focus:ring-1 focus:ring-blue-400 outline-none">
                <option>厂家名称</option>
              </select>
              <input type="text" placeholder="请输入" className="border border-gray-200 rounded px-2 py-1.5 text-xs flex-1 focus:ring-1 focus:ring-blue-400 outline-none" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-[12px] text-gray-500 w-16 text-right shrink-0">激励发放时间</label>
            <div className="flex items-center space-x-1 flex-1">
              <div className="relative flex-1">
                <input type="text" placeholder="开始日期" className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-400 outline-none" />
              </div>
              <span className="text-gray-400 text-xs text-center">至</span>
              <div className="relative flex-1">
                <input type="text" placeholder="结束日期" className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs pr-10 focus:ring-1 focus:ring-blue-400 outline-none" />
                <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold" />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-[12px] text-gray-500 w-16 text-right shrink-0">奖励内容</label>
            <select className="border border-gray-200 rounded px-2 py-1.5 text-xs flex-1 bg-white focus:ring-1 focus:ring-blue-400 outline-none">
              <option>请选择</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-[12px] text-gray-500 w-16 text-right shrink-0">订单编号</label>
            <input type="text" placeholder="请输入" className="border border-gray-200 rounded px-2 py-1.5 text-xs flex-1 focus:ring-1 focus:ring-blue-400 outline-none" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1 flex-1 ml-[72px]">
              <select className="border border-gray-200 rounded px-2 py-1.5 text-xs w-24 bg-white focus:ring-1 focus:ring-blue-400 outline-none">
                <option>商品名称</option>
              </select>
              <input type="text" placeholder="请输入" className="border border-gray-200 rounded px-2 py-1.5 text-xs flex-1 focus:ring-1 focus:ring-blue-400 outline-none" />
            </div>
          </div>
          <div className="flex items-center space-x-3 ml-12">
            <button className="bg-blue-600 text-white px-6 py-1.5 rounded text-xs hover:bg-blue-700 transition-colors">查询</button>
            <button className="bg-white border border-gray-300 text-gray-600 px-6 py-1.5 rounded text-xs hover:bg-gray-50 transition-colors">重置</button>
            <div className="relative">
              <button className="flex items-center space-x-1 border border-blue-200 text-blue-600 px-3 py-1.5 rounded text-xs bg-blue-50 hover:bg-blue-100 transition-all">
                <span>导出</span>
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col flex-1 overflow-hidden">
          {/* Header Actions */}
          <div className="p-3 border-b border-gray-100 flex justify-end">
            <button className="flex items-center space-x-1 px-3 py-1.5 border border-blue-200 text-blue-600 rounded text-xs bg-blue-50 hover:bg-blue-100 transition-colors">
              <span>批量操作</span>
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto no-scrollbar">
            <table className="w-full text-left text-[12px] border-collapse sticky top-0 bg-white">
              <thead className="bg-[#f8fafc] text-gray-500 font-medium z-10 sticky top-0 shadow-sm border-b border-gray-100">
                <tr>
                  <th className="px-3 py-3 w-10">
                    <input type="checkbox" onChange={handleSelectAll} checked={selectedItems.length === mockData.length && mockData.length > 0} className="w-4 h-4 rounded border-gray-300" />
                  </th>
                  <th className="px-3 py-3 font-medium whitespace-nowrap">订单编号</th>
                  <th className="px-3 py-3 font-medium whitespace-nowrap">员工信息</th>
                  <th className="px-3 py-3 font-medium whitespace-nowrap">所属企业</th>
                  <th className="px-3 py-3 font-medium whitespace-nowrap">所属片区</th>
                  <th className="px-3 py-3 font-medium whitespace-nowrap">晒单时间</th>
                  <th className="px-3 py-3 font-medium whitespace-nowrap">晒单分值</th>
                  <th className="px-3 py-3 font-medium whitespace-nowrap">晒单标签</th>
                  <th className="px-3 py-3 font-medium whitespace-nowrap">激励状态</th>
                  <th className="px-3 py-3 font-medium whitespace-nowrap">奖励内容</th>
                  <th className="px-3 py-3 font-medium whitespace-nowrap text-center">激励总金额</th>
                  <th className="px-3 py-3 font-medium whitespace-nowrap">激励厂家</th>
                  <th className="px-3 py-3 font-medium whitespace-nowrap">打赏人</th>
                  <th className="px-3 py-3 font-medium whitespace-nowrap">激励发放时间</th>
                  <th className="px-3 py-3 font-medium whitespace-nowrap">隐藏原因</th>
                  <th className="px-3 py-3 font-medium whitespace-nowrap text-center sticky right-0 bg-[#f8fafc]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockData.map((item) => (
                  <tr key={item.id} className={`hover:bg-blue-50/30 transition-colors ${selectedItems.includes(item.id) ? 'bg-blue-50/50' : ''}`}>
                    <td className="px-3 py-4">
                      <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => handleSelectItem(item.id)} className="w-4 h-4 rounded border-gray-300" />
                    </td>
                    <td className="px-3 py-4 font-mono text-gray-500 whitespace-nowrap group">
                      <span className="hover:text-blue-500 cursor-pointer">{item.id}</span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden shrink-0">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.employee.code}`} alt="avatar" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-1">
                            <span className="font-bold text-gray-700 text-[13px]">{item.employee.name}</span>
                            <Eye size={12} className="text-gray-300 cursor-pointer hover:text-blue-400" />
                          </div>
                          <span className="text-[10px] text-gray-400">员工编码：{item.employee.code}</span>
                          <span className="text-[10px] text-gray-400">所属机构：{item.employee.store}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-gray-600">
                      <div>{item.enterprise}</div>
                      <div className="text-[10px] text-gray-400">{item.enterpriseCode}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-gray-600">
                      <div>{item.district}</div>
                      <div className="text-[10px] text-gray-400">{item.districtCode}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-gray-500 leading-tight">
                      {item.sharingTime.split(' ')[0]}<br/>{item.sharingTime.split(' ')[1]}
                    </td>
                    <td className="px-3 py-4 text-center font-bold text-gray-700">{item.score}</td>
                    <td className="px-3 py-4">
                      {item.tag !== '-' ? (
                        <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[10px]">{item.tag}</span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-3 py-4">
                      <span className={`${item.incentiveStatus === '有激励' ? 'text-green-600' : 'text-gray-400'}`}>
                        {item.incentiveStatus}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {item.rewards ? (
                        <div className="flex flex-col space-y-1">
                          {item.rewards.map((r, idx) => (
                            <div key={idx} className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${r.type === '及时豆' ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                              <span className="text-gray-600">{r.type}</span>
                            </div>
                          ))}
                        </div>
                      ) : item.rewardContent !== '-' ? (
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${item.rewardContent === '及时豆' ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                          <span className="text-gray-600">{item.rewardContent}</span>
                        </div>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {item.rewards ? (
                        <div className="text-[10px] text-gray-500">
                          <div className="font-bold text-gray-700 flex items-center justify-between">
                            激励总金额: <span>{item.totalReward}</span>
                          </div>
                          {item.rewards.map((r, idx) => (
                            <div key={idx} className="flex justify-between">
                              {r.type}: <span>{r.value}</span>
                            </div>
                          ))}
                        </div>
                      ) : item.rewardValue > 0 ? (
                        <div className="flex flex-col items-center">
                          <div className="text-gray-500">{item.rewardContent}: {item.rewardValue}</div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-300">-</div>
                      )}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-gray-600">
                      <div>{item.manufacturer}</div>
                      <div className="text-[10px] text-gray-400">{item.manufacturerCode}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-gray-600">
                      {item.tipper !== '-' ? (
                        <div className="flex items-center space-x-1">
                          <span>{item.tipper}</span>
                          <Eye size={12} className="text-gray-300 cursor-pointer" />
                        </div>
                      ) : (
                         <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-gray-500 leading-tight">
                      {item.issueTime !== '-' ? (
                        <>
                          {item.issueTime.split(' ')[0]}<br/>
                          {item.issueTime.split(' ')[1]}
                        </>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-gray-400">{item.hideReason}</td>
                    <td className="px-3 py-4 whitespace-nowrap sticky right-0 bg-white shadow-[-4px_0_10px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center justify-center space-x-3">
                        <button className="text-blue-600 hover:underline">查看</button>
                        <button className="text-blue-600 hover:underline">{item.hideReason !== '-' ? '展示' : '隐藏'}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white">
            <span className="text-gray-400">共 {mockData.length} 条</span>
            <div className="flex items-center space-x-2">
              <select className="border border-gray-200 rounded px-2 py-1 bg-white cursor-pointer outline-none">
                <option>10条/页</option>
                <option>20条/页</option>
                <option>50条/页</option>
              </select>
              <div className="flex items-center space-x-1">
                <button className="p-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed" disabled>
                  <ChevronLeft size={14} />
                </button>
                <button className="w-6 h-6 bg-blue-600 text-white rounded font-medium">1</button>
                <button className="p-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed" disabled>
                  <ChevronRight size={14} />
                </button>
              </div>
              <div className="flex items-center space-x-1">
                <span>跳至</span>
                <input type="text" className="w-8 border border-gray-200 rounded px-1 py-1 text-center font-bold" defaultValue="1" />
                <span>页</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CommentManagementView = () => {
  const mockData = [
    {
      id: '25061600020271735',
      sharingTime: '2025-07-02 00:28:35',
      commentTime: '2026-05-19 23:37:15',
      employee: {
        name: 'z**',
        code: 'SP4867_3184'
      },
      enterprise: '上海海典智慧药店',
      district: '西南大区',
      districtCode: '04816',
      content: '评论了等会儿删除',
    }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* Filters Area */}
      <div className="p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-y-4 gap-x-6">
          <div className="flex items-center space-x-2">
            <label className="text-[12px] text-gray-500 w-16 text-right shrink-0">所属企业</label>
            <select className="border border-gray-200 rounded px-2 py-1.5 text-xs w-48 bg-white focus:ring-1 focus:ring-blue-400 outline-none">
              <option>请选择</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-[12px] text-gray-500 w-16 text-right shrink-0">所属片区</label>
            <div className="relative w-48">
              <input type="text" placeholder="输入片区名称" className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs pr-10 focus:ring-1 focus:ring-blue-400 outline-none" />
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-[12px] text-gray-500 w-16 text-right shrink-0">订单编号</label>
            <input type="text" placeholder="请输入" className="w-48 border border-gray-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-400 outline-none" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center border border-gray-200 rounded overflow-hidden">
              <select className="border-r border-gray-200 px-2 py-1.5 text-xs bg-gray-50 outline-none">
                <option>员工编码</option>
              </select>
              <input type="text" placeholder="请输入" className="px-2 py-1.5 text-xs w-40 focus:ring-1 focus:ring-blue-400 outline-none" />
            </div>
          </div>
          
          <div className="flex items-center space-x-3 ml-auto">
            <button className="bg-blue-600 text-white px-6 py-1.5 rounded text-xs hover:bg-blue-700 transition-colors">查询</button>
            <button className="bg-white border border-gray-300 text-gray-600 px-6 py-1.5 rounded text-xs hover:bg-gray-50 transition-colors">重置</button>
            <div className="relative">
              <button className="flex items-center space-x-1 border border-blue-200 text-blue-600 px-3 py-1.5 rounded text-xs bg-blue-50 hover:bg-blue-100 transition-all">
                <span>导出</span>
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col flex-1 overflow-hidden">
          {/* Table */}
          <div className="flex-1 overflow-auto no-scrollbar">
            <table className="w-full text-left text-[12px] border-collapse sticky top-0 bg-white">
              <thead className="bg-[#f8fafc] text-gray-500 font-medium z-10 sticky top-0 shadow-sm border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">订单编号</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">晒单时间</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">评论时间</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">员工信息</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">所属企业</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">所属片区</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">评论内容</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {Array(10).fill(mockData[0]).map((item, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-4 font-mono text-gray-500 whitespace-nowrap">{item.id}</td>
                    <td className="px-4 py-4 text-gray-500 whitespace-nowrap group">
                       {item.sharingTime}
                    </td>
                    <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                       {item.commentTime}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <span className="font-bold text-gray-700">{item.employee.name}</span>
                        <Eye size={12} className="text-gray-300 cursor-pointer hover:text-blue-400" />
                      </div>
                      <div className="text-[10px] text-gray-400">{item.employee.code}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {item.enterprise}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      <div>{item.district}</div>
                      <div className="text-[10px] text-gray-400">{item.districtCode}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-600 max-w-xs truncate">
                      {item.content}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-300">-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white">
            <span className="text-gray-400">共 20 条</span>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <button className="p-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed" disabled>
                  <ChevronLeft size={14} />
                </button>
                <button className="w-6 h-6 bg-blue-600 text-white rounded font-medium">1</button>
                <button className="w-6 h-6 border border-gray-200 text-gray-600 rounded hover:bg-gray-50">2</button>
                <button className="p-1 border border-gray-200 rounded hover:bg-gray-50">
                  <ChevronRight size={14} />
                </button>
              </div>
              <select className="border border-gray-200 rounded px-2 py-1 bg-white cursor-pointer outline-none ml-2">
                <option>10条/页</option>
                <option>20条/页</option>
              </select>
              <div className="flex items-center space-x-1">
                <span>跳至</span>
                <input type="text" className="w-8 border border-gray-200 rounded px-1 py-1 text-center font-bold" defaultValue="1" />
                <span>页</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClerkCircleRewardDetailView = () => {
  const mockData = [
    {
      id: '1865601455670518529',
      industrialName: 'zlx服务商测试',
      industrialCode: '550237',
      tipper: 'z**',
      rewardAmount: '6.66',
      issueTime: '2026-05-19 15:36:47',
      clerk: {
        name: '张**',
        id: '12501',
        org: '海典智慧药房双品汇店'
      },
      enterprise: '海典预发智慧药店22',
      district: '片区五级01',
      districtCode: '00097',
      orderId: '260519002330002',
      productName: '二十五味驴血丸',
      productCode: '8013370'
    },
    {
      id: '1865601235471654657',
      industrialName: 'zlx服务商测试',
      industrialCode: '550237',
      tipper: 'z**',
      rewardAmount: '8.88',
      issueTime: '2026-05-19 15:33:11',
      clerk: {
        name: '张**',
        id: '12501',
        org: '海典智慧药房双品汇店'
      },
      enterprise: '海典预发智慧药店22',
      district: '片区五级01',
      districtCode: '00097',
      orderId: '260519002330001',
      productName: '麦子自建单品0112A',
      productCode: '7001682'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* Filters Area */}
      <div className="p-4 bg-white border-b border-gray-200 shadow-sm">
        <h2 className="text-sm font-bold text-gray-700 mb-4">奖励明细</h2>
        <div className="grid grid-cols-4 lg:grid-cols-6 gap-y-4 gap-x-6">
          <div className="flex items-center space-x-2">
            <label className="text-[12px] text-gray-500 w-16 text-right shrink-0">所属企业</label>
            <select className="border border-gray-200 rounded px-2 py-1.5 text-xs flex-1 bg-white focus:ring-1 focus:ring-blue-400 outline-none">
              <option>请选择</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-[12px] text-gray-500 w-16 text-right shrink-0">所属片区</label>
            <div className="relative flex-1">
              <input type="text" placeholder="输入片区名称" className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs pr-10 focus:ring-1 focus:ring-blue-400 outline-none" />
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center border border-gray-200 rounded overflow-hidden flex-1">
              <select className="border-r border-gray-200 px-2 py-1.5 text-xs bg-gray-50 outline-none">
                <option>工业编码</option>
              </select>
              <input type="text" placeholder="请输入" className="px-2 py-1.5 text-xs flex-1 focus:ring-1 focus:ring-blue-400 outline-none" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-[12px] text-gray-500 w-16 text-right shrink-0">晒单时间</label>
            <div className="flex items-center space-x-1 flex-1">
              <input type="text" placeholder="开始日期" className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-400 outline-none" />
              <span className="text-gray-400 text-xs">至</span>
              <div className="relative flex-1">
                <input type="text" placeholder="结束日期" className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs pr-10 focus:ring-1 focus:ring-blue-400 outline-none" />
                <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-[12px] text-gray-500 w-16 text-right shrink-0">打赏时间</label>
            <div className="flex items-center space-x-1 flex-1">
              <input type="text" placeholder="开始日期" className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-400 outline-none" />
              <span className="text-gray-400 text-xs">至</span>
              <div className="relative flex-1">
                <input type="text" placeholder="结束日期" className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs pr-10 focus:ring-1 focus:ring-blue-400 outline-none" />
                <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-[12px] text-gray-500 w-16 text-right shrink-0">员工</label>
            <input type="text" placeholder="搜索员工编码或名称" className="border border-gray-200 rounded px-2 py-1.5 text-xs flex-1 focus:ring-1 focus:ring-blue-400 outline-none" />
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-[12px] text-gray-500 w-16 text-right shrink-0">所属机构</label>
            <input type="text" placeholder="输入机构/门店名称" className="border border-gray-200 rounded px-2 py-1.5 text-xs flex-1 focus:ring-1 focus:ring-blue-400 outline-none" />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-[12px] text-gray-500 w-16 text-right shrink-0">订单编号</label>
            <input type="text" placeholder="请输入" className="border border-gray-200 rounded px-2 py-1.5 text-xs flex-1 focus:ring-1 focus:ring-blue-400 outline-none" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center border border-gray-200 rounded overflow-hidden flex-1">
              <select className="border-r border-gray-200 px-2 py-1.5 text-xs bg-gray-50 outline-none">
                <option>商品名称</option>
              </select>
              <input type="text" placeholder="请输入" className="px-2 py-1.5 text-xs flex-1 focus:ring-1 focus:ring-blue-400 outline-none" />
            </div>
          </div>
          
          <div className="flex items-center space-x-3 col-span-1 lg:col-span-3">
            <button className="bg-blue-600 text-white px-6 py-1.5 rounded text-xs font-medium hover:bg-blue-700 transition-colors">查询</button>
            <button className="border border-gray-200 text-gray-600 px-6 py-1.5 rounded text-xs font-medium hover:bg-gray-50 transition-colors">重置</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TargetProductIncentiveModal = ({ onClose, onSave }: { onClose: () => void, onSave: (data: any) => void }) => {
  const [configMode, setConfigMode] = useState<'uniform' | 'custom'>('uniform');
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [uniformTiers, setUniformTiers] = useState([
    { id: '1', name: '超额达成目标1', excessRate: 0, rewardType: 'percentage' }
  ]);

  // Custom configuration groups
  const [employeeGroups, setEmployeeGroups] = useState([
    { 
      id: 'group1', 
      name: '默认店员组', 
      members: ['店员 1', '店员 2'],
      tiers: [{ id: 't1', name: '超额达成目标1' }]
    }
  ]);

  const [storeGroups, setStoreGroups] = useState([
    {
      id: 'store_group1',
      name: '默认门店组',
      members: ['旗舰店', '分店 1'],
      tiers: [{ id: 'st1', name: '超额达成目标1' }]
    }
  ]);

  const [chainGroups, setChainGroups] = useState([
    {
      id: 'chain_group1',
      name: '连锁管理激励组',
      tiers: [{ id: 'ct1', name: '超额达成目标1' }]
    }
  ]);

  // Validation Simulation
  const coverageStatus = {
    missingEmployees: 3,
    duplicateEmployees: 0,
    missingStores: 5,
    totalEmployeesInTarget: 125,
    totalStoresInTarget: 22
  };

  const renderIncentiveTable = (type: 'uniform' | 'group', tiersData: any[], configType: 'all' | 'employee' | 'store' | 'chain' = 'all') => {
    const showEmployee = configType === 'all' || configType === 'employee';
    const showStoreManager = configType === 'all' || configType === 'store';
    const showRegionManager = configType === 'all' || configType === 'store';
    const showManagement = configType === 'all' || configType === 'chain';

    const colCount = [showEmployee, showStoreManager, showRegionManager, showManagement].filter(Boolean).length;

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
        <table className="w-full border-collapse text-[12px]">
          <thead className="bg-[#f8fafc] text-gray-600 font-medium">
            <tr>
              <th className="px-4 py-3 border-b border-r border-gray-200 w-24">达成条件</th>
              <th className="px-4 py-3 border-b border-r border-gray-200 w-24">发放方式</th>
              {showEmployee && <th className="px-4 py-3 border-b border-r border-gray-200 text-center">店员激励</th>}
              {showStoreManager && <th className="px-4 py-3 border-b border-r border-gray-200 text-center">店长激励</th>}
              {showRegionManager && <th className="px-4 py-3 border-b border-r border-gray-200 text-center">区域经理激励</th>}
              {showManagement && <th className="px-4 py-3 border-b border-gray-200 text-center">管理激励</th>}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-4 border-b border-r border-gray-200 bg-gray-50 font-medium">未完成目标</td>
              <td className="px-4 py-4 border-b border-r border-gray-200 text-center">按单件</td>
              {[...Array(colCount)].map((_, i) => (
                <td key={i} className={`px-4 py-4 border-b border-gray-200 ${i < colCount - 1 ? 'border-r' : ''}`}>
                  <div className="flex items-center justify-center space-x-2">
                    <input type="text" placeholder="请输入" className="w-20 border border-gray-200 rounded px-2 py-1 outline-none text-center" />
                    <span className="text-gray-400">元/件</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td rowSpan={2} className="px-4 py-4 border-b border-r border-gray-200 bg-gray-50 font-medium">达成目标后</td>
              <td className="px-4 py-4 border-b border-r border-gray-200 text-center">按单件</td>
              {[...Array(colCount)].map((_, i) => (
                <td key={i} className={`px-4 py-4 border-b border-gray-200 ${i < colCount - 1 ? 'border-r' : ''}`}>
                  <div className="flex items-center justify-center space-x-2">
                    <input type="text" placeholder="请输入" className="w-20 border border-gray-200 rounded px-2 py-1 outline-none text-center" />
                    <span className="text-gray-400">元/件</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-4 border-b border-r border-gray-200 text-center relative group">
                达成补发
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-orange-400 text-white flex items-center justify-center text-[10px] cursor-help">!</div>
              </td>
              {[...Array(colCount)].map((_, i) => (
                <td key={i} className={`px-4 py-4 border-b border-gray-200 ${i < colCount - 1 ? 'border-r' : ''}`}>
                  <div className="flex items-center justify-center space-x-2">
                    <input type="text" className="w-16 border border-gray-200 rounded px-2 py-1 outline-none text-center" />
                    <span className="text-gray-400">元/件 或 固定</span>
                    <input type="text" className="w-16 border border-gray-200 rounded px-2 py-1 outline-none text-center" />
                    <span className="text-gray-400">元</span>
                  </div>
                </td>
              ))}
            </tr>
            {tiersData.map((tier) => (
              <React.Fragment key={tier.id}>
                <tr>
                  <td rowSpan={2} className="px-4 py-4 border-b border-r border-gray-200 bg-gray-50 font-medium">{tier.name}</td>
                  <td className="px-4 py-4 border-b border-r border-gray-200 text-center">按单件</td>
                  {[...Array(colCount)].map((_, i) => (
                    <td key={i} className={`px-4 py-4 border-b border-gray-200 ${i < colCount - 1 ? 'border-r' : ''}`}>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-gray-400">超过</span>
                        <input type="text" className="w-12 border border-gray-200 rounded px-1 py-1 outline-none text-center" />
                        <select className="bg-transparent text-gray-500 outline-none"><option>%</option></select>
                        <input type="text" className="w-16 border border-gray-200 rounded px-2 py-1 outline-none text-center" />
                        <span className="text-gray-400">元/件</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-4 border-b border-r border-gray-200 text-center relative">
                    达成补发
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-orange-400 text-white flex items-center justify-center text-[10px] cursor-help">!</div>
                  </td>
                  {[...Array(colCount)].map((_, i) => (
                    <td key={i} className={`px-4 py-4 border-b border-gray-200 ${i < colCount - 1 ? 'border-r' : ''}`}>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-center space-x-1">
                          <span className="text-gray-400">超过</span>
                          <input type="text" className="w-12 border border-gray-200 rounded px-1 py-1 outline-none text-center" />
                          <select className="bg-transparent text-gray-500 outline-none"><option>%</option></select>
                          <span className="text-gray-400">补</span>
                          <input type="text" className="w-16 border border-gray-200 rounded px-2 py-1 outline-none text-center" />
                          <span className="text-gray-400 text-[10px]">元/件 或</span>
                        </div>
                        <div className="flex items-center justify-center space-x-1">
                          <span className="text-gray-400">固定</span>
                          <input type="text" className="w-16 border border-gray-200 rounded px-2 py-1 outline-none text-center" />
                          <span className="text-gray-400">元</span>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-white border-t border-gray-100">
          <button 
            onClick={() => {
              if (type === 'uniform') {
                setUniformTiers([...tiersData, { id: Date.now().toString(), name: `超额达成目标${tiersData.length + 1}` }]);
              } else if (configType === 'employee') {
                 setEmployeeGroups(employeeGroups.map(g => g.id === tiersData[0]?.id?.split('-')[0] ? {...g, tiers: [...g.tiers, { id: Date.now().toString(), name: `超额达成目标${g.tiers.length + 1}` }]} : g));
              }
            }}
            className="text-blue-600 flex items-center space-x-1 hover:underline"
          >
            <Plus size={16} />
            <span>添加阶梯</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">新增目标单品激励政策</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
          {/* Section 1: Selection */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm font-bold text-gray-800">激励商品</span>
              <span className="text-xs text-gray-400 font-normal">可选择多个商品批量设置激励</span>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 flex items-center justify-center">
              <button className="text-blue-600 flex items-center space-x-2 hover:underline font-medium">
                <Plus size={18} />
                <span>从目标库选择激励商品</span>
              </button>
            </div>
          </section>

          {/* Configuration Options */}
          <section className="border-t border-gray-100 pt-6">
             <div className="flex items-center space-x-8 mb-6">
                <span className="text-sm font-bold text-gray-800">配置选项</span>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center cursor-pointer group">
                    <div className={`w-4 h-4 rounded-full border ${configMode === 'uniform' ? 'border-blue-600' : 'border-gray-300'} flex items-center justify-center mr-2`}>
                      {configMode === 'uniform' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                    </div>
                    <input type="radio" className="hidden" checked={configMode === 'uniform'} onChange={() => setConfigMode('uniform')} />
                    <span className="text-sm text-gray-700">统一配置</span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <div className={`w-4 h-4 rounded-full border ${configMode === 'custom' ? 'border-blue-600' : 'border-gray-300'} flex items-center justify-center mr-2`}>
                      {configMode === 'custom' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                    </div>
                    <input type="radio" className="hidden" checked={configMode === 'custom'} onChange={() => setConfigMode('custom')} />
                    <span className="text-sm text-gray-700">自定义配置</span>
                  </label>
                </div>
             </div>

             {/* Validation Alert (Custom Mode Only) */}
             {configMode === 'custom' && (coverageStatus.missingEmployees > 0 || coverageStatus.missingStores > 0) && (
               <div className="mb-6 bg-red-50 border border-red-100 rounded-lg p-4 flex items-start space-x-3">
                 <AlertTriangle size={18} className="text-red-500 mt-0.5" />
                 <div>
                   <p className="text-sm font-bold text-red-800">配置覆盖异常提醒</p>
                   <p className="text-xs text-red-600 mt-1">
                     目标库中该商品关联了 <span className="font-bold underline">{coverageStatus.totalEmployeesInTarget}</span> 名员工，当前有 <span className="font-bold underline">{coverageStatus.missingEmployees}</span> 名员工未配置激励政策。
                     关联了 <span className="font-bold underline">{coverageStatus.totalStoresInTarget}</span> 家门店，有 <span className="font-bold underline">{coverageStatus.missingStores}</span> 家门店未配置管理激励。请检查并补齐配置，以免影响激励发放。
                   </p>
                 </div>
               </div>
             )}

             <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-sm text-gray-500 w-20 shrink-0">激励规则</span>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>1.按销售数量计算、店员按单个店员计算、店长按照单个门店计算、区域经理按照区域内门店计算；</p>
                    <p>2.设置了店员目标，店员激励才有效；设置了门店目标，店长激励、区域经理激励、管理激励才有效；</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 w-20 shrink-0">激励统计</span>
                  <div className="flex items-center text-sm">
                    <span className="font-bold text-gray-800">年度 0527测试</span>
                    <button className="ml-2 text-blue-600 flex items-center hover:underline">
                      查看 <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
                <div className="ml-20 text-[11px] text-gray-400 space-y-1">
                  <p>目标周期：2027-01-01 00:00:00 至 2027-12-31 23:59:59</p>
                  <p>目标类型：爆品目标 考核维度：销售量</p>
                </div>
             </div>
          </section>

          {configMode === 'uniform' ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {renderIncentiveTable('uniform', uniformTiers)}
            </div>
          ) : (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Custom Employee Groups */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-800 flex items-center">
                    <div className="w-1 h-4 bg-blue-600 rounded-full mr-2" />
                    店员激励配置
                  </h4>
                  <button 
                    onClick={() => setEmployeeGroups([...employeeGroups, { id: Date.now().toString(), name: `店员组 ${employeeGroups.length + 1}`, members: [], tiers: [{ id: 't1', name: '超额达成目标1' }] }])}
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs rounded border border-blue-100 hover:bg-blue-100 transition-colors flex items-center"
                  >
                    <Plus size={14} className="mr-1" /> 新增店员组
                  </button>
                </div>
                
                {employeeGroups.map((group, gIdx) => (
                  <div key={group.id} className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-xs font-bold text-gray-700">{group.name}</span>
                        <div className="flex items-center text-[10px] text-blue-600 cursor-pointer hover:underline">
                          <Users size={12} className="mr-1" />
                          <span>已选 {group.members.length || 0} 人 (点击配置人员)</span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                    <div className="p-4 overflow-x-auto no-scrollbar">
                      {renderIncentiveTable('group', group.tiers, 'employee')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Store Groups */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-800 flex items-center">
                    <div className="w-1 h-4 bg-orange-500 rounded-full mr-2" />
                    门店管理激励配置
                  </h4>
                  <button 
                    onClick={() => setStoreGroups([...storeGroups, { id: Date.now().toString(), name: `门店组 ${storeGroups.length + 1}`, members: [], tiers: [{ id: 'st1', name: '超额达成目标1' }] }])}
                    className="px-3 py-1.5 bg-orange-50 text-orange-600 text-xs rounded border border-orange-100 hover:bg-orange-100 transition-colors flex items-center"
                  >
                    <Plus size={14} className="mr-1" /> 新增门店组
                  </button>
                </div>

                {storeGroups.map((group, gIdx) => (
                  <div key={group.id} className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-xs font-bold text-gray-700">{group.name}</span>
                        <div className="flex items-center text-[10px] text-orange-600 cursor-pointer hover:underline">
                          <LayoutDashboard size={12} className="mr-1" />
                          <span>已选 {group.members.length || 0} 家门店 (点击配置门店)</span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                    <div className="p-4 overflow-x-auto no-scrollbar">
                      {renderIncentiveTable('group', group.tiers, 'store')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Chain Groups */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-800 flex items-center">
                    <div className="w-1 h-4 bg-purple-600 rounded-full mr-2" />
                    连锁管理激励配置
                  </h4>
                </div>

                {chainGroups.map((group) => (
                  <div key={group.id} className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                       <span className="text-xs font-bold text-gray-700">{group.name}</span>
                    </div>
                    <div className="p-4 overflow-x-auto no-scrollbar">
                      {renderIncentiveTable('group', group.tiers, 'chain')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Settings */}
          <section className="space-y-4 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 w-20 shrink-0">补发规则</span>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-800">按超额分段补发</span>
                <button className="text-blue-600 hover:underline">查看案例</button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 w-20 shrink-0">激励门槛</span>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">商品实际销售单价小于</span>
                <input type="text" className="w-16 border border-gray-200 rounded px-2 py-1 text-xs text-center outline-none mx-1" placeholder="请输入" />
                <span className="text-sm text-gray-700">元，目标记录销量，不发放激励</span>
              </div>
            </div>
          </section>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-4 bg-white">
          <button onClick={onClose} className="px-8 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors">取消</button>
          <button onClick={() => onSave({})} className="px-8 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">确定</button>
        </div>
      </div>
    </div>
  );
};

const BusinessSettingsView = () => {
  const [activeTab, setActiveTab] = useState('订单配置');
  const [publicIncentiveEnabled, setPublicIncentiveEnabled] = useState(false);
  const [publicIncentiveTypes, setPublicIncentiveTypes] = useState<string[]>(['none']);
  const [publicNonePaymentMethods, setPublicNonePaymentMethods] = useState<string[]>(['1/货到付款']);
  const [publicCustomPaymentMethods, setPublicCustomPaymentMethods] = useState<string[]>([]);
  const [publicCustomActivePaymentMethod, setPublicCustomActivePaymentMethod] = useState<string | null>(null);
  const [publicPaymentModalType, setPublicPaymentModalType] = useState<'none' | 'custom' | null>(null);
  const [publicUniversalRatios, setPublicUniversalRatios] = useState<Record<string, string>>({});
  
  // Private Domain + Offline Retail Turnover States
  const [privateIncentiveEnabled, setPrivateIncentiveEnabled] = useState(false);
  const [privateIncentiveModes, setPrivateIncentiveModes] = useState<string[]>(['none']);
  const [privateSelectedMemberLevels, setPrivateSelectedMemberLevels] = useState<string[]>([]);
  const [privateNonePaymentMethods, setPrivateNonePaymentMethods] = useState<string[]>([]);
  const [privateCustomPaymentMethods, setPrivateCustomPaymentMethods] = useState<string[]>([]);
  const [privateCustomActivePaymentMethod, setPrivateCustomActivePaymentMethod] = useState<string | null>(null);
  const [privatePaymentModalType, setPrivatePaymentModalType] = useState<'none' | 'custom' | null>(null);
  const [privateUniversalRatios, setPrivateUniversalRatios] = useState<Record<string, string>>({});
  const [showPrivatePaymentModal, setShowPrivatePaymentModal] = useState(false);
  const [showPrivateMemberLevelModal, setShowPrivateMemberLevelModal] = useState(false);
  const [showPrivateProductModal, setShowPrivateProductModal] = useState(false);
  const [privateProductSearchCode, setPrivateProductSearchCode] = useState('');
  const [privateProductPage, setPrivateProductPage] = useState(1);
  const [privateConfiguredProducts, setPrivateConfiguredProducts] = useState<Array<{
    code: string;
    name: string;
    spec: string;
    barcode: string;
    image: string;
    ratio: string;
    time: string;
    paymentMethod: string;
    isManual?: boolean;
  }>>([]);

  // Custom Incentive States (Public)
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [publicProductSearchCode, setPublicProductSearchCode] = useState('');
  const [publicProductPage, setPublicProductPage] = useState(1);
  const [configuredProducts, setConfiguredProducts] = useState<Array<{
    code: string;
    name: string;
    spec: string;
    barcode: string;
    image: string;
    ratio: string;
    time: string;
    paymentMethod: string;
    isManual?: boolean;
  }>>([]);

  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const [operationRecords, setOperationRecords] = useState([
    { type: '员工黑名单', user: '666666_admin', content: '删除员工12414(压测员工门店单39223)', time: '2026-03-18 13:40:38' },
    { type: '员工黑名单', user: '666666_admin', content: '新增员工12414(压测员工门店单39223)', time: '2026-03-18 13:40:37' },
    { type: '看谁赚得多', user: '666666_admin', content: '参与排行类型：店员、店长、区域经理；参与排行门店：直营店、加盟店', time: '2026-03-18 13:40:27' },
    { type: '目标完成情况', user: '666666_admin', content: '员工目标排行：目标量/销售目标、达成量/销售数量、达成率；门店目标排行：目标量/销售目标、达成量/销售数量、达成率；区域目标排行：目标量/销售目标、达成量/销售数量、达成率', time: '2026-03-18 13:34:13' },
    { type: '员工提现', user: '666666_admin', content: '提现提醒金额：999999', time: '2026-03-18 13:34:07' },
    { type: '早鸟首单时间变更', user: '666666_admin', content: '早鸟首单时间:null', time: '2026-03-18 13:33:20' },
    { type: '私域+线下零售流水', user: '666666_admin', content: '开启；不激励渠道：按会员等级，1/普通卡；按付款方式，', time: '2026-03-18 13:33:20' },
    { type: '订单预警', user: '666666_admin', content: '订单收益超额1500', time: '2026-03-18 13:33:20' },
    { type: '公域订单激励', user: '666666_admin', content: '关闭；不激励渠道：按付款方式，1/货到付款', time: '2026-03-18 13:33:20' },
    { type: '员工签约', user: '666666_admin', content: '从协议:20251113151117557/商品销售激励协议.pdf移除员工', time: '2026-03-18 13:32:17' },
    { type: '员工签约', user: '666666_admin', content: '添加员工到协议:20251113151117557/商品销售激励协议.pdf', time: '2026-03-18 13:32:16' },
    { type: '员工签约', user: '666666_admin', content: '启用协议:20251113151117557/商品销售激励协议.pdf', time: '2026-03-18 13:32:00' },
    { type: '员工签约', user: '666666_admin', content: '作废协议:20251113151117557/商品销售激励协议.pdf', time: '2026-03-18 13:32:00' },
    { type: '员工签约', user: '666666_admin', content: '是否开启员工签约:是', time: '2026-03-18 13:24:12' },
    { type: '员工签约', user: '666666_admin', content: '修改附件1 2021年度个税汇算清缴申报APP操作指引.pdf员工税率配置 扣税门槛：1000 扣税税点：0.1 是否需要补录信息：需要', time: '2026-03-18 13:22:42' },
    { type: '员工签约', user: '666666_admin', content: '关闭商品销售激励协议.pdf员工税率配置', time: '2026-03-18 13:19:35' },
    { type: '员工签约', user: '666666_admin', content: '启用', time: '2026-03-18 13:19:35' },
    { type: '连锁抽佣企业配置', user: '666666_admin', content: '删除企业：小周H2测试企业01，管理人：麦子180', time: '2026-03-18 13:17:57' },
  ]);

  const addOperationRecord = (type: string, content: string) => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setOperationRecords(prev => [{
      type,
      user: '666666_admin',
      content,
      time: timeStr
    }, ...prev]);
  };

  const handleSaveSettings = () => {
    const errors = [];

    if (publicIncentiveEnabled && publicIncentiveTypes.includes('custom') && configuredProducts.length === 0) {
      errors.push('公域订单激励的商品激励配置不能为空');
    }
    
    if (privateIncentiveEnabled && privateIncentiveModes.includes('custom') && privateConfiguredProducts.length === 0) {
      errors.push('私域+线下流水的商品激励配置不能为空');
    }

    if (errors.length > 0) {
      setValidationMessage(errors.join('，') + '，请添加商品。');
      setShowValidationModal(true);
      return;
    }

    addOperationRecord('保存设置', '更新了业务设置配置');
    setValidationMessage('保存成功');
    setShowValidationModal(true);
  };

  const handleAddProduct = (products: Array<{ code: string; ratio: string }>) => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const newProducts = products.map(p => ({
      ...p,
      name: p.code === '009726' ? '头孢（辅酶Q10胶囊）' : '肠炎宁片',
      spec: p.code === '009726' ? '1g*6粒' : '0.24g*24片',
      barcode: p.code === '009726' ? '6910728380619' : '6910728380618',
      image: `https://picsum.photos/seed/${p.code}/80/80`,
      time: timeStr,
      paymentMethod: publicCustomActivePaymentMethod || '',
      isManual: true
    }));

    setConfiguredProducts(prev => [...prev, ...newProducts]);
    addOperationRecord('公域订单激励', `手动添加商品：${products.map(p => p.code).join(', ')}，付款方式：${publicCustomActivePaymentMethod}`);
  };

  const handleImportProducts = () => {
    // Mock import
    const mockImported = [
      { code: '009726', ratio: '0.05' },
      { code: 'IM002', ratio: '0.08' }
    ];
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const newProducts = mockImported.map(p => ({
      ...p,
      name: p.code === '009726' ? '头孢（辅酶Q10胶囊）' : '肠炎宁片',
      spec: p.code === '009726' ? '1g*6粒' : '0.24g*24片',
      barcode: p.code === '009726' ? '6910728380619' : '6910728380618',
      image: `https://picsum.photos/seed/${p.code}/80/80`,
      time: timeStr,
      paymentMethod: publicCustomActivePaymentMethod || '',
      isManual: false
    }));

    setConfiguredProducts(prev => [...prev, ...newProducts]);
    addOperationRecord('公域订单激励', `按模板导入商品：${mockImported.map(p => p.code).join(', ')}，付款方式：${publicCustomActivePaymentMethod}`);
  };

  const handleRemoveProduct = (code: string) => {
    setConfiguredProducts(prev => prev.filter(p => p.code !== code || p.paymentMethod !== publicCustomActivePaymentMethod));
    addOperationRecord('公域订单激励', `移除商品：${code}，付款方式：${publicCustomActivePaymentMethod}`);
  };

  const handleUpdateProductRatio = (code: string, newRatio: string) => {
    setConfiguredProducts(prev => prev.map(p => 
      (p.code === code && p.paymentMethod === publicCustomActivePaymentMethod) 
        ? { ...p, ratio: newRatio } 
        : p
    ));
    addOperationRecord('公域订单激励', `更新商品激励比例：${code}，比例：${newRatio}，付款方式：${publicCustomActivePaymentMethod}`);
  };

  const handleAddPrivateProduct = (products: Array<{ code: string; ratio: string }>) => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const newProducts = products.map(p => ({
      ...p,
      name: p.code === '009726' ? '头孢（辅酶Q10胶囊）' : '肠炎宁片',
      spec: p.code === '009726' ? '1g*6粒' : '0.24g*24片',
      barcode: p.code === '009726' ? '6910728380619' : '6910728380618',
      image: `https://picsum.photos/seed/${p.code}/80/80`,
      time: timeStr,
      paymentMethod: privateCustomActivePaymentMethod || '',
      isManual: true
    }));

    setPrivateConfiguredProducts(prev => [...prev, ...newProducts]);
    addOperationRecord('私域+线下零售流水', `手动添加商品：${products.map(p => p.code).join(', ')}，付款方式：${privateCustomActivePaymentMethod}`);
  };

  const handleImportPrivateProducts = () => {
    // Mock import
    const mockImported = [
      { code: '009726', ratio: '0.05' },
      { code: 'IM002', ratio: '0.08' }
    ];
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const newProducts = mockImported.map(p => ({
      ...p,
      name: p.code === '009726' ? '头孢（辅酶Q10胶囊）' : '肠炎宁片',
      spec: p.code === '009726' ? '1g*6粒' : '0.24g*24片',
      barcode: p.code === '009726' ? '6910728380619' : '6910728380618',
      image: `https://picsum.photos/seed/${p.code}/80/80`,
      time: timeStr,
      paymentMethod: privateCustomActivePaymentMethod || '',
      isManual: false
    }));

    setPrivateConfiguredProducts(prev => [...prev, ...newProducts]);
    addOperationRecord('私域+线下零售流水', `按模板导入商品：${mockImported.map(p => p.code).join(', ')}，付款方式：${privateCustomActivePaymentMethod}`);
  };

  const handleRemovePrivateProduct = (code: string) => {
    setPrivateConfiguredProducts(prev => prev.filter(p => p.code !== code || p.paymentMethod !== privateCustomActivePaymentMethod));
    addOperationRecord('私域+线下零售流水', `移除商品：${code}，付款方式：${privateCustomActivePaymentMethod}`);
  };

  const handleUpdatePrivateProductRatio = (code: string, newRatio: string) => {
    setPrivateConfiguredProducts(prev => prev.map(p => 
      (p.code === code && p.paymentMethod === privateCustomActivePaymentMethod) 
        ? { ...p, ratio: newRatio } 
        : p
    ));
    addOperationRecord('私域+线下零售流水', `更新商品激励比例：${code}，比例：${newRatio}，付款方式：${privateCustomActivePaymentMethod}`);
  };
  
  const tabs = [
    '订单配置', '激励发放', '员工黑名单', '员工签约', '员工提现', '看谁赚得多', '连锁抽佣', '操作记录'
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <h2 className="text-base font-bold text-gray-800">业务配置</h2>
      </div>
      
      <div className="bg-white px-4 border-b border-gray-200 flex items-center space-x-8">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-20">
        {activeTab === '订单配置' && (
          <>
            {/* 订单预警 */}
            <div className="bg-white rounded border border-gray-100 p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800">订单预警</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">订单收益超额：</span>
                <input 
                  type="text" 
                  defaultValue="1500" 
                  className="w-24 px-2 py-1 border border-gray-200 rounded text-sm text-gray-700 bg-gray-50/50 focus:outline-none focus:border-blue-400"
                />
                <span className="text-sm text-gray-600">元</span>
              </div>
              <p className="text-xs text-orange-400">
                注：所有收益金额超过设置金额的激励订单将进入异常订单，需手动操作处理；不填写或填写0，不拦截订单；
              </p>
            </div>

            {/* 公域订单激励 */}
            <div className="bg-white rounded border border-gray-100 p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800">公域订单激励</h3>
              <div className="flex items-center space-x-6">
                <span className="text-sm text-gray-600">是否开启：</span>
                <div className="flex items-center space-x-4">
                  <label 
                    className="flex items-center space-x-1 cursor-pointer group"
                    onClick={() => setPublicIncentiveEnabled(true)}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${publicIncentiveEnabled ? 'border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                      {publicIncentiveEnabled && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                    </div>
                    <span className="text-sm text-gray-600">是</span>
                  </label>
                  <label 
                    className="flex items-center space-x-1 cursor-pointer group"
                    onClick={() => setPublicIncentiveEnabled(false)}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${!publicIncentiveEnabled ? 'border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                      {!publicIncentiveEnabled && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                    </div>
                    <span className="text-sm text-gray-600">否</span>
                  </label>
                </div>
              </div>
              {!publicIncentiveEnabled && (
                <p className="text-xs text-orange-400">
                  注：选择否，您将关闭公域订单激励，所有公域订单的分享人将不会收到激励；
                </p>
              )}
              
              {publicIncentiveEnabled && (
                <div className="space-y-4 pt-2 border-t border-gray-50">
                  <div className="flex items-center space-x-4">
                    <div 
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                        publicIncentiveTypes.includes('none') 
                          ? 'border-blue-600 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-blue-300 text-gray-600'
                      }`}
                      onClick={() => setPublicIncentiveTypes(prev => prev.includes('none') ? prev.filter(t => t !== 'none') : [...prev, 'none'])}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${publicIncentiveTypes.includes('none') ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                        {publicIncentiveTypes.includes('none') && <Check size={12} className="text-white" />}
                      </div>
                      <span className="text-sm font-medium">不激励渠道</span>
                    </div>
                    <div 
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                        publicIncentiveTypes.includes('custom') 
                          ? 'border-blue-600 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-blue-300 text-gray-600'
                      }`}
                      onClick={() => setPublicIncentiveTypes(prev => prev.includes('custom') ? prev.filter(t => t !== 'custom') : [...prev, 'custom'])}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${publicIncentiveTypes.includes('custom') ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                        {publicIncentiveTypes.includes('custom') && <Check size={12} className="text-white" />}
                      </div>
                      <span className="text-sm font-medium">自定义</span>
                    </div>
                  </div>
                  
                  {publicIncentiveTypes.includes('none') && (
                    <div className="space-y-4 pt-4 border-t border-gray-50">
                      <div className="space-y-1">
                        <p className="text-xs text-orange-400">注：新增的付款方式编码类型的订单不获得激励；删除的付款方式编码类型的订单可以获得激励；注意：订单中的付款方式字段为空时，发激励；</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-600">不激励渠道：</span>
                        <span className="text-sm text-gray-600">按付款方式</span>
                        <button 
                          onClick={() => {
                            setPublicPaymentModalType('none');
                            setShowPaymentModal(true);
                          }}
                          className="text-blue-600 text-sm flex items-center hover:underline"
                        >
                          <Plus size={14} className="mr-0.5" />选择
                        </button>
                      </div>
                      <div className="border border-gray-100 rounded p-3 bg-white min-h-[60px]">
                        <div className="text-[10px] text-gray-400 mb-2">当前已选择：</div>
                        <div className="flex flex-wrap gap-2">
                          {publicNonePaymentMethods.length > 0 ? (
                            publicNonePaymentMethods.map(pm => (
                              <span key={pm} className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded text-xs text-gray-600">{pm}</span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">暂未选择付款方式</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {publicIncentiveTypes.includes('custom') && (
                    <div className="space-y-4 pt-4 border-t border-gray-50">
                      <div className="space-y-1">
                        <p className="text-xs text-orange-400">注：包含配置商品编码+付款方式的订单将根据配置比例计算商品激励；最终商品激励金额=原商品激励金额*商品激励比例；</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-600">配置按付款方式：</span>
                        <button 
                          onClick={() => {
                            setPublicPaymentModalType('custom');
                            setShowPaymentModal(true);
                          }}
                          className="text-blue-600 text-sm flex items-center hover:underline"
                        >
                          <Plus size={14} className="mr-0.5" />选择付款方式
                        </button>
                      </div>
                      <div className="border border-gray-100 rounded p-3 bg-white min-h-[60px]">
                        <div className="text-[10px] text-gray-400 mb-2">当前已选择：</div>
                        <div className="flex flex-wrap gap-2">
                          {publicCustomPaymentMethods.length > 0 ? (
                            publicCustomPaymentMethods.map(pm => (
                              <button 
                                key={pm}
                                onClick={() => setPublicCustomActivePaymentMethod(pm)}
                                className={`px-2 py-0.5 border rounded text-xs transition-colors ${
                                  publicCustomActivePaymentMethod === pm 
                                    ? 'bg-blue-600 border-blue-600 text-white' 
                                    : 'bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100'
                                }`}
                              >
                                {pm}
                              </button>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">暂未选择付款方式</span>
                          )}
                        </div>
                      </div>

                      {publicCustomActivePaymentMethod && (
                        <div className="space-y-4 pt-4 border-t border-gray-50">
                          {/* NEW: Universal Ratio Configuration */}
                          <div className="bg-blue-50/30 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Settings size={16} className="text-blue-600" />
                              <span className="text-sm font-medium text-gray-700">按支付方式配置所有商品配置统一激励比例 ({publicCustomActivePaymentMethod})</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">统一比例：</span>
                              <div className="flex items-center border border-gray-300 rounded bg-white px-2 py-1 w-24 focus-within:border-blue-500 transition-colors">
                                <input 
                                  type="text" 
                                  placeholder="如 0.05" 
                                  className="w-full text-sm outline-none" 
                                  value={publicUniversalRatios[publicCustomActivePaymentMethod] || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setPublicUniversalRatios(prev => ({ ...prev, [publicCustomActivePaymentMethod]: val }));
                                  }}
                                />
                              </div>
                              <button 
                                onClick={() => {
                                  const ratio = publicUniversalRatios[publicCustomActivePaymentMethod];
                                  if (ratio) {
                                    addOperationRecord('公域订单激励', `配置支付方式 ${publicCustomActivePaymentMethod} 统一激励比例：${ratio}`);
                                    alert(`已设置 ${publicCustomActivePaymentMethod} 的统一奖励比例为 ${ratio}`);
                                  }
                                }}
                                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                              >
                                保存
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-gray-700">商品激励配置 ({publicCustomActivePaymentMethod})</h4>
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input 
                                  type="text" 
                                  placeholder="搜索商品编码" 
                                  value={publicProductSearchCode}
                                  onChange={(e) => setPublicProductSearchCode(e.target.value)}
                                  className="pl-8 pr-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 w-48"
                                />
                              </div>
                              <button 
                                onClick={handleImportProducts}
                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-600"
                              >
                                按模板导入
                              </button>
                              <button 
                                onClick={() => setShowProductModal(true)}
                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                手动添加
                              </button>
                              <button 
                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-600"
                              >
                                导出
                              </button>
                            </div>
                          </div>

                          <div className="border border-gray-100 rounded overflow-hidden">
                            <table className="w-full text-sm text-left">
                              <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                  <th className="px-4 py-2 font-medium text-gray-600">商品信息</th>
                                  <th className="px-4 py-2 font-medium text-gray-600">商品激励比例</th>
                                  <th className="px-4 py-2 font-medium text-gray-600">配置时间</th>
                                  <th className="px-4 py-2 font-medium text-gray-600">操作</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {configuredProducts
                                  .filter(p => p.paymentMethod === publicCustomActivePaymentMethod && p.code.includes(publicProductSearchCode))
                                  .slice((publicProductPage - 1) * 5, publicProductPage * 5)
                                  .length > 0 ? (
                                  configuredProducts
                                    .filter(p => p.paymentMethod === publicCustomActivePaymentMethod && p.code.includes(publicProductSearchCode))
                                    .slice((publicProductPage - 1) * 5, publicProductPage * 5)
                                    .map((p, idx) => (
                                    <tr key={idx}>
                                      <td className="px-4 py-3">
                                        <div className="flex items-center space-x-3">
                                          <img src={p.image} alt="" className="w-12 h-12 rounded border border-gray-100 object-cover" referrerPolicy="no-referrer" />
                                          <div className="space-y-0.5">
                                            <div className="font-bold text-gray-800 text-sm">{p.name}</div>
                                            <div className="text-[11px] text-gray-500">规格：{p.spec}</div>
                                            <div className="text-[11px] text-gray-500">条形码：{p.barcode}</div>
                                            <div className="text-[11px] text-gray-500">商品编码：{p.code}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-gray-600">
                                        <ProductRatioInput 
                                          initialRatio={p.ratio} 
                                          onSave={(newRatio) => handleUpdateProductRatio(p.code, newRatio)} 
                                          isManual={p.isManual}
                                        />
                                      </td>
                                      <td className="px-4 py-3 text-gray-600">{p.time}</td>
                                      <td className="px-4 py-3">
                                        <button 
                                          onClick={() => handleRemoveProduct(p.code)}
                                          className="text-red-500 hover:text-red-600"
                                        >
                                          移除
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">暂无配置商品</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          <Pagination 
                            total={configuredProducts.filter(p => p.paymentMethod === publicCustomActivePaymentMethod && p.code.includes(publicProductSearchCode)).length} 
                            pageSize={5} 
                            currentPage={publicProductPage}
                            onPageChange={setPublicProductPage}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 私域+线下零售流水 */}
            <div className="bg-white rounded border border-gray-100 p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800">私域+线下零售流水</h3>
              <div className="flex items-center space-x-6">
                <span className="text-sm text-gray-600">是否开启：</span>
                <div className="flex items-center space-x-4">
                  <label 
                    className="flex items-center space-x-1 cursor-pointer group"
                    onClick={() => {
                      setPrivateIncentiveEnabled(true);
                      addOperationRecord('私域+线下零售流水', '开启');
                    }}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${privateIncentiveEnabled ? 'border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                      {privateIncentiveEnabled && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                    </div>
                    <span className="text-sm text-gray-600">是</span>
                  </label>
                  <label 
                    className="flex items-center space-x-1 cursor-pointer group"
                    onClick={() => {
                      setPrivateIncentiveEnabled(false);
                      addOperationRecord('私域+线下零售流水', '关闭');
                    }}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${!privateIncentiveEnabled ? 'border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                      {!privateIncentiveEnabled && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                    </div>
                    <span className="text-sm text-gray-600">否</span>
                  </label>
                </div>
              </div>
              {privateIncentiveEnabled ? (
                <p className="text-xs text-orange-400">
                  注：选择是，您将开启私域+线下零售流水，所有微商城+线下零售订单的分享人将收到激励；
                </p>
              ) : (
                <p className="text-xs text-orange-400">
                  注：选择否，您将关闭私域+线下零售流水，所有微商城+线下零售订单的分享人将不会收到激励；
                </p>
              )}
              
              {privateIncentiveEnabled && (
                <div className="space-y-6 pt-4 border-t border-gray-50">
                  <div className="flex items-center space-x-4">
                    <div 
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                        privateIncentiveModes.includes('none') 
                          ? 'border-blue-600 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-blue-300 text-gray-600'
                      }`}
                      onClick={() => setPrivateIncentiveModes(prev => prev.includes('none') ? prev.filter(t => t !== 'none') : [...prev, 'none'])}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${privateIncentiveModes.includes('none') ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                        {privateIncentiveModes.includes('none') && <Check size={12} className="text-white" />}
                      </div>
                      <span className="text-sm font-medium">不激励渠道</span>
                    </div>
                    <div 
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                        privateIncentiveModes.includes('custom') 
                          ? 'border-blue-600 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-blue-300 text-gray-600'
                      }`}
                      onClick={() => setPrivateIncentiveModes(prev => prev.includes('custom') ? prev.filter(t => t !== 'custom') : [...prev, 'custom'])}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${privateIncentiveModes.includes('custom') ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                        {privateIncentiveModes.includes('custom') && <Check size={12} className="text-white" />}
                      </div>
                      <span className="text-sm font-medium">自定义</span>
                    </div>
                  </div>

                  {privateIncentiveModes.includes('none') && (
                    <div className="space-y-4 pt-4 border-t border-gray-50">
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <p className="text-xs text-orange-400">注：展示新增的等级权益类型的订单不获得激励；删除的等级权益类型的订单获得激励；注意：订单中的会员等级字段为空时，发激励；</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-600">不激励渠道：</span>
                          <span className="text-sm text-gray-600">按会员等级</span>
                          <button 
                            onClick={() => setShowPrivateMemberLevelModal(true)}
                            className="text-blue-600 text-sm flex items-center hover:underline"
                          >
                            <Plus size={14} className="mr-0.5" />选择
                          </button>
                        </div>
                        <div className="border border-gray-100 rounded p-3 bg-white min-h-[60px]">
                          <div className="text-[10px] text-gray-400 mb-2">当前已选择：</div>
                          <div className="flex flex-wrap gap-2">
                            {privateSelectedMemberLevels.length > 0 ? (
                              privateSelectedMemberLevels.map(level => (
                                <span key={level} className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded text-xs text-gray-600">{level}</span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400 italic">暂未选择会员等级</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="space-y-1">
                          <p className="text-xs text-orange-400">注：新增的付款方式编码类型的订单不获得激励；删除的付款方式编码类型的订单可以获得激励；注意：订单中的付款方式字段为空时，发激励；</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-600">不激励渠道：</span>
                          <span className="text-sm text-gray-600">按付款方式</span>
                          <button 
                            onClick={() => {
                              setPrivatePaymentModalType('none');
                              setShowPrivatePaymentModal(true);
                            }}
                            className="text-blue-600 text-sm flex items-center hover:underline"
                          >
                            <Plus size={14} className="mr-0.5" />选择
                          </button>
                        </div>
                        <div className="border border-gray-100 rounded p-3 bg-white min-h-[60px]">
                          <div className="text-[10px] text-gray-400 mb-2">当前已选择：</div>
                          <div className="flex flex-wrap gap-2">
                            {privateNonePaymentMethods.length > 0 ? (
                              privateNonePaymentMethods.map(pm => (
                                <span key={pm} className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded text-xs text-gray-600">{pm}</span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400 italic">暂未选择付款方式</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {privateIncentiveModes.includes('custom') && (
                    <div className="space-y-4 pt-4 border-t border-gray-50">
                      <div className="space-y-1">
                        <p className="text-xs text-orange-400">注：包含配置商品编码+付款方式的订单将根据配置比例计算商品激励；最终商品激励金额=原商品激励金额*商品激励比例；</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-600">配置按付款方式：</span>
                        <button 
                          onClick={() => {
                            setPrivatePaymentModalType('custom');
                            setShowPrivatePaymentModal(true);
                          }}
                          className="text-blue-600 text-sm flex items-center hover:underline"
                        >
                          <Plus size={14} className="mr-0.5" />选择付款方式
                        </button>
                      </div>
                      <div className="border border-gray-100 rounded p-3 bg-white min-h-[60px]">
                        <div className="text-[10px] text-gray-400 mb-2">当前已选择：</div>
                        <div className="flex flex-wrap gap-2">
                          {privateCustomPaymentMethods.length > 0 ? (
                            privateCustomPaymentMethods.map(pm => (
                              <button 
                                key={pm}
                                onClick={() => setPrivateCustomActivePaymentMethod(pm)}
                                className={`px-2 py-0.5 border rounded text-xs transition-colors ${
                                  privateCustomActivePaymentMethod === pm 
                                    ? 'bg-blue-600 border-blue-600 text-white' 
                                    : 'bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100'
                                }`}
                              >
                                {pm}
                              </button>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">暂未选择付款方式</span>
                          )}
                        </div>
                      </div>

                      {privateCustomActivePaymentMethod && (
                        <div className="space-y-4 pt-4 border-t border-gray-50">
                          {/* NEW: Universal Ratio Configuration */}
                          <div className="bg-blue-50/30 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Settings size={16} className="text-blue-600" />
                              <span className="text-sm font-medium text-gray-700">按支付方式配置所有商品配置统一激励比例 ({privateCustomActivePaymentMethod})</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">统一比例：</span>
                              <div className="flex items-center border border-gray-300 rounded bg-white px-2 py-1 w-24 focus-within:border-blue-500 transition-colors">
                                <input 
                                  type="text" 
                                  placeholder="如 0.05" 
                                  className="w-full text-sm outline-none" 
                                  value={privateUniversalRatios[privateCustomActivePaymentMethod] || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setPrivateUniversalRatios(prev => ({ ...prev, [privateCustomActivePaymentMethod]: val }));
                                  }}
                                />
                              </div>
                              <button 
                                onClick={() => {
                                  const ratio = privateUniversalRatios[privateCustomActivePaymentMethod];
                                  if (ratio) {
                                    addOperationRecord('私域+线下零售流水', `配置支付方式 ${privateCustomActivePaymentMethod} 统一激励比例：${ratio}`);
                                    alert(`已设置 ${privateCustomActivePaymentMethod} 的统一奖励比例为 ${ratio}`);
                                  }
                                }}
                                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                              >
                                保存
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-gray-700">商品激励配置 ({privateCustomActivePaymentMethod})</h4>
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input 
                                  type="text" 
                                  placeholder="搜索商品编码" 
                                  value={privateProductSearchCode}
                                  onChange={(e) => setPrivateProductSearchCode(e.target.value)}
                                  className="pl-8 pr-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 w-48"
                                />
                              </div>
                              <button 
                                onClick={handleImportPrivateProducts}
                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-600"
                              >
                                按模板导入
                              </button>
                              <button 
                                onClick={() => setShowPrivateProductModal(true)}
                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                手动添加
                              </button>
                              <button 
                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-600"
                              >
                                导出
                              </button>
                            </div>
                          </div>

                          <div className="border border-gray-100 rounded overflow-hidden">
                            <table className="w-full text-sm text-left">
                              <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                  <th className="px-4 py-2 font-medium text-gray-600">商品信息</th>
                                  <th className="px-4 py-2 font-medium text-gray-600">商品激励比例</th>
                                  <th className="px-4 py-2 font-medium text-gray-600">配置时间</th>
                                  <th className="px-4 py-2 font-medium text-gray-600">操作</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {privateConfiguredProducts
                                  .filter(p => p.paymentMethod === privateCustomActivePaymentMethod && p.code.includes(privateProductSearchCode))
                                  .slice((privateProductPage - 1) * 5, privateProductPage * 5)
                                  .length > 0 ? (
                                  privateConfiguredProducts
                                    .filter(p => p.paymentMethod === privateCustomActivePaymentMethod && p.code.includes(privateProductSearchCode))
                                    .slice((privateProductPage - 1) * 5, privateProductPage * 5)
                                    .map((p, idx) => (
                                    <tr key={idx}>
                                      <td className="px-4 py-3">
                                        <div className="flex items-center space-x-3">
                                          <img src={p.image} alt="" className="w-12 h-12 rounded border border-gray-100 object-cover" referrerPolicy="no-referrer" />
                                          <div className="space-y-0.5">
                                            <div className="font-bold text-gray-800 text-sm">{p.name}</div>
                                            <div className="text-[11px] text-gray-500">规格：{p.spec}</div>
                                            <div className="text-[11px] text-gray-500">条形码：{p.barcode}</div>
                                            <div className="text-[11px] text-gray-500">商品编码：{p.code}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-gray-600">
                                        <ProductRatioInput 
                                          initialRatio={p.ratio} 
                                          onSave={(newRatio) => handleUpdatePrivateProductRatio(p.code, newRatio)} 
                                          isManual={p.isManual}
                                        />
                                      </td>
                                      <td className="px-4 py-3 text-gray-600">{p.time}</td>
                                      <td className="px-4 py-3">
                                        <button 
                                          onClick={() => handleRemovePrivateProduct(p.code)}
                                          className="text-red-500 hover:text-red-600"
                                        >
                                          移除
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">暂无配置商品</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          <Pagination 
                            total={privateConfiguredProducts.filter(p => p.paymentMethod === privateCustomActivePaymentMethod && p.code.includes(privateProductSearchCode)).length} 
                            pageSize={5} 
                            currentPage={privateProductPage}
                            onPageChange={setPrivateProductPage}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 早鸟活动 */}
            <div className="bg-white rounded border border-gray-100 p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800">早鸟活动</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">首单奖励活动开始时间：每日 16 点</span>
              </div>
              <p className="text-xs text-orange-400">
                注:后续的早鸟类型的配置都默认该配置
              </p>
            </div>
          </>
        )}

        {activeTab === '激励发放' && (
          <>
            {/* 激励发放 */}
            <div className="bg-white rounded border border-gray-100 p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800">激励发放</h3>
              <div className="flex items-center space-x-6">
                <span className="text-sm text-gray-600">是否开启：</span>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-1 cursor-pointer group">
                    <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-blue-400">
                      <div className="w-2 h-2 rounded-full bg-transparent"></div>
                    </div>
                    <span className="text-sm text-gray-600">是</span>
                  </label>
                  <label className="flex items-center space-x-1 cursor-pointer group">
                    <div className="w-4 h-4 rounded-full border border-blue-600 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    </div>
                    <span className="text-sm text-gray-600">否</span>
                  </label>
                </div>
              </div>
              <p className="text-xs text-orange-400">
                注：开启状态下，将过滤无店长门店激励不进异常订单，跳过店长激励不发，其他激励正常发放；已发放的激励订单，后续店长激励无法补发；
              </p>
            </div>

            {/* 待入账显示 */}
            <div className="bg-white rounded border border-gray-100 p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800">待入账显示</h3>
              <div className="flex items-center space-x-6">
                <span className="text-sm text-gray-600">员工端小程序是否显示待入账：</span>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-1 cursor-pointer group">
                    <div className="w-4 h-4 rounded-full border border-blue-600 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    </div>
                    <span className="text-sm text-gray-600">显示</span>
                  </label>
                  <label className="flex items-center space-x-1 cursor-pointer group">
                    <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-blue-400">
                      <div className="w-2 h-2 rounded-full bg-transparent"></div>
                    </div>
                    <span className="text-sm text-gray-600">不显示</span>
                  </label>
                </div>
              </div>
              <p className="text-xs text-orange-400">
                注：设置不显示时，随心看员工端小程序中将隐藏所有待入账数据展示
              </p>
            </div>

            {/* 发放规则 */}
            <div className="bg-white rounded border border-gray-100 p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800">发放规则</h3>
              <div className="flex items-center space-x-6">
                <span className="text-sm text-gray-600">发放周期：</span>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-1 cursor-pointer group">
                    <div className="w-4 h-4 rounded-full border border-blue-600 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    </div>
                    <span className="text-sm text-gray-600">实时发放</span>
                  </label>
                  <label className="flex items-center space-x-1 cursor-pointer group">
                    <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-blue-400">
                      <div className="w-2 h-2 rounded-full bg-transparent"></div>
                    </div>
                    <span className="text-sm text-gray-600">按月发放</span>
                  </label>
                </div>
              </div>
              <p className="text-xs text-orange-400">
                注：实时发放指订单确认收货后立即发放激励；按月发放指每月固定日期统一发放上月激励；
              </p>
            </div>
          </>
        )}

        {activeTab === '员工黑名单' && (
          <div className="flex flex-col h-full bg-white">
            {/* Toolbar */}
            <div className="p-4 flex justify-between items-center border-b border-gray-50">
              <div className="flex items-center space-x-2">
                <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                  添加员工
                </button>
                <div className="relative group">
                  <button className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded text-sm flex items-center hover:bg-blue-50">
                    导入 <ChevronDown size={14} className="ml-1" />
                  </button>
                </div>
                <div className="relative group">
                  <button className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded text-sm flex items-center hover:bg-blue-50">
                    导出 <ChevronDown size={14} className="ml-1" />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative group">
                  <button className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded text-sm flex items-center hover:bg-blue-50">
                    批量导入移除 <ChevronDown size={14} className="ml-1" />
                  </button>
                </div>
                <button className="px-4 py-1.5 border border-gray-200 text-gray-400 rounded text-sm cursor-not-allowed">
                  移除
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">员工信息</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">所属机构</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">加入时间</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { id: '1', name: '批量导入随心看角色13', empId: '020713', phone: '17678790011', org: '上海海典集团', role: '老板', joinTime: '2025-07-23 23:45:04' },
                    { id: '2', name: '批量导入随心看角色10', empId: '020710', phone: '17678790008', org: '上海海典集团', role: '店员', joinTime: '2025-07-23 23:45:04' },
                    { id: '3', name: '随心看老板', empId: '19118927263', phone: '19118927263', org: '海典智慧药房双品汇店(直营)', role: '老板', joinTime: '2025-07-23 23:45:04' },
                    { id: '4', name: '小周自动化员工账户92633', empId: '1709614917226', phone: '17670792633', org: '上海海典集团', role: '', joinTime: '2025-07-23 23:45:04' },
                    { id: '5', name: '小周自动化16761', empId: '1690003824994', phone: '17670716761', org: '上海海典集团', role: '', joinTime: '2025-07-23 23:45:04' },
                    { id: '6', name: '海典101457', empId: '101457', phone: '-', org: '上海海典集团', role: '', joinTime: '2025-07-23 23:45:04' },
                    { id: '7', name: '彭晓珍', empId: '1225', phone: '13975864810', org: '江药集团山东有限公司', role: '', joinTime: '2025-07-23 23:45:04' },
                    { id: '8', name: '李文捷', empId: '2015', phone: '17788777643', org: '海典总部仓库', role: '管理员', joinTime: '2025-07-23 23:45:04' },
                    { id: '9', name: '测试张三', empId: '23981', phone: '13145670939', org: '海典智慧药房吴云康汇店', role: '', joinTime: '2025-07-23 23:45:04' },
                    { id: '10', name: '筱雨12', empId: '2233', phone: '13525554554', org: '1', role: '', joinTime: '2025-07-23 23:45:04' },
                    { id: '11', name: 'zmz', empId: '1504', phone: '-', org: '海典智慧药房双品汇店(直营)', role: '运营', joinTime: '2025-07-23 23:45:04' },
                  ].map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs overflow-hidden">
                            {item.name === '随心看老板' ? (
                              <img src="https://picsum.photos/seed/avatar/32/32" alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <UserPlus size={16} />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">{item.name}</div>
                            <div className="text-[10px] text-gray-400">员工编号：{item.empId}</div>
                            <div className="text-[10px] text-gray-400">手机号：{item.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{item.org}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{item.role || '-'}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{item.joinTime}</td>
                      <td className="px-4 py-4">
                        <button className="text-sm text-blue-600 hover:underline">移除黑名单</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* 新增提示 */}
            <div className="p-4 mt-auto border-t border-gray-50 bg-gray-50/30">
              <div className="text-sm font-bold text-gray-800 mb-2">注意：</div>
              <ul className="text-xs text-gray-500 space-y-1.5 list-disc list-inside">
                <li>在黑名单中的员工登录随心看，仅可正常查询账户余额及所有流水记录，但无法提现；</li>
                <li>在黑名单中的员工所获得的所有收益将不再参与随心看端【看谁赚得多】排行；</li>
                <li>在黑名单中的员工所有群聊消息【大单来了】【收益秘籍】将不会被播报；</li>
                <li>在黑名单中的员工不能晒单；</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === '员工签约' && (
          <div className="flex flex-col h-full bg-gray-50 overflow-auto no-scrollbar pb-10">
            {/* 1. Enable Signing Toggle */}
            <div className="bg-white p-4 mb-4 flex items-center border-b border-gray-100">
              <span className="text-sm text-gray-700 mr-4">是否开启签约</span>
              <button className="w-10 h-5 bg-blue-600 rounded-full relative transition-colors">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
            </div>

            {/* 2. Agreement Management */}
            <div className="bg-white p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-800">协议管理</h3>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <button className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-sm hover:bg-blue-100 transition-colors">
                  新增协议
                </button>
                <span className="text-xs text-gray-400">*注：请上传纸张大小：A4的pdf文件</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">协议使用模块</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">协议号</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">协议名称</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">上传时间</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">上传人</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">协议状态</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">员工税率配置</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">员工列表</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { module: '员工签约', id: '20251113151117557', name: '商品销售激励协议.pdf', time: '2025-11-13 15:11:17', user: '666666_admin', status: '正常', tax: true },
                      { module: '员工签约', id: '20251113151054148', name: '00 斗拱平台综合支付服务协议-湖北天和堂.pdf', time: '2025-11-13 15:10:54', user: '666666_admin', status: '无效', tax: false },
                      { module: '员工签约', id: '20250617130045571', name: '员工签约2025-06-17.pdf', time: '2025-06-17 13:00:45', user: '666666_admin', status: '正常', tax: false },
                      { module: '员工签约', id: '20250616130012895', name: '员工签约2025-06-16.pdf', time: '2025-06-16 13:00:12', user: '666666_admin', status: '正常', tax: false },
                      { module: '员工签约', id: '20250616130012559', name: '员工签约2025-06-16.pdf', time: '2025-06-16 13:00:12', user: '666666_admin', status: '无效', tax: false },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 text-xs">
                        <td className="px-4 py-3 text-gray-600">{row.module}</td>
                        <td className="px-4 py-3 text-gray-600">{row.id}</td>
                        <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">{row.name}</td>
                        <td className="px-4 py-3 text-gray-600">{row.time}</td>
                        <td className="px-4 py-3 text-gray-600">{row.user}</td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center ${row.status === '正常' ? 'text-green-500' : 'text-gray-400'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${row.status === '正常' ? 'bg-green-500' : 'bg-gray-400'}`} />
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button className={`w-8 h-4 rounded-full relative transition-colors ${row.tax ? 'bg-blue-600' : 'bg-gray-200'}`}>
                              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${row.tax ? 'right-0.5' : 'left-0.5'}`} />
                            </button>
                            <span className="text-gray-300">|</span>
                            <button className="text-blue-600 hover:underline">管理</button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">共0人</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:underline">{row.status === '正常' ? '作废' : '启用'}</button>
                            <button className="text-blue-600 hover:underline">管理</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex justify-end items-center mt-4 space-x-2 text-xs text-gray-500">
                <span>共 6 条</span>
                <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronLeft size={14} /></button>
                <button className="px-2 py-1 border border-blue-600 text-blue-600 rounded bg-blue-50">1</button>
                <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
                <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronRight size={14} /></button>
                <select className="border border-gray-200 rounded px-1 py-0.5">
                  <option>5条/页</option>
                </select>
                <span>跳转至</span>
                <input type="text" className="w-8 border border-gray-200 rounded px-1 py-0.5 text-center" defaultValue="1" />
                <span>页</span>
              </div>
            </div>

            {/* 3. Employee Signing List */}
            <div className="bg-white p-4 mb-4">
              <h3 className="text-sm font-bold text-gray-800 mb-4">员工签约名单</h3>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center border border-gray-200 rounded px-2 py-1.5 focus-within:border-blue-500 transition-colors">
                    <span className="text-xs text-gray-400 mr-2">员工信息</span>
                    <input type="text" placeholder="请输入员工姓名/编码" className="text-xs outline-none w-40" />
                  </div>
                  <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">查询</button>
                  <button className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded text-sm flex items-center hover:bg-blue-50">
                    导出 <ChevronDown size={14} className="ml-1" />
                  </button>
                </div>
                <button className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded text-sm flex items-center hover:bg-blue-50">
                  批量下载 <ChevronDown size={14} className="ml-1" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1500px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">员工信息</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">证件类型</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">证件号码</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">国籍(地区)</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">性别</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">出生日期</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">任职受雇从业类型</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">任职受雇从业日期</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">所属机构</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">角色</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">签约时间</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">协议号</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">签订协议</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { name: '随心看店长', empId: '1503', phone: '13873174117', idType: '身份证', idNo: '4301**********4026', country: '中国', gender: '女', birth: '2026-01-19', type: '雇员', date: '2026-01-19', org: '海典智慧药房双品汇店(直营)', role: '店长', time: '2025-04-30 00:14:29', agreement: '20250429233106698' },
                      { name: '随心看店长', empId: '150305', phone: '-', idType: '-', idNo: '-', country: '-', gender: '-', birth: '-', type: '-', date: '-', org: '海典智慧药房双品汇店(直营)', role: '店长', time: '2025-04-29 23:54:12', agreement: '20250429233106698' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 text-xs">
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                              <User size={16} />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800">{row.name}</div>
                              <div className="text-[10px] text-gray-400">员工昵称：6......子账号</div>
                              <div className="text-[10px] text-gray-400">员工编号：{row.empId}</div>
                              <div className="text-[10px] text-gray-400">手机号：{row.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-600">{row.idType}</td>
                        <td className="px-4 py-4 text-gray-600">{row.idNo}</td>
                        <td className="px-4 py-4 text-gray-600">{row.country}</td>
                        <td className="px-4 py-4 text-gray-600">{row.gender}</td>
                        <td className="px-4 py-4 text-gray-600">{row.birth}</td>
                        <td className="px-4 py-4 text-gray-600">{row.type}</td>
                        <td className="px-4 py-4 text-gray-600">{row.date}</td>
                        <td className="px-4 py-4 text-gray-600 max-w-[150px] truncate">{row.org}</td>
                        <td className="px-4 py-4 text-gray-600">{row.role}</td>
                        <td className="px-4 py-4 text-gray-600">{row.time}</td>
                        <td className="px-4 py-4 text-gray-600">{row.agreement}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:underline">查看</button>
                            <button className="text-blue-600 hover:underline">下载</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex justify-end items-center mt-4 space-x-2 text-xs text-gray-500">
                <span>共 2 条</span>
                <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronLeft size={14} /></button>
                <button className="px-2 py-1 border border-blue-600 text-blue-600 rounded bg-blue-50">1</button>
                <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronRight size={14} /></button>
                <select className="border border-gray-200 rounded px-1 py-0.5">
                  <option>5条/页</option>
                </select>
                <span>跳转至</span>
                <input type="text" className="w-8 border border-gray-200 rounded px-1 py-0.5 text-center" defaultValue="1" />
                <span>页</span>
              </div>
            </div>

            {/* 4. Employee Personal Tax Report */}
            <div className="bg-white p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-4">员工个税报表</h3>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center border border-gray-200 rounded px-2 py-1.5 focus-within:border-blue-500 transition-colors">
                  <span className="text-xs text-gray-400 mr-2">员工信息</span>
                  <input type="text" placeholder="请输入员工姓名/编码" className="text-xs outline-none w-40" />
                </div>
                <div className="flex items-center border border-gray-200 rounded px-2 py-1.5 focus-within:border-blue-500 transition-colors">
                  <span className="text-xs text-gray-400 mr-2">时间</span>
                  <input type="text" defaultValue="2026-03" className="text-xs outline-none w-24" />
                  <Calendar size={14} className="text-gray-400 ml-1" />
                </div>
                <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">查询</button>
                <button className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded text-sm flex items-center hover:bg-blue-50">
                  导出 <ChevronDown size={14} className="ml-1" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1500px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">员工信息</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">证件类型</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">证件号码</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">国籍(地区)</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">性别</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">出生日期</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">任职受雇从业类型</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">任职受雇从业日期</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">所属机构</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">手机号码</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">提现金额</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">员工扣税金额</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { name: '随心看店长', empId: '1503', phone: '13873174117', idType: '身份证', idNo: '4301**********4026', country: '中国', gender: '女', birth: '2026-01-19', type: '雇员', date: '2026-01-19', org: '海典智慧药房双品汇店(直营)', withdraw: '0.02元', tax: '0元' },
                      { name: '随心看店长', empId: '150305', phone: '-', idType: '-', idNo: '-', country: '-', gender: '-', birth: '-', type: '-', date: '-', org: '海典智慧药房双品汇店(直营)', withdraw: '0元', tax: '0元' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 text-xs">
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                              <User size={16} />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800">{row.name}</div>
                              <div className="text-[10px] text-gray-400">员工昵称：6......子账号</div>
                              <div className="text-[10px] text-gray-400">员工编号：{row.empId}</div>
                              <div className="text-[10px] text-gray-400">手机号：{row.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-600">{row.idType}</td>
                        <td className="px-4 py-4 text-gray-600">{row.idNo}</td>
                        <td className="px-4 py-4 text-gray-600">{row.country}</td>
                        <td className="px-4 py-4 text-gray-600">{row.gender}</td>
                        <td className="px-4 py-4 text-gray-600">{row.birth}</td>
                        <td className="px-4 py-4 text-gray-600">{row.type}</td>
                        <td className="px-4 py-4 text-gray-600">{row.date}</td>
                        <td className="px-4 py-4 text-gray-600 max-w-[150px] truncate">{row.org}</td>
                        <td className="px-4 py-4 text-gray-600">{row.phone}</td>
                        <td className="px-4 py-4 text-gray-600">{row.withdraw}</td>
                        <td className="px-4 py-4 text-gray-600">{row.tax}</td>
                        <td className="px-4 py-4">
                          <button className="text-blue-600 hover:underline">查看</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {activeTab === '员工提现' && (
          <div className="flex flex-col h-full bg-gray-50 overflow-auto no-scrollbar pb-10">
            {/* 1. Withdrawal Switch */}
            <div className="bg-white rounded border border-gray-100 p-6 mb-4 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-800">提现开关</h3>
              <div className="flex items-center space-x-6">
                <span className="text-sm text-gray-600">是否开启提现：</span>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-1 cursor-pointer group">
                    <div className="w-4 h-4 rounded-full border border-blue-600 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    </div>
                    <span className="text-sm text-gray-600">是</span>
                  </label>
                  <label className="flex items-center space-x-1 cursor-pointer group">
                    <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-blue-400">
                      <div className="w-2 h-2 rounded-full bg-transparent"></div>
                    </div>
                    <span className="text-sm text-gray-600">否</span>
                  </label>
                </div>
              </div>
              <p className="text-xs text-orange-400">
                注：关闭提现后，员工端小程序将无法进行提现操作；
              </p>
            </div>

            {/* 2. Withdrawal Method */}
            <div className="bg-white rounded border border-gray-100 p-6 mb-4 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-800">提现方式</h3>
              <div className="flex items-center space-x-6">
                <span className="text-sm text-gray-600">提现到：</span>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                    <span className="text-sm text-gray-600">微信零钱</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                    <span className="text-sm text-gray-600">银行卡</span>
                  </label>
                </div>
              </div>
              <p className="text-xs text-orange-400">
                注：目前仅支持微信零钱提现，银行卡提现功能开发中；
              </p>
            </div>

            {/* 3. Withdrawal Rules */}
            <div className="bg-white rounded border border-gray-100 p-6 mb-4 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-gray-800">提现规则</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="text-sm text-gray-600">单笔最小提现金额：</span>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      defaultValue="1.00" 
                      className="w-32 px-2 py-1.5 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                    />
                    <span className="text-sm text-gray-600">元</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-gray-600">单笔最大提现金额：</span>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      defaultValue="5000.00" 
                      className="w-32 px-2 py-1.5 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                    />
                    <span className="text-sm text-gray-600">元</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-gray-600">每日提现次数上限：</span>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      defaultValue="10" 
                      className="w-32 px-2 py-1.5 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                    />
                    <span className="text-sm text-gray-600">次</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-gray-600">每月提现金额上限：</span>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      defaultValue="50000.00" 
                      className="w-32 px-2 py-1.5 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                    />
                    <span className="text-sm text-gray-600">元</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-gray-600">提现手续费率：</span>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      defaultValue="0.00" 
                      className="w-32 px-2 py-1.5 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                    />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 space-y-4">
                <div className="flex items-center space-x-6">
                  <span className="text-sm text-gray-600">提现审核：</span>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-1 cursor-pointer group">
                      <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-blue-400">
                        <div className="w-2 h-2 rounded-full bg-transparent"></div>
                      </div>
                      <span className="text-sm text-gray-600">开启</span>
                    </label>
                    <label className="flex items-center space-x-1 cursor-pointer group">
                      <div className="w-4 h-4 rounded-full border border-blue-600 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      </div>
                      <span className="text-sm text-gray-600">自动通过</span>
                    </label>
                  </div>
                </div>
                <p className="text-xs text-orange-400">
                  注：开启审核后，员工提现需管理员在“提现管理”中手动审核通过；自动通过则直接打款；
                </p>
              </div>
            </div>

            {/* 4. Withdrawal Description */}
            <div className="bg-white rounded border border-gray-100 p-6 mb-4 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-800">提现说明</h3>
              <textarea 
                className="w-full h-24 p-3 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-blue-400 resize-none"
                placeholder="请输入提现说明，将展示在员工端小程序提现页面..."
                defaultValue="1. 提现申请将在1-3个工作日内处理；&#10;2. 提现金额将直接打入您的微信零钱；&#10;3. 如有疑问请联系财务部门。"
              ></textarea>
            </div>

            {/* 5. Withdrawal Records */}
            <div className="bg-white p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-sm font-bold text-gray-800">提现记录</h3>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 border border-gray-200 text-gray-400 rounded text-xs cursor-not-allowed">批量通过</button>
                    <button className="px-3 py-1 border border-gray-200 text-gray-400 rounded text-xs cursor-not-allowed">批量拒绝</button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center border border-gray-200 rounded px-2 py-1.5 focus-within:border-blue-500 transition-colors">
                    <span className="text-xs text-gray-400 mr-2">员工信息</span>
                    <input type="text" placeholder="姓名/手机号" className="text-xs outline-none w-32" />
                  </div>
                  <div className="flex items-center border border-gray-200 rounded px-2 py-1.5 focus-within:border-blue-500 transition-colors">
                    <span className="text-xs text-gray-400 mr-2">状态</span>
                    <select className="text-xs outline-none bg-transparent">
                      <option>全部</option>
                      <option>待审核</option>
                      <option>已通过</option>
                      <option>已拒绝</option>
                      <option>打款中</option>
                      <option>打款失败</option>
                    </select>
                  </div>
                  <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">查询</button>
                  <button className="px-3 py-1.5 border border-blue-600 text-blue-600 rounded text-sm flex items-center hover:bg-blue-50">
                    导出 <ChevronDown size={14} className="ml-1" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 w-10">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">提现单号</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">员工信息</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">所属机构</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">提现金额</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">提现方式</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">申请时间</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">状态</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { id: 'TX202603190005', name: '张三', empId: '8888', phone: '13900001111', org: '海典智慧药房', amount: '88.00', method: '微信零钱', time: '2026-03-19 11:30:00', status: '待审核' },
                      { id: 'TX202603190001', name: '随心看店长', empId: '1503', phone: '13873174117', org: '海典智慧药房双品汇店(直营)', amount: '100.00', method: '微信零钱', time: '2026-03-19 10:00:00', status: '已通过' },
                      { id: 'TX202603180052', name: '批量导入随心看角色13', empId: '020713', phone: '17678790011', org: '上海海典集团', amount: '50.50', method: '微信零钱', time: '2026-03-18 15:30:22', status: '打款中' },
                      { id: 'TX202603180012', name: '李文捷', empId: '2015', phone: '17788777643', org: '海典总部仓库', amount: '200.00', method: '微信零钱', time: '2026-03-18 09:12:45', status: '已拒绝' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 text-xs">
                        <td className="px-4 py-4">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-4 py-4 text-gray-600">{row.id}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                              <User size={12} />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{row.name}</div>
                              <div className="text-[10px] text-gray-400">{row.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-600 max-w-[150px] truncate">{row.org}</td>
                        <td className="px-4 py-4 font-medium text-gray-800">¥{row.amount}</td>
                        <td className="px-4 py-4 text-gray-600">{row.method}</td>
                        <td className="px-4 py-4 text-gray-600">{row.time}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                            row.status === '已通过' ? 'bg-green-50 text-green-600' :
                            row.status === '打款中' ? 'bg-blue-50 text-blue-600' :
                            row.status === '待审核' ? 'bg-orange-50 text-orange-600' :
                            'bg-red-50 text-red-600'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:underline">详情</button>
                            {row.status === '待审核' && (
                              <>
                                <button className="text-green-600 hover:underline">通过</button>
                                <button className="text-red-600 hover:underline">拒绝</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex justify-end items-center mt-4 space-x-2 text-xs text-gray-500">
                <span>共 3 条</span>
                <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronLeft size={14} /></button>
                <button className="px-2 py-1 border border-blue-600 text-blue-600 rounded bg-blue-50">1</button>
                <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronRight size={14} /></button>
              </div>
            </div>
          </div>
        )}

        {activeTab === '看谁赚得多' && (
          <div className="flex flex-col h-full bg-white p-6 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">参与排行类型：</span>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                    <span className="text-sm text-gray-600">店员</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                    <span className="text-sm text-gray-600">店长</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                    <span className="text-sm text-gray-600">区域经理</span>
                  </label>
                </div>
              </div>
              <p className="text-xs text-orange-400">
                注：勾选的对应角色收益类型将会统计在排行榜中；
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">参与排行门店：</span>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                    <span className="text-sm text-gray-600">加盟店</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                    <span className="text-sm text-gray-600">直营店</span>
                  </label>
                </div>
              </div>
              <p className="text-xs text-orange-400">
                注：勾选的门店及门店收益将会统计在排行榜中，未勾选的门店将不参与排名且门店员工不展示看谁赚得多；
              </p>
            </div>
          </div>
        )}

        {activeTab === '连锁抽佣' && (
          <div className="space-y-8 bg-white p-6 rounded shadow-sm">
            {/* Enable Chain Commission Section */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-6">
              <div className="flex items-center space-x-4 max-w-md">
                <span className="text-sm font-medium text-gray-700">是否开启连锁抽佣</span>
                <button className="relative inline-flex h-5 w-10 items-center rounded-full bg-blue-600 transition-colors focus:outline-none">
                  <span className="inline-block h-3.5 w-3.5 transform translate-x-5.5 rounded-full bg-white transition-transform" />
                </button>
              </div>
              <p className="text-xs text-orange-400">
                注：连锁抽佣开启状态下，激励活动可配置连锁抽佣；关闭状态下，激励活动不可配置连锁抽佣；
              </p>
              
              <div className="flex items-center space-x-4 max-w-md">
                <span className="text-sm text-gray-600 w-24"><span className="text-red-500 mr-1">*</span>默认管理人</span>
                <input 
                  type="text" 
                  defaultValue="小周自动化员工账户25899" 
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-orange-400">
                注：当分子公司未配置企业管理人的情况下，所有连锁抽佣激励将进入默认管理人账户；
              </p>
            </div>

            {/* Account List Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-800">连锁抽佣账户列表</h3>
              <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                <Plus size={16} />
                <span>新增</span>
              </button>
              
              <div className="border border-gray-200 rounded overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 font-medium text-gray-600">序号</th>
                      <th className="px-4 py-3 font-medium text-gray-600">所属企业</th>
                      <th className="px-4 py-3 font-medium text-gray-600">企业管理人</th>
                      <th className="px-4 py-3 font-medium text-gray-600">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <tr>
                      <td className="px-4 py-3 text-gray-600">1</td>
                      <td className="px-4 py-3 text-gray-600">上海海典智慧药店</td>
                      <td className="px-4 py-3 text-gray-600">海典101503</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <button className="text-blue-600 hover:text-blue-700">编辑</button>
                          <button className="text-blue-600 hover:text-blue-700">删除</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-end space-x-2 text-xs text-gray-500 py-4">
                <span>共 1 条</span>
                <button className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>
                  <ChevronLeft size={14} />
                </button>
                <button className="px-2 py-1 border border-blue-600 bg-blue-50 text-blue-600 rounded">1</button>
                <button className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>
                  <ChevronRight size={14} />
                </button>
                <select className="px-2 py-1 border border-gray-300 rounded bg-white outline-none">
                  <option>10条/页</option>
                </select>
                <span>跳转至</span>
                <input type="text" defaultValue="1" className="w-10 px-1 py-1 border border-gray-300 rounded text-center" />
                <span>页</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === '操作记录' && (
          <div className="bg-white rounded shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-600 w-40">操作类型</th>
                  <th className="px-4 py-3 font-medium text-gray-600 w-40">操作人</th>
                  <th className="px-4 py-3 font-medium text-gray-600">变更内容</th>
                  <th className="px-4 py-3 font-medium text-gray-600 w-48">操作时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {operationRecords.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{row.type}</td>
                    <td className="px-4 py-3 text-gray-600">{row.user}</td>
                    <td className="px-4 py-3 text-gray-600">{row.content}</td>
                    <td className="px-4 py-3 text-gray-600">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Method Modal (Figure 2) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-[600px] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-800">选择付款方式</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-wrap gap-6">
                {['1/A现金', '15/E金孚龙卡', '1111/pengwzh付款方式', '1/货到付款'].map(pm => {
                  const isNoneSelected = publicNonePaymentMethods.includes(pm);
                  const isCustomSelected = publicCustomPaymentMethods.includes(pm);
                  
                  const isDisabled = publicPaymentModalType === 'custom' && isNoneSelected;
                  const isChecked = publicPaymentModalType === 'none' ? isNoneSelected : isCustomSelected;

                  return (
                    <label key={pm} className={`flex items-center space-x-2 ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer group'}`}>
                      <input 
                        type="checkbox" 
                        disabled={isDisabled}
                        checked={isChecked}
                        onChange={(e) => {
                          if (publicPaymentModalType === 'none') {
                            if (e.target.checked) {
                              setPublicNonePaymentMethods(prev => [...prev, pm]);
                              // Remove from custom if selected in none
                              setPublicCustomPaymentMethods(prev => prev.filter(p => p !== pm));
                              if (publicCustomActivePaymentMethod === pm) {
                                setPublicCustomActivePaymentMethod(null);
                              }
                            } else {
                              setPublicNonePaymentMethods(prev => prev.filter(p => p !== pm));
                            }
                          } else if (publicPaymentModalType === 'custom') {
                            if (e.target.checked) {
                              setPublicCustomPaymentMethods(prev => [...prev, pm]);
                            } else {
                              setPublicCustomPaymentMethods(prev => prev.filter(p => p !== pm));
                            }
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:bg-gray-100"
                      />
                      <span className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-600 group-hover:text-blue-600'} transition-colors`}>{pm}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 px-4 py-3 bg-gray-50 border-t border-gray-100">
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-1.5 text-sm border border-gray-300 rounded text-gray-600 hover:bg-white"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  if (publicCustomPaymentMethods.length > 0 && !publicCustomActivePaymentMethod) {
                    setPublicCustomActivePaymentMethod(publicCustomPaymentMethods[0]);
                  } else if (publicCustomPaymentMethods.length > 0 && !publicCustomPaymentMethods.includes(publicCustomActivePaymentMethod!)) {
                    setPublicCustomActivePaymentMethod(publicCustomPaymentMethods[0]);
                  } else if (publicCustomPaymentMethods.length === 0) {
                    setPublicCustomActivePaymentMethod(null);
                  }
                  setShowPaymentModal(false);
                }}
                className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Selection Modal (Figure 1) */}
      {showProductModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-[800px] max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-800">选择商品</h3>
              <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4 overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 w-20">商品名称</span>
                  <input type="text" placeholder="输入商品名称模糊搜索" className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-400" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 w-20">商品编码</span>
                  <div className="flex-1 relative">
                    <input type="text" placeholder="输入商品编码精确搜索" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-400" />
                    <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 w-20">条形码</span>
                  <input type="text" placeholder="输入商品条形码" className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-400" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 w-20">批准文号</span>
                  <div className="flex-1 flex space-x-2">
                    <input type="text" placeholder="输入批准文号" className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-400" />
                    <button className="px-4 py-1.5 bg-white border border-blue-600 text-blue-600 rounded text-sm hover:bg-blue-50">查询</button>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded px-3 py-2 flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full border border-orange-400 flex items-center justify-center text-[10px] text-orange-400 font-bold">!</div>
                <span className="text-xs text-orange-400">已参与“按商品批号”政策商品不可勾选</span>
              </div>

              <div className="border border-gray-100 rounded overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
                      <th className="px-4 py-2 font-medium text-gray-600">商品图片</th>
                      <th className="px-4 py-2 font-medium text-gray-600">商品信息</th>
                      <th className="px-4 py-2 font-medium text-gray-600">关联活动</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { img: 'https://picsum.photos/seed/med1/40/40', name: '肠炎宁片', spec: '0.24g*24片', code: '009385', activity: '564169/商品冲突弹...' },
                      { img: 'https://picsum.photos/seed/med2/40/40', name: '肠炎宁片 (康恩贝)', spec: '0.42g*48s', code: '144081', activity: '564168/厂家模式活...' },
                      { img: 'https://picsum.photos/seed/med3/40/40', name: '0000010', spec: '6g', code: '0000010', activity: '564169/商品冲突弹...' },
                    ].map((p, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                        <td className="px-4 py-4">
                          <img src={p.img} alt="" className="w-10 h-10 rounded border border-gray-100" referrerPolicy="no-referrer" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-medium text-gray-800">{p.name}</div>
                          <div className="text-xs text-gray-400">规格：{p.spec}</div>
                          <div className="text-xs text-gray-400">商品编码：{p.code}</div>
                        </td>
                        <td className="px-4 py-4 text-blue-600 text-xs">
                          {p.activity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-end space-x-2 text-xs text-gray-500 py-2">
                <span>共 43560 条</span>
                <button className="p-1 border border-gray-300 rounded hover:bg-gray-50"><ChevronLeft size={14} /></button>
                <button className="px-2 py-1 border border-blue-600 bg-blue-50 text-blue-600 rounded">1</button>
                <button className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50">2</button>
                <button className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50">3</button>
                <button className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50">4</button>
                <button className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50">5</button>
                <button className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50">6</button>
                <span>...</span>
                <button className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50">4356</button>
                <button className="p-1 border border-gray-300 rounded hover:bg-gray-50"><ChevronRight size={14} /></button>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <div className="text-xs text-gray-400">提示：活动商品最多添加100件</div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setShowProductModal(false)}
                  className="px-6 py-1.5 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    handleAddProduct([{ code: '009385', ratio: '' }]);
                    setShowProductModal(false);
                  }}
                  className="px-6 py-1.5 text-sm bg-blue-400 text-white rounded hover:bg-blue-500"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Private Member Level Modal */}
      {showPrivateMemberLevelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-[500px] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-800">选择会员等级</h3>
              <button onClick={() => setShowPrivateMemberLevelModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-wrap gap-6">
                {['普通卡', '银卡', '金卡', '白金卡', '钻石卡'].map(level => (
                  <label key={level} className="flex items-center space-x-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={privateSelectedMemberLevels.includes(level)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPrivateSelectedMemberLevels(prev => [...prev, level]);
                        } else {
                          setPrivateSelectedMemberLevels(prev => prev.filter(l => l !== level));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">{level}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 px-4 py-3 bg-gray-50 border-t border-gray-100">
              <button 
                onClick={() => setShowPrivateMemberLevelModal(false)}
                className="px-4 py-1.5 text-sm border border-gray-300 rounded text-gray-600 hover:bg-white"
              >
                取消
              </button>
              <button 
                onClick={() => setShowPrivateMemberLevelModal(false)}
                className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Private Payment Method Modal */}
      {showPrivatePaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-[600px] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-800">选择付款方式</h3>
              <button onClick={() => setShowPrivatePaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-wrap gap-6">
                {['1/A现金', '15/E金孚龙卡', '1111/pengwzh付款方式', '1/货到付款'].map(pm => {
                  const isNoneSelected = privateNonePaymentMethods.includes(pm);
                  const isCustomSelected = privateCustomPaymentMethods.includes(pm);
                  
                  const isDisabled = privatePaymentModalType === 'custom' && isNoneSelected;
                  const isChecked = privatePaymentModalType === 'none' ? isNoneSelected : isCustomSelected;

                  return (
                    <label key={pm} className={`flex items-center space-x-2 ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer group'}`}>
                      <input 
                        type="checkbox" 
                        disabled={isDisabled}
                        checked={isChecked}
                        onChange={(e) => {
                          if (privatePaymentModalType === 'none') {
                            if (e.target.checked) {
                              setPrivateNonePaymentMethods(prev => [...prev, pm]);
                              // Remove from custom if selected in none
                              setPrivateCustomPaymentMethods(prev => prev.filter(p => p !== pm));
                              if (privateCustomActivePaymentMethod === pm) {
                                setPrivateCustomActivePaymentMethod(null);
                              }
                            } else {
                              setPrivateNonePaymentMethods(prev => prev.filter(p => p !== pm));
                            }
                          } else if (privatePaymentModalType === 'custom') {
                            if (e.target.checked) {
                              setPrivateCustomPaymentMethods(prev => [...prev, pm]);
                            } else {
                              setPrivateCustomPaymentMethods(prev => prev.filter(p => p !== pm));
                            }
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:bg-gray-100"
                      />
                      <span className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-600 group-hover:text-blue-600'} transition-colors`}>{pm}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 px-4 py-3 bg-gray-50 border-t border-gray-100">
              <button 
                onClick={() => setShowPrivatePaymentModal(false)}
                className="px-4 py-1.5 text-sm border border-gray-300 rounded text-gray-600 hover:bg-white"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  if (privateCustomPaymentMethods.length > 0 && !privateCustomActivePaymentMethod) {
                    setPrivateCustomActivePaymentMethod(privateCustomPaymentMethods[0]);
                  } else if (privateCustomPaymentMethods.length > 0 && !privateCustomPaymentMethods.includes(privateCustomActivePaymentMethod!)) {
                    setPrivateCustomActivePaymentMethod(privateCustomPaymentMethods[0]);
                  } else if (privateCustomPaymentMethods.length === 0) {
                    setPrivateCustomActivePaymentMethod(null);
                  }
                  setShowPrivatePaymentModal(false);
                }}
                className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Private Product Selection Modal */}
      {showPrivateProductModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-[800px] max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-800">选择商品</h3>
              <button onClick={() => setShowPrivateProductModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4 overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 w-20">商品名称</span>
                  <input type="text" placeholder="输入商品名称模糊搜索" className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-400" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 w-20">商品编码</span>
                  <input type="text" placeholder="输入商品编码精确搜索" className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-400" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 w-20">商品条码</span>
                  <input type="text" placeholder="输入商品条码" className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-400" />
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end space-x-3">
              <button 
                onClick={() => setShowPrivateProductModal(false)}
                className="px-4 py-1.5 text-sm border border-gray-300 rounded text-gray-600 hover:bg-white"
              >
                取消
              </button>
              <button 
                onClick={() => setShowPrivateProductModal(false)}
                className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TargetManagementView = () => {
  const [searchName, setSearchName] = useState('');
  
  const mockData = [
    {
      id: '1',
      name: '爆品目标1778132987',
      status: '已中止',
      period: '2027-05至2027-05',
      type: '爆品目标',
      dimension: '销售额',
      storeProgress: { achieved: 0, target: 10, rate: '0%' },
      employeeProgress: { achieved: 0, target: 0, rate: '0%' },
      riskCount: 0,
      scope: { regions: 1, stores: 1, employees: 0 },
      maintenance: { creator: '666666_admin', createTime: '2026.05.07 13:49:47', modifier: '666666_admin', modifyTime: '2026.05.07 13:49:48' },
      isDraft: false
    },
    {
      id: '2',
      name: '草稿',
      status: '草稿',
      period: '2027至2027',
      type: '爆品目标',
      dimension: '销售量',
      storeProgress: { achieved: 0, target: 10, rate: '0%' },
      employeeProgress: { achieved: 0, target: 0, rate: '0%' },
      riskCount: 0,
      scope: { regions: 1, stores: 1, employees: 0 },
      maintenance: { creator: '666666_admin', createTime: '2026.05.07 13:46:34', modifier: '666666_admin', modifyTime: '2026.05.07 13:46:34' },
      isDraft: true
    },
    {
      id: '3',
      name: '爆品目标1778132685',
      status: '已中止',
      period: '2027至2027',
      type: '爆品目标',
      dimension: '销售额',
      storeProgress: { achieved: 0, target: 10, rate: '0%' },
      employeeProgress: { achieved: 0, target: 0, rate: '0%' },
      riskCount: 0,
      scope: { regions: 1, stores: 1, employees: 0 },
      maintenance: { creator: '666666_admin', createTime: '2026.05.07 13:44:45', modifier: '666666_admin', modifyTime: '2026.05.07 13:44:50' },
      isDraft: false
    },
    {
      id: '4',
      name: '系列目标自动化1778132...',
      status: '已中止',
      period: '2027至2027',
      type: '系列目标',
      dimension: '销售量',
      storeProgress: { achieved: 0, target: 5, rate: '0%' },
      employeeProgress: { achieved: 0, target: 10, rate: '0%' },
      riskCount: 0,
      scope: { regions: 1, stores: 1, employees: 2 },
      maintenance: { creator: '666666_admin', createTime: '2026.05.07 13:39:07', modifier: '666666_admin', modifyTime: '2026.05.07 13:39:12' },
      isDraft: false
    },
    {
      id: '5',
      name: '系列目标自动化1778132...',
      status: '已中止',
      period: '2027至2027',
      type: '系列目标',
      dimension: '销售量',
      storeProgress: { achieved: 0, target: 5, rate: '0%' },
      employeeProgress: { achieved: 0, target: 10, rate: '0%' },
      riskCount: 0,
      scope: { regions: 1, stores: 1, employees: 2 },
      maintenance: { creator: '666666_admin', createTime: '2026.05.07 13:39:04', modifier: '666666_admin', modifyTime: '2026.05.07 13:39:11' },
      isDraft: false
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f6f8fa]">
      <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center h-[52px]">
        <h2 className="text-sm font-bold text-gray-800">目标管理</h2>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white border-b border-gray-100">
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 w-16 text-right">目标名称</span>
            <input 
              type="text" 
              placeholder="请输入目标名称" 
              className="border border-gray-200 rounded px-2 py-1 text-xs w-48 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 w-16 text-right">目标类型</span>
            <select className="border border-gray-200 rounded px-2 py-1 text-xs w-40 focus:outline-none bg-white">
              <option>请选择</option>
              <option>爆品目标</option>
              <option>系列目标</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 w-16 text-right">考核维度</span>
            <select className="border border-gray-200 rounded px-2 py-1 text-xs w-40 focus:outline-none bg-white">
              <option>请选择</option>
              <option>销售额</option>
              <option>销售量</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 w-16 text-right">目标状态</span>
            <select className="border border-gray-200 rounded px-2 py-1 text-xs w-40 focus:outline-none bg-white">
              <option>请选择</option>
              <option>进行中</option>
              <option>草稿</option>
              <option>已中止</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 w-16 text-right">活动商品</span>
            <div className="flex">
              <select className="border border-gray-200 rounded-l px-2 py-1 text-xs w-24 focus:outline-none bg-white border-r-0">
                <option>商品名称</option>
                <option>商品编码</option>
                <option>商品条码</option>
              </select>
              <input 
                type="text" 
                placeholder="请输入商品名称" 
                className="border border-gray-200 rounded-r px-2 py-1 text-xs w-48 focus:outline-none focus:ring-1 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 text-white px-5 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors">查询</button>
          <button className="border border-gray-200 text-gray-600 px-5 py-1 rounded text-xs font-medium hover:bg-gray-50 transition-colors">重置</button>
          <div className="relative group">
            <button className="border border-blue-600 text-blue-600 px-5 py-1 rounded text-xs font-medium flex items-center hover:bg-blue-50">
              导出 <ChevronDown size={14} className="ml-1" />
            </button>
          </div>
          <button className="bg-blue-600 text-white px-4 py-1 rounded text-xs font-medium flex items-center hover:bg-blue-700">
            <Plus size={14} className="mr-1" /> 新建目标
          </button>
        </div>
      </div>

      {/* Table Head */}
      <div className="bg-white px-4 py-2 border-b border-gray-100 flex items-center text-[11px] text-gray-400 font-bold uppercase tracking-wider sticky top-0 z-10 min-w-[1280px]">
        <div className="w-[28%]">目标信息</div>
        <div className="w-[8%]">考核维度</div>
        <div className="w-[12%] flex items-center">门店整体进度 <Info size={12} className="ml-1 opacity-50" /></div>
        <div className="w-[12%] flex items-center">员工整体进度 <Info size={12} className="ml-1 opacity-50" /></div>
        <div className="w-[10%]">风险商品/品类/组合数</div>
        <div className="w-[12%]">参与范围</div>
        <div className="w-[12%]">维护信息</div>
        <div className="w-[6%] text-right pr-4">操作</div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar min-w-[1280px]">
        {mockData.map((item) => (
          <div key={item.id} className="bg-white px-4 py-4 border-b border-gray-50 hover:bg-blue-50/10 transition-colors flex items-center">
            {/* Target Info */}
            <div className="w-[28%] flex items-start space-x-3">
              <div className="w-16 h-12 bg-gray-50 rounded border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5">
                <img src={`https://picsum.photos/seed/${item.id}/64/48`} alt="" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-bold truncate ${item.isDraft ? 'text-gray-400' : 'text-gray-800'}`}>{item.name}</span>
                  <span className={`flex-shrink-0 px-1 border rounded-[2px] text-[10px] scale-90 ${
                    item.status === '已中止' ? 'bg-pink-50 text-pink-500 border-pink-100' : 
                    item.status === '草稿' ? 'bg-gray-50 text-gray-400 border-gray-200' :
                    'bg-green-50 text-green-600 border-green-100'
                  }`}>{item.status}</span>
                </div>
                <div className="mt-1 space-y-0.5">
                  <div className="text-[11px] text-gray-500">
                    <span className="text-gray-400">任务周期:</span> {item.period}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    <span className="text-gray-400">类型:</span> {item.type}
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment */}
            <div className="w-[8%] text-xs text-gray-600 font-medium">
              {item.dimension}
            </div>

            {/* Store Progress */}
            <div className="w-[12%] text-[11px] text-gray-500 space-y-1">
              <div className="flex justify-between w-28">
                <span>达成值:</span>
                <span className="font-bold text-gray-700">{item.storeProgress.achieved}</span>
              </div>
              <div className="flex justify-between w-28">
                <span>目标值:</span>
                <span className="font-bold text-gray-700">{item.storeProgress.target}</span>
              </div>
              <div className="flex justify-between w-28">
                <span>达成率:</span>
                <span className="font-bold text-blue-600">{item.storeProgress.rate}</span>
              </div>
            </div>

            {/* Employee Progress */}
            <div className="w-[12%] text-[11px] text-gray-500 space-y-1">
              <div className="flex justify-between w-28">
                <span>达成值:</span>
                <span className="font-bold text-gray-700">{item.employeeProgress.achieved}</span>
              </div>
              <div className="flex justify-between w-28">
                <span>目标值:</span>
                <span className="font-bold text-gray-700">{item.employeeProgress.target}</span>
              </div>
              <div className="flex justify-between w-28">
                <span>达成率:</span>
                <span className="font-bold text-blue-600">{item.employeeProgress.rate}</span>
              </div>
            </div>

            {/* Risk */}
            <div className="w-[10%] text-xs text-gray-800 font-bold pl-12">
              {item.riskCount}
            </div>

            {/* Scope */}
            <div className="w-[12%] text-[11px] text-gray-500 space-y-0.5">
              <div className="flex items-center">
                <span className="text-gray-400 w-16">参与区域数:</span>
                <span className="font-bold text-gray-700 ml-1">{item.scope.regions}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 w-16">参与门店数:</span>
                <span className="font-bold text-gray-700 ml-1">{item.scope.stores}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 w-16">参与员工数:</span>
                <span className="font-bold text-gray-700 ml-1">{item.scope.employees}</span>
              </div>
            </div>

            {/* Maintenance */}
            <div className="w-[12%] text-[10px] text-gray-400 space-y-0.5 pr-2">
              <div>添加人: {item.maintenance.creator}</div>
              <div>添加时间: {item.maintenance.createTime}</div>
              <div>最后修改人: {item.maintenance.modifier}</div>
              <div>最后修改时间: {item.maintenance.modifyTime}</div>
            </div>

            {/* Actions */}
            <div className="w-[6%] flex justify-end pr-4">
              <div className="flex flex-wrap justify-end gap-x-2 gap-y-1 max-w-[80px]">
                {item.isDraft ? (
                  <>
                    <button className="text-blue-600 hover:underline text-[11px]">编辑</button>
                    <button className="text-blue-600 hover:underline text-[11px]">发布</button>
                    <button className="text-blue-600 hover:underline text-[11px]">删除</button>
                    <button className="text-blue-600 hover:underline text-[11px]">复制</button>
                  </>
                ) : (
                  <button className="text-blue-600 hover:underline text-[11px]">复制</button>
                )}
              </div>
            </div>
          </div>
        ))}
        {/* Pagination placeholder */}
        <div className="bg-white p-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center">共 4451 条</div>
          <div className="flex items-center space-x-1">
            <button className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50">&lt;</button>
            <button className="w-6 h-6 flex items-center justify-center border border-blue-600 rounded bg-blue-50 text-blue-600 font-bold">1</button>
            <button className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50">2</button>
            <button className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50">3</button>
            <button className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50">4</button>
            <button className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50">5</button>
            <button className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50">6</button>
            <span className="px-2">...</span>
            <button className="w-8 h-6 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50">891</button>
            <button className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-50">&gt;</button>
            <select className="border border-gray-200 rounded px-1 py-0.5 ml-2">
              <option>5条/页</option>
              <option>10条/页</option>
            </select>
            <span className="ml-2">跳转至</span>
            <input type="text" className="border border-gray-200 rounded w-8 px-1 py-0.5 text-center" defaultValue="1" />
            <span>页</span>
          </div>
        </div>
      </div>
    </div>
  );
};


const TargetManagementDimensionView = () => {
  const [showTargetActivityModal, setShowTargetActivityModal] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<any>(null);

  const mockData = [
    { id: 'TGT-2026-001', type: '组合目标-按数量', targetAmount: '10000', targetEmployees: 500, targetStores: 50, completedEmployees: 450, completedStores: 48, employeeRate: '90%', storeRate: '96%', targetActivityCount: 4 },
    { id: 'TGT-2026-002', type: '单品目标-按数量', targetAmount: '5000', targetEmployees: 300, targetStores: 30, completedEmployees: 200, completedStores: 25, employeeRate: '66.7%', storeRate: '83.3%', targetActivityCount: 2 },
    { id: 'TGT-2026-003', type: '系列目标-按数量', targetAmount: '8000', targetEmployees: 400, targetStores: 40, completedEmployees: 350, completedStores: 38, employeeRate: '87.5%', storeRate: '95%', targetActivityCount: 6 },
    { id: 'TGT-2026-004', type: '单品目标-按金额', targetAmount: '¥500,000', targetEmployees: 200, targetStores: 20, completedEmployees: 180, completedStores: 19, employeeRate: '90%', storeRate: '95%', targetActivityCount: 3 },
    { id: 'TGT-2026-005', type: '系列目标-按金额', targetAmount: '¥800,000', targetEmployees: 250, targetStores: 25, completedEmployees: 210, completedStores: 22, employeeRate: '84%', storeRate: '88%', targetActivityCount: 5 },
  ];

  const openTargetActivityModal = (item: any) => {
    setSelectedTarget(item);
    setShowTargetActivityModal(true);
  };

  const targetActivities = [
    { name: '2026春季感冒药专项激励', type: '单品销售激励', time: '2026-03-01 至 2026-05-31', status: '进行中' },
    { name: '维C银翘片季度达成奖励', type: '目标达成激励', time: '2026-04-01 至 2026-06-30', status: '未开始' },
    { name: '品牌周联动促销活动', type: '关联销售激励', time: '2026-03-15 至 2026-03-22', status: '已结束' },
    { name: '新店开业全品类大促', type: '单品销售激励', time: '2026-04-10 至 2026-04-20', status: '进行中' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 space-y-6 bg-gray-50 min-h-full pb-20"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-gray-800">目标管理维度</h2>
        <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center shadow-sm">
          <Download size={14} className="mr-1.5" />
          导出数据
        </button>
      </div>

      <div className="space-y-6">
        {mockData.map((item, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center">
                <div className="p-1.5 bg-blue-50 rounded text-blue-500 mr-2">
                  <BarChart3 size={16} />
                </div>
                <h3 className="font-bold text-gray-800">{item.type}</h3>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-sm text-gray-500">
                  目标活动数: 
                  <button 
                    onClick={() => openTargetActivityModal(item)}
                    className="ml-2 font-bold text-blue-600 hover:underline hover:text-blue-700 bg-blue-50 px-2 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    {item.targetActivityCount}个
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  目标量: <span className="font-bold text-gray-800 text-lg ml-1">{item.targetAmount}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 员工完成情况 */}
              <div className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-800 flex items-center">
                    <div className="p-1.5 bg-orange-50 rounded text-orange-500 mr-2">
                      <User size={16} />
                    </div>
                    员工完成情况
                  </h4>
                  <span className="text-xs text-gray-500">目标人数 {item.targetEmployees} 人</span>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4 flex justify-between items-center mb-5">
                  <span className="text-orange-600 font-medium">员工达成率</span>
                  <span className="text-2xl font-bold text-orange-600">{item.employeeRate}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">完成进度</span>
                    <span className="text-gray-800 font-medium">{item.completedEmployees} <span className="text-gray-400 text-xs font-normal">/ {item.targetEmployees} 人</span></span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: item.employeeRate }}></div>
                  </div>
                </div>
              </div>

              {/* 门店完成情况 */}
              <div className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-800 flex items-center">
                    <div className="p-1.5 bg-blue-50 rounded text-blue-500 mr-2">
                      <Store size={16} />
                    </div>
                    门店完成情况
                  </h4>
                  <span className="text-xs text-gray-500">目标门店数 {item.targetStores} 家</span>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 flex justify-between items-center mb-5">
                  <span className="text-blue-600 font-medium">门店达成率</span>
                  <span className="text-2xl font-bold text-blue-600">{item.storeRate}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">完成进度</span>
                    <span className="text-gray-800 font-medium">{item.completedStores} <span className="text-gray-400 text-xs font-normal">/ {item.targetStores} 家</span></span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: item.storeRate }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Target Activity Detail Modal */}
      {showTargetActivityModal && selectedTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden border border-gray-100"
          >
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mr-4 shadow-lg shadow-blue-200">
                  <ClipboardList size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">目标关联活动明细</h3>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setShowTargetActivityModal(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-gray-50 text-gray-500 font-bold text-[11px] uppercase tracking-wider border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 w-16 text-center">序号</th>
                      <th className="px-6 py-4">活动名称</th>
                      <th className="px-6 py-4">激励类型</th>
                      <th className="px-6 py-4">活动时间</th>
                      <th className="px-6 py-4 text-center">状态</th>
                      <th className="px-6 py-4 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {targetActivities.slice(0, selectedTarget.targetActivityCount).map((activity, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 text-center text-gray-500 font-mono italic">{idx + 1}</td>
                        <td className="px-6 py-4 text-gray-800 font-bold">{activity.name}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[11px] font-medium border border-blue-100">
                            {activity.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs tabular-nums">
                          {activity.time}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-1 rounded text-[11px] font-bold ${
                            activity.status === '进行中' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 
                            activity.status === '未开始' ? 'text-orange-600 bg-orange-50 border border-orange-100' : 
                            'text-gray-400 bg-gray-50 border border-gray-200'
                          }`}>
                            {activity.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button className="text-blue-600 hover:underline font-bold text-xs">管理</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">共 {selectedTarget.targetActivityCount} 个关联活动</span>
              <button 
                onClick={() => setShowTargetActivityModal(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 hover:text-gray-900 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                关闭界面
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};


const RobotAdoptionView = ({ 
  onNavigateToGroups, 
  onNavigateToPrivate,
  onNavigateToRewardWithOrder
}: { 
  onNavigateToGroups?: () => void, 
  onNavigateToPrivate?: () => void,
  onNavigateToRewardWithOrder?: (orderCode: string) => void
}) => {
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  
  const stats = [
    { label: '群聊机器人', value: '12', subValue: '共计群数', extraInfo: '共计 1500 人', icon: <MessageCircle className="text-blue-500" size={20} />, subClickable: true },
    { 
      label: '私聊机器人', 
      value: '1373', 
      subValue: '已添加人数', 
      icon: <User className="text-orange-500" size={20} />,
      clickable: true,
      subClickable: true, // Allow navigating to management via subLabel or just click
      extraStats: [
        { label: '大单来了/收益秘籍小程序点赞次数', value: '45.2k' }
      ]
    },
  ];

  const privateChatRoles = [
    { role: '老板', count: 1, likeCount: 15 },
    { role: '运营', count: 2, likeCount: 42 },
    { role: '区域经理', count: 4, likeCount: 128 },
    { role: '店长', count: 123, likeCount: 4205 },
    { role: '店员', count: 1243, likeCount: 40810 },
  ];

  const robotEmployees = [
    { id: 1, avatar: 'https://i.pravatar.cc/150?u=1', customerId: '7881300361932437', customerName: 'BOYSO', storeName: '97测试门店1', storeCode: '24637454324', company: '97测试集团', employeeName: '江国兴', employeeCode: '3055', gender: '男', role: '店员', status: '在职', isAdded: true },
    { id: 2, avatar: 'https://i.pravatar.cc/150?u=2', customerId: '7881299703911906', customerName: 'zlx____', storeName: '上海海典集团', storeCode: 'c_0', company: '上海海典集团', employeeName: '小周自动化员工账户41108', employeeCode: '1739165503571', gender: '女', role: '店员', status: '在职', isAdded: true },
    { id: 3, avatar: 'https://i.pravatar.cc/150?u=3', customerId: '7881299703911906', customerName: 'zlx____', storeName: '海典智慧药房双品汇店(直营)', storeCode: '20002', company: '上海海典智慧药店', employeeName: 'zlx', employeeCode: '318401', gender: '女', role: '运营', status: '在职', isAdded: true },
    { id: 4, avatar: 'https://i.pravatar.cc/150?u=4', customerId: '7881303047909341', customerName: '越来越菜', storeName: '海典智慧药房双品汇店(直营)', storeCode: '20002', company: '上海海典智慧药店', employeeName: 'zlx', employeeCode: '3184', gender: '男', role: '老板', status: '在职', isAdded: true },
    { id: 5, avatar: 'https://i.pravatar.cc/150?u=5', customerId: '7881302545221407', customerName: 'noone', storeName: '熊家店', storeCode: '1025', company: '上海海典集团', employeeName: '何晓妍', employeeCode: '20014', gender: '未知', role: '店长', status: '在职', isAdded: true },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 space-y-4 bg-gray-50 min-h-full"
    >
      {/* Module Title */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-gray-800">机器人普及</h2>
        <div className="text-xs text-gray-400">数据更新时间: 2026-03-18 08:31</div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
              <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">{stat.icon}</div>
              {stat.extraStats && (
                <div 
                  className="flex flex-col items-end cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors group/like"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (stat.extraStats?.[0].label === '大单来了/收益秘籍小程序点赞次数') {
                      setShowLikesModal(true);
                    }
                  }}
                >
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider group-hover/like:text-blue-500">{stat.extraStats[0].label}</span>
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-orange-500 group-hover/like:text-orange-600">{stat.extraStats[0].value}</span>
                    <ExternalLink size={10} className="ml-1 text-gray-300 opacity-0 group-hover/like:opacity-100 transition-opacity" />
                  </div>
                </div>
              )}
            </div>
            <div className="mt-3 relative z-10">
              <div 
                className={`text-2xl font-bold text-gray-800 ${(stat.clickable || stat.subClickable) ? 'cursor-pointer hover:text-blue-600 transition-colors inline-block' : ''}`}
                onClick={() => {
                  if (stat.clickable && stat.label === '私聊机器人') {
                    // Show modal for employees, but maybe user wants management? 
                    // Let's stick to showing modal if clickable is true, 
                    // and use subClickable for management navigation.
                    setShowEmployeeModal(true);
                  } else if (stat.clickable) {
                    setShowEmployeeModal(true);
                  }
                  
                  if (stat.subClickable) {
                    if (stat.label === '群聊机器人') onNavigateToGroups?.();
                    if (stat.label === '私聊机器人') onNavigateToPrivate?.();
                  }
                }}
              >
                {stat.value}
                {(stat.clickable || stat.subClickable) && <ExternalLink size={14} className="inline ml-1 mb-1 opacity-0 group-hover:opacity-100 transition-opacity" />}
              </div>
              <div className="text-xs text-gray-400 mt-1 flex justify-between">
                <span>
                  {stat.label} - 
                  {stat.subClickable ? (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (stat.label === '群聊机器人') onNavigateToGroups?.();
                        if (stat.label === '私聊机器人') onNavigateToPrivate?.();
                      }}
                      className="text-blue-500 hover:underline hover:text-blue-700 cursor-pointer font-bold ml-1 px-1 rounded hover:bg-blue-50 transition-colors"
                    >
                      {stat.subValue}
                    </button>
                  ) : (
                    <span className="ml-1">{stat.subValue}</span>
                  )}
                </span>
                {stat.extraInfo && <span>{stat.extraInfo}</span>}
              </div>
            </div>
            {stat.clickable && (
              <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">点击查看列表</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Private Chat Roles */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-700 flex items-center">
              <User size={16} className="mr-2 text-orange-500" />
              私聊机器人 - 职位分布
            </h3>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-medium">职位</th>
                  <th className="px-4 py-3 font-medium">已添加人数</th>
                  <th className="px-4 py-3 font-medium text-right whitespace-nowrap">大单来了/收益秘籍小程序点赞次数</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {privateChatRoles.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-700">{item.role}</td>
                    <td className="px-4 py-3 text-gray-600 font-medium">{item.count}</td>
                    <td className="px-4 py-3 text-orange-500 font-bold text-right">
                      <button 
                        onClick={() => setShowLikesModal(true)}
                        className="hover:underline hover:text-orange-600 transition-colors cursor-pointer"
                      >
                        {item.likeCount.toLocaleString()}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Added Robot Employees Modal */}
      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">已添加机器人员工列表</h3>
              <button 
                onClick={() => setShowEmployeeModal(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 flex flex-col space-y-4">
              {/* Notice */}
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex items-start text-xs text-orange-600">
                <Info size={14} className="mr-2 mt-0.5 shrink-0" />
                <span>注意：离职、未关联状态的员工信息将从此列表中移除</span>
              </div>

              {/* Filters */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-end gap-4">
                <div className="space-y-1 min-w-[200px]">
                  <label className="text-xs text-gray-500 font-bold">所属企业</label>
                  <select className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-blue-400">
                    <option>请选择</option>
                  </select>
                </div>
                <div className="space-y-1 min-w-[200px]">
                  <label className="text-xs text-gray-500 font-bold">员工</label>
                  <input type="text" placeholder="员工编号/员工姓名" className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm outline-none focus:border-blue-400" />
                </div>
                <div className="space-y-1 min-w-[200px]">
                  <label className="text-xs text-gray-500 font-bold">角色类型</label>
                  <select className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-blue-400">
                    <option>店员/店长/区域经理/运营/老板</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-6 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors">查询</button>
                  <button className="border border-gray-200 text-gray-600 px-6 py-1.5 rounded text-sm font-medium hover:bg-gray-50 transition-colors">重置</button>
                </div>
                <div className="flex-1 flex justify-end space-x-2">
                  <button className="border border-gray-200 text-gray-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-50 transition-colors flex items-center">
                    <Download size={14} className="mr-1.5" /> 导出
                    <ChevronDown size={14} className="ml-1" />
                  </button>
                  <button className="bg-white border border-blue-200 text-blue-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors">同步数据</button>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
                <div className="overflow-auto flex-1">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10 text-gray-500 text-[11px] uppercase tracking-wider font-bold border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 border-r border-gray-200 w-12 text-center">序号</th>
                        <th className="px-4 py-3 border-r border-gray-200">客户头像</th>
                        <th className="px-4 py-3 border-r border-gray-200">客户Id</th>
                        <th className="px-4 py-3 border-r border-gray-200">客户姓名</th>
                        <th className="px-4 py-3 border-r border-gray-200">所在门店</th>
                        <th className="px-4 py-3 border-r border-gray-200">所属企业</th>
                        <th className="px-4 py-3 border-r border-gray-200">员工姓名/编码</th>
                        <th className="px-4 py-3 border-r border-gray-200">客户性别</th>
                        <th className="px-4 py-3 border-r border-gray-200">角色类型</th>
                        <th className="px-4 py-3 border-r border-gray-200">在职状态</th>
                        <th className="px-4 py-3">是否添加机器人</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {robotEmployees.map((emp, index) => (
                        <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 border-r border-gray-100 text-gray-500 text-center">{index + 1}</td>
                          <td className="px-4 py-4 border-r border-gray-100 text-center">
                            <img src={emp.avatar} alt="avatar" className="w-10 h-10 rounded-lg mx-auto border border-gray-200 object-cover" referrerPolicy="no-referrer" />
                          </td>
                          <td className="px-4 py-4 border-r border-gray-100 font-mono text-gray-600">{emp.customerId}</td>
                          <td className="px-4 py-4 border-r border-gray-100 font-medium text-gray-800">{emp.customerName}</td>
                          <td className="px-4 py-4 border-r border-gray-100">
                            <div className="text-xs text-gray-700 font-medium">{emp.storeName}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">{emp.storeCode}</div>
                          </td>
                          <td className="px-4 py-4 border-r border-gray-100 text-gray-600">{emp.company}</td>
                          <td className="px-4 py-4 border-r border-gray-100">
                            <div className="text-xs text-gray-700 font-medium">{emp.employeeName}</div>
                            <div className="text-[11px] text-blue-500 font-mono mt-0.5">{emp.employeeCode}</div>
                          </td>
                          <td className="px-4 py-4 border-r border-gray-100 text-gray-600">{emp.gender}</td>
                          <td className="px-4 py-4 border-r border-gray-100 text-gray-600 italic font-medium">{emp.role}</td>
                          <td className="px-4 py-4 border-r border-gray-100">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]">{emp.status}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center text-green-500 font-bold text-xs">
                              <div className="w-1 h-1 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                              ● 已关联
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Placeholder */}
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
                   <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <span>共 1373 条</span>
                      <div className="w-px h-3 bg-gray-300 mx-2"></div>
                      <button className="px-2 py-1 rounded border border-gray-200 bg-white">&lt;</button>
                      <button className="px-2 py-1 rounded border border-blue-500 bg-blue-50 text-blue-600">1</button>
                      <button className="px-2 py-1 rounded border border-gray-200 bg-white">2</button>
                      <button className="px-2 py-1 rounded border border-gray-200 bg-white">...</button>
                      <button className="px-2 py-1 rounded border border-gray-200 bg-white">&gt;</button>
                   </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-white">
              <button 
                onClick={() => setShowEmployeeModal(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Likes Modal */}
      <AnimatePresence>
        {showLikesModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[70vh] flex flex-col overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center mr-3">
                      <ThumbsUp className="text-pink-500" size={18} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">大单来了/收益秘籍小程序点赞详情</h3>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 ml-11">统计所有对大单来了/收益秘籍小程序点赞的员工明细</p>
                </div>
                <div className="flex items-center space-x-3">
                   <button 
                    onClick={() => {
                      const headers = ['员工姓名', '员工编码', '角色', '所属机构', '点赞时间', 'Erp订单编码'];
                      const dataRows = [
                        ['张益达', '1739165503571', '店长', '海典智慧药房分店 A', '2026-03-24 10:15:22', 'ERP202603240001'],
                        ['李阿美', '1690003824994', '店员', '海典智慧药房分店 B', '2026-03-24 11:20:05', 'ERP202603240002'],
                        ['赵铁柱', '1709614917226', '执业药师', '海典智慧药房分店 C', '2026-03-24 09:05:12', 'ERP202603240003'],
                        ['周日明', 'EMP1004', '店长', '海典大药房', '2026-03-23 13:16:35', 'ERP202603230004'],
                        ['王小芬', 'EMP1005', '收银员', '双品汇店', '2026-03-23 15:42:10', 'ERP202603230005'],
                        ['马建国', 'EMP1006', '店长', '分店 D', '2026-03-22 08:20:15', 'ERP202603220006'],
                        ['刘晓丽', 'EMP1007', '店员', '分店 E', '2026-03-22 14:11:30', 'ERP202603220007'],
                        ['孙悟空', 'EMP1888', '配送员', '总店', '2026-03-21 17:00:00', 'ERP202603210008'],
                      ];
                      const csvContent = [headers.join(',')].concat(dataRows.map(row => row.join(','))).join('\n');
                      const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
                      const link = document.createElement("a");
                      const url = URL.createObjectURL(blob);
                      link.setAttribute("href", url);
                      link.setAttribute("download", `大单来了_收益秘籍小程序点赞详情.csv`);
                      link.style.visibility = 'hidden';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    <Download size={14} className="mr-2" />
                    导出表格数据
                  </button>
                  <button onClick={() => setShowLikesModal(false)} className="bg-gray-100 p-2 rounded-full text-gray-400 hover:bg-gray-200 transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-auto p-4 bg-gray-50/50">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#fcfdfe] text-gray-500 font-bold text-[11px] uppercase tracking-wider sticky top-0 z-10 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4">员工姓名</th>
                        <th className="px-6 py-4">员工编码</th>
                        <th className="px-6 py-4">职位角色</th>
                        <th className="px-6 py-4">所属机构</th>
                        <th className="px-6 py-4">点赞时间</th>
                        <th className="px-6 py-4">Erp订单编码</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[
                        { name: '张益达', code: '1739165503571', role: '店长', org: '海典智慧药房分店 A', time: '2026-03-24 10:15:22', erpOrderCode: 'ERP202603240001' },
                        { name: '李阿美', code: '1690003824994', role: '店员', org: '海典智慧药房分店 B', time: '2026-03-24 11:20:05', erpOrderCode: 'ERP202603240002' },
                        { name: '赵铁柱', code: '1709614917226', role: '执业药师', org: '海典智慧药房分店 C', time: '2026-03-24 09:05:12', erpOrderCode: 'ERP202603240003' },
                        { name: '周日明', code: 'EMP1004', role: '店长', org: '海典大药房', time: '2026-03-23 13:16:35', erpOrderCode: 'ERP202603230004' },
                        { name: '王小芬', code: 'EMP1005', role: '收银员', org: '双品汇店', time: '2026-03-23 15:42:10', erpOrderCode: 'ERP202603230005' },
                        { name: '马建国', code: 'EMP1006', role: '店长', org: '分店 D', time: '2026-03-22 08:20:15', erpOrderCode: 'ERP202603220006' },
                        { name: '刘晓丽', code: 'EMP1007', role: '店员', org: '分店 E', time: '2026-03-22 14:11:30', erpOrderCode: 'ERP202603220007' },
                        { name: '孙悟空', code: 'EMP1888', role: '配送员', org: '总店', time: '2026-03-21 17:00:00', erpOrderCode: 'ERP202603210008' },
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-800">{item.name}</div>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-blue-500 font-bold">{item.code}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold border border-gray-200">
                              {item.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 font-medium">{item.org}</td>
                          <td className="px-6 py-4 text-[10px] text-gray-400 font-mono tracking-tight">{item.time}</td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => {
                                setShowLikesModal(false);
                                onNavigateToRewardWithOrder?.(item.erpOrderCode);
                              }}
                              className="text-blue-600 hover:underline font-mono text-xs font-bold"
                            >
                              {item.erpOrderCode}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-white shadow-sm z-20">
                <div className="text-xs text-gray-400">
                  当前显示 <span className="font-bold text-gray-800">8</span> 条数据
                </div>
                <button onClick={() => setShowLikesModal(false)} className="px-8 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all">
                  确认
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PrivateChatManagementView = () => {
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState<any>(null);

  const robots = [
    { 
      name: '智能助手-小星', 
      status: '运行中', 
      likeCount: 1373, 
      userCount: 856, 
      messageCount: 15420,
      createTime: '2025-10-15 08:30:00'
    },
    { 
      name: '慢病管家-小医', 
      status: '运行中', 
      likeCount: 942, 
      userCount: 517, 
      messageCount: 8230,
      createTime: '2025-11-20 10:15:30'
    }
  ];

  const likeDetails = [
    { name: '张益达', code: '1739165503571', role: '店长', org: '海典智慧药房分店 A', time: '2026-03-24 10:15:22' },
    { name: '李阿美', code: '1690003824994', role: '店员', org: '海典智慧药房分店 B', time: '2026-03-24 11:20:05' },
    { name: '赵铁柱', code: '1709614917226', role: '执业药师', org: '海典智慧药房分店 C', time: '2026-03-24 09:05:12' },
    { name: '周日明', code: 'EMP1004', role: '店长', org: '海典大药房', time: '2026-03-23 13:16:35' },
    { name: '王小芬', code: 'EMP1005', role: '收银员', org: '双品汇店', time: '2026-03-23 15:42:10' },
    { name: '马建国', code: 'EMP1006', role: '店长', org: '分店 D', time: '2026-03-22 08:20:15' },
    { name: '刘晓丽', code: 'EMP1007', role: '店员', org: '分店 E', time: '2026-03-22 14:11:30' },
    { name: '孙悟空', code: 'EMP1888', role: '配送员', org: '总店', time: '2026-03-21 17:00:00' },
  ];

  const handleExport = () => {
    const headers = ['员工姓名', '员工编码', '角色', '所属机构', '点赞时间'];
    const csvContent = [headers.join(',')].concat(
      likeDetails.map(item => `${item.name},${item.code},${item.role},\"${item.org}\",${item.time}`)
    ).join('\n');
    
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `大单来了_收益秘籍小程序点赞详情_${selectedRobot?.name || ''}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">私聊机器人管理</h2>
          <p className="text-sm text-gray-500 mt-1 flex items-center">
            <Info size={14} className="mr-1 text-blue-400" />
            查看私聊机器人的运营数据及其被员工进行了大单来了/收益秘籍小程序点赞、使用的明细统计
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            数据看板
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            <Plus size={16} className="mr-2" />
            创建机器人
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: '活跃机器人', value: '2', unit: '个', icon: <MessageSquare size={20} className="text-blue-500" />, bg: 'bg-blue-50' },
          { label: '大单来了/收益秘籍小程序点赞次数', value: '2,315', unit: '次', icon: <ThumbsUp size={20} className="text-pink-500" />, bg: 'bg-pink-50' },
          { label: '服务覆盖人数', value: '1,373', unit: '人', icon: <Users size={20} className="text-purple-500" />, bg: 'bg-purple-50' },
          { label: '处理会话数', value: '23,640', unit: '条', icon: <MessageCircle size={20} className="text-green-500" />, bg: 'bg-green-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center">
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mr-4`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">{stat.label}</p>
              <div className="flex items-baseline">
                <span className="text-2xl font-black text-gray-800">{stat.value}</span>
                <span className="text-[10px] text-gray-400 ml-1">{stat.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">机器人列表</h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input type="text" placeholder="搜索机器人名称..." className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-400 w-64" />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fcfdfe] text-gray-400 font-bold text-[10px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b">机器人名称</th>
                <th className="px-6 py-4 border-b">状态</th>
                <th className="px-6 py-4 border-b">大单来了/收益秘籍小程序点赞次数</th>
                <th className="px-6 py-4 border-b">使用人数</th>
                <th className="px-6 py-4 border-b">累计消息数</th>
                <th className="px-6 py-4 border-b">创建时间</th>
                <th className="px-6 py-4 border-b text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-600 font-medium">
              {robots.map((robot, idx) => (
                <tr key={idx} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-xl flex items-center justify-center mr-3 shadow-md shadow-blue-100">
                        <MessageSquare size={18} />
                      </div>
                      <span className="font-bold text-gray-800">{robot.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center px-2 py-1 rounded-full bg-green-50 text-green-600 text-[10px] w-fit font-black border border-green-100">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                      {robot.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => {
                        setSelectedRobot(robot);
                        setShowLikesModal(true);
                      }}
                      className="group/btn relative px-3 py-1 rounded-lg hover:bg-pink-50 transition-colors"
                    >
                      <div className="flex items-center space-x-1.5">
                        <ThumbsUp size={16} className="text-pink-400 group-hover/btn:scale-125 transition-transform" />
                        <span className="text-lg font-black text-gray-800">{robot.likeCount.toLocaleString()}</span>
                      </div>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                        点击查看详情
                      </div>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-black">{robot.userCount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-500">{robot.messageCount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-[10px] text-gray-400 font-mono">{robot.createTime}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-4">
                      <button className="text-blue-600 hover:text-blue-800 text-xs font-bold transition-colors">查看明细</button>
                      <button className="text-gray-400 hover:text-blue-500 transition-colors"><Edit3 size={16} /></button>
                      <button className="text-gray-300 hover:text-red-500 transition-colors"><X size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showLikesModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white relative">
                <div className="absolute left-0 top-0 w-1.5 h-full bg-pink-500"></div>
                <div>
                  <h3 className="text-xl font-black text-gray-800 flex items-center">
                    <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center mr-3">
                      <ThumbsUp className="text-pink-500" size={20} />
                    </div>
                    大单来了/收益秘籍小程序点赞明细
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 ml-13 flex items-center leading-none">
                    <span className="font-bold text-gray-600 mr-1">{selectedRobot?.name}</span> 的互动记录统计
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={handleExport}
                    className="flex items-center bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    <Download size={16} className="mr-2" />
                    导出表格
                  </button>
                  <button onClick={() => setShowLikesModal(false)} className="bg-gray-50 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30 scrollbar-thin scrollbar-thumb-gray-200">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#fcfdfe] text-gray-400 text-[10px] font-black uppercase tracking-widest sticky top-0 z-10 border-b border-gray-50">
                      <tr>
                        <th className="px-8 py-4">员工姓名</th>
                        <th className="px-8 py-4">员工编码</th>
                        <th className="px-8 py-4">职位角色</th>
                        <th className="px-8 py-4">所属机构</th>
                        <th className="px-8 py-4">点赞时间</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {likeDetails.map((item, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/10 transition-colors group">
                          <td className="px-8 py-4">
                            <div className="font-black text-gray-800 flex items-center">
                              <div className="w-2 h-2 bg-pink-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              {item.name}
                            </div>
                          </td>
                          <td className="px-8 py-4 font-mono text-blue-500 font-bold text-xs">{item.code}</td>
                          <td className="px-8 py-4">
                            <span className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-black border border-gray-100 italic">
                              {item.role}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-gray-600 text-xs font-medium">{item.org}</td>
                          <td className="px-8 py-4 text-gray-400 text-[11px] font-mono">{item.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="px-8 py-4 border-t border-gray-100 bg-white flex justify-between items-center">
                <div className="text-xs font-medium text-gray-400">
                  当前显示 <span className="text-gray-700 font-black">{likeDetails.length}</span> 条记录
                </div>
                <button 
                  onClick={() => setShowLikesModal(false)} 
                  className="px-8 py-2 bg-gray-50 text-gray-600 rounded-xl text-sm font-black hover:bg-gray-100 transition-colors"
                >
                  我知道了
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GroupChatManagementView = () => {
  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">群聊机器人管理</h2>
          <p className="text-sm text-gray-500 mt-1 flex items-center">
            <Info size={14} className="mr-1 text-blue-400" />
            配置并管理企微群聊中的智能助手，提升社群互动率
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100">
          <Plus size={16} className="mr-2" />
          创建群机器人
        </button>
      </div>
      
      <div className="bg-white rounded-3xl border border-gray-100 p-12 flex flex-col items-center justify-center shadow-sm">
        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
          <MessageCircle size={40} className="text-blue-400 opacity-40" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">正在建设中</h3>
        <p className="max-w-sm text-center text-gray-400 text-sm leading-relaxed">
          群聊管理模块即将上线。届时您将可以实现机器人入群授权、关键词自动回复、实时活跃度监控等核心功能，敬请期待。
        </p>
        <button className="mt-8 px-8 py-2.5 bg-gray-50 text-blue-600 rounded-xl text-sm font-bold border border-blue-50 hover:bg-blue-50 transition-colors">
          先去配置私聊机器人
        </button>
      </div>
    </div>
  );
};


const StaffCircleInteractionView = ({ onNavigate }: { onNavigate?: (subItem: string) => void }) => {
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showSharesModal, setShowSharesModal] = useState(false);

  const LIKE_DETAILS = [
    { name: '王晓明', code: 'EMP001', store: '长沙旗舰店', time: '2026-03-23 10:30:15' },
    { name: '李华', code: 'EMP005', store: '岳麓山店', time: '2026-03-23 11:45:22' },
    { name: '张强', code: 'EMP008', store: '五一坊店', time: '2026-03-23 14:20:00' },
    { name: '赵敏', code: 'EMP012', store: '洋湖大道店', time: '2026-03-23 16:10:05' },
    { name: '钱多多', code: 'EMP015', store: '天心阁店', time: '2026-03-23 17:30:40' },
  ];

  const SHARE_DETAILS = [
    { name: '刘洋', code: 'EMP002', store: '河西步步高店', time: '2026-03-23 09:15:30' },
    { name: '陈洁', code: 'EMP010', store: '梅溪湖店', time: '2026-03-23 13:50:45' },
    { name: '孙伟', code: 'EMP018', store: '烈士公园店', time: '2026-03-23 15:25:12' },
  ];

  const handleDownload = (data: any[], filename: string) => {
    // Mock download behavior
    console.log(`Downloading ${filename}...`, data);
    alert(`数据已准备好下载：${filename}`);
  };

  const DetailModal = ({ 
    isOpen, 
    onClose, 
    title, 
    data, 
    timeLabel 
  }: { 
    isOpen: boolean, 
    onClose: () => void, 
    title: string, 
    data: any[], 
    timeLabel: string 
  }) => (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-800">{title}明细</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">共 {data.length} 条记录</span>
                <button 
                  onClick={() => handleDownload(data, `${title}列表.csv`)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  <Download size={16} />
                  <span>下载数据</span>
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 font-semibold">员工姓名</th>
                      <th className="px-4 py-3 font-semibold">员工编码</th>
                      <th className="px-4 py-3 font-semibold">所属门店</th>
                      <th className="px-4 py-3 font-semibold">{timeLabel}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {data.map((item, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3 font-mono text-xs">{item.code}</td>
                        <td className="px-4 py-3">{item.store}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{item.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const stats = [
    { 
      label: '晒单数', 
      value: '1,245', 
      icon: <FileText className="text-blue-500" size={20} />,
      onClick: () => onNavigate?.('晒单管理')
    },
    { 
      label: '点赞数', 
      value: '8,432', 
      icon: <ThumbsUp className="text-red-500" size={20} />,
      onClick: () => setShowLikesModal(true)
    },
    { 
      label: '转发数', 
      value: '3,102', 
      icon: <Share2 className="text-green-500" size={20} />,
      onClick: () => setShowSharesModal(true)
    },
    { 
      label: '评论数', 
      value: '5,621', 
      icon: <MessageSquare className="text-purple-500" size={20} />,
      onClick: () => onNavigate?.('评论管理')
    },
    { 
      label: '激励金额', 
      value: '￥12,500.00', 
      icon: <Package className="text-orange-500" size={20} />,
      onClick: () => onNavigate?.('奖励明细')
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 space-y-4 bg-gray-50 min-h-full"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-gray-800">店员圈互动</h2>
        <div className="text-xs text-gray-400">数据更新时间: 2026-03-26 23:24</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            onClick={stat.onClick}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 cursor-pointer transition-all flex flex-col items-center justify-center text-center group"
          >
            <div className="p-3 bg-gray-50 rounded-full mb-3 group-hover:bg-blue-50 transition-colors">
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <DetailModal 
        isOpen={showLikesModal} 
        onClose={() => setShowLikesModal(false)} 
        title="点赞" 
        data={LIKE_DETAILS} 
        timeLabel="点赞时间" 
      />

      <DetailModal 
        isOpen={showSharesModal} 
        onClose={() => setShowSharesModal(false)} 
        title="转发" 
        data={SHARE_DETAILS} 
        timeLabel="转发时间" 
      />
    </motion.div>
  );
};

const EmployeeUsageView = () => {
  const [showUnloggedModal, setShowUnloggedModal] = useState(false);

  const unloggedEmployees = [
    { name: '张三', id: 'EMP001', org: '海典大药房-上海分店', role: '店员' },
    { name: '李四', id: 'EMP002', org: '海典大药房-北京分店', role: '店长' },
    { name: '王五', id: 'EMP003', org: '海典大药房-广州分店', role: '运营' },
    { name: '赵六', id: 'EMP004', org: '海典大药房-深圳分店', role: '店员' },
    { name: '钱七', id: 'EMP005', org: '海典大药房-杭州分店', role: '店员' },
    { name: '孙八', id: 'EMP006', org: '海典大药房-南京分店', role: '店员' },
    { name: '周九', id: 'EMP007', org: '海典大药房-武汉分店', role: '店员' },
    { name: '吴十', id: 'EMP008', org: '海典大药房-成都分店', role: '店员' },
  ];

  const handleExport = () => {
    console.log('Exporting unlogged employees data...');
    // In a real app, this would trigger a download
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 space-y-4 bg-gray-50 min-h-full"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-gray-800">员工使用情况</h2>
        <div className="text-xs text-gray-400">数据更新时间: 2026-03-26 23:28</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 登录情况 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center">
            <div className="p-1.5 bg-blue-50 rounded text-blue-500 mr-2">
              <LogIn size={16} />
            </div>
            <h3 className="font-bold text-gray-800">登录情况</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-sm text-gray-500 mb-1">登录人数</div>
                <div className="text-xl font-bold text-gray-800">856 <span className="text-xs font-normal text-gray-500">人</span></div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-sm text-gray-500 mb-1">连锁员工总数</div>
                <div className="text-xl font-bold text-gray-800">1,129 <span className="text-xs font-normal text-gray-500">人</span></div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 flex justify-between items-center">
              <span className="text-blue-600 font-medium">登录率</span>
              <span className="text-2xl font-bold text-blue-600">75.8%</span>
            </div>

            <button 
              onClick={() => setShowUnloggedModal(true)}
              className="w-full py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
            >
              <User size={14} className="mr-1.5" />
              查看未登录人员名单
            </button>
          </div>
        </div>

        {/* 提现情况 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center">
            <div className="p-1.5 bg-orange-50 rounded text-orange-500 mr-2">
              <Wallet size={16} />
            </div>
            <h3 className="font-bold text-gray-800">提现情况</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-500 mb-1">未提现金额 (总)</div>
              <div className="text-2xl font-bold text-gray-800">￥45,230.50</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-500 mb-1">一次也没提现人数</div>
              <div className="text-xl font-bold text-gray-800">342 <span className="text-xs font-normal text-gray-500">人</span></div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4 flex justify-between items-center">
              <span className="text-orange-600 font-medium">提现率</span>
              <span className="text-2xl font-bold text-orange-600">69.7%</span>
            </div>
          </div>
        </div>

        {/* 认证情况 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center">
            <div className="p-1.5 bg-green-50 rounded text-green-500 mr-2">
              <ShieldCheck size={16} />
            </div>
            <h3 className="font-bold text-gray-800">认证情况</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-sm text-gray-500 mb-1">完成随心看认证人数</div>
              <div className="text-2xl font-bold text-gray-800">1,050 <span className="text-xs font-normal text-gray-500">人</span></div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 flex justify-between items-center mt-auto">
              <span className="text-green-600 font-medium">认证率</span>
              <span className="text-2xl font-bold text-green-600">93.0%</span>
            </div>
            
            <div className="space-y-2 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">认证进度</span>
                <span className="text-gray-800 font-medium">1,050 <span className="text-gray-400 text-xs font-normal">/ 1,129 人</span></span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '93%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unlogged Employees Modal */}
      {showUnloggedModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col"
          >
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <User size={20} className="mr-2 text-blue-500" />
                未登录人员名单
              </h3>
              <button onClick={() => setShowUnloggedModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-gray-500">
                  共计 <span className="font-bold text-blue-600">273</span> 名员工未登录
                </div>
                <button 
                  onClick={handleExport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center shadow-sm transition-all active:scale-95"
                >
                  <Download size={16} className="mr-2" />
                  一键导出数据
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4">员工信息</th>
                      <th className="px-6 py-4">员工编号</th>
                      <th className="px-6 py-4">所属机构</th>
                      <th className="px-6 py-4">角色</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {unloggedEmployees.map((emp, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                              {emp.name.charAt(0)}
                            </div>
                            <span className="text-gray-800 font-medium">{emp.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-mono">{emp.id}</td>
                        <td className="px-6 py-4 text-gray-600">{emp.org}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                            {emp.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50/50 rounded-b-xl">
              <button 
                onClick={() => setShowUnloggedModal(false)}
                className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

const HomeView = ({ 
  onActivityClick,
  onNavigate,
  onNavigateToRewardDetails,
  onNavigateToRobotGroups,
  onNavigateToRobotPrivate,
  onNavigateToRewardWithOrder
}: { 
  onActivityClick?: (id: string) => void,
  onNavigate?: (subItem: string) => void,
  onNavigateToRewardDetails?: (filters: { startDate: string, endDate: string, rewardType: string }) => void,
  onNavigateToRobotGroups?: () => void,
  onNavigateToRobotPrivate?: () => void,
  onNavigateToRewardWithOrder?: (orderCode: string) => void
}) => {
  const [activeTab, setActiveTab] = useState('品种维度');
  const [timeField, setTimeField] = useState('订单创建时间');
  const [startDate, setStartDate] = useState('2026-04-01');
  const [endDate, setEndDate] = useState('2026-04-21');

  const handleReset = () => {
    setStartDate('2026-04-01');
    setEndDate('2026-04-21');
    setTimeField('订单创建时间');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white px-4 border-b border-gray-200 flex items-center overflow-x-auto no-scrollbar">
        <TabItem label="品种维度" active={activeTab === '品种维度'} onClick={() => setActiveTab('品种维度')} />
        <TabItem label="活动政策维度" active={activeTab === '活动政策维度'} onClick={() => setActiveTab('活动政策维度')} />
        <TabItem label="活动激励发放" active={activeTab === '活动激励发放'} onClick={() => setActiveTab('活动激励发放')} />
        <TabItem label="目标管理维度" active={activeTab === '目标管理维度'} onClick={() => setActiveTab('目标管理维度')} />
        <TabItem label="机器人普及" active={activeTab === '机器人普及'} onClick={() => setActiveTab('机器人普及')} />
        <TabItem label="店员圈互动" active={activeTab === '店员圈互动'} onClick={() => setActiveTab('店员圈互动')} />
        <TabItem label="员工使用情况" active={activeTab === '员工使用情况'} onClick={() => setActiveTab('员工使用情况')} />
      </div>

      <div className="bg-gray-50 px-4 pt-4">
        <GenericTableFilter 
          initialTimeField={timeField}
          initialStartDate={startDate}
          initialEndDate={endDate}
          onQuery={(data) => {
            setTimeField(data.timeField);
            setStartDate(data.startDate);
            setEndDate(data.endDate);
          }}
          onReset={handleReset}
        />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === '品种维度' ? <VarietyDimensionView onActivityClick={onActivityClick} /> : 
         activeTab === '活动政策维度' ? <ActivityDimensionView onActivityClick={onActivityClick} /> : 
         activeTab === '活动激励发放' ? (
           <IncentiveDistributionView 
             onNavigateToDetails={(filters) => 
               onNavigateToRewardDetails?.({ 
                 ...filters, 
                 startDate, 
                 endDate 
               })
             } 
           />
         ) :
         activeTab === '目标管理维度' ? <TargetManagementDimensionView /> :
          activeTab === '机器人普及' ? <RobotAdoptionView 
            onNavigateToGroups={onNavigateToRobotGroups} 
            onNavigateToPrivate={onNavigateToRobotPrivate} 
            onNavigateToRewardWithOrder={onNavigateToRewardWithOrder}
          /> :
         activeTab === '店员圈互动' ? (
           <StaffCircleInteractionView 
             onNavigate={onNavigate} 
           />
         ) :
         activeTab === '员工使用情况' ? <EmployeeUsageView /> :
         <IncentiveDistributionView />}
      </div>
    </div>
  );
};

const ProductRatioInput = ({ initialRatio, onSave, isManual }: { initialRatio: string, onSave: (ratio: string) => void, isManual?: boolean }) => {
  const [ratio, setRatio] = useState(initialRatio);
  const [isEditing, setIsEditing] = useState(isManual && !initialRatio);

  const handleSave = () => {
    let numStr = ratio.trim();
    if (!numStr) {
      alert('请输入商品激励比例');
      return;
    }
    let isPercent = false;
    if (numStr.endsWith('%')) {
      isPercent = true;
      numStr = numStr.slice(0, -1);
    }
    const val = parseFloat(numStr);
    if (isNaN(val)) {
      alert('请输入有效的数字');
      return;
    }
    
    const decimalVal = isPercent ? val / 100 : val;
    if (decimalVal < 0 || decimalVal > 1) {
      alert('商品激励比例最小值为0，最大值为100%');
      return;
    }

    onSave(ratio);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <span>{ratio || '-'}</span>
        <button 
          onClick={() => setIsEditing(true)}
          className="px-2 py-1 text-xs text-blue-600 hover:text-blue-700"
        >
          编辑
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <input 
        type="text" 
        value={ratio} 
        onChange={(e) => setRatio(e.target.value)} 
        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm outline-none focus:border-blue-400"
      />
      <button 
        onClick={handleSave}
        className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
      >
        保存
      </button>
    </div>
  );
};

const SingleProductIncentiveModal = ({ 
  onClose, 
  onSave 
}: { 
  onClose: () => void; 
  onSave: (policy: any) => void;
}) => {
  const [isTiered, setIsTiered] = useState(false);
  const [thresholdType, setThresholdType] = useState('none');
  const [marginThreshold, setMarginThreshold] = useState('30');
  const [calcType, setCalcType] = useState('quantity'); // 按商品数量

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-[1200px] max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">新增单品销售激励政策</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar bg-gray-50/30">
          {/* Section: Select Products */}
          <div className="bg-white p-4 rounded border border-gray-100">
            <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center">
              激励商品 <span className="text-xs font-normal text-gray-400 ml-2">可选择多个商品批量设置激励</span>
            </h4>
            <button className="flex items-center text-blue-600 text-sm hover:underline">
              <Plus size={16} className="mr-1" /> 选择激励商品
            </button>
          </div>

          {/* Section: Rules */}
          <div className="bg-white p-4 rounded border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-800 flex items-center">
                设置单品激励规则 <span className="text-xs font-normal text-gray-400 ml-2">按销售数量计算</span>
              </h4>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <span className="text-sm text-gray-600 w-24">激励方式</span>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      checked={!isTiered} 
                      onChange={() => setIsTiered(false)} 
                      className="mr-2"
                    />
                    <span className="text-sm">无阶梯</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      checked={isTiered} 
                      onChange={() => setIsTiered(true)} 
                      className="mr-2"
                    />
                    <span className="text-sm">有阶梯</span>
                  </label>
                </div>
              </div>

              {isTiered && (
                <div className="flex items-center space-x-6">
                  <span className="text-sm text-gray-600 w-24">统计周期</span>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="term" className="mr-2" defaultChecked />
                      <span className="text-sm">按单张小票</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="term" className="mr-2" />
                      <span className="text-sm">按活动周期</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="term" className="mr-2" />
                      <span className="text-sm">按店员/门店/区域销售</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="bg-orange-50 border border-orange-100 rounded px-3 py-2 flex items-center space-x-2">
                <Info size={14} className="text-orange-400" />
                <span className="text-xs text-orange-600">
                  {isTiered 
                    ? "阶梯将按照活动周期内该连锁所有活动门店的销售数量累计计算；示例：当活动周期内品种累计销量达到阶梯时，对应的店员、店长、片区经理，均可获得对应激励。"
                    : "单张小票销售数量2件，店员每件奖励5元，奖励共10元。"}
                </span>
              </div>

              {/* Table for Rewards */}
              <div className="border border-gray-200 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="text-gray-500 font-medium">
                      <th className="px-4 py-3 text-left w-64">{isTiered ? "销售件数" : "销售件数"}</th>
                      <th className="px-4 py-3 text-left"><span className="text-red-500">*</span> 店员每件激励</th>
                      <th className="px-4 py-3 text-left">店长每件激励</th>
                      <th className="px-4 py-3 text-left">区域经理每件激励</th>
                      <th className="px-4 py-3 text-left">连锁抽佣每件激励</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        {isTiered ? (
                          <div className="flex items-center space-x-2">
                            <span>销售</span>
                            <input type="text" className="w-16 border rounded px-2 py-1 outline-none focus:border-blue-400" defaultValue="1" />
                            <span>件至</span>
                            <input type="text" className="w-16 border rounded px-2 py-1 outline-none focus:border-blue-400" defaultValue="3" />
                            <span>件</span>
                          </div>
                        ) : (
                          <span>每销售1件</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center border border-gray-300 rounded px-2 py-1 w-32 focus-within:border-blue-400 transition-colors">
                          <input type="text" placeholder="请输入" className="w-full outline-none" />
                          <span className="text-gray-400 ml-1">元</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center border border-gray-300 rounded px-2 py-1 w-32">
                          <input type="text" placeholder="请输入" className="w-full outline-none" />
                          <span className="text-gray-400 ml-1">元</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center border border-gray-300 rounded px-2 py-1 w-32">
                          <input type="text" placeholder="请输入" className="w-full outline-none" />
                          <span className="text-gray-400 ml-1">元</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center border border-gray-300 rounded px-2 py-1 w-32">
                          <input type="text" placeholder="请输入" className="w-full outline-none" />
                          <span className="text-gray-400 ml-1">元</span>
                        </div>
                      </td>
                    </tr>
                    {isTiered && (
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-4" colSpan={5}>
                          <button className="text-blue-600 flex items-center text-xs hover:underline">
                            <Plus size={14} className="mr-1" /> 添加阶梯
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="text-[10px] text-red-400">注：店员角色激励必填，其他角色可不填写</div>

              {/* Incentive Threshold Section */}
              <div className="space-y-4">
                <div className="flex items-start space-x-6">
                  <span className="text-sm text-gray-600 w-24 pt-1">激励门槛</span>
                  <div className="flex-1 space-y-4">
                    <p className="text-[10px] text-gray-400">
                      商品实际销售单价低于XX元或小于标价XX%则不发放激励，无门槛则不设置，配置最大值，商品实际销售单价高于XX元或高于标价XX%则不发放激励。
                    </p>
                    
                    <div className="space-y-4">
                      {/* Original Options */}
                      <div className="flex items-center space-x-4">
                        <input 
                          type="radio" 
                          name="threshold" 
                          checked={thresholdType === 'range'} 
                          onChange={() => setThresholdType('range')} 
                        />
                        <div className={`flex items-center space-x-2 ${thresholdType !== 'range' && 'opacity-50'}`}>
                          <input type="text" className="w-20 border rounded px-2 py-1 text-sm outline-none" disabled={thresholdType !== 'range'} />
                          <span className="text-sm text-gray-500">元 ≤ 实付销售金额 ≤</span>
                          <input type="text" className="w-20 border rounded px-2 py-1 text-sm outline-none" disabled={thresholdType !== 'range'} />
                          <span className="text-sm text-gray-500">元，发放激励。</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <input 
                          type="radio" 
                          name="threshold" 
                          checked={thresholdType === 'ratio'} 
                          onChange={() => setThresholdType('ratio')} 
                        />
                        <div className={`flex items-center space-x-2 ${thresholdType !== 'ratio' && 'opacity-50'}`}>
                          <span className="text-sm text-gray-500">标价</span>
                          <input type="text" className="w-16 border rounded px-2 py-1 text-sm outline-none" disabled={thresholdType !== 'ratio'} />
                          <span className="text-sm text-gray-500">% ≤ 实付销售金额 ≤ 标价</span>
                          <input type="text" className="w-16 border rounded px-2 py-1 text-sm outline-none" disabled={thresholdType !== 'ratio'} />
                          <span className="text-sm text-gray-500">%，发放激励。</span>
                        </div>
                      </div>

                      {/* NEW OPTION: 毛利率 */}
                      <div className="flex items-center space-x-4">
                        <input 
                          type="radio" 
                          name="threshold" 
                          checked={thresholdType === 'margin'} 
                          onChange={() => setThresholdType('margin')} 
                        />
                        <div className={`flex items-center space-x-2 ${thresholdType !== 'margin' && 'opacity-50'}`}>
                          <span className="text-sm text-gray-500 font-bold text-blue-600">毛利率 ≥</span>
                          <div className="flex items-center border border-gray-300 rounded px-2 py-1 w-24 bg-white focus-within:border-blue-400">
                            <input 
                              type="text" 
                              value={marginThreshold}
                              onChange={(e) => setMarginThreshold(e.target.value)}
                              className="w-full text-sm outline-none" 
                              disabled={thresholdType !== 'margin'}
                            />
                            <span className="text-gray-400 ml-1 text-xs">%</span>
                          </div>
                          <span className="text-sm text-gray-500">，发放激励。</span>
                          <span className="text-[10px] text-gray-400 italic ml-2">(毛利率 = (实价 - 进价) / 实价 × 100%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-4">
          <button 
            onClick={onClose}
            className="px-8 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-white"
          >
            取消
          </button>
          <button 
            onClick={onClose} // Just close for now
            className="px-8 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

function CreateActivityView({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showTargetProductModal, setShowTargetProductModal] = useState(false);
  const [policies, setPolicies] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    employeeIncentive: '扣连锁汇付账号',
    serviceFee: '扣连锁汇付账号',
    associatedIndustry: '',
    activityTitle: '',
    incentiveMode: '及时豆模式',
    incentiveCalculation: '按商品数量',
    associatedTarget: '',
    rebateRule: '按超额分段补发',
    rewardProtectionPeriod: 0,
    startTime: '',
    endTime: '',
    activityIntro: ''
  });

  const steps = ['创建活动信息', '配置激励政策', '活动商品', '活动门店'];

  const handleTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      associatedTarget: value,
      // When target is selected, set fixed dates
      ...(value === '0527测试' ? {
        startTime: '2027-01-01',
        endTime: '2027-12-31'
      } : {})
    }));
  };

  return (
    <div className="p-0 bg-gray-50 min-h-full flex flex-col">
      {showTargetProductModal && (
        <TargetProductIncentiveModal 
          onClose={() => setShowTargetProductModal(false)}
          onSave={(data) => {
            console.log('Saved incentive:', data);
            setShowTargetProductModal(false);
          }}
        />
      )}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center">
          <button onClick={onBack} className="text-gray-600 hover:text-blue-600 flex items-center mr-4">
            <ChevronLeft size={18} className="mr-1" /> 返回
          </button>
          <div className="w-px h-4 bg-gray-300 mx-3" />
          <h2 className="text-sm font-bold text-gray-800">{step === 2 ? '活动详情' : '代厂家建活动'}</h2>
        </div>
      </div>

      <div className="bg-white px-12 py-8 shadow-sm">
        <div className="flex items-center max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center relative">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full text-lg z-10 ${step > i + 1 ? 'bg-blue-600 text-white' : step === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {i + 1}
                </div>
                <span className={`mt-2 text-sm whitespace-nowrap absolute top-12 left-1/2 -translate-x-1/2 ${step === i + 1 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-4 -mt-6 ${step > i + 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        {step === 1 ? (
          <div className="bg-white rounded-lg p-12 w-full max-w-4xl shadow-sm space-y-8">
            {/* 员工激励 */}
            <div className="grid grid-cols-12 gap-6 items-center">
              <label className="col-span-2 text-sm text-right text-gray-500"><span className="text-red-500 mr-1">*</span>员工激励</label>
              <div className="col-span-10 flex items-center space-x-12">
                <label className="flex items-center cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center mr-2 group-hover:border-blue-500">
                    {formData.employeeIncentive === '扣连锁汇付账号' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <input 
                    type="radio" 
                    name="employeeIncentive" 
                    className="hidden" 
                    checked={formData.employeeIncentive === '扣连锁汇付账号'}
                    onChange={() => setFormData({...formData, employeeIncentive: '扣连锁汇付账号'})}
                  />
                  <span className="text-sm text-gray-700">扣连锁汇付账号</span>
                </label>
                <label className="flex items-center cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center mr-2 group-hover:border-blue-500">
                    {formData.employeeIncentive === '扣厂家汇付账号' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <input 
                    type="radio" 
                    name="employeeIncentive" 
                    className="hidden"
                    checked={formData.employeeIncentive === '扣厂家汇付账号'}
                    onChange={() => setFormData({...formData, employeeIncentive: '扣厂家汇付账号'})}
                  />
                  <span className="text-sm text-gray-700">扣厂家汇付账号</span>
                </label>
              </div>
            </div>

            {/* 海典服务费 */}
            <div className="grid grid-cols-12 gap-6 items-center">
              <label className="col-span-2 text-sm text-right text-gray-500"><span className="text-red-500 mr-1">*</span>海典服务费</label>
              <div className="col-span-10 flex items-center space-x-12">
                <label className="flex items-center cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center mr-2 group-hover:border-blue-500">
                    {formData.serviceFee === '扣连锁汇付账号' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <input 
                    type="radio" 
                    name="serviceFee" 
                    className="hidden"
                    checked={formData.serviceFee === '扣连锁汇付账号'}
                    onChange={() => setFormData({...formData, serviceFee: '扣连锁汇付账号'})}
                  />
                  <span className="text-sm text-gray-700">扣连锁汇付账号</span>
                </label>
                <label className="flex items-center cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center mr-2 group-hover:border-blue-500">
                    {formData.serviceFee === '扣厂家汇付账号' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <input 
                    type="radio" 
                    name="serviceFee" 
                    className="hidden"
                    checked={formData.serviceFee === '扣厂家汇付账号'}
                    onChange={() => setFormData({...formData, serviceFee: '扣厂家汇付账号'})}
                  />
                  <span className="text-sm text-gray-700">扣厂家汇付账号</span>
                </label>
              </div>
            </div>

            {/* 关联工业 */}
            <div className="grid grid-cols-12 gap-6 items-center">
              <label className="col-span-2 text-sm text-right text-gray-500"><span className="text-red-500 mr-1">*</span>关联工业</label>
              <div className="col-span-6">
                <div className="relative">
                  <select 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm appearance-none bg-white focus:border-blue-500 outline-none"
                    value={formData.associatedIndustry}
                    onChange={(e) => setFormData({...formData, associatedIndustry: e.target.value})}
                  >
                    <option value="">请选择</option>
                    <option value="ind1">海典工业</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 活动主题 */}
            <div className="grid grid-cols-12 gap-6 items-center">
              <label className="col-span-2 text-sm text-right text-gray-500"><span className="text-red-500 mr-1">*</span>活动主题</label>
              <div className="col-span-6 relative">
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none pr-12" 
                  maxLength={30} 
                  placeholder="请输入"
                  value={formData.activityTitle}
                  onChange={(e) => setFormData({...formData, activityTitle: e.target.value})}
                />
                <span className="absolute right-3 top-2.5 text-xs text-gray-400">{formData.activityTitle.length}/30</span>
              </div>
            </div>

            {/* 激励模式 */}
            <div className="grid grid-cols-12 gap-6 items-start">
              <label className="col-span-2 text-sm text-right text-gray-500 pt-2"><span className="text-red-500 mr-1">*</span>激励模式</label>
              <div className="col-span-10 space-y-4">
                <label className="flex items-center cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center mr-2 group-hover:border-blue-500">
                    {formData.incentiveMode === '及时豆模式' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <input 
                    type="radio" 
                    name="incentiveMode" 
                    className="hidden"
                    checked={formData.incentiveMode === '及时豆模式'}
                    onChange={() => setFormData({...formData, incentiveMode: '及时豆模式'})}
                  />
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700 mr-2">及时豆模式，即时激励，实时向店员发放销售激励</span>
                    <span className="bg-orange-50 text-orange-500 text-[10px] px-2 py-0.5 rounded flex items-center">
                      <ThumbsUp size={10} className="mr-1" /> 推荐
                    </span>
                  </div>
                </label>
                <label className="flex items-center cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center mr-2 group-hover:border-blue-500">
                    {formData.incentiveMode === '延时豆模式' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <input 
                    type="radio" 
                    name="incentiveMode" 
                    className="hidden"
                    checked={formData.incentiveMode === '延时豆模式'}
                    onChange={() => setFormData({...formData, incentiveMode: '延时豆模式'})}
                  />
                  <span className="text-sm text-gray-700">延时豆模式，由连锁线下向店员结算销售激励</span>
                </label>
              </div>
            </div>

            {/* 激励计算 */}
            <div className="grid grid-cols-12 gap-6 items-center">
              <label className="col-span-2 text-sm text-right text-gray-500"><span className="text-red-500 mr-1">*</span>激励计算</label>
              <div className="col-span-10 flex items-center space-x-12">
                <label className="flex items-center cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center mr-2 group-hover:border-blue-500">
                    {formData.incentiveCalculation === '按商品数量' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <input 
                    type="radio" 
                    name="incentiveCalculation" 
                    className="hidden"
                    checked={formData.incentiveCalculation === '按商品数量'}
                    onChange={() => setFormData({...formData, incentiveCalculation: '按商品数量'})}
                  />
                  <span className="text-sm text-gray-700">按商品数量</span>
                </label>
                <label className="flex items-center cursor-pointer group">
                  <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center mr-2 group-hover:border-blue-500">
                    {formData.incentiveCalculation === '按商品金额' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <input 
                    type="radio" 
                    name="incentiveCalculation" 
                    className="hidden"
                    checked={formData.incentiveCalculation === '按商品金额'}
                    onChange={() => setFormData({...formData, incentiveCalculation: '按商品金额'})}
                  />
                  <span className="text-sm text-gray-700">按商品金额</span>
                </label>
              </div>
            </div>

            {/* 激励发放 */}
            <div className="grid grid-cols-12 gap-6 items-center">
              <label className="col-span-2 text-sm text-right text-gray-500"><span className="text-red-500 mr-1">*</span>激励发放</label>
              <div className="col-span-10 text-sm text-gray-700">按固定金额</div>
            </div>

            {/* 关联目标 */}
            <div className="grid grid-cols-12 gap-6 items-center">
              <label className="col-span-2 text-sm text-right text-gray-500">关联目标</label>
              <div className="col-span-6 flex items-center space-x-4">
                <div className="relative flex-1">
                  <select 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm appearance-none bg-white focus:border-blue-500 outline-none"
                    value={formData.associatedTarget}
                    onChange={handleTargetChange}
                  >
                    <option value="">请选择</option>
                    <option value="0527测试">0527测试</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <button className="text-blue-600 text-sm hover:underline">新建目标</button>
              </div>
            </div>
            
            {/* Target Alert */}
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-2" />
              <div className="col-span-10 bg-orange-50 border border-orange-100 p-2.5 rounded flex items-center text-xs text-orange-600">
                <div className="w-4 h-4 rounded-full border border-orange-400 flex items-center justify-center mr-2 shrink-0">!</div>
                仅限发布状态为【已发布】的目标活动
              </div>
            </div>

            {/* Conditionally shown fields when target is selected */}
            {formData.associatedTarget && (
              <>
                {/* 补发规则 */}
                <div className="grid grid-cols-12 gap-6 items-start">
                  <label className="col-span-2 text-sm text-right text-gray-500 pt-1"><span className="text-red-500 mr-1">*</span>补发规则</label>
                  <div className="col-span-10 space-y-4">
                    <div className="flex items-center space-x-8">
                      <label className="flex items-center cursor-pointer group">
                        <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center mr-2 group-hover:border-blue-500">
                          {formData.rebateRule === '按超额分段补发' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                        </div>
                        <input type="radio" className="hidden" checked={formData.rebateRule === '按超额分段补发'} onChange={() => setFormData({...formData, rebateRule: '按超额分段补发'})} />
                        <span className="text-sm text-gray-700">按超额分段补发</span>
                        <button className="ml-2 text-blue-600 text-xs">查看案例</button>
                      </label>
                      <label className="flex items-center cursor-pointer group">
                        <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center mr-2 group-hover:border-blue-500">
                          {formData.rebateRule === '超额按最高补发' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                        </div>
                        <input type="radio" className="hidden" checked={formData.rebateRule === '超额按最高补发'} onChange={() => setFormData({...formData, rebateRule: '超额按最高补发'})} />
                        <span className="text-sm text-gray-700">超额按最高补发</span>
                        <button className="ml-2 text-blue-600 text-xs">查看案例</button>
                      </label>
                      <label className="flex items-center cursor-pointer group">
                        <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center mr-2 group-hover:border-blue-500">
                          {formData.rebateRule === '所有销售量按最高补发' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                        </div>
                        <input type="radio" className="hidden" checked={formData.rebateRule === '所有销售量按最高补发'} onChange={() => setFormData({...formData, rebateRule: '所有销售量按最高补发'})} />
                        <span className="text-sm text-gray-700">所有销售量按最高补发</span>
                        <button className="ml-2 text-blue-600 text-xs">查看案例</button>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 奖励保护期 */}
                <div className="grid grid-cols-12 gap-6 items-center">
                  <label className="col-span-2 text-sm text-right text-gray-500">奖励保护期</label>
                  <div className="col-span-4">
                    <div className="relative">
                      <select 
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm appearance-none bg-white focus:border-blue-500 outline-none"
                        value={formData.rewardProtectionPeriod}
                        onChange={(e) => setFormData({...formData, rewardProtectionPeriod: Number(e.target.value)})}
                      >
                        <option value={0}>0</option>
                        <option value={7}>7</option>
                        <option value={15}>15</option>
                        <option value={30}>30</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-6 -mt-4">
                  <div className="col-span-2" />
                  <div className="col-span-10 text-[11px] text-gray-400">
                    我们将在2027-12-31 23:59:59，发放达成后补发的固定奖励，且不会对退单/补发做重复计算。
                  </div>
                </div>
              </>
            )}

            {/* 活动时间 */}
            <div className="grid grid-cols-12 gap-6 items-center">
              <label className="col-span-2 text-sm text-right text-gray-500"><span className="text-red-500 mr-1">*</span>活动时间</label>
              <div className="col-span-10 flex items-center space-x-2">
                {formData.associatedTarget ? (
                  <div className="text-sm text-gray-700 flex items-center">
                    <span className="font-medium mr-4">{formData.startTime} - {formData.endTime}</span>
                    <span className="text-gray-400 text-xs">您选择了任务，活动时间已自动获取为目标时间，如需修改时间，请前往 <button className="text-blue-600 hover:underline">目标管理</button></span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 w-full max-w-lg">
                    <div className="relative flex-1">
                      <input 
                        type="date" 
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" 
                        value={formData.startTime}
                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      />
                    </div>
                    <span className="text-gray-400">至</span>
                    <div className="relative flex-1">
                      <input 
                        type="date" 
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" 
                        value={formData.endTime}
                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 活动封面 */}
            <div className="grid grid-cols-12 gap-6 items-start">
              <label className="col-span-2 text-sm text-right text-gray-500 pt-2">活动封面</label>
              <div className="col-span-10">
                <div className="w-36 h-28 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-400 hover:bg-gray-50 transition-colors">
                  <Plus size={32} strokeWidth={1.5} />
                </div>
                <p className="text-[11px] text-gray-400 mt-2">建议240*160px，格式PNG，JPG，JPEG不超过2M</p>
              </div>
            </div>

            {/* 活动简介 */}
            <div className="grid grid-cols-12 gap-6 items-start">
              <label className="col-span-2 text-sm text-right text-gray-500 pt-2"><span className="text-red-500 mr-1">*</span>活动简介</label>
              <div className="col-span-8 relative">
                <textarea 
                  className="w-full h-24 border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none resize-none" 
                  maxLength={300}
                  placeholder="请输入"
                  value={formData.activityIntro}
                  onChange={(e) => setFormData({...formData, activityIntro: e.target.value})}
                ></textarea>
                <span className="absolute right-3 bottom-2 text-xs text-gray-400">{formData.activityIntro.length}/300</span>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 flex items-center justify-center space-x-4">
              <button className="px-10 py-2.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors">仅保存</button>
              <button onClick={() => setStep(2)} className="px-10 py-2.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">保存并下一步</button>
            </div>
          </div>
        ) : step === 2 ? (
          <div className="w-full max-w-6xl space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h1 className="text-xl font-bold text-gray-800 flex items-center">
                     {formData.activityTitle || '阿斯顿发史蒂夫'}
                     <span className="ml-3 px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-normal rounded">草稿</span>
                     <span className="ml-2 px-2 py-0.5 bg-orange-50 text-orange-500 text-xs font-normal rounded">代建</span>
                   </h1>
                   <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-gray-500">
                     <span>活动ID：635739</span>
                     <span className="text-gray-300">|</span>
                     <span>活动时间：{formData.startTime || '2027-01-01'} 至 {formData.endTime || '2027-12-31'}</span>
                     <span className="text-gray-300">|</span>
                     <span>扣费模式：激励扣连锁 服务费扣连锁</span>
                     <span className="text-gray-300">|</span>
                     <span>激励计算：按商品数量</span>
                     <span className="text-gray-300">|</span>
                     <span>激励发放：按固定金额</span>
                     <span className="text-gray-300">|</span>
                     <span>奖励保护期：0天</span>
                     <span className="text-gray-300">|</span>
                     <span>关联目标：{formData.associatedTarget || '0527测试'}</span>
                   </div>
                 </div>
                 <div className="flex space-x-3">
                   <button className="px-5 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors">发布活动</button>
                   <button className="px-5 py-2 border border-blue-500 text-blue-600 rounded text-sm font-medium hover:bg-blue-50 transition-colors">更多操作</button>
                 </div>
               </div>

               <div className="mt-8">
                 <h2 className="text-sm font-bold text-gray-800 mb-4">目标单品激励</h2>
                 <div className="bg-orange-50 border border-orange-100 p-3 rounded flex items-center text-xs text-orange-600 mb-6">
                   <div className="w-4 h-4 rounded-full border border-orange-400 flex items-center justify-center mr-2 shrink-0">!</div>
                   提示：目标单品激励与其他激励属于并行奖励，不受其他任何激励政策影响
                 </div>

                 <div className="flex justify-between items-center mb-4">
                   <div className="flex space-x-6">
                     <button 
                       onClick={() => setShowTargetProductModal(true)}
                       className="text-blue-600 text-sm flex items-center hover:underline"
                     >
                       <Plus size={16} className="mr-1" /> 添加目标单品激励
                     </button>
                     <button className="text-blue-600 text-sm flex items-center hover:underline">
                       <Trash2 size={16} className="mr-1" /> 批量删除
                     </button>
                   </div>
                   <div className="flex items-center space-x-2">
                     <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                       <select className="bg-gray-50 px-2 py-1.5 text-xs border-r border-gray-300 outline-none">
                         <option>商品编码</option>
                       </select>
                       <input type="text" placeholder="请输入商品编码" className="px-3 py-1.5 text-xs w-48 outline-none" />
                       <button className="px-3 text-gray-400"><Search size={14} /></button>
                     </div>
                   </div>
                 </div>

                 <table className="w-full border-collapse">
                   <thead>
                     <tr className="bg-gray-50 border-y border-gray-200">
                       <th className="p-3 w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
                       <th className="p-3 text-left text-xs font-bold text-gray-600">商品信息</th>
                       <th className="p-3 text-left text-xs font-bold text-gray-600">激励政策</th>
                       <th className="p-3 text-left text-xs font-bold text-gray-600">更新时间</th>
                       <th className="p-3 text-center text-xs font-bold text-gray-600">操作</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr>
                       <td colSpan={5} className="p-12 text-center">
                         <div className="flex flex-col items-center justify-center text-gray-400">
                           <div className="text-sm">暂无数据</div>
                         </div>
                       </td>
                     </tr>
                   </tbody>
                 </table>
               </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button onClick={() => setStep(1)} className="px-10 py-2.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors bg-white">上一步</button>
              <button onClick={() => setStep(3)} className="px-10 py-2.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">下一步</button>
            </div>
          </div>
        ) : step === 3 ? (

        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">活动商品</h3>
          <p className="text-gray-500">商品选择页面开发中...</p>
          <div className="mt-8 flex justify-end space-x-4">
            <button onClick={() => setStep(2)} className="px-6 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">上一步</button>
            <button onClick={() => setStep(4)} className="px-6 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">下一步</button>
          </div>
        </div>
      ) : step === 4 ? (
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4 mb-6 text-sm">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">所属企业</label>
              <select className="w-full border border-gray-300 rounded px-2 py-1.5"><option>请选择</option></select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">门店编码</label>
              <input type="text" className="w-full border border-gray-300 rounded px-2 py-1.5" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">门店名称</label>
              <input type="text" className="w-full border border-gray-300 rounded px-2 py-1.5" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">机构类型</label>
              <select className="w-full border border-gray-300 rounded px-2 py-1.5"><option>选择机构类型</option></select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">所属机构</label>
              <input type="text" className="w-full border border-gray-300 rounded px-2 py-1.5" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">所属区域</label>
              <select className="w-full border border-gray-300 rounded px-2 py-1.5"><option>请选择</option></select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">所属片区</label>
              <select className="w-full border border-gray-300 rounded px-2 py-1.5"><option>请选择所属片区</option></select>
            </div>
            <div className="flex items-end space-x-2">
              <button className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm">查询</button>
              <button className="border border-gray-300 rounded px-4 py-1.5 text-sm">重置</button>
            </div>
          </div>

          <div className="flex space-x-2 mb-4">
            <button className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm">添加门店</button>
            <button className="border border-gray-300 rounded px-4 py-1.5 text-sm">导入门店</button>
            <button className="border border-gray-300 rounded px-4 py-1.5 text-sm">更多操作</button>
          </div>

          <p className="text-sm text-gray-600 mb-4">当前活动共 0 家门店参与活动，您当前可操作 0 家门店，活动将按其参与时间计算活动商品奖励与统计销售数据。</p>

          <table className="w-full border-collapse border border-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 border border-gray-200 text-left"><input type="checkbox" /></th>
                <th className="p-3 border border-gray-200 text-left">门店编码</th>
                <th className="p-3 border border-gray-200 text-left">门店名称</th>
                <th className="p-3 border border-gray-200 text-left">所属企业</th>
                <th className="p-3 border border-gray-200 text-left">机构分类</th>
                <th className="p-3 border border-gray-200 text-left">所属机构</th>
                <th className="p-3 border border-gray-200 text-left">所属区域</th>
                <th className="p-3 border border-gray-200 text-left">参与时间</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-400">暂无数据</td>
              </tr>
            </tbody>
          </table>
          
          <div className="mt-8 flex justify-end space-x-4">
            <button onClick={() => setStep(3)} className="px-6 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">上一步</button>
            <button className="px-6 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">发布活动</button>
          </div>
        </div>
      ) : null}
      </div>
    </div>
  );
}

const GoldenSingleProductView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempTag, setTempTag] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  const [products, setProducts] = useState([
    {
      id: '1',
      image: 'https://picsum.photos/seed/medicine1/100/100',
      name: '阿莫西林胶囊',
      spec: '0.25g*24粒',
      code: 'YP001',
      barcode: '6901234567890',
      time: '2026-03-18 10:00:00',
      tag: '热销'
    },
    {
      id: '2',
      image: 'https://picsum.photos/seed/medicine2/100/100',
      name: '感冒灵颗粒',
      spec: '10g*9袋',
      code: 'YP002',
      barcode: '6901234567891',
      time: '2026-03-18 11:00:00',
      tag: '常备'
    },
    {
      id: '3',
      image: 'https://picsum.photos/seed/medicine3/100/100',
      name: '布洛芬缓释胶囊',
      spec: '0.3g*20粒',
      code: 'YP003',
      barcode: '6901234567892',
      time: '2026-03-18 12:00:00',
      tag: '止痛'
    },
    {
      id: '4',
      image: 'https://picsum.photos/seed/medicine4/100/100',
      name: '维C银翘片',
      spec: '12片*2板',
      code: 'YP004',
      barcode: '6901234567893',
      time: '2026-03-18 13:00:00',
      tag: '维C'
    },
    {
      id: '5',
      image: 'https://picsum.photos/seed/medicine5/100/100',
      name: '板蓝根颗粒',
      spec: '10g*20袋',
      code: 'YP005',
      barcode: '6901234567894',
      time: '2026-03-18 14:00:00',
      tag: '清热'
    },
    {
      id: '6',
      image: 'https://picsum.photos/seed/medicine6/100/100',
      name: '藿香正气水',
      spec: '10ml*10支',
      code: 'YP006',
      barcode: '6901234567895',
      time: '2026-03-18 15:00:00',
      tag: '解暑'
    }
  ]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.code.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (searchCode === '' || p.code.toLowerCase().includes(searchCode.toLowerCase()))
    );
  }, [products, searchQuery, searchCode]);

  const handleEditTag = (id: string, currentTag: string) => {
    setEditingId(id);
    setTempTag(currentTag || '');
  };

  const handleSaveTag = (id: string) => {
    if (tempTag.length > 4) {
      alert('标签最多可输入四个汉字');
      return;
    }
    setProducts(prev => prev.map(p => p.id === id ? { ...p, tag: tempTag } : p));
    setEditingId(null);
  };

  const handleAddTagClick = () => {
    setShowImportModal(true);
  };

  return (
    <div className="p-4 flex flex-col h-full overflow-hidden">
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-lg shadow-2xl w-[500px] overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">导入数据</h3>
                <button 
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">导入操作指南</h4>
                  <p className="text-sm text-gray-600 flex items-center">
                    点击 <button className="text-blue-600 hover:underline mx-1 font-medium">下载模板</button> 按照表格模板填好对应的信息
                  </p>
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center space-y-4 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">点击上传文件或拖拽文件到这里</p>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button 
                  onClick={() => setShowImportModal(false)}
                  className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={() => setShowImportModal(false)}
                  className="px-6 py-2 bg-blue-300 text-white rounded-md text-sm font-medium cursor-not-allowed"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1">
            <label className="text-xs text-gray-500">商品名称/编码</label>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="请输入商品名称或编码" 
              className="w-64 border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500">厂家编码</label>
            <input 
              type="text" 
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="请输入厂家编码" 
              className="w-48 border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div className="flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors">查询</button>
            <button 
              onClick={() => {setSearchQuery(''); setSearchCode('');}}
              className="border border-gray-200 text-gray-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-50 transition-colors flex items-center"
            >
              <RotateCcw size={14} className="mr-1" /> 重置
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              onClick={handleAddTagClick}
              className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium flex items-center"
            >
              <Plus size={16} className="mr-1" /> 新增商品标签
            </button>
            <button className="border border-gray-200 text-gray-600 px-4 py-1.5 rounded text-sm font-medium flex items-center hover:bg-gray-50">
              <Download size={16} className="mr-1" /> 导入商品
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-blue-600 transition-colors">
              <RotateCcw size={18} />
            </button>
            <button className="text-gray-400 hover:text-blue-600 transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 border-b border-gray-100">商品信息</th>
                <th className="px-4 py-3 border-b border-gray-100">规格</th>
                <th className="px-4 py-3 border-b border-gray-100">商品展示标签</th>
                <th className="px-4 py-3 border-b border-gray-100">商品编码/条码</th>
                <th className="px-4 py-3 border-b border-gray-100">操作时间</th>
                <th className="px-4 py-3 border-b border-gray-100 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 border-b border-gray-50">
                    <div className="flex items-center space-x-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded border border-gray-100 object-cover" referrerPolicy="no-referrer" />
                      <span className="font-medium text-gray-700">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 border-b border-gray-50 text-gray-600">{product.spec}</td>
                  <td className="px-4 py-4 border-b border-gray-50">
                    {editingId === product.id ? (
                      <div className="flex items-center space-x-2">
                        <input 
                          type="text" 
                          value={tempTag}
                          onChange={(e) => setTempTag(e.target.value)}
                          maxLength={4}
                          className="w-24 border border-blue-400 rounded px-2 py-1 text-xs focus:outline-none"
                          autoFocus
                        />
                        <button 
                          onClick={() => handleSaveTag(product.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Check size={14} />
                        </button>
                        <button 
                          onClick={() => setEditingId(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 group/tag">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${product.tag ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'text-gray-300 italic'}`}>
                          {product.tag || '无标签'}
                        </span>
                        <button 
                          onClick={() => handleEditTag(product.id, product.tag || '')}
                          className="opacity-0 group-hover/tag:opacity-100 text-blue-500 hover:text-blue-700 transition-opacity"
                        >
                          <Edit3 size={12} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 border-b border-gray-50 text-gray-600">
                    <div>{product.code}</div>
                    <div className="text-xs text-gray-400">{product.barcode}</div>
                  </td>
                  <td className="px-4 py-4 border-b border-gray-50 text-gray-500 text-xs">{product.time}</td>
                  <td className="px-4 py-4 border-b border-gray-50">
                    <div className="flex items-center justify-center space-x-3">
                      <button className="text-blue-600 hover:underline text-xs">排序</button>
                      <button className="text-blue-600 hover:underline text-xs">置顶</button>
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>共 {filteredProducts.length} 条</span>
          <div className="flex items-center space-x-2">
            <button className="p-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled><ChevronLeft size={14} /></button>
            <button className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center">1</button>
            <button className="p-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled><ChevronRight size={14} /></button>
            <select className="border border-gray-200 rounded px-2 py-1 bg-white">
              <option>10条/页</option>
              <option>20条/页</option>
            </select>
            <div className="flex items-center space-x-1">
              <span>跳转至</span>
              <input type="text" className="w-8 border border-gray-200 rounded px-1 py-1 text-center" defaultValue="1" />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState('慢病活动');
  const [activeSidebar, setActiveSidebar] = useState('四季蝉');
  const [expandedSubmenu, setExpandedSubmenu] = useState('');
  const [activeSubItem, setActiveSubItem] = useState('首页');
  
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [searchName, setSearchName] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [searchManufacturer, setSearchManufacturer] = useState('');
  const [searchType, setSearchType] = useState<IncentiveType | ''>('');
  const [participationFilter, setParticipationFilter] = useState<ParticipationStatus>('待参与');
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [rewardDetailFilters, setRewardDetailFilters] = useState<{ startDate: string, endDate: string, rewardType: string, erpOrderCode?: string }>({
    startDate: '',
    endDate: '',
    rewardType: '',
    erpOrderCode: ''
  });

  React.useEffect(() => {
    setSelectedActivityId(null);
  }, [activeSubItem]);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const sjcSubmenu = [
    { label: '首页' },
    { label: '活动管理', hasChildren: true, children: ['活动广场', '我的活动', '激励补发申请', '带金单品', '目标管理'] },
    { label: '培训管理', hasChildren: true, children: ['我的课程', '培训素材', '试卷管理', '培训学堂', '用户组管理', '培训报名'] },
    { label: '数据统计', hasChildren: true, children: ['账户统计', '奖励统计', '销售统计', '合约统计', '培训统计'] },
    { label: '奖励发放明细' },
    { label: '厂家管理', hasChildren: true, children: ['厂家账户', '厂家资料', '厂家商品'] },
    { label: '配送管理' },
    { label: '机器人管理', hasChildren: true, children: ['私聊管理', '群聊管理'] },
    { label: '店员圈', hasChildren: true, children: ['晒单管理', '评论管理', '奖励明细'] },
    { label: '业务设置' },
    { label: '任务管理' },
  ];

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesName = activity.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesCode = activity.manufacturerCode.toLowerCase().includes(searchCode.toLowerCase());
      const matchesManufacturer = activity.manufacturer.toLowerCase().includes(searchManufacturer.toLowerCase());
      const matchesType = searchType === '' || activity.incentiveType === searchType;
      const matchesParticipation = activity.participationStatus === participationFilter;
      return matchesName && matchesCode && matchesManufacturer && matchesType && matchesParticipation;
    });
  }, [activities, searchName, searchCode, searchManufacturer, searchType, participationFilter]);

  const handleReset = () => {
    setSearchName('');
    setSearchCode('');
    setSearchManufacturer('');
    setSearchType('');
  };

  const handleJoin = (id: string) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, participationStatus: '已参与' } : a));
  };

  const openRejectModal = (id: string) => {
    setRejectingId(id);
    setIsRejectModalOpen(true);
  };

  const handleReject = () => {
    if (rejectingId) {
      setActivities(prev => prev.map(a => a.id === rejectingId ? { 
        ...a, 
        participationStatus: '已拒绝', 
        rejectReason, 
        rejectTime: new Date().toLocaleString() 
      } : a));
      setIsRejectModalOpen(false);
      setRejectReason('');
      setRejectingId(null);
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
      {/* Sidebar - Level 1 */}
      <aside className="w-16 bg-white border-r border-gray-200 flex flex-col z-30">
        <div className="p-4 flex justify-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl italic">H</div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <SidebarItem icon={Home} label="首页" onClick={() => setActiveSidebar('首页')} active={activeSidebar === '首页'} />
          <SidebarItem icon={Megaphone} label="营销" onClick={() => setActiveSidebar('营销')} active={activeSidebar === '营销'} />
          <SidebarItem icon={ShoppingBag} label="商城" onClick={() => setActiveSidebar('商城')} active={activeSidebar === '商城'} />
          <SidebarItem icon={Package} label="商品" onClick={() => setActiveSidebar('商品')} active={activeSidebar === '商品'} />
          <SidebarItem icon={ClipboardList} label="订单" onClick={() => setActiveSidebar('订单')} active={activeSidebar === '订单'} />
          <SidebarItem icon={GraduationCap} label="培训" onClick={() => setActiveSidebar('培训')} active={activeSidebar === '培训'} />
          <SidebarItem icon={BarChart3} label="数据" onClick={() => setActiveSidebar('数据')} active={activeSidebar === '数据'} />
          <SidebarItem icon={UserPlus} label="助手" onClick={() => setActiveSidebar('助手')} active={activeSidebar === '助手'} />
          <SidebarItem icon={Leaf} label="四季蝉" onClick={() => {
            setActiveSidebar('四季蝉');
            setActiveSubItem('首页');
            setExpandedSubmenu('');
          }} active={activeSidebar === '四季蝉'} />
          <SidebarItem icon={ShoppingCart} label="随心采" onClick={() => setActiveSidebar('随心采')} active={activeSidebar === '随心采'} />
          <SidebarItem icon={Eye} label="随心看" onClick={() => setActiveSidebar('随心看')} active={activeSidebar === '随心看'} />
          <SidebarItem icon={Briefcase} label="业务" onClick={() => setActiveSidebar('业务')} active={activeSidebar === '业务'} />
          <SidebarItem icon={CheckSquare} label="任务" onClick={() => setActiveSidebar('任务')} active={activeSidebar === '任务'} />
        </div>
      </aside>

      {/* Sidebar - Level 2 */}
      <AnimatePresence>
        {activeSidebar === '四季蝉' && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 160, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-white border-r border-gray-200 flex flex-col z-20 overflow-hidden"
          >
            <div className="h-12 flex items-center px-4 border-b border-gray-50 font-bold text-sm text-gray-700">
              四季蝉
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar py-2">
              {sjcSubmenu.map((item) => (
                <div key={item.label}>
                  <SubmenuItem 
                    label={item.label} 
                    active={expandedSubmenu === item.label || activeSubItem === item.label}
                    hasChildren={item.hasChildren}
                    expanded={expandedSubmenu === item.label}
                    onClick={() => {
                      if (item.hasChildren) {
                        setExpandedSubmenu(expandedSubmenu === item.label ? '' : item.label);
                      } else {
                        setActiveSubItem(item.label);
                        setExpandedSubmenu('');
                      }
                    }}
                  />
                  {item.hasChildren && expandedSubmenu === item.label && (
                    <div className="bg-gray-50/50">
                      {item.children?.map(child => (
                        <div key={child}>
                          <ChildMenuItem 
                            label={child} 
                            active={activeSubItem === child}
                            onClick={() => setActiveSubItem(child)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-10 bg-white border-b border-gray-200 flex items-center px-4 justify-between">
          <div className="flex items-center space-x-4">
            <div className={`text-xs flex items-center px-2 py-1 rounded cursor-pointer ${activeSubItem === '首页' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-400'}`} onClick={() => setActiveSubItem('首页')}>
              <span className="mr-2">● 首页</span>
              <X size={12} className="cursor-pointer" />
            </div>
            {activeSubItem !== '首页' && (
              <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded flex items-center font-medium">
                <span className="mr-2">● {activeSubItem}</span>
                <X size={12} className="cursor-pointer" />
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4 text-gray-500">
            <div className="flex items-center space-x-1 cursor-pointer">
              <ChevronLeft size={16} />
              <ChevronRight size={16} />
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="搜索功能名称..." 
                className="bg-gray-100 rounded-full px-4 py-1 text-xs w-48 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <Search size={14} className="absolute right-3 top-1.5 text-gray-400" />
            </div>
            <div className="relative cursor-pointer">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] px-1 rounded-full">99+</span>
            </div>
            <Grid size={18} className="cursor-pointer" />
            <div className="flex items-center space-x-1 cursor-pointer">
              <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-white text-[10px]">测</div>
              <span className="text-xs">(测试) 湖南易采...</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {activeSubItem === '首页' ? (
            <HomeView 
              onActivityClick={(id) => {
                setActiveSubItem('我的活动');
                setSelectedActivityId(id);
              }} 
              onNavigate={(subItem) => {
                setActiveSubItem(subItem);
                setExpandedSubmenu('店员圈');
              }}
              onNavigateToRewardDetails={(filters) => {
                setRewardDetailFilters(filters);
                setActiveSubItem('奖励发放明细');
              }}
              onNavigateToRobotGroups={() => {
                setActiveSidebar('四季蝉');
                setExpandedSubmenu('机器人管理');
                setActiveSubItem('群聊管理');
              }}
              onNavigateToRobotPrivate={() => {
                setActiveSidebar('四季蝉');
                setExpandedSubmenu('机器人管理');
                setActiveSubItem('私聊管理');
              }}
              onNavigateToRewardWithOrder={(orderCode) => {
                setRewardDetailFilters(prev => ({ ...prev, erpOrderCode: orderCode }));
                setActiveSubItem('奖励发放明细');
              }}
            />
          ) : activeSubItem === '私聊管理' ? (
            <PrivateChatManagementView />
          ) : activeSubItem === '群聊管理' ? (
            <GroupChatManagementView />
          ) : activeSubItem === '我的活动' ? (
            selectedActivityId ? (
              <ActivityDetailView id={selectedActivityId} onBack={() => setSelectedActivityId(null)} />
            ) : (
              <MyActivitiesView onDetailClick={(id) => setSelectedActivityId(id)} onCreateClick={() => setActiveSubItem('创建活动')} />
            )
          ) : activeSubItem === '创建活动' ? (
            <CreateActivityView onBack={() => setActiveSubItem('我的活动')} />
          ) : activeSubItem === '晒单管理' ? (
            <OrderSharingManagementView />
          ) : activeSubItem === '评论管理' ? (
            <CommentManagementView />
          ) : activeSubItem === '奖励明细' ? (
            <ClerkCircleRewardDetailView />
          ) : activeSubItem === '奖励发放明细' ? (
            <div className="p-6 bg-white min-h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">奖励发放明细</h2>
                {rewardDetailFilters.startDate && (
                  <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                    <History size={14} className="text-blue-600 mr-2" />
                    <span className="text-xs text-blue-700">
                      已带入时间范围: {rewardDetailFilters.startDate} 至 {rewardDetailFilters.endDate}
                      {rewardDetailFilters.rewardType && ` | 奖励内容: ${rewardDetailFilters.rewardType}`}
                    </span>
                    <button 
                      onClick={() => setRewardDetailFilters({ startDate: '', endDate: '', rewardType: '' })}
                      className="ml-3 text-blue-400 hover:text-blue-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                {rewardDetailFilters.erpOrderCode && (
                  <div className="flex items-center bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 ml-2">
                    <ClipboardList size={14} className="text-orange-600 mr-2" />
                    <span className="text-xs text-orange-700">
                      筛选订单号: {rewardDetailFilters.erpOrderCode}
                    </span>
                    <button 
                      onClick={() => setRewardDetailFilters(prev => ({ ...prev, erpOrderCode: '' }))}
                      className="ml-3 text-orange-400 hover:text-orange-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Search Filters */}
              <div className="grid grid-cols-5 gap-4 mb-6 text-sm">
                <div className="flex items-center space-x-2">
                  <select className="border border-gray-300 rounded px-2 py-1.5 w-32"><option>订单创建时</option></select>
                  <input 
                    type="text" 
                    readOnly
                    placeholder="2026-03-01 - 2026-03-23" 
                    value={rewardDetailFilters.startDate ? `${rewardDetailFilters.startDate} 至 ${rewardDetailFilters.endDate}` : ""}
                    className="border border-gray-300 rounded px-2 py-1.5 flex-1 bg-gray-50 focus:outline-none" 
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">ERP订单号</label>
                  <input 
                    type="text" 
                    placeholder="ERP订单号" 
                    value={rewardDetailFilters.erpOrderCode || ""}
                    onChange={(e) => setRewardDetailFilters(prev => ({ ...prev, erpOrderCode: e.target.value }))}
                    className="border border-gray-300 rounded px-2 py-1.5 flex-1" 
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">商品编码</label>
                  <input type="text" placeholder="输入商品编码搜索" className="border border-gray-300 rounded px-2 py-1.5 flex-1" />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">商品名称</label>
                  <input type="text" placeholder="输入商品名称搜索" className="border border-gray-300 rounded px-2 py-1.5 flex-1" />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">活动</label>
                  <input type="text" placeholder="输入活动名称搜索" className="border border-gray-300 rounded px-2 py-1.5 flex-1" />
                </div>
                <div className="flex items-center space-x-2">
                  <select className="border border-gray-300 rounded px-2 py-1.5 w-32"><option>奖励员工</option></select>
                  <input type="text" placeholder="搜索员工编码或名称" className="border border-gray-300 rounded px-2 py-1.5 flex-1" />
                </div>
                <div className="flex items-center space-x-2">
                  <select className="border border-gray-300 rounded px-2 py-1.5 w-32"><option>厂家名称</option></select>
                  <input type="text" placeholder="请输入" className="border border-gray-300 rounded px-2 py-1.5 flex-1" />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">下门店</label>
                  <input type="text" placeholder="输入机构/门店名称" className="border border-gray-300 rounded px-2 py-1.5 flex-1" />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">门店类型</label>
                  <select className="border border-gray-300 rounded px-2 py-1.5 flex-1"><option>全部</option></select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">入账状态</label>
                  <select className="border border-gray-300 rounded px-2 py-1.5 flex-1"><option>全部</option></select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">补推申请单号</label>
                  <input type="text" placeholder="激励补推申请单号" className="border border-gray-300 rounded px-2 py-1.5 flex-1" />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">奖励内容</label>
                  <select className="border border-gray-300 rounded px-2 py-1.5 flex-1 bg-white focus:outline-none">
                    <option>{rewardDetailFilters.rewardType || '请选择'}</option>
                    <option>及时豆</option>
                    <option>延时豆</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">订单来源</label>
                  <select className="border border-gray-300 rounded px-2 py-1.5 flex-1"><option>请选择</option></select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">激励计算</label>
                  <select className="border border-gray-300 rounded px-2 py-1.5 flex-1"><option>请选择</option></select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">激励发放</label>
                  <select className="border border-gray-300 rounded px-2 py-1.5 flex-1"><option>请选择</option></select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">基数类型</label>
                  <select className="border border-gray-300 rounded px-2 py-1.5 flex-1"><option>请选择</option></select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">微商城订单号</label>
                  <input type="text" placeholder="微商城订单号" className="border border-gray-300 rounded px-2 py-1.5 flex-1" />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">所属门店</label>
                  <input type="text" placeholder="输入机构/门店名称" className="border border-gray-300 rounded px-2 py-1.5 flex-1" />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">销售区域</label>
                  <select className="border border-gray-300 rounded px-2 py-1.5 flex-1"><option>请选择省/市</option></select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">门店所属企业</label>
                  <select className="border border-gray-300 rounded px-2 py-1.5 flex-1"><option>请选择</option></select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">出资所属企业</label>
                  <select className="border border-gray-300 rounded px-2 py-1.5 flex-1"><option>请选择</option></select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">所属片区</label>
                  <select className="border border-gray-300 rounded px-2 py-1.5 flex-1"><option>请选择所属片区</option></select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">激励类型</label>
                  <select className="border border-gray-300 rounded px-2 py-1.5 flex-1"><option>请选择</option></select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">扣费模式</label>
                  <select className="border border-gray-300 rounded px-2 py-1.5 flex-1"><option>请选择</option></select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-600 w-20 text-right">付款方式</label>
                  <select className="border border-gray-300 rounded px-2 py-1.5 flex-1">
                    <option>全部</option>
                    <option>1/A现金</option>
                    <option>5/E金孚龙卡</option>
                    <option>1111/pengwzh付款方式</option>
                    <option>1/货到付款</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-6">
                <button className="text-blue-600 text-sm flex items-center"><RotateCcw size={14} className="mr-1" /> 折叠条件</button>
                <button className="bg-blue-600 text-white px-6 py-1.5 rounded text-sm">查询</button>
                <button className="border border-gray-300 rounded px-6 py-1.5 text-sm">导出</button>
              </div>

              {/* Stats Table */}
              <table className="w-full border-collapse border border-gray-200 text-sm mb-6">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 border border-gray-200">统计指标</th>
                    <th className="p-3 border border-gray-200">激励金额(元)</th>
                    <th className="p-3 border border-gray-200">退款金额(元)</th>
                    <th className="p-3 border border-gray-200">实发金额(元)</th>
                    <th className="p-3 border border-gray-200">订单数(个)</th>
                    <th className="p-3 border border-gray-200">退款订单数(个)</th>
                    <th className="p-3 border border-gray-200">实发订单数(个)</th>
                    <th className="p-3 border border-gray-200">奖励销售数量(个)</th>
                    <th className="p-3 border border-gray-200">标价金额(元)</th>
                    <th className="p-3 border border-gray-200">实付金额(元)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-gray-200 font-bold text-yellow-600">及时豆</td>
                    <td className="p-3 border border-gray-200">89.81</td>
                    <td className="p-3 border border-gray-200">-50</td>
                    <td className="p-3 border border-gray-200">39.81</td>
                    <td className="p-3 border border-gray-200">107</td>
                    <td className="p-3 border border-gray-200">9</td>
                    <td className="p-3 border border-gray-200">98</td>
                    <td className="p-3 border border-gray-200">5</td>
                    <td className="p-3 border border-gray-200">105.4</td>
                    <td className="p-3 border border-gray-200">120.2</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-gray-200 font-bold text-green-600">延时豆</td>
                    <td className="p-3 border border-gray-200">0</td>
                    <td className="p-3 border border-gray-200">0</td>
                    <td className="p-3 border border-gray-200">0</td>
                    <td className="p-3 border border-gray-200">0</td>
                    <td className="p-3 border border-gray-200">0</td>
                    <td className="p-3 border border-gray-200">0</td>
                    <td className="p-3 border border-gray-200">0</td>
                    <td className="p-3 border border-gray-200">0</td>
                    <td className="p-3 border border-gray-200">0</td>
                  </tr>
                </tbody>
              </table>

              {/* Details Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">奖励生成时间</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">ERP订单号</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">订单时间</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">账户中心创建时间</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">奖励商品</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">数量</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">奖励销售数量</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">奖励金额</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">奖励状态</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">营业员</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">奖励员工</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">下门店</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">门店类型</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">活动名称</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">奖励类型</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">付款方式</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">付款方式激励比例</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">活动厂家</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">奖励内容</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">商品类型</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">订单来源</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">分享人</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">微商城订单号</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">关联原单(仅退货)</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">补推申请单号</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">账户中心入账时间</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">账户中心出账时间</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">入账状态</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">所属门店</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">平台服务费</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">平台服务费率</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">连锁服务费</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">出资所属企业</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">激励发放</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">基数类型</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">奖励发放备注</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">扣费模式</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">激励计算</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">标价金额</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">实付金额</th>
                      <th className="p-3 border border-gray-200 whitespace-nowrap">奖励销售金额</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {/* ... existing cells ... */}
                      <td className="p-3 border border-gray-200">2026-03-23 13:16:35</td>
                      <td className="p-3 border border-gray-200">10137</td>
                      <td className="p-3 border border-gray-200">2026-03-23 13:16:35</td>
                      <td className="p-3 border border-gray-200">2026-03-23 13:16:35</td>
                      <td className="p-3 border border-gray-200">规格: -<br/>商品编码: -<br/>商品批号: -</td>
                      <td className="p-3 border border-gray-200">0</td>
                      <td className="p-3 border border-gray-200">0</td>
                      <td className="p-3 border border-gray-200">0.01</td>
                      <td className="p-3 border border-gray-200">已发放</td>
                      <td className="p-3 border border-gray-200">周日明<br/>3551</td>
                      <td className="p-3 border border-gray-200">周日明<br/>3551</td>
                      <td className="p-3 border border-gray-200">-</td>
                      <td className="p-3 border border-gray-200">-</td>
                      <td className="p-3 border border-gray-200">厂家模式-无连锁抽佣</td>
                      <td className="p-3 border border-gray-200">手工发放连锁抽佣激励</td>
                      <td className="p-3 border border-gray-200">-</td>
                      <td className="p-3 border border-gray-200">-</td>
                      <td className="p-3 border border-gray-200">小婷供应商<br/>SP4867</td>
                      <td className="p-3 border border-gray-200">及时豆</td>
                      <td className="p-3 border border-gray-200">-</td>
                      <td className="p-3 border border-gray-200">-</td>
                      <td className="p-3 border border-gray-200">-</td>
                      <td className="p-3 border border-gray-200">-</td>
                      <td className="p-3 border border-gray-200">-</td>
                      <td className="p-3 border border-gray-200">-</td>
                      <td className="p-3 border border-gray-200">2026-03-23 13:19:08</td>
                      <td className="p-3 border border-gray-200">-</td>
                      <td className="p-3 border border-gray-200">已结算</td>
                      <td className="p-3 border border-gray-200">海典智慧药房双品汇店(直营)<br/>20002</td>
                      <td className="p-3 border border-gray-200">0</td>
                      <td className="p-3 border border-gray-200">0</td>
                      <td className="p-3 border border-gray-200">0</td>
                      <td className="p-3 border border-gray-200">0</td>
                      <td className="p-3 border border-gray-200">-</td>
                      <td className="p-3 border border-gray-200">上海海典智慧药店<br/>c_20</td>
                      <td className="p-3 border border-gray-200">按固定金额</td>
                      <td className="p-3 border border-gray-200">按实付金额</td>
                      <td className="p-3 border border-gray-200">已发放</td>
                      <td className="p-3 border border-gray-200">激励扣厂家 服务费扣厂家</td>
                      <td className="p-3 border border-gray-200">按商品数量</td>
                      <td className="p-3 border border-gray-200">0</td>
                      <td className="p-3 border border-gray-200">0</td>
                      <td className="p-3 border border-gray-200">0</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-end space-x-2 mt-4 text-sm">
                <span className="text-gray-600">共 1 条</span>
                <select className="border border-gray-300 rounded px-2 py-1">
                  <option>10条/页</option>
                  <option>20条/页</option>
                  <option>50条/页</option>
                </select>
                <button className="border border-gray-300 rounded px-3 py-1 disabled:opacity-50" disabled>&lt;</button>
                <button className="bg-blue-600 text-white rounded px-3 py-1">1</button>
                <button className="border border-gray-300 rounded px-3 py-1 disabled:opacity-50" disabled>&gt;</button>
                <span className="text-gray-600">跳至</span>
                <input type="text" className="border border-gray-300 rounded w-12 px-2 py-1 text-center" defaultValue="1" />
                <span className="text-gray-600">页</span>
              </div>
            </div>
          ) : activeSubItem === '目标管理' ? (
            <TargetManagementView />
          ) : activeSubItem === '带金单品' ? (
            <GoldenSingleProductView />
          ) : activeSubItem === '业务设置' ? (
            <BusinessSettingsView />
          ) : activeSubItem === '活动广场' ? (
            <>
              {/* Banner Area */}
        <div className="p-4">
          <div className="relative h-24 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl overflow-hidden flex items-center px-8">
            <div className="z-10">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                活动广场 <span className="text-sm font-normal text-gray-500 ml-4">助力动销，协力共赢！</span>
              </h1>
              <div className="mt-2 flex items-center space-x-4">
                <span className="text-orange-600 font-bold">千万补贴金 分完即止</span>
                <span className="text-xs text-gray-500">厂家补贴买单 ● 协助动销奇迹 ● 首创线上厂家活动</span>
              </div>
            </div>
            <div className="absolute right-0 top-0 h-full opacity-20">
              <img src="https://picsum.photos/seed/medical/400/100" alt="Banner" className="h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>

        {/* Tabs and Filters */}
        <div className="px-4 flex flex-col flex-1 overflow-hidden">
          <div className="bg-white rounded-t-xl border-x border-t border-gray-200">
            <div className="flex border-b border-gray-100">
              <TabItem label="带金活动" onClick={() => setActiveMainTab('带金活动')} active={activeMainTab === '带金活动'} />
              <TabItem label="合约购药" onClick={() => setActiveMainTab('合约购药')} active={activeMainTab === '合约购药'} />
              <TabItem label="慢病活动" onClick={() => setActiveMainTab('慢病活动')} active={activeMainTab === '慢病活动'} />
            </div>

            {/* Filter Bar */}
            <div className="p-4 grid grid-cols-4 gap-4 items-end">
              <div className="space-y-1">
                <label className="text-xs text-gray-500">活动名称</label>
                <input 
                  type="text" 
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="请输入活动名称" 
                  className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">厂家编码</label>
                <input 
                  type="text" 
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="请输入厂家编码" 
                  className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">厂家名称</label>
                <input 
                  type="text" 
                  value={searchManufacturer}
                  onChange={(e) => setSearchManufacturer(e.target.value)}
                  placeholder="请输入厂家名称" 
                  className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div className="flex space-x-2">
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-gray-500">活动类型</label>
                  <select 
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value as any)}
                    className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                  >
                    <option value="">请选择</option>
                    <option value="建档">建档</option>
                    <option value="检测">检测</option>
                    <option value="回访">回访</option>
                  </select>
                </div>
                <button className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors">查询</button>
                <button 
                  onClick={handleReset}
                  className="border border-gray-200 text-gray-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-50 transition-colors flex items-center"
                >
                  <RotateCcw size={14} className="mr-1" /> 重置
                </button>
              </div>
            </div>

            {/* View Toggle Bar */}
            <div className="px-4 pb-4 flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="flex items-center space-x-1 px-3 py-1 border border-orange-200 text-orange-600 rounded text-xs bg-orange-50">
                  <LayoutList size={14} />
                  <span>列表</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1 border border-gray-200 text-gray-500 rounded text-xs hover:bg-gray-50">
                  <LayoutGrid size={14} />
                  <span>卡片</span>
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setParticipationFilter(participationFilter === '待参与' ? '已拒绝' : '待参与')}
                    className="flex items-center space-x-1 px-3 py-1 border border-gray-200 text-gray-600 rounded text-xs hover:bg-gray-50"
                  >
                    <span>{participationFilter}活动</span>
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Activity List */}
          <div className="flex-1 bg-white border-x border-b border-gray-200 overflow-y-auto rounded-b-xl relative">
            <div className="p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-4">平台活动</h3>
              <div className="text-center py-10 text-gray-400 text-sm">暂无符合条件的活动</div>

              <h3 className="text-sm font-bold text-gray-700 mb-4 mt-8">厂家活动</h3>
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-gray-50 text-gray-500 font-medium text-[12px]">
                  <tr>
                    <th className="px-4 py-3 border-b border-gray-100">活动名称</th>
                    <th className="px-4 py-3 border-b border-gray-100">激励类型</th>
                    <th className="px-4 py-3 border-b border-gray-100">活动状态</th>
                    <th className="px-4 py-3 border-b border-gray-100">参与状态</th>
                    <th className="px-4 py-3 border-b border-gray-100">活动时间</th>
                    <th className="px-4 py-3 border-b border-gray-100">激励模式</th>
                    <th className="px-4 py-3 border-b border-gray-100 text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-4 py-4 border-b border-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                            <Package size={16} />
                          </div>
                          <span className="font-medium text-gray-700">{activity.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 border-b border-gray-50 text-gray-600">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px]">{activity.incentiveType}</span>
                      </td>
                      <td className="px-4 py-4 border-b border-gray-50">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          activity.status === '进行中' ? 'text-green-600 bg-green-50' : 
                          activity.status === '未开始' ? 'text-orange-600 bg-orange-50' : 
                          activity.status === '草稿' ? 'text-gray-400 bg-gray-50' :
                          'text-gray-500 bg-gray-100'
                        }`}>
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 border-b border-gray-50">
                        <span className={`text-xs font-medium ${activity.participationStatus === '已拒绝' ? 'text-red-400' : 'text-orange-400'}`}>
                          {activity.participationStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 border-b border-gray-50 text-xs text-gray-500">
                        <div>{activity.startTime} 至 {activity.endTime}</div>
                        {activity.status === '未开始' && (
                          <div className="text-red-500 mt-1">距离开始 <span className="font-bold">00时16分</span></div>
                        )}
                      </td>
                      <td className="px-4 py-4 border-b border-gray-50">
                        <div className="flex items-center space-x-1">
                          <div className={`w-3 h-3 rounded-full ${activity.incentiveMode === '及时豆' ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                          <span className="text-xs text-gray-600">{activity.incentiveMode}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 border-b border-gray-50">
                        <div className="flex items-center justify-center space-x-3">
                          {activity.participationStatus === '待参与' && (
                            <>
                              <button 
                                onClick={() => openRejectModal(activity.id)}
                                className="text-gray-400 hover:text-red-500 text-xs font-medium transition-colors"
                              >
                                拒绝参加
                              </button>
                              <button 
                                onClick={() => handleJoin(activity.id)}
                                className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-medium hover:bg-orange-600 transition-colors shadow-sm"
                              >
                                马上参加
                              </button>
                            </>
                          )}
                          {activity.participationStatus === '已拒绝' && (
                            <div className="text-center">
                              <div className="text-gray-400 text-xs">已拒绝</div>
                              <div className="text-[10px] text-gray-300 mt-1">{activity.rejectTime?.split(' ')[0]}</div>
                            </div>
                          )}
                          {activity.participationStatus === '已参与' && (
                            <span className="text-green-500 text-xs">已参与</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
                <span>共 {filteredActivities.length} 条</span>
                <div className="flex items-center space-x-2">
                  <button className="p-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled><ChevronLeft size={14} /></button>
                  <button className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center">1</button>
                  <button className="w-6 h-6 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50">2</button>
                  <button className="w-6 h-6 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50">3</button>
                  <button className="w-6 h-6 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50">4</button>
                  <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronRight size={14} /></button>
                  <select className="border border-gray-200 rounded px-2 py-1 bg-white">
                    <option>6条/页</option>
                    <option>10条/页</option>
                  </select>
                  <div className="flex items-center space-x-1">
                    <span>跳转至</span>
                    <input type="text" className="w-8 border border-gray-200 rounded px-1 py-1 text-center" defaultValue="1" />
                    <span>页</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 h-full">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Grid size={32} className="opacity-20" />
              </div>
              <h2 className="text-lg font-medium text-gray-600 mb-2">{activeSubItem}</h2>
              <p className="text-sm">该模块正在建设中，敬请期待...</p>
            </div>
          )}
        </div>
      </main>

      {/* Reject Modal */}
      <AnimatePresence>
        {isRejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl w-[400px] overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">拒绝参加活动</h3>
                <X size={20} className="text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => setIsRejectModalOpen(false)} />
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">拒绝原因</label>
                  <textarea 
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="请输入拒绝参加的原因..."
                    className="w-full h-32 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 resize-none"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button 
                    onClick={() => setIsRejectModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleReject}
                    disabled={!rejectReason.trim()}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                  >
                    确认拒绝
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
