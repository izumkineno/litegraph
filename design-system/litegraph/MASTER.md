# 设计系统主文件

> **规则：** 当你要实现某个具体页面时，先检查 `design-system/pages/[page-name].md`。  
> 如果该文件存在，其规则 **优先于** 本主文件。  
> 如果不存在，则严格遵循本文件规则。

---

**项目：** LiteGraph  
**生成时间：** 2026-02-19 11:04:37  
**类别：** 开发者工具 / IDE

---

## 全局规则

### 色彩方案

| 角色 | Hex | CSS 变量 |
|------|-----|----------|
| 主色 | `#1E293B` | `--color-primary` |
| 次色 | `#334155` | `--color-secondary` |
| CTA/强调 | `#22C55E` | `--color-cta` |
| 背景 | `#0F172A` | `--color-background` |
| 文本 | `#F8FAFC` | `--color-text` |

**配色说明：** 深色代码风 + 运行态绿色强调

### 字体系统

- **标题字体：** JetBrains Mono
- **正文字体：** IBM Plex Sans
- **风格关键词：** 代码感、开发者、技术向、精确、功能导向
- **Google Fonts：** [JetBrains Mono + IBM Plex Sans](https://fonts.google.com/share?selection.family=IBM+Plex+Sans:wght@300;400;500;600;700|JetBrains+Mono:wght@400;500;600;700)

**CSS 引入：**
```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
```

### 间距变量

| Token | 数值 | 用途 |
|-------|------|------|
| `--space-xs` | `4px` / `0.25rem` | 极小间隙 |
| `--space-sm` | `8px` / `0.5rem` | 图标间距、行内间距 |
| `--space-md` | `16px` / `1rem` | 标准内边距 |
| `--space-lg` | `24px` / `1.5rem` | 区块内边距 |
| `--space-xl` | `32px` / `2rem` | 大间距 |
| `--space-2xl` | `48px` / `3rem` | 区块外边距 |
| `--space-3xl` | `64px` / `4rem` | Hero 区内边距 |

### 阴影层级

| 层级 | 数值 | 用途 |
|------|------|------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | 轻微悬浮 |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | 卡片、按钮 |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | 弹窗、下拉菜单 |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero 图片、重点卡片 |

---

## 组件规范

### 按钮

```css
/* 主按钮 */
.btn-primary {
  background: #22C55E;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* 次按钮 */
.btn-secondary {
  background: transparent;
  color: #1E293B;
  border: 2px solid #1E293B;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### 卡片

```css
.card {
  background: #0F172A;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### 输入框

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #1E293B;
  outline: none;
  box-shadow: 0 0 0 3px #1E293B20;
}
```

### 弹窗

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## 风格指南

**视觉风格：** 鲜明、块面化

**关键词：** 大胆、活力、趣味、块状布局、几何形态、高对比、双色调、现代

**适用场景：** 创业产品、创意机构、游戏、社交媒体、年轻用户产品、娱乐与消费类

**关键效果：** 大区块间距（48px+）、动态背景图案、明显 hover（颜色变化）、scroll-snap、大字号（32px+）、200-300ms 过渡

### 页面模式

**模式名：** FAQ / 文档落地页

- **转化策略：** 降低支持工单；跟踪搜索行为；展示相关文章；提供升级联系路径。
- **CTA 布局：** 强化搜索框 + 对“未解决问题”的联系入口。
- **区块顺序：** 1. 带搜索框的 Hero，2. 热门分类，3. FAQ 折叠列表，4. 联系/支持 CTA。

---

## 反模式（禁止）

- 扁平但无层次的视觉设计
- 文本堆叠过重的页面

### 额外禁用项

- **用 Emoji 当图标**：请使用 SVG 图标（Heroicons、Lucide、Simple Icons）
- **缺少 `cursor:pointer`**：所有可点击元素必须设置 `cursor:pointer`
- **导致布局抖动的 hover**：避免使用会影响布局的缩放变换
- **低对比文本**：文本对比度至少 4.5:1
- **瞬时状态变化**：统一使用 150-300ms 过渡
- **不可见焦点态**：必须提供可见焦点样式，保证可访问性

---

## 交付前检查清单

交付 UI 代码前，请确认：

- [ ] 图标不使用 Emoji（改用 SVG）
- [ ] 图标来自同一套图标系统（Heroicons/Lucide）
- [ ] 所有可点击元素都设置 `cursor-pointer`
- [ ] Hover 具备平滑过渡（150-300ms）
- [ ] 浅色模式文本对比度至少 4.5:1
- [ ] 焦点态对键盘导航可见
- [ ] 遵循 `prefers-reduced-motion`
- [ ] 响应式断点覆盖：375px、768px、1024px、1440px
- [ ] 固定导航不遮挡内容
- [ ] 移动端不出现横向滚动
