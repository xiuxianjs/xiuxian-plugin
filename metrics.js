// ====== 性能/资源占用周期性输出 ======
// 环境变量控制：
//   METRICS=0  关闭
//   METRICS_INTERVAL_MS=数值  调整间隔（毫秒，默认 6000）
//   METRICS_MODE=table|line|json  输出格式(默认 table)
// 日志说明：
//   rss       常驻集大小 (物理内存占用)
//   heapUsed  V8 已使用堆
//   heapTotal V8 分配堆总量
//   ext       C++ 对象等额外内存
//   arrBuf    ArrayBuffer 相关内存
//   cpu%      该时间片内 (user+system)/墙钟时间/核数 *100
// =====================================

const enableMetrics = process.env.METRICS !== '0'
if (enableMetrics) {
  const os = await import('os')
  const cores = os.cpus()?.length || 1
  const interval =
    Number(process.env.METRICS_INTERVAL_MS) > 0
      ? Number(process.env.METRICS_INTERVAL_MS)
      : 6_000
  const mode = (process.env.METRICS_MODE || 'table').toLowerCase()
  const langEnv = process.env.METRICS_LANG
  const lang = (langEnv || 'en').toLowerCase() // en|zh
  const bilingual = !langEnv // 未显式指定语言 -> 双语
  const enableColor = process.env.METRICS_COLOR !== '0'

  const log = (...args) => {
    try {
      if (globalThis.logger && typeof globalThis.logger.info === 'function') {
        globalThis.logger.info(...args)
      } else {
        console.log('[METRICS]', ...args)
      }
    } catch {
      console.log('[METRICS]', ...args)
    }
  }

  let lastCpu = process.cpuUsage()
  let lastTime = process.hrtime.bigint()
  let lastHandles = 0
  let lastRequests = 0
  // Event loop lag 估计
  let loopDelaySum = 0
  let loopDelayCount = 0
  let prevCheck = performance.now()
  const loopMonitor = () => {
    const now = performance.now()
    const diff = now - prevCheck
    // 理论 diff ~ 500ms
    const lag = diff - 500
    if (lag > 0) {
      loopDelaySum += lag
      loopDelayCount++
    }
    prevCheck = now
    setTimeout(loopMonitor, 500).unref?.()
  }
  setTimeout(loopMonitor, 500).unref?.()

  // GC 统计（需要 --expose-gc，否则只能标注不可用）
  const gcCount = 0
  const gcTimeMs = 0
  const hasGC = typeof global.gc === 'function'
  if (hasGC) {
    // 被动无法直接 hook GC；这里只能主动触发采样(可选)；默认不主动调用 global.gc 以避免影响性能
  }

  function formatBytes(b) {
    if (b < 1024) return b + 'B'
    const u = ['KB', 'MB', 'GB', 'TB']
    let i = -1
    let v = b
    do {
      v /= 1024
      i++
    } while (v >= 1024 && i < u.length - 1)
    return v.toFixed(2) + u[i]
  }

  // 英文 -> 中文 标签映射（含简短含义）。若需更详细解释，可扩展。
  const LABEL_I18N = {
    'Uptime': '运行时长',
    'CPU': 'CPU占比',
    'Heap Used': '已用堆',
    'Heap Total': '堆总量',
    'Heap Usage%': '堆使用率',
    'RSS': '常驻内存',
    'External': '原生扩展内存',
    'ArrayBuffers': 'ArrayBuffer内存',
    'Handles': '活动句柄数',
    'Requests': '活动请求数',
    'EvtLoopLag': '事件循环延迟',
    'LoadAvg': '系统平均负载',
    'GC Enabled': 'GC可用',
    'GC Count': 'GC次数',
    'GC Time': 'GC累计耗时'
  }

  // JSON 字段中文含义映射（只在 lang=zh 时附加 metrics_zh 字段）
  const FIELD_MEANING_ZH = {
    ts: '时间戳 (ISO)',
    uptime_s: '运行秒数',
    cpu_pct: 'CPU百分比(本进程)',
    heap_used: 'V8堆已使用字节',
    heap_total: 'V8堆已分配总字节',
    heap_usage_pct: '堆使用率%',
    rss: '常驻集内存字节',
    rss_pct_of_sysmem: 'RSS占系统物理内存%',
    external: 'C++/外部内存字节',
    array_buffers: 'ArrayBuffer相关字节',
    handles: '活动句柄数量',
    handle_delta: '相对上次句柄变化',
    requests: '活动请求数量',
    request_delta: '相对上次请求变化',
    avg_loop_lag_ms: '平均事件循环延迟ms',
    load: '系统1/5/15分钟负载',
    gc: 'GC信息对象(enabled/count/time_ms)'
  }

  // ========== 指标分类逻辑 ==========
  const STATUS_I18N = {
    good: { zh: '低', en: 'low' },
    moderate: { zh: '中', en: 'medium' },
    high: { zh: '高', en: 'high' },
    critical: { zh: '危', en: 'critical' }
  }

  const COLOR = {
    reset: '\u001b[0m',
    green: '\u001b[32m',
    yellow: '\u001b[33m',
    red: '\u001b[31m',
    magenta: '\u001b[35m'
  }

  function wrapColor(level, text) {
    if (!enableColor) return text
    switch (level) {
      case 'good':
        return COLOR.green + text + COLOR.reset
      case 'moderate':
        return COLOR.yellow + text + COLOR.reset
      case 'high':
        return COLOR.red + text + COLOR.reset
      case 'critical':
        return COLOR.magenta + text + COLOR.reset
      default:
        return text
    }
  }

  function classifyCpu(v) {
    // CPU 百分比(已平摊多核)。
    if (v < 20)
      return { level: 'good', desc_zh: 'CPU负载低', desc_en: 'Low CPU usage' }
    if (v < 70)
      return {
        level: 'moderate',
        desc_zh: 'CPU适中',
        desc_en: 'Moderate CPU usage'
      }
    if (v < 90)
      return {
        level: 'high',
        desc_zh: 'CPU较高，注意容量',
        desc_en: 'High CPU usage'
      }
    return {
      level: 'critical',
      desc_zh: 'CPU接近瓶颈',
      desc_en: 'CPU near saturation'
    }
  }
  function classifyHeap(pct) {
    if (pct < 60)
      return {
        level: 'good',
        desc_zh: '堆使用充足',
        desc_en: 'Plenty of heap headroom'
      }
    if (pct < 85)
      return {
        level: 'moderate',
        desc_zh: '堆使用正常',
        desc_en: 'Normal heap usage'
      }
    if (pct < 95)
      return {
        level: 'high',
        desc_zh: '堆偏高可观察 GC 锯齿',
        desc_en: 'High heap usage; observe GC'
      }
    return {
      level: 'critical',
      desc_zh: '堆接近上限，可能触发频繁GC',
      desc_en: 'Heap near limit; risk of frequent GC'
    }
  }
  function classifyRss(pct) {
    // RSS 占物理内存百分比（容器内可能失真）。
    if (pct < 2)
      return {
        level: 'good',
        desc_zh: 'RSS占用低',
        desc_en: 'Low RSS footprint'
      }
    if (pct < 5)
      return { level: 'moderate', desc_zh: 'RSS正常', desc_en: 'Normal RSS' }
    if (pct < 10)
      return { level: 'high', desc_zh: 'RSS较高', desc_en: 'High RSS' }
    return {
      level: 'critical',
      desc_zh: 'RSS过高需排查',
      desc_en: 'Excessive RSS; investigate'
    }
  }
  function classifyLag(ms) {
    if (ms < 20)
      return {
        level: 'good',
        desc_zh: '事件循环流畅',
        desc_en: 'Smooth event loop'
      }
    if (ms < 100)
      return {
        level: 'moderate',
        desc_zh: '事件循环轻微延迟',
        desc_en: 'Minor loop lag'
      }
    if (ms < 200)
      return {
        level: 'high',
        desc_zh: '事件循环卡顿',
        desc_en: 'Notable loop lag'
      }
    return {
      level: 'critical',
      desc_zh: '严重卡顿',
      desc_en: 'Severe loop lag'
    }
  }
  function classifyLoad(load1, cores) {
    const ratio = cores ? load1 / cores : load1
    if (ratio < 0.7)
      return {
        level: 'good',
        desc_zh: '系统负载充足',
        desc_en: 'Plenty capacity'
      }
    if (ratio < 1.0)
      return {
        level: 'moderate',
        desc_zh: '系统负载适中',
        desc_en: 'Moderate system load'
      }
    if (ratio < 1.5)
      return {
        level: 'high',
        desc_zh: '接近满载',
        desc_en: 'Approaching saturation'
      }
    return {
      level: 'critical',
      desc_zh: '系统可能过载',
      desc_en: 'System overload risk'
    }
  }

  setInterval(() => {
    try {
      const m = process.memoryUsage()
      const nowCpu = process.cpuUsage()
      const nowTime = process.hrtime.bigint()
      const cpuUserDiff = nowCpu.user - lastCpu.user // microseconds
      const cpuSysDiff = nowCpu.system - lastCpu.system // microseconds
      const timeDiffNs = Number(nowTime - lastTime) // ns
      const wallSec = timeDiffNs / 1e9 || 1 // avoid div 0
      const cpuTotalMs = (cpuUserDiff + cpuSysDiff) / 1000 // ms
      const cpuPercent = (cpuTotalMs / 1000 / wallSec / cores) * 100 // (CPU 秒 / 墙钟秒 / 核) *100

      lastCpu = nowCpu
      lastTime = nowTime

      // 句柄/请求数量 (Node 内部 API 仅供参考)
      const handles = (process._getActiveHandles?.() || []).length
      const requests = (process._getActiveRequests?.() || []).length
      const handleDelta = handles - lastHandles
      const requestDelta = requests - lastRequests
      lastHandles = handles
      lastRequests = requests

      // event loop avg lag
      const avgLoopLag = loopDelayCount ? loopDelaySum / loopDelayCount : 0
      loopDelaySum = 0
      loopDelayCount = 0

      // 负载
      const [load1, load5, load15] = os.loadavg()

      const heapUsageRate = m.heapTotal ? (m.heapUsed / m.heapTotal) * 100 : 0
      const totalMem = os.totalmem()
      const rssRate = totalMem ? (m.rss / totalMem) * 100 : 0

      const data = {
        ts: new Date().toISOString(),
        uptime_s: Number(process.uptime().toFixed(0)),
        cpu_pct: Number(cpuPercent.toFixed(2)),
        heap_used: m.heapUsed,
        heap_total: m.heapTotal,
        heap_usage_pct: Number(heapUsageRate.toFixed(2)),
        rss: m.rss,
        rss_pct_of_sysmem: Number(rssRate.toFixed(2)),
        external: m.external,
        array_buffers: m.arrayBuffers || 0,
        handles,
        handle_delta: handleDelta,
        requests,
        request_delta: requestDelta,
        avg_loop_lag_ms: Number(avgLoopLag.toFixed(2)),
        load: {
          l1: load1.toFixed(2),
          l5: load5.toFixed(2),
          l15: load15.toFixed(2)
        },
        gc: {
          enabled: hasGC,
          count: gcCount,
          time_ms: Number(gcTimeMs.toFixed(2))
        }
      }

      // 状态判定
      const statCpu = classifyCpu(data.cpu_pct)
      const statHeap = classifyHeap(data.heap_usage_pct)
      const statRss = classifyRss(data.rss_pct_of_sysmem)
      const statLag = classifyLag(data.avg_loop_lag_ms)
      const statLoad = classifyLoad(Number(data.load.l1), cores)

      function fmtStatus(s) {
        const lvlZh = STATUS_I18N[s.level]?.zh || s.level
        const lvlEn = STATUS_I18N[s.level]?.en || s.level
        if (bilingual)
          return wrapColor(
            s.level,
            `${lvlZh}/${lvlEn}/${s.desc_zh}/${s.desc_en}`
          )
        if (lang === 'zh') return wrapColor(s.level, `${lvlZh}/${s.desc_zh}`)
        return wrapColor(s.level, `${lvlEn}/${s.desc_en}`)
      }

      function localizeLabel(label) {
        const zh = LABEL_I18N[label]
        if (bilingual) return zh ? `${label}(${zh})` : label
        if (lang === 'zh') return zh ? `${label}(${zh})` : label
        return label
      }

      function pad(label, val) {
        return localizeLabel(label).padEnd(20, ' ') + val
      }

      if (mode === 'json') {
        const status = {
          cpu: statCpu,
          heap: statHeap,
          rss: statRss,
          event_loop_lag: statLag,
          load: statLoad
        }
        if (bilingual || lang === 'zh') {
          log(
            JSON.stringify({
              metrics: data,
              status,
              metrics_zh_meaning: FIELD_MEANING_ZH
            })
          )
        } else {
          log(JSON.stringify({ metrics: data, status }))
        }
      } else if (mode === 'line') {
        const line = [
          `up=${data.uptime_s}s`,
          `cpu=${data.cpu_pct}%`,
          `heap=${formatBytes(m.heapUsed)}/${formatBytes(m.heapTotal)}(${data.heap_usage_pct.toFixed(2)}%)`,
          `rss=${formatBytes(m.rss)}(${data.rss_pct_of_sysmem}%)`,
          `hdl=${handles}(${handleDelta >= 0 ? '+' : ''}${handleDelta})`,
          `req=${requests}(${requestDelta >= 0 ? '+' : ''}${requestDelta})`,
          `loopLag=${data.avg_loop_lag_ms}ms`,
          `load=${data.load.l1}/${data.load.l5}/${data.load.l15}`,
          bilingual
            ? `S(cpu:${STATUS_I18N[statCpu.level].zh}/${STATUS_I18N[statCpu.level].en}` +
              ` heap:${STATUS_I18N[statHeap.level].zh}/${STATUS_I18N[statHeap.level].en}` +
              ` rss:${STATUS_I18N[statRss.level].zh}/${STATUS_I18N[statRss.level].en}` +
              ` lag:${STATUS_I18N[statLag.level].zh}/${STATUS_I18N[statLag.level].en}` +
              ` load:${STATUS_I18N[statLoad.level].zh}/${STATUS_I18N[statLoad.level].en}` +
              `)`
            : `S(cpu:${STATUS_I18N[statCpu.level][lang]} heap:${STATUS_I18N[statHeap.level][lang]} rss:${STATUS_I18N[statRss.level][lang]} lag:${STATUS_I18N[statLag.level][lang]} load:${STATUS_I18N[statLoad.level][lang]})`
        ].join(' | ')
        if (bilingual) {
          log(line + ' | 说明: 低/low 中/medium 高/high 危/critical')
        } else if (lang === 'zh') {
          log(line + ' | 说明: 低=良好 中=注意 高=偏高 危=严重')
        } else {
          log(line)
        }
      } else {
        // table
        const table =
          `\n[METRICS] ${data.ts}\n` +
          pad('Uptime', data.uptime_s + ' s') +
          '\n' +
          pad('CPU', data.cpu_pct + ' % ' + fmtStatus(statCpu)) +
          '\n' +
          pad(
            'Heap Used',
            formatBytes(m.heapUsed) + ' ' + fmtStatus(statHeap)
          ) +
          '\n' +
          pad('Heap Total', formatBytes(m.heapTotal)) +
          '\n' +
          pad('Heap Usage%', data.heap_usage_pct + ' %') +
          '\n' +
          pad(
            'RSS',
            formatBytes(m.rss) +
              ` (${data.rss_pct_of_sysmem}%) ` +
              fmtStatus(statRss)
          ) +
          '\n' +
          pad('External', formatBytes(m.external)) +
          '\n' +
          pad('ArrayBuffers', formatBytes(m.arrayBuffers || 0)) +
          '\n' +
          pad(
            'Handles',
            `${handles} (${handleDelta >= 0 ? '+' : ''}${handleDelta})`
          ) +
          '\n' +
          pad(
            'Requests',
            `${requests} (${requestDelta >= 0 ? '+' : ''}${requestDelta})`
          ) +
          '\n' +
          pad(
            'EvtLoopLag',
            data.avg_loop_lag_ms + ' ms ' + fmtStatus(statLag)
          ) +
          '\n' +
          pad(
            'LoadAvg',
            `${data.load.l1} / ${data.load.l5} / ${data.load.l15} ${fmtStatus(statLoad)}`
          ) +
          '\n' +
          pad('GC Enabled', String(hasGC)) +
          '\n' +
          pad('GC Count', gcCount) +
          '\n' +
          pad('GC Time', gcTimeMs.toFixed(2) + ' ms') +
          '\n'
        log(table)
      }
    } catch (e) {
      console.error('[METRICS] 采集失败', e)
    }
  }, interval).unref?.()

  // 首次立即输出一行基线数据
  setTimeout(() => {
    const m = process.memoryUsage()
    log(
      `METRICS 启动 interval=${interval}ms mode=${mode} rss=${formatBytes(m.rss)} heap=${formatBytes(m.heapUsed)}/${formatBytes(m.heapTotal)}`
    )
  }, 0)
}
