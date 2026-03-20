import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, MessageCircle, MonitorSmartphone } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'toyshine' && password === '123') {
      onLogin();
    } else {
      setError('账号或密码错误');
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f5ff] flex flex-col relative overflow-hidden font-sans">
      {/* Background Waves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-40">
        <div className="absolute w-[150%] h-[150%] border-[1px] border-blue-200 rounded-[40%] animate-[spin_20s_linear_infinite] opacity-30"></div>
        <div className="absolute w-[140%] h-[140%] border-[1px] border-blue-300 rounded-[45%] animate-[spin_25s_linear_infinite_reverse] opacity-20"></div>
        <div className="absolute w-[160%] h-[160%] border-[1px] border-blue-200 rounded-[35%] animate-[spin_30s_linear_infinite] opacity-20"></div>
      </div>

      {/* Header Logo */}
      <div className="absolute top-8 left-10 flex items-center space-x-2 z-10">
        <div className="flex space-x-0.5">
          <div className="w-2 h-5 bg-red-500 rounded-sm transform -skew-x-12"></div>
          <div className="w-2 h-5 bg-blue-500 rounded-sm transform -skew-x-12"></div>
          <div className="w-2 h-5 bg-yellow-500 rounded-sm transform -skew-x-12"></div>
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-widest ml-2">海典软件</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center z-10 p-4">
        <div className="flex w-full max-w-[1100px] items-center justify-between gap-10">
          
          {/* Left Illustration Area */}
          <div className="hidden md:flex flex-col items-center justify-center w-[500px]">
            <div className="w-full h-[350px] relative mb-8 flex items-center justify-center">
               <img 
                 src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop" 
                 alt="Illustration" 
                 className="w-full h-full object-cover rounded-3xl shadow-2xl"
               />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4 tracking-[0.2em]">海典数字医药</h1>
            <p className="text-gray-500 tracking-[0.4em] text-lg">专 注 药 店 数 字 化 升 级</p>
          </div>

          {/* Right Login Form */}
          <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-2xl p-12">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">欢迎登录</h2>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                    placeholder="请输入账号 (toyshine)"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                    placeholder="请输入密码 (123)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <div className="flex items-center justify-end">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                  忘记密码
                </a>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-[#0052ff] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-2"
              >
                登录
              </button>

              <div className="pt-8 flex items-center justify-center space-x-10 text-sm text-gray-500">
                <button type="button" className="flex items-center space-x-1.5 hover:text-gray-700 transition-colors">
                  <MessageCircle className="h-5 w-5 text-[#07c160]" />
                  <span>微信扫码登录</span>
                </button>
                <button type="button" className="flex items-center space-x-1.5 hover:text-gray-700 transition-colors">
                  <MonitorSmartphone className="h-5 w-5 text-[#2b7cff]" />
                  <span>企微扫码登录</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 w-full text-center text-sm text-gray-400 z-10">
        Copyright © 2016-2026 上海海典软件股份有限公司 版权所有 沪ICP备10208754号
      </div>
    </div>
  );
}
