## 关于项目

项目采用master模版分支扩展，为uniapp前端项目(https://github.com/94club/uniapp_elm)提供api服务

## 包含功能：

[1、日志系统]<br/>
[2、token的验证、刷新]配合前端地址： https://github.com/94club/template_vue<br/>
[3、apidoc(弃用;原因可能是自己的打开方式不对，接口文档不能按照注释的更新)]<br/>
1 全局安装apidoc npm install -g apidoc <br/>
2 根目录创建apidoc.json文件 <br/>
3 apidoc -i ./controller -o ./public/apidoc<br/>
4 利用express的静态服务，生成接口文档 localhost/apidoc<br/>
[4、swagger-ui]
1 使用swagger-ui在线编辑，然后生成json文件<br/>
2 用1中生成的json文件替换public/apidoc/apidoc.json<br/>
3 利用express的静态服务，生成接口文档 localhost/apidoc<br/>
[5、单点登录]

## 注意事项：
redis和mongodb的地址使用部署文件配置
iptables 端口映射
