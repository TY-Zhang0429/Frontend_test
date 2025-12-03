# 阿里云函数计算部署指南

## 步骤 1：登录阿里云控制台

访问：https://fcnext.console.aliyun.com/

## 步骤 2：创建函数

1. 点击左侧菜单 **"服务及函数"** → **"函数"**
2. 点击 **"创建函数"**
3. 选择 **"使用内置运行时创建"**
4. 配置如下：
   - **函数名称**：`topic-proxy`
   - **运行环境**：选择 `Node.js 18` 或 `Node.js 16`
   - **请求处理程序类型**：`处理 HTTP 请求`
   - **地域**：选择 `华东2(上海)` 或离你最近的地域

## 步骤 3：上传代码

1. 在函数代码编辑器中，删除默认代码
2. 将 `cloudfunction/index.js` 的内容复制粘贴进去
3. 点击 **"部署"**

## 步骤 4：配置触发器

1. 在函数详情页，点击 **"触发器"** 标签
2. 点击 **"创建触发器"**
3. 配置如下：
   - **触发器类型**：`HTTP 触发器`
   - **认证方式**：`anonymous`（匿名访问）
   - **请求方法**：选择 `POST` 和 `OPTIONS`
4. 创建后会得到一个公网访问地址，类似：
   ```
   https://xxxxxxxx.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/default/topic-proxy/
   ```

## 步骤 5：测试函数

在触发器页面，点击 **"测试"** 按钮，或使用 curl 测试：

```bash
curl -X POST "你的函数URL" \
  -H "Content-Type: application/json" \
  -H "X-Target-API: https://popularzer-blue-uvpzmhjoqt.cn-shanghai.fcapp.run/" \
  -d '{"keyword":"手机","platform":"xhs","limit":10}'
```

## 步骤 6：更新前端代码

复制你的函数 URL，然后在 `src/services/api.ts` 中更新：

```typescript
const VERCEL_PROXY = '你的阿里云函数URL';
```

## 费用说明

- 阿里云函数计算有免费额度：
  - 每月前 100 万次调用免费
  - 每月前 400,000 GB-秒计算资源免费
- 对于个人项目，基本不会产生费用

## 常见问题

### 1. 函数超时
如果遇到超时，在函数配置中增加**超时时间**（推荐 60 秒）

### 2. CORS 错误
确保函数代码中的 CORS 头部设置正确，已包含在提供的代码中

### 3. 502 错误
检查函数日志，可能是目标 API 无法访问或响应超时
