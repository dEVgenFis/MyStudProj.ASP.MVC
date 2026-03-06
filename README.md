[![Continuous deployment My_Stud_Proj to VPS](https://github.com/dEVgenFis/MyStudProj.ASP.MVC/actions/workflows/continuous-deployment.yml/badge.svg)](https://github.com/dEVgenFis/MyStudProj.ASP.MVC/actions/workflows/continuous-deployment.yml)

# Hello, World!

Данный проект, визуально представляющий из себя одностраничное приложение с fetch-запросами, является своеобразной “пробой пера” начинающего web-программиста.

## Описание

* <b>Фреймворк:</b>&emsp;ASP.NET Core
* <b>Архитектура:</b>&emsp;Monolith
* <b>Шаблон проектирования:</b>&emsp;MVC
* <b>База данных:</b>&emsp;MySQL
* <b>Логирование:</b>&emsp;Serilog

## Production Lifecycle

* <b>Способ развертывания:</b>&emsp;GitHub Actions
* <b>Хостинг:</b>&emsp;VPS Beget *(Ubuntu, v22)*
* <b>Веб-сервер:</b>&emsp;Nginx *(reverse proxy)*
* <b>Среда исполнения:</b>&emsp;ASP.NET Core *(v8)*
* <b>Администрирование:</b>&emsp;systemd / ISPmanager *(v6)*

## Observability

* OpenTelemetry *(сбор метрик)*
* Prometheus
* Loki
* Alloy
* Grafana

<br>
<details>
<summary>⚙️ <b>Важный момент при клонировании репозитория</b></summary>

<br>

1. Откройте терминал в корне проекта (там, где лежит файл "MVC.sln").

2. Введите команду `git config core.hooksPath .github/hooks`.

3. Осуществите проверку: введите команду `git config core.hooksPath` &mdash; если терминал в ответ напишет ".github/hooks", значит, настройка применилась.

&emsp;Необходимость использования авторского "post-checkout"-хука в скором времени будет описана в разделе "🎓 <b>Challenges</b>".

</details>

<br>
<details>
<summary>🔒 <b>Безопасность</b></summary>

<br>

### Персональные данные

* для домена "evgenproject.com" выпущен SSL-сертификат от Let's Encrypt

* в целях соблюдения статьи 5 Федерального закона № 152-ФЗ каждый IP-адрес, посетивший сайт, попадает в БД <b>Loki</b> в обезличенном виде: последний октет через <b>Alloy</b> заменяется на "0"

### Сервис

* точка "/metrics" скрыта за `auth_basic`, куда <b>Prometheus</b> самостоятельно передает логин и пароль согласно своему файлу настроек при каждом обращении за метриками

* docker-контейнеры <b>Prometheus</b> и <b>Loki</b> запущены с параметром "expose" конфигурационного файла "docker-compose", что позволяет им оставаться в пределах видимости для соседних контейнеров внутри дефолтной сети, но при этом быть закрытыми для внешнего интернета

* конвейерный агент <b>Alloy</b> запущен без параметров видимости, т.к. он самостоятельно читает логи приложения, обрабатывает их и пересылает в <b>Loki</b> согласно своему файлу настроек

* docker-контейнер <b>Grafana</b> скрыт за префиксом Nginx, что обеспечивает невидимость стандарного порта ботам-сканерам. Более того, при первом запуске указанного контейнера был изменен пароль для стандартного <b>admin</b> через переменную окружения "GRAFANA_PASSWORD".

</details>

<br>
<details>
<summary>⚡ <b>Оптимизация</b></summary>

<br>

Информация будет представлена в скором времени. Спасибо за ожидание!

</details>

<br>
<details>
<summary>🎓 <b>Challenges</b></summary>

<br>

Информация будет представлена в скором времени. Спасибо за ожидание!

*Текста будет много...* 🙂

</details>

<br>
<details>
<summary>❓ <b>Ответы на возможные вопросы</b></summary>

<br>

Информация будет представлена в скором времени. Спасибо за ожидание!

</details>
<br>

## Добро пожаловать!
