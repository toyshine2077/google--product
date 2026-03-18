/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
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
  FileText
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

const Pagination = ({ total, pageSize = 5 }: { total: number, pageSize?: number }) => (
  <div className="mt-4 flex items-center justify-between text-[11px] text-gray-500 px-4 py-3 border-t border-gray-100 bg-white">
    <div className="flex items-center space-x-1">
      <span>共</span>
      <span className="font-medium text-gray-700">{total}</span>
      <span>条</span>
    </div>
    <div className="flex items-center space-x-1.5">
      <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" disabled>
        <ChevronLeft size={14} />
      </button>
      <button className="w-7 h-7 flex items-center justify-center bg-blue-600 text-white rounded-md font-medium shadow-sm shadow-blue-200">1</button>
      <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition-colors">2</button>
      <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition-colors">3</button>
      <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition-colors">4</button>
      <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition-colors">5</button>
      <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition-colors">6</button>
      <span className="px-1 text-gray-300">...</span>
      <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition-colors">824</button>
      <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
        <ChevronRight size={14} />
      </button>
      
      <div className="flex items-center ml-2 space-x-2">
        <select className="border border-gray-200 rounded-md px-2 py-1 bg-white outline-none focus:border-blue-400 transition-colors cursor-pointer">
          <option>{pageSize}条/页</option>
          <option>10条/页</option>
          <option>20条/页</option>
        </select>
        <div className="flex items-center space-x-1">
          <span>跳转至</span>
          <input type="text" className="w-9 border border-gray-200 rounded-md px-1 py-1 text-center outline-none focus:border-blue-400 transition-colors" defaultValue="1" />
          <span>页</span>
        </div>
      </div>
    </div>
  </div>
);

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
          <Pagination total={4120} />
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

const MyActivitiesView = ({ onDetailClick }: { onDetailClick: (id: string) => void }) => {
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
            <button className="bg-blue-600 text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-blue-700 transition-colors flex items-center shadow-sm">
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
          <Pagination total={12785} pageSize={10} />
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

export default function App() {
  const [activeMainTab, setActiveMainTab] = useState('慢病活动');
  const [activeSidebar, setActiveSidebar] = useState('四季蝉');
  const [expandedSubmenu, setExpandedSubmenu] = useState('活动管理');
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
          <SidebarItem icon={Leaf} label="四季蝉" onClick={() => setActiveSidebar('四季蝉')} active={activeSidebar === '四季蝉'} />
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
              <MyActivitiesView onDetailClick={(id) => setSelectedActivityId(id)} />
            )
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
