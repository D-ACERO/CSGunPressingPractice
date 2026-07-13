# CS2 压枪实验室

浏览器中的第一人称压枪练习器。选择武器后按住鼠标左键射击，通过移动鼠标抵消后坐力，并实时查看弹着点与控制评分。

## 功能

- 覆盖当前练习版本中的 34 把武器
- 为主要自动武器提供逐发累计弹道
- 站立人形靶与 1 / 10 / 20 / 30 / 50 米交战距离
- 按 72 HU 站立高度和 Source 视野关系计算人形靶透视大小
- 右手第一人称持枪、枪口火花、曳光弹、烟雾与武器后坐动画
- Pointer Lock 鼠标输入与灵敏度、DPI、eDPI 设置
- 自动通过 GitHub Actions 部署到 GitHub Pages

## 本地运行

需要 Node.js 22 或更高版本。

```bash
npm ci
npm run dev
```

验证 GitHub Pages 静态版本：

```bash
npm run build:pages
```

## 说明

本项目是独立制作的非商业训练工具，与 Valve 或 Counter-Strike 2 官方无关联。武器名称仅用于帮助玩家识别练习对象；页面中的武器外形由 CSS 原创重绘，不包含游戏原始模型或贴图。距离换算参考 Valve Developer Community 的 [Source 尺度说明](https://developer.valvesoftware.com/wiki/Dimensions_%28Half-Life_2_and_Counter-Strike%3A_Source%29)，属于训练比例参考。
