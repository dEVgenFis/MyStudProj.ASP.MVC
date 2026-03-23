[![Continuous deployment My_Stud_Proj to VPS](https://github.com/dEVgenFis/MyStudProj.ASP.MVC/actions/workflows/continuous-deployment.yml/badge.svg)](https://github.com/dEVgenFis/MyStudProj.ASP.MVC/actions/workflows/continuous-deployment.yml)

# Hello, World!

Данный проект, представляющий из себя SPA-приложение с fetch-запросами и PartialView/JSON-ответами на них, является своеобразной “пробой пера” начинающего web-программиста.

## Описание

* <b>Архитектура:</b>&emsp;Monolith
* <b>Шаблон проектирования:</b>&emsp;MVC
* <b>База данных:</b>&emsp;MySQL
* <b>Логирование:</b>&emsp;Serilog
* <b>Регистрация/аутентификация:</b>&emsp;JSON-формат `user` в localStorage

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

## Дополнительные инструменты

* <b>Дизайн:</b>&emsp;Figma
* <b>Backend-разработка:</b>&emsp;Visual Studio *(v22)*
* <b>Frontend-разработка:</b>&emsp;Visual Studio Code
* <b>Развертывание Observability:</b>&emsp;Docker *(кроме OTel)*
* <b>Справочная информация:</b>&emsp;Google AI, Metanit.com, WebReference, Stepik

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

* в целях соблюдения статьи 5 Федерального закона № 152-ФЗ каждый IP-адрес, посетивший сайт, попадает в БД <b>Loki</b> в обезличенном виде: последний октет через <b>Alloy</b> заменяется на "0"

### Пользовательская сессия

* в целях обеспечения защиты от MitM-атак и подтверждения подлинности сервера для домена "evgenproject.com" выпущен SSL-сертификат от Let's Encrypt

* в целях устранения "Mixed Content"-уязвимости все fetch-запросы на сайте формируются через относительные пути с передачей из Nginx в Kestrel заголовка `X-Forwarded-Proto`

* против Clickjacking-атак на строне Nginx в CSP используется директива `frame-ancestors 'none'` совместно с заголовком `X-Frame-Options "DENY"` (для старых браузеров)

* защита от "MIME Sniffing"-уязвимости обеспечивается заголовком `X-Content-Type-Options "nosniff"` в Nginx

* в целях обеспечения защиты от "Dangling Markup"/"Stored XSS"-атак на строне Nginx в CSP используются директивы `script-src`, `img-src`, `font-src`, `base-uri`, `connect-src`, `form-action` со значением `self`

### База данных

* взаимодействие приложения с БД происходит через Entity Framework Core посредством LINQ to Entities <b>без</b> использования методов с конкатенацией строк, ввиду чего согласно [официальной документации Microsoft](https://learn.microsoft.com/ru-ru/dotnet/framework/data/adonet/ef/security-considerations#security-considerations-for-queries) запросы не подвержены "SQL injection"-атакам благодаря автоматической параметризации

### Observability

* точка "/metrics" скрыта за `auth_basic`, куда <b>Prometheus</b> самостоятельно передает логин и пароль согласно своему файлу настроек при каждом обращении за метриками

* docker-контейнеры <b>Prometheus</b> и <b>Loki</b> запущены с параметром "expose" конфигурационного файла "docker-compose", что позволяет им оставаться в пределах видимости для соседних контейнеров внутри дефолтной сети, но при этом быть закрытыми для внешнего интернета

* конвейерный агент <b>Alloy</b> запущен без параметров видимости, т.к. он самостоятельно читает логи приложения, обрабатывает их и пересылает в <b>Loki</b> согласно своему файлу настроек

* docker-контейнер <b>Grafana</b> скрыт за префиксом Nginx, что обеспечивает невидимость стандарного порта ботам-сканерам. Более того, при первом запуске указанного контейнера был изменен пароль для стандартного <b>admin</b> через переменную окружения "GRAFANA_PASSWORD".

</details>

<br>
<details>
<summary>⚡ <b>Оптимизация</b></summary>

<br>

### Reverse proxy

* статические файлы раздаются через Nginx напрямую из папки "wwwroot", что исключает необходимость обработки сетевого запроса в Kestrel

* заголовок `Strict-Transport-Security` в Nginx исключает необходимость обработки http-запроса

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

### Какие дальнейшие планы по развитию проекта?

* 🚩 Смена реализованного на сайте авторского способа аутентификации на JWT в `HttpOnly`-куках для повышения безопасности пользовательской сессии

* 🚩 Покрытие кода unit-тестами для реализации полноценного CI/CD

* Оптимизация расхода RAM с помощью `AsNoTracking`-метода при операциях чтения данных, не требующих отслеживания изменений

* Внедрение History API для корректной навигации на сайте

*Раздел дополняется.*

</details>
<br>

Ниже представлены скриншоты мониторинга проекта из Grafana.

[![Дашборд\_таблица\_с\_круговой\_диаграммой](./screenshots/Дашборд\_таблица\_с\_круговой\_диаграммой.png)](./screenshots/Дашборд\_таблица\_с\_круговой\_диаграммой.png)

<b>Скриншот №0</b>:&ensp;Дашборд_таблица_с_круговой_диаграммой

На скриншоте под номером "0" показаны:

* таблица "Топ-10" IP адресов, чаще всего посещающих сайт, с определением страны, интернет-провайдера, операционной системы и браузера

* круговая диаграмма групп устройств, с которых осуществляются запросы к сайту

<br>

[![Дашборд\_тепловая\_карта](./screenshots/Дашборд\_тепловая\_карта.png)](./screenshots/Дашборд\_тепловая\_карта.png)

<b>Скриншот №1</b>:&ensp;Дашборд_тепловая_карта

На скриншоте под номером "1" показано распределение IP адресов, посещающих сайт, на тепловой карте.

<br>

[![Дашборд\_тепловая\_карта\_Самара](./screenshots/Дашборд\_тепловая\_карта\_Самара.png)](./screenshots/Дашборд\_тепловая\_карта\_Самара.png)

<b>Скриншот №2</b>:&ensp;Дашборд_тепловая_карта_Самара

На скриншоте под номером "2" приведено географическое уточнение плотности запросов: большинство IP адресов базируются в Самаре. Так и есть, потому что значительная часть запросов к сайту исходят от меня, автора проекта.

Также представляю возможность ознакомиться с [десктопной](https://www.figma.com/proto/xwAFWbBMASH04oqgMu8vuK/dEvgEn?page-id=0%3A1&node-id=996-1149&viewport=466%2C214%2C0.06&t=sTPmNUo86c0X4waA-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=980%3A2) и [мобильной](https://www.figma.com/proto/xwAFWbBMASH04oqgMu8vuK/dEvgEn?page-id=1182%3A2&node-id=1313-150&viewport=449%2C144%2C0.09&t=sAv1jNmLqX0cmNlQ-1&scaling=scale-down&content-scaling=fixed) версиями прототипа сайта в Figma.

## Добро пожаловать!
