# DataBaseProject
Project for "Introduction to Database Management Systems" discipline.
# Описание
Сайт с информацией о доступных для бронирования автомобилей
## Наименование
Car4YOU
## Предметная область
Аренда автомобилей
# Данные
![image](https://user-images.githubusercontent.com/100342935/194010058-b283feaa-3aae-4d5b-98ae-2d3a77eac04f.png)

- Информация об автомобилях (car)
- Информация о пользователях (user)
- Информация об отзывах (record)
## Для каждого элемента данных - ограничения
Car.id - primary key (unique and not null) \
Car.model - not null, contains only letters \
Car.vehicle_mileage - not null, more than 0 \
Car.owner_user_id - foreign key references user(id) \
Car.rating - between 1 and 5

User.id - primary key (unique and not null) \
User.first_name - not null, contains only letters \
User.last_name - not null, contains only letters \
User.phone_number - length = 10 (only Russian numbers + 7xxxxxxxxxx) \
User.email - like 'user_name'@'domain_name' \
User.hash_password - not null \
User.user_type - "Renter" or "Admin" or "Owner"

Record.id - primary key (unique and not null) \
Record.car_id - foreign key references car(id) \
Record.user_id - foreign key references user(id) \
Record.grade - between 1 and 5, not null

## Общие ограничения целостности


У каждого пользователя может быть несколько машин. 

У каждой машины может быть несколько отзывов. 

Каждый пользователь может оставлять несколько отзывов

# Пользовательские роли
- Администратор (Admin) - возможность редактировать/удалять записи в таблицах car, user - количество пользователей этой роли от 1 до 3
- Владелец автомобиля (Owner) - возможности получить список своих автомобилей, редактировать/удалять собственные автомобили, добавлять свои автомобили - количество пользователей этой роли от 0 до 1000000
- Арендатор автомобиля (Renter) - возможность оставить отзыв на арендованный автомобиль, получить список всех автомобилей с отзывами

# UI / API 
## User API
GET /api/user - Получить список пользователей \
POST /api/user - Создать пользователя \
PUT /api/user - Изменить параметры пользователя \
GET /api/user/{user_id} - Получить пользователя по id \
DELETE /api/user/{user_id} - Удалить пользователя по id \
GET /api/user/limit-offset - Установить ограничение на количество пользователей

## Car API
GET /api/car - Получить список машин \
PUT /api/car - Изменить параметры машины \
POST /api/car - Создать машину \
GET /api/car/{car_id}/reviews - Получить отзывы о машине по id \
GET /api/car/{car_id} - Получить машину по id \
DELETE /api/car/{car_id} - Удалить машину по id \
GET /api/car/limit-offset - Установить ограничение на количество машин

## Record API
GET /api/record/owner/{user_id} - Получить список записей оценок автомобилей, принадлежащих одному owner-у по его id \
GET /api/record/car/{car_id} - Получить список оценок одного автомобиля по id авто \
POST /api/record - Создать отзыв \
PUT /api/record/{record_id} - Изменить отзыв по id 

# Технологии разработки
## Язык программирования
Python3.10
JavaScript
### Библиотеки и фреймворки
FastAPI —  фреймворк для создания HTTP API-серверов со встроенными сериализацией и асинхронностью

Pydantic — библиотека, которая обеспечивает проведение валидации данных и управление настройками с помощью аннотаций типов

SQLAlchemy — библиотека для работы с реляционными СУБД с применением технологии ORM

Alembic — инструмент для миграции базы данных, используемый в SQLAlchemy

psycopg2 — адаптер для базы данных PostgreSQL

React - JavaScript-библиотека для создания пользовательских интерфейсов.

## Дополнительные технологии
- Docker
- GitHub
## СУБД
PostgreSQL
# Тестирование
Unit тестирование с помощью библиотеки PyTest
