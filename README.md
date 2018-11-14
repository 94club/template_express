# tempalte_express
这是一个express后台模版

## 包含功能：

[1、日志系统]<br/>
[2、token的验证、刷新]配合前端地址： https://github.com/94club/template_vue<br/>
[3、apidoc]<br/>
1 全局安装apidoc npm install -g apidoc <br/>
2 根目录创建apidoc.json文件 <br/>
3 apidoc -i ./controller -o ./public/apidoc<br/>
4 利用express的静态服务，生成接口文档 localhost/apidoc<br/>
[4、单点登录]