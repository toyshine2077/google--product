/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
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
  User,
  Calendar,
  Check
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

// --- Variety Dimension View Component ---

const VarietyDimensionView = ({ onActivityClick }: { onActivityClick?: (id: string) => void }) => {
  const stats = [
    { label: '重点品销售额', value: '117.42万', subValue: '146个商品', trend: '-26.55%', isUp: false, icon: <BarChart3 className="text-blue-500" size={20} /> },
    { label: '动销商品数', value: '120', subValue: '动销率 82.19%', trend: '+5.2%', isUp: true, icon: <ShoppingBag className="text-orange-500" size={20} /> },
    { label: '未动销商品数', value: '26', subValue: '需关注', trend: '-12.5%', isUp: false, icon: <Package className="text-gray-400" size={20} /> },
    { label: '3A商品数', value: '50', subValue: '占比 34.25%', trend: '+2.1%', isUp: true, icon: <GraduationCap className="text-purple-500" size={20} /> },
  ];

  const topSelling = [
    { name: '感冒灵颗粒', qty: '4159盒', sales: '41174.1元', incentiveQty: '3800盒', incentiveSales: '38000元' },
    { name: '阿莫西林胶囊', qty: '3200盒', sales: '32000.0元', incentiveQty: '3000盒', incentiveSales: '30000元' },
    { name: '板蓝根颗粒', qty: '2800盒', sales: '28000.0元', incentiveQty: '2500盒', incentiveSales: '25000元' },
  ];

  const nonSelling = [
    { name: '健胃消食片', code: '6901234567890', batchNumber: '20240105', category: '消化系统', activityId: 'ACT001', activityName: '夏季清爽活动', manufacturer: '江中药业股份有限公司' },
    { name: '维生素C泡腾片', code: '6901234567891', batchNumber: '20240212', category: '营养补充', activityId: 'ACT002', activityName: '健康季补贴', manufacturer: '拜耳医药保健有限公司' },
    { name: '藿香正气水', code: '6901234567892', batchNumber: '20240318', category: '暑湿感冒', activityId: 'ACT003', activityName: '清凉一夏', manufacturer: '太极集团重庆涪陵制药厂' },
    { name: '阿莫西林胶囊', code: '6901234567893', batchNumber: '20240120', category: '抗生素', activityId: 'ACT004', activityName: '秋季流感季', manufacturer: '华北制药股份有限公司' },
    { name: '感冒灵颗粒', code: '6901234567894', batchNumber: '20240225', category: '感冒用药', activityId: 'ACT005', activityName: '家庭常备药', manufacturer: '华润三九医药股份有限公司' },
  ];

  const risingStars = [
    { name: '燕窝(白燕窝)', trend: '400.00%' },
    { name: '虫草清肺胶囊', trend: '324.96%' },
    { name: '燕窝', trend: '140.00%' },
  ];

  const fallingStars = [
    { name: '健脾八珍糕', trend: '-99.37%' },
    { name: '阿莫西林克拉维酸钾干混悬剂', trend: '-98.08%' },
    { name: '他达拉非片(仁和)', trend: '-91.47%' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 space-y-4 bg-gray-50 min-h-full"
    >
      {/* Module Title */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-gray-800">品种维度</h2>
        <div className="text-xs text-gray-400">数据更新时间: 2026-03-18 08:31</div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
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

      <div className="grid grid-cols-3 gap-4">
        {/* Top Selling */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-700 flex items-center">
              <BarChart3 size={16} className="mr-2 text-blue-500" />
              动销商品前三名
            </h3>
            <span className="text-xs text-gray-400">11月数据统计</span>
          </div>
          <div className="p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2 font-medium">商品名称</th>
                  <th className="px-4 py-2 font-medium">销售数量</th>
                  <th className="px-4 py-2 font-medium">销售金额</th>
                  <th className="px-4 py-2 font-medium">激励销售数量</th>
                  <th className="px-4 py-2 font-medium">激励销售金额</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topSelling.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-700">{item.name}</td>
                    <td className="px-4 py-3 text-gray-600">{item.qty}</td>
                    <td className="px-4 py-3 text-blue-600 font-medium">{item.sales}</td>
                    <td className="px-4 py-3 text-gray-600">{item.incentiveQty}</td>
                    <td className="px-4 py-3 text-orange-600 font-medium">{item.incentiveSales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trends */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center">
              <div className="w-1.5 h-4 bg-green-500 rounded-full mr-2"></div>
              <h3 className="font-bold text-gray-700 text-sm">销售趋势上升榜</h3>
            </div>
            <div className="p-3 space-y-2">
              {risingStars.map((star, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 hover:bg-green-50 rounded-lg transition-colors">
                  <span className="text-sm text-gray-600">{star.name}</span>
                  <span className="text-sm font-bold text-green-600">+{star.trend}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center">
              <div className="w-1.5 h-4 bg-red-500 rounded-full mr-2"></div>
              <h3 className="font-bold text-gray-700 text-sm">销售趋势下降榜</h3>
            </div>
            <div className="p-3 space-y-2">
              {fallingStars.map((star, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <span className="text-sm text-gray-600">{star.name}</span>
                  <span className="text-sm font-bold text-red-600">{star.trend}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Non-Selling List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-700 flex items-center">
            <Package size={16} className="mr-2 text-gray-400" />
            未动销商品列表 (26个)
          </h3>
          <button className="text-xs text-blue-600 hover:underline">查看全部</button>
        </div>
        <div className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2 font-medium">商品名称/编码/批号</th>
                <th className="px-4 py-2 font-medium">所属品类</th>
                <th className="px-4 py-2 font-medium">配置活动ID</th>
                <th className="px-4 py-2 font-medium">活动名称</th>
                <th className="px-4 py-2 font-medium">活动厂家</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {nonSelling.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-700">{item.name}</div>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-[10px] text-gray-400">编码: {item.code}</span>
                      <span className="text-[10px] text-blue-400 bg-blue-50 px-1 rounded">批号: {item.batchNumber}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.category}</td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => onActivityClick?.(item.activityId)}
                      className="text-gray-500 font-mono text-xs hover:text-blue-600 hover:underline"
                    >
                      {item.activityId}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => onActivityClick?.(item.activityId)}
                      className="text-blue-600 hover:underline text-left"
                    >
                      {item.activityName}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{item.manufacturer}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination total={4120} currentPage={1} onPageChange={(p) => console.log(p)} />
        </div>
      </div>
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

const ActivityDimensionView = () => {
  const activityStats = [
    { title: '单品活动', total: 150, active: 120, color: 'blue' },
    { title: '疗程活动', total: 80, active: 60, color: 'orange' },
    { title: '固定关联', total: 45, active: 30, color: 'green' },
    { title: '系列激励', total: 60, active: 40, color: 'purple' },
    { title: '高频带低频激励', total: 35, active: 20, color: 'pink' },
    { title: '高频带系列激励', total: 25, active: 15, color: 'indigo' },
  ];

  return (
    <div className="p-4 space-y-4 bg-gray-50 min-h-full">
      <div className="grid grid-cols-3 gap-4">
        {activityStats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700">{stat.title}</h3>
              <span className={`px-2 py-1 rounded text-[10px] font-medium bg-${stat.color}-50 text-${stat.color}-600`}>
                活动中
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">商品总数</div>
                <div className="text-xl font-bold text-gray-800">{stat.total}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">动销商品</div>
                <div className="text-xl font-bold text-blue-600">{stat.active}</div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-50">
              <div className="text-xs text-gray-400">
                未动销: <span className="text-red-400 font-medium">{stat.total - stat.active}</span>
              </div>
              <button className="text-xs text-blue-600 hover:underline flex items-center">
                查看明细 <ChevronRight size={12} className="ml-0.5" />
              </button>
            </div>
          </div>
        ))}
        
        {/* Ranking Incentive Card */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700">排名激励</h3>
              <span className="px-2 py-1 rounded text-[10px] font-medium bg-yellow-50 text-yellow-600">
                激励中
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">单品排名激励</span>
                <span className="font-bold text-gray-700">4个</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">销售周排名激励</span>
                <span className="font-bold text-gray-700">3个</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">销售月排名激励</span>
                <span className="font-bold text-gray-700">3个</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
            <div className="text-xs text-gray-400">
              总计: <span className="text-gray-800 font-bold">10个</span>
            </div>
            <button className="text-xs text-blue-600 hover:underline flex items-center">
              查看明细 <ChevronRight size={12} className="ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Incentive Distribution View Component ---

const IncentiveDistributionView = () => {
  const overallStats = [
    { label: '10月累计发放', value: '328677.5元', date: '截止11月17日', icon: <BarChart3 className="text-blue-500" size={20} /> },
    { label: '11月累计发放', value: '11421.37元', date: '截止11月17日', icon: <ShoppingBag className="text-orange-500" size={20} /> },
    { label: '累计未提现', value: '0元', date: '无累计', icon: <Package className="text-gray-400" size={20} /> },
    { label: '当前活动类型', value: '延时豆', date: '活动中', icon: <Leaf className="text-green-500" size={20} /> },
  ];

  const employeeTop3 = [
    { name: '王艳玲', amount: '94.5' },
    { name: '常青', amount: '93.3' },
    { name: '杨艳丽', amount: '75.6' },
  ];

  const storeTop3 = [
    { name: '团结大街一店', amount: '150.1' },
    { name: '曲石大龙井店', amount: '130.98' },
    { name: '秀峰店', amount: '130.95' },
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
            整体激励发放情况
          </h3>
          <span className="text-xs text-gray-400">截止日期: 2026-11-17</span>
        </div>
        <div className="p-4 grid grid-cols-4 gap-4">
          {overallStats.map((stat, idx) => (
            <div key={idx} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-1.5 bg-white rounded-lg shadow-sm">{stat.icon}</div>
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
              <div className="text-xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-[10px] text-gray-400 mt-1">{stat.date}</div>
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
            
            <div className="space-y-3">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">获得激励前三名</div>
              <div className="grid grid-cols-3 gap-2">
                {employeeTop3.map((emp, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">{emp.name}</div>
                    <div className="text-sm font-bold text-gray-800">{emp.amount}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">激励区间分布</div>
              <div className="space-y-2">
                {[
                  { label: '低于 50 元', count: 1123, total: 1129 },
                  { label: '低于 20 元', count: 994, total: 1129 },
                  { label: '低于 10 元', count: 679, total: 1129 },
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
            
            <div className="space-y-3">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">获得激励前三名</div>
              <div className="grid grid-cols-3 gap-2">
                {storeTop3.map((store, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                    <div className="text-[10px] text-gray-500 mb-1 truncate px-1" title={store.name}>{store.name}</div>
                    <div className="text-sm font-bold text-gray-800">{store.amount}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">激励区间分布</div>
              <div className="space-y-2">
                {[
                  { label: '低于 100 元', count: 436, total: 442 },
                  { label: '低于 50 元', count: 393, total: 442 },
                  { label: '低于 20 元', count: 215, total: 442 },
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

const BusinessSettingsView = () => {
  const [activeTab, setActiveTab] = useState('订单配置');
  const [publicIncentiveEnabled, setPublicIncentiveEnabled] = useState(false);
  const [publicIncentiveTypes, setPublicIncentiveTypes] = useState<string[]>(['none']);
  const [publicNonePaymentMethods, setPublicNonePaymentMethods] = useState<string[]>(['1/货到付款']);
  const [publicCustomPaymentMethods, setPublicCustomPaymentMethods] = useState<string[]>([]);
  const [publicCustomActivePaymentMethod, setPublicCustomActivePaymentMethod] = useState<string | null>(null);
  const [publicPaymentModalType, setPublicPaymentModalType] = useState<'none' | 'custom' | null>(null);
  
  // Private Domain + Offline Retail Turnover States
  const [privateIncentiveEnabled, setPrivateIncentiveEnabled] = useState(false);
  const [privateIncentiveModes, setPrivateIncentiveModes] = useState<string[]>(['none']);
  const [privateSelectedMemberLevels, setPrivateSelectedMemberLevels] = useState<string[]>([]);
  const [privateNonePaymentMethods, setPrivateNonePaymentMethods] = useState<string[]>([]);
  const [privateCustomPaymentMethods, setPrivateCustomPaymentMethods] = useState<string[]>([]);
  const [privateCustomActivePaymentMethod, setPrivateCustomActivePaymentMethod] = useState<string | null>(null);
  const [privatePaymentModalType, setPrivatePaymentModalType] = useState<'none' | 'custom' | null>(null);
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
            </div>

            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <div className="text-xs text-gray-400">提示：活动商品最多添加100件</div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setShowPrivateProductModal(false)}
                  className="px-6 py-1.5 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    handleAddPrivateProduct([{ code: '009385', ratio: '' }]);
                    setShowPrivateProductModal(false);
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

      {/* Floating Action Buttons */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <button className="flex items-center space-x-1 px-4 py-2 border border-blue-600 text-blue-600 rounded bg-white text-sm hover:bg-blue-50 transition-colors shadow-sm font-medium">
          <Edit3 size={14} />
          <span>编辑</span>
        </button>
      </div>
      <div className="absolute bottom-4 right-4">
        <button className="px-6 py-2 bg-blue-600 text-white rounded shadow-md hover:bg-blue-700 transition-colors text-sm font-medium">
          保存设置
        </button>
      </div>
    </div>
  );
};

const HomeView = ({ onActivityClick }: { onActivityClick?: (id: string) => void }) => {
  const [activeTab, setActiveTab] = useState('品种维度');

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white px-4 border-b border-gray-200 flex items-center">
        <TabItem label="品种维度" active={activeTab === '品种维度'} onClick={() => setActiveTab('品种维度')} />
        <TabItem label="活动维度" active={activeTab === '活动维度'} onClick={() => setActiveTab('活动维度')} />
        <TabItem label="激励发放情况" active={activeTab === '激励发放情况'} onClick={() => setActiveTab('激励发放情况')} />
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === '品种维度' ? <VarietyDimensionView onActivityClick={onActivityClick} /> : 
         activeTab === '活动维度' ? <ActivityDimensionView /> : 
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

function CreateActivityView({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);

  const steps = ['创建活动信息', '配置激励政策', '活动商品', '活动门店'];

  return (
    <div className="p-6 bg-white min-h-full">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="text-gray-600 hover:text-blue-600 flex items-center mr-4">
          <ArrowLeft size={18} className="mr-1" /> 返回
        </button>
        <h2 className="text-lg font-bold text-gray-800">代厂家建活动</h2>
      </div>

      <div className="flex items-center mb-8 bg-gray-50 p-4 rounded-lg">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i + 1}
            </div>
            <span className={`ml-2 text-sm ${step === i + 1 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>{s}</span>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-gray-300 mx-4" />}
          </div>
        ))}
      </div>

      {step === 1 ? (
        <div className="space-y-6 max-w-3xl">
          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-2 text-sm text-right text-gray-600"><span className="text-red-500">*</span> 海典服务费</label>
            <div className="col-span-10 flex items-center space-x-4">
              <label className="flex items-center"><input type="radio" name="serviceFee" className="mr-2" defaultChecked /> 连锁汇付账号</label>
              <label className="flex items-center"><input type="radio" name="serviceFee" className="mr-2" /> 厂家汇账号</label>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-2 text-sm text-right text-gray-600"><span className="text-red-500">*</span> 关联工业</label>
            <select className="col-span-10 border border-gray-300 rounded px-3 py-2 text-sm">
              <option>请选择</option>
            </select>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-2 text-sm text-right text-gray-600"><span className="text-red-500">*</span> 活动主题</label>
            <div className="col-span-10 relative">
              <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" maxLength={30} />
              <span className="absolute right-3 top-2 text-xs text-gray-400">0/30</span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-start">
            <label className="col-span-2 text-sm text-right text-gray-600 pt-2"><span className="text-red-500">*</span> 激励模式</label>
            <div className="col-span-10 space-y-2">
              <label className="flex items-center"><input type="radio" name="mode" className="mr-2" defaultChecked /> 及时豆模式，即时激励，实时向店员发放销售激励 <span className="ml-2 bg-orange-100 text-orange-600 text-[10px] px-1.5 rounded">推荐</span></label>
              <label className="flex items-center"><input type="radio" name="mode" className="mr-2" /> 延时豆模式，由连锁线下向店员结算销售激励</label>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-2 text-sm text-right text-gray-600"><span className="text-red-500">*</span> 激励计算</label>
            <div className="col-span-10 flex items-center space-x-4">
              <label className="flex items-center"><input type="radio" name="calc" className="mr-2" defaultChecked /> 按商品数量</label>
              <label className="flex items-center"><input type="radio" name="calc" className="mr-2" /> 按商品金额</label>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-2 text-sm text-right text-gray-600"><span className="text-red-500">*</span> 激励发放</label>
            <span className="col-span-10 text-sm text-gray-800">按固定金额</span>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-2 text-sm text-right text-gray-600">关联目标</label>
            <div className="col-span-10 flex items-center space-x-4">
              <select className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm">
                <option>请选择</option>
              </select>
              <button className="text-blue-600 text-sm">新建目标</button>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-2"></div>
            <div className="col-span-10 bg-orange-50 text-orange-600 text-xs p-2 rounded flex items-center">
              <Info size={14} className="mr-1" /> 仅限发布状态为【已发布】的目标活动
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-2 text-sm text-right text-gray-600"><span className="text-red-500">*</span> 活动时间</label>
            <div className="col-span-10 flex items-center space-x-2">
              <input type="date" className="border border-gray-300 rounded px-3 py-2 text-sm" />
              <span>至</span>
              <input type="date" className="border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-start">
            <label className="col-span-2 text-sm text-right text-gray-600 pt-2">活动封面</label>
            <div className="col-span-10">
              <div className="w-32 h-24 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-400">
                <Plus size={24} />
              </div>
              <p className="text-xs text-gray-400 mt-2">建议240*160px，格式PNG，JPG，JPEG不超过2M</p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-start">
            <label className="col-span-2 text-sm text-right text-gray-600 pt-2"><span className="text-red-500">*</span> 活动简介</label>
            <div className="col-span-10 relative">
              <textarea className="w-full h-24 border border-gray-300 rounded px-3 py-2 text-sm" maxLength={300}></textarea>
              <span className="absolute right-3 bottom-2 text-xs text-gray-400">0/300</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex space-x-4">
            <button className="px-6 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">仅保存</button>
            <button onClick={() => setStep(2)} className="px-6 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">保存并设置政策</button>
          </div>
        </div>
      ) : step === 2 ? (
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <Info size={18} className="text-blue-600 mt-0.5 shrink-0" />
            <div className="space-y-2">
              <p className="text-xs text-blue-800">
                *当同一个商品在不同活动中设置了不同的激励政策时，我们将按照以下优先级进行奖励发放（激励退还将按照此优先级反向进行）：
              </p>
              <div className="flex items-center space-x-2 text-[10px] text-gray-600">
                <span>固定组合关联</span> <ChevronRight size={12} />
                <span>高频带低频关联</span> <ChevronRight size={12} />
                <span>高频带系列关联</span> <ChevronRight size={12} />
                <span>系列关联-任意组合</span> <ChevronRight size={12} />
                <span>疗程销售激励</span> <ChevronRight size={12} />
                <span>单品销售奖励</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 border-b border-gray-200 mb-6">
            {['单品销售激励', '疗程销售激励', '关联销售激励', '销售排行激励'].map(tab => (
              <button key={tab} className={`pb-2 text-sm ${tab === '单品销售激励' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-orange-50 text-orange-600 text-xs p-3 rounded mb-4 flex items-center">
            <Info size={14} className="mr-1" /> 注意：同一商品设置“按商品批号激励”，则不能再设置其他任何激励政策(包含单品、疗程、关联、销售排行)；
          </div>

          <div className="flex space-x-4 text-sm mb-4">
            <button className="text-blue-600 border-b-2 border-blue-600 pb-1">按商品激励</button>
            <button className="text-gray-600">按商品批号激励</button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <button className="text-blue-600 text-sm flex items-center"><Plus size={16} className="mr-1" /> 添加商品</button>
              <button className="text-gray-600 text-sm">批量删除</button>
              <button className="text-gray-600 text-sm">导入商品</button>
              <button className="text-gray-600 text-sm">导出</button>
            </div>
            <div className="flex space-x-2">
              <select className="border border-gray-300 rounded px-2 py-1 text-sm"><option>商品编码</option></select>
              <input type="text" placeholder="请输入商品编码" className="border border-gray-300 rounded px-2 py-1 text-sm" />
              <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm">查询</button>
              <button className="border border-gray-300 rounded px-4 py-1 text-sm">重置</button>
            </div>
          </div>

          <table className="w-full border-collapse border border-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 border border-gray-200 text-left">商品信息</th>
                <th className="p-3 border border-gray-200 text-left">激励政策</th>
                <th className="p-3 border border-gray-200 text-left">更新时间</th>
                <th className="p-3 border border-gray-200 text-left">营销政策</th>
                <th className="p-3 border border-gray-200 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">暂无数据</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-8 flex justify-end space-x-4">
            <button onClick={() => setStep(1)} className="px-6 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">上一步</button>
            <button onClick={() => setStep(3)} className="px-6 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">下一步</button>
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
  );
}

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
            <HomeView onActivityClick={(id) => {
              setActiveSubItem('我的活动');
              setSelectedActivityId(id);
            }} />
          ) : activeSubItem === '我的活动' ? (
            selectedActivityId ? (
              <ActivityDetailView id={selectedActivityId} onBack={() => setSelectedActivityId(null)} />
            ) : (
              <MyActivitiesView onDetailClick={(id) => setSelectedActivityId(id)} onCreateClick={() => setActiveSubItem('创建活动')} />
            )
          ) : activeSubItem === '创建活动' ? (
            <CreateActivityView onBack={() => setActiveSubItem('我的活动')} />
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
