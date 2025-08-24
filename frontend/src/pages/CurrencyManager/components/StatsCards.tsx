import React from 'react'
import { Row, Col } from 'antd'
import { BarChartOutlined } from '@ant-design/icons'
import type { GlobalStats } from '@/types/CurrencyManager'

interface StatsCardsProps {
  stats: GlobalStats
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-lg mb-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <BarChartOutlined className="text-purple-400" />
        数据统计
      </h3>
      <Row gutter={16}>
        <Col span={6}>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="text-sm text-slate-400 mb-2">总充值金额</div>
            <div className="text-2xl font-bold text-green-400">
              ¥{stats.total_amount.toLocaleString()}
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="text-sm text-slate-400 mb-2">总充值次数</div>
            <div className="text-2xl font-bold text-blue-400">
              {stats.total_count.toLocaleString()}
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="text-sm text-slate-400 mb-2">首充用户数</div>
            <div className="text-2xl font-bold text-purple-400">
              {stats.first_recharge_users.toLocaleString()}
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-4">
            <div className="text-sm text-slate-400 mb-2">今日充值</div>
            <div className="text-2xl font-bold text-orange-400">
              ¥{stats.today_amount.toLocaleString()}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}
