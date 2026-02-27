# 脚本说明

- 构建脚本：[`build-vite.mjs`](build-vite.mjs)
- 覆盖率门槛校验：[`check-coverage.mjs`](check-coverage.mjs)
- 本地示例服务：[`../server/js/server.js`](../server/js/server.js)
- 构建时复制的运行资源目录：`../build/resources/`

在仓库根目录通过 npm scripts 运行：

```bash
npm run build
npm run docs
npm run docs:check
npm run server
npm run test:coverage
npm run test:coverage:ci
npm run test:coverage:soft
```

覆盖率阶段通过 `COVERAGE_PHASE` 控制（默认 `1`）：

```powershell
$env:COVERAGE_PHASE=2; npm run test:coverage:ci
```
