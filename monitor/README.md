# monitor
局部放电监测系统

# 主要功能
1. 用户管理：用户登录、注册（包括用户权限管理，token生成及验证）
2. 设备管理
3. 监测记录管理
4. 报警管理（监控异常数据）

# 项目架构
springboot、mybatis、thymeleaf
bootstrap
mysql
集成swagger-ui生成接口文档，启动项目后使用localhost:9527/swagger-ui.html访问

# 项目启动
mvn clean install 安装项目依赖
运行项目入口类：com.wjup.shorturl下的ShorturlApplication

# todo: 数据库配置待补充
